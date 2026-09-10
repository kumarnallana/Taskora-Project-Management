import "dotenv/config";
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { app } from "../src/app";
import { prisma } from "../src/db/prisma";
import { env } from "../src/config/env";

test(
  "authenticated project lifecycle and authorization boundaries",
  { timeout: 60000 },
  async (t) => {
    assert.notEqual(
      env.NODE_ENV,
      "production",
      "Do not run integration tests in production.",
    );
    const server = app.listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address();
    assert(address && typeof address === "object");
    const base = `http://127.0.0.1:${address.port}/api`;
    const suffix = randomUUID();
    const password = `Taskora-${randomUUID()}`;
    const userIds: string[] = [];
    let projectId = "";
    let taskId = "";
    type Account = { id: string; cookie: string; email: string };
    async function request(
      path: string,
      method = "GET",
      body?: unknown,
      cookie = "",
      origin = env.CLIENT_ORIGIN,
    ) {
      const response = await fetch(base + path, {
        method,
        headers: {
          Origin: origin,
          Cookie: cookie,
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const data = response.status === 204 ? null : await response.json();
      return { response, data };
    }
    async function register(name: string): Promise<Account> {
      const email = `${name}.${suffix}@example.test`;
      const result = await request("/auth/register", "POST", {
        name,
        email: email.toUpperCase(),
        password,
      });
      assert.equal(result.response.status, 201);
      assert.equal(result.data.email, email.toLowerCase());
      assert.equal("passwordHash" in result.data, false);
      const cookie = result.response.headers.get("set-cookie")!;
      assert.match(cookie, /HttpOnly/i);
      assert.match(cookie, /SameSite=Lax/i);
      assert.match(cookie, /Max-Age=604800/i);
      userIds.push(result.data.id);
      return { id: result.data.id, email, cookie: cookie.split(";")[0] };
    }
    try {
      const owner = await register("Owner");
      const member = await register("Member");
      const outsider = await register("Outsider");
      await t.test(
        "validates authentication and rejects forged sessions and origins",
        async () => {
          assert.equal((await request("/projects")).response.status, 401);
          assert.equal(
            (
              await request(
                "/projects",
                "GET",
                undefined,
                "taskora_session=forged",
              )
            ).response.status,
            401,
          );
          assert.equal(
            (
              await request("/auth/login", "POST", {
                email: owner.email,
                password: "wrong-password",
              })
            ).response.status,
            401,
          );
          const login = await request("/auth/login", "POST", {
            email: owner.email,
            password,
          });
          assert.equal(login.response.status, 200);
          assert.equal(
            (await request("/auth/me", "GET", undefined, owner.cookie)).data.id,
            owner.id,
          );
          assert.equal(
            (
              await request("/auth/register", "POST", {
                name: "Duplicate",
                email: owner.email,
                password,
              })
            ).response.status,
            409,
          );
          assert.equal(
            (
              await request("/auth/register", "POST", {
                name: "X",
                email: "invalid",
                password: "short",
              })
            ).response.status,
            400,
          );
          assert.equal(
            (
              await request(
                "/projects",
                "POST",
                { name: "Rejected" },
                owner.cookie,
                "https://untrusted.test",
              )
            ).response.status,
            403,
          );
          const expired = jwt.sign({}, env.JWT_SECRET, {
            subject: owner.id,
            expiresIn: -1,
            issuer: "taskora",
            audience: "taskora-web",
          });
          assert.equal(
            (
              await request(
                "/auth/me",
                "GET",
                undefined,
                `taskora_session=${expired}`,
              )
            ).response.status,
            401,
          );
        },
      );
      await t.test(
        "creates persistent projects and scopes project reads",
        async () => {
          const created = await request(
            "/projects",
            "POST",
            { name: "Launch", description: "A real database project" },
            owner.cookie,
          );
          assert.equal(created.response.status, 201);
          projectId = created.data.id;
          assert.equal(
            (
              await prisma.project.findUniqueOrThrow({
                where: { id: projectId },
              })
            ).ownerId,
            owner.id,
          );
          const detail = await request(
            `/projects/${projectId}`,
            "GET",
            undefined,
            owner.cookie,
          );
          assert.equal(detail.data.progress, 0);
          assert.equal(detail.data.members[0].user.id, owner.id);
          assert.equal(
            JSON.stringify(detail.data).includes("passwordHash"),
            false,
          );
          assert.equal(
            (await request("/projects", "GET", undefined, outsider.cookie)).data
              .length,
            0,
          );
          assert.equal(
            (
              await request(
                `/projects/${projectId}`,
                "GET",
                undefined,
                outsider.cookie,
              )
            ).response.status,
            404,
          );
          assert.equal(
            (
              await request(
                "/projects/not-a-uuid",
                "GET",
                undefined,
                owner.cookie,
              )
            ).response.status,
            400,
          );
          assert.equal(
            (
              await request(
                `/projects/${projectId}`,
                "PATCH",
                { name: "Launch revised" },
                owner.cookie,
              )
            ).response.status,
            200,
          );
        },
      );
      await t.test("enforces owner membership controls", async () => {
        assert.equal(
          (
            await request(
              `/projects/${projectId}/members`,
              "POST",
              { email: member.email },
              owner.cookie,
            )
          ).response.status,
          201,
        );
        assert.equal(
          (
            await request(
              `/projects/${projectId}/members`,
              "POST",
              { email: member.email },
              owner.cookie,
            )
          ).response.status,
          409,
        );
        assert.equal(
          (
            await request(
              `/projects/${projectId}/members`,
              "POST",
              { email: outsider.email },
              member.cookie,
            )
          ).response.status,
          403,
        );
        assert.equal(
          (
            await request(
              `/projects/${projectId}/members/${owner.id}`,
              "DELETE",
              undefined,
              owner.cookie,
            )
          ).response.status,
          400,
        );
        assert.equal(
          (
            await request(
              `/projects/${projectId}`,
              "PATCH",
              { name: "Unauthorized" },
              member.cookie,
            )
          ).response.status,
          403,
        );
        assert.equal(
          (
            await request(
              `/projects/${projectId}`,
              "DELETE",
              undefined,
              member.cookie,
            )
          ).response.status,
          403,
        );
        assert.equal(
          (
            await request(
              `/projects/${projectId}/members`,
              "GET",
              undefined,
              member.cookie,
            )
          ).data.length,
          2,
        );
      });
      await t.test(
        "supports member task creation, assignment, status, progress and My Tasks",
        async () => {
          assert.equal(
            (
              await request(
                `/projects/${projectId}/tasks`,
                "POST",
                { title: "Invalid", assigneeId: outsider.id },
                member.cookie,
              )
            ).response.status,
            400,
          );
          const created = await request(
            `/projects/${projectId}/tasks`,
            "POST",
            { title: "Ship the workspace", assigneeId: member.id },
            member.cookie,
          );
          assert.equal(created.response.status, 201);
          taskId = created.data.id;
          assert.equal(
            (await request("/tasks/mine", "GET", undefined, member.cookie))
              .data[0].id,
            taskId,
          );
          assert.equal(
            (await request("/tasks/mine", "GET", undefined, outsider.cookie))
              .data.length,
            0,
          );
          assert.equal(
            (
              await request(
                `/tasks/${taskId}`,
                "PATCH",
                { status: "DONE" },
                outsider.cookie,
              )
            ).response.status,
            404,
          );
          assert.equal(
            (
              await request(
                `/tasks/${taskId}`,
                "DELETE",
                undefined,
                outsider.cookie,
              )
            ).response.status,
            404,
          );
          assert.equal(
            (
              await request(
                `/tasks/${taskId}`,
                "PATCH",
                { projectId },
                member.cookie,
              )
            ).response.status,
            400,
          );
          assert.equal(
            (
              await request(
                `/tasks/${taskId}`,
                "PATCH",
                { status: "UNKNOWN" },
                member.cookie,
              )
            ).response.status,
            400,
          );
          assert.equal(
            (
              await request(
                `/tasks/${taskId}`,
                "PATCH",
                { status: "IN_PROGRESS", description: "Real work" },
                member.cookie,
              )
            ).response.status,
            200,
          );
          assert.equal(
            (
              await request(
                `/tasks/${taskId}`,
                "PATCH",
                { status: "DONE" },
                member.cookie,
              )
            ).response.status,
            200,
          );
          assert.equal(
            (
              await request(
                `/projects/${projectId}`,
                "GET",
                undefined,
                owner.cookie,
              )
            ).data.progress,
            100,
          );
          assert.equal(
            (await prisma.task.findUniqueOrThrow({ where: { id: taskId } }))
              .status,
            "DONE",
          );
          assert.equal(
            (
              await request(
                `/projects/${projectId}/tasks`,
                "GET",
                undefined,
                member.cookie,
              )
            ).data.length,
            1,
          );
        },
      );
      await t.test(
        "keeps assignments valid during concurrent membership removal",
        async () => {
          const retained = await prisma.task.findUniqueOrThrow({
            where: { id: taskId },
          });
          assert.equal(retained.assigneeId, member.id);
          assert.equal(retained.description, "Real work");
          assert.equal(
            (await request("/tasks/mine", "GET", undefined, member.cookie))
              .data[0].id,
            taskId,
          );
          const results = await Promise.all([
            request(
              `/projects/${projectId}/members/${member.id}`,
              "DELETE",
              undefined,
              owner.cookie,
            ),
            request(
              `/tasks/${taskId}`,
              "PATCH",
              { assigneeId: member.id },
              owner.cookie,
            ),
          ]);
          assert.equal(results[0].response.status, 204);
          assert([200, 400].includes(results[1].response.status));
          assert.equal(
            (await prisma.task.findUniqueOrThrow({ where: { id: taskId } }))
              .assigneeId,
            null,
          );
          assert.equal(
            (
              await request(
                `/projects/${projectId}`,
                "GET",
                undefined,
                member.cookie,
              )
            ).response.status,
            404,
          );
          assert.equal(
            (await request("/tasks/mine", "GET", undefined, member.cookie)).data
              .length,
            0,
          );
        },
      );
      await t.test(
        "deletes tasks, cascades projects, and clears the session cookie",
        async () => {
          assert.equal(
            (
              await request(
                `/tasks/${taskId}`,
                "DELETE",
                undefined,
                owner.cookie,
              )
            ).response.status,
            204,
          );
          assert.equal(
            await prisma.task.findUnique({ where: { id: taskId } }),
            null,
          );
          assert.equal(
            (
              await request(
                `/projects/${projectId}`,
                "GET",
                undefined,
                owner.cookie,
              )
            ).data.progress,
            0,
          );
          await request(
            `/projects/${projectId}/tasks`,
            "POST",
            { title: "Cascade check" },
            owner.cookie,
          );
          assert.equal(
            (
              await request(
                `/projects/${projectId}`,
                "DELETE",
                undefined,
                owner.cookie,
              )
            ).response.status,
            204,
          );
          assert.equal(await prisma.task.count({ where: { projectId } }), 0);
          assert.equal(
            await prisma.projectMember.count({ where: { projectId } }),
            0,
          );
          const logout = await request(
            "/auth/logout",
            "POST",
            undefined,
            owner.cookie,
          );
          assert.equal(logout.response.status, 204);
          assert.match(
            logout.response.headers.get("set-cookie")!,
            /Expires=Thu, 01 Jan 1970/,
          );
        },
      );
    } finally {
      await prisma.project.deleteMany({ where: { ownerId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
      await prisma.$disconnect();
    }
  },
);
