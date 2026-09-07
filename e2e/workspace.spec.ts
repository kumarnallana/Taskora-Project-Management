import "dotenv/config";
import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";

test("register, collaborate, deliver and navigate responsively", async ({
  page,
  request,
}) => {
  test.skip(
    process.env.NODE_ENV === "production",
    "Use a development database.",
  );
  const prisma = new PrismaClient();
  const suffix = randomUUID();
  const email = `browser.${suffix}@example.test`;
  const teammateEmail = `teammate.${suffix}@example.test`;
  const password = `Taskora-${randomUUID()}`;
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Keep every project moving." }),
    ).toBeVisible();
    await page.screenshot({
      path: "test-results/taskora-landing.png",
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: "test-results/taskora-landing-mobile.png",
      fullPage: true,
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole("link", { name: "Get Started" }).first().click();
    await expect(
      page.getByRole("heading", { name: "A fresh start for your team." }),
    ).toBeVisible();
    await page.screenshot({
      path: "test-results/taskora-auth.png",
      fullPage: true,
    });
    await page.getByLabel("Full Name", { exact: true }).fill("Browser Owner");
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Confirm Password", { exact: true }).fill(password);
    await page
      .getByRole("button", { name: "Create account", exact: true })
      .click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Welcome back, Browser." }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "New project", exact: true })
      .click();
    await page
      .getByLabel("Project name", { exact: true })
      .fill("Release workspace");
    await page
      .getByLabel("Description", { exact: false })
      .fill("A shared plan for a considered product launch.");
    await page
      .getByRole("button", { name: "Create project", exact: true })
      .click();
    await expect(page).toHaveURL(/\/projects\/[a-f0-9-]+$/);
    await expect(
      page.getByRole("heading", { name: "Release workspace", exact: true }),
    ).toBeVisible();
    const projectUrl = page.url().split("?")[0];
    await page
      .getByRole("button", { name: "Edit project", exact: true })
      .click();
    await page
      .getByLabel("Project name", { exact: true })
      .fill("Product launch");
    await page
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Product launch", exact: true }),
    ).toBeVisible();
    const teammate = await request.post("/api/auth/register", {
      headers: { Origin: "http://localhost:3000" },
      data: { name: "Browser Teammate", email: teammateEmail, password },
    });
    expect(teammate.status()).toBe(201);
    await page.getByRole("link", { name: "Members", exact: true }).click();
    await page.getByRole("button", { name: "Add member", exact: true }).click();
    await page.getByLabel("Email", { exact: true }).fill(teammateEmail);
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Add member", exact: true })
      .click();
    await expect(
      page.getByText("Browser Teammate", { exact: true }),
    ).toBeVisible();
    await page.getByRole("link", { name: /^Tasks/ }).click();
    await page.getByRole("button", { name: "New task", exact: true }).click();
    await page
      .getByLabel("Task title", { exact: true })
      .fill("Ship the workspace");
    await page
      .getByLabel("Description", { exact: true })
      .fill("Connect the final pieces and prepare the release.");
    await page
      .getByRole("combobox", { name: "Assignee", exact: true })
      .selectOption({ label: "Browser Owner" });
    await page
      .getByRole("button", { name: "Create task", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Ship the workspace", exact: true }),
    ).toBeVisible();
    await page.screenshot({
      path: "test-results/taskora-desktop.png",
      fullPage: true,
    });
    await page.setViewportSize({ width: 820, height: 1180 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: "test-results/taskora-tablet.png",
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: "test-results/taskora-mobile.png",
      fullPage: true,
    });
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("dialog")
      .getByRole("link", { name: "My Tasks", exact: true })
      .click();
    await expect(page).toHaveURL(/\/my-tasks$/);
    await page
      .getByRole("combobox", {
        name: "Status for Ship the workspace",
        exact: true,
      })
      .selectOption("DONE");
    await expect(
      page.getByRole("combobox", {
        name: "Status for Ship the workspace",
        exact: true,
      }),
    ).toHaveValue("DONE");
    await page.reload();
    await expect(
      page.getByRole("combobox", {
        name: "Status for Ship the workspace",
        exact: true,
      }),
    ).toHaveValue("DONE");
    await page.getByRole("link", { name: /Ship the workspace/ }).click();
    await expect(page.getByRole("dialog", { name: "Edit task" })).toBeVisible();
    await page
      .getByLabel("Task title", { exact: true })
      .fill("Release the workspace");
    await page
      .getByRole("combobox", { name: "Assignee", exact: true })
      .selectOption({ label: "Browser Teammate" });
    await page
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await page.getByRole("link", { name: "Overview", exact: true }).click();
    await expect(
      page.getByRole("progressbar", { name: "Project completion" }),
    ).toHaveAttribute("aria-valuenow", "100");
    await page.getByRole("link", { name: "Members", exact: true }).click();
    await page.getByRole("button", { name: "Remove Browser Teammate" }).click();
    await page
      .getByRole("button", { name: "Remove member", exact: true })
      .click();
    await expect(
      page.getByText("Browser Teammate", { exact: true }),
    ).toHaveCount(0);
    await page.getByRole("link", { name: /^Tasks/ }).click();
    await page.getByRole("button", { name: "Done", exact: true }).click();
    await expect(page.getByText("Unassigned", { exact: true })).toBeVisible();
    await page
      .getByRole("button", {
        name: "Delete Release the workspace",
        exact: true,
      })
      .click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Release the workspace", exact: true }),
    ).toHaveCount(0);
    await page.goto(projectUrl);
    await expect(
      page.getByRole("progressbar", { name: "Project completion" }),
    ).toHaveAttribute("aria-valuenow", "0");
    await page
      .getByRole("button", { name: "Delete project", exact: true })
      .click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Sign out", exact: true })
      .click();
    await expect(page).toHaveURL(/\/login$/);
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    expect(errors).toEqual([]);
  } finally {
    const users = await prisma.user.findMany({
      where: { email: { in: [email, teammateEmail] } },
      select: { id: true },
    });
    await prisma.project.deleteMany({
      where: { ownerId: { in: users.map((user) => user.id) } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: users.map((user) => user.id) } },
    });
    await prisma.$disconnect();
  }
});
