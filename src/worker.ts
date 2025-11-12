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

      // Create a new request for the Pages origin and ensure the Host header
      // matches the Pages hostname. If we forward the original request object
      // directly the Host header will remain the incoming hostname (e.g.
      // "mintcd.dev") and Cloudflare Pages will return a 404 because it
      // doesn't recognize that Host. Setting the Host to the Pages origin
      // ensures Pages serves the expected site.
      const headers = new Headers(req.headers);
      headers.set('host', originHost);

      const init: RequestInit = {
        method: req.method,
        headers,
        body: req.body,
        redirect: 'manual'
      };

      return fetch(new Request(target.toString(), init));
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
