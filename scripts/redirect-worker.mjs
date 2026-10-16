export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.hostname !== 'rasairon.ismailstudio.my') return new Response('Not found', {status:404});
    url.protocol = 'https:';
    url.hostname = 'makansedap.ismailstudio.my';
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }
};
