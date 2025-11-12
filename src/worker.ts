// src/worker.ts
export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

    // Helper: forward to a Pages origin, stripping the prefix
    const forward = (originHost: string, strip: string | RegExp) => {
      const target = new URL(req.url);
      target.hostname = originHost;
      target.protocol = "https:"; // Pages is HTTPS
      target.pathname = path.replace(strip, "") || "/"; // keep trailing slash behavior
      // Let Cloudflare set Host for the new origin automatically
      return fetch(new Request(target.toString(), req));
    };

    if (path.startsWith("/annotation")) {
      return forward("annotation-czy.pages.dev", /^\/annotation/);
    }
    if (path.startsWith("/notes")) {
      return forward("notes-5qd.pages.dev", /^\/notes/);
    }

    return new Response("Not found", { status: 404 });
  }
}
