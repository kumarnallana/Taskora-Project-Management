declare global {
  namespace Express {
    interface Locals {
      user: { id: string; name: string; email: string };
    }
  }
}

export {};
