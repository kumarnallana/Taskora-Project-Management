import { env } from "./config/env";
import { app } from "./app";
import { prisma } from "./db/prisma";

async function start() {
  await prisma.$connect();
  const server = app.listen(env.PORT, "0.0.0.0", () => console.log(`Taskora API listening on ${env.PORT}`));
  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.once(signal, () => {
      server.close(() => { void prisma.$disconnect().then(() => process.exit(0)); });
      setTimeout(() => process.exit(1), 10000).unref();
    });
  }
}

start().catch(error => { console.error(error); process.exit(1); });
