export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.delete('X-Robots-Tag');
    if (env.RELEASE_COMMIT) headers.set('X-Release-Commit', env.RELEASE_COMMIT);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'");
    headers.set('Cache-Control', url.pathname.startsWith('/assets/') ? 'public, max-age=604800' : 'public, max-age=0, must-revalidate');
    return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
  }
};
