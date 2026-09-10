import Link from "next/link";
export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-5 px-6 text-center"
    >
      <p className="eyebrow">404 · A wrong turn</p>
      <h1 className="text-3xl">This page isn’t here.</h1>
      <p className="text-muted">Let’s get you back to your workspace.</p>
      <Link href="/dashboard" className="btn btn-primary">
        Go to dashboard
      </Link>
    </main>
  );
}
