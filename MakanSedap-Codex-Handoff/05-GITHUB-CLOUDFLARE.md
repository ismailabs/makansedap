# GitHub and Cloudflare release plan

**Scope authorization:** rename `ismailabs/rasa-iron` to `ismailabs/makansedap`, update this website, set up `https://makansedap.ismailstudio.my/`, and permanently redirect `https://rasairon.ismailstudio.my/` to the corresponding new route when feasible. No other repository/domain/service is in scope.

- Read existing live configuration (GitHub remote, Cloudflare Pages project, build output `site`, connected branch, DNS and redirect rules). Historical README described deployment as not performed; do not assume it exists.
- Establish rollback: save existing repository URL, branch SHA, Pages deployment ID, DNS record/rule state and current response headers if accessible.
- Ensure the new Pages target is functional on a preview hostname first. Verify all five routes, headers, assets, and that noindex is removed. Attach new custom hostname with required DNS and HTTPS certificate, then verify it resolves and serves the expected SHA/build.
- Rename GitHub repo preserving history; update local origin, CI/Pages integration and documentation. GitHub redirects do not substitute for updating integrations. Push validated changes using verified target remote; never force-push or delete history.
- After new domain is healthy, install a 301/308 redirect from old hostname to new hostname, preserving path and query where supported. Verify with HTTP requests, and prevent redirect loops. DNS alone is not an HTTP redirect.
- Ensure canonical, sitemap, robots and OG metadata reference the verified new host, disclose fictional nature, and avoid fake restaurant schema. Search engines may take time to index; do not promise ranking.
- If account access, DNS authority or deployment permissions are missing, complete all locally possible work and report exact blocker. Do not misstate production as complete.
