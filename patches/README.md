The `next@15.2.6.patch` patch fixes the Webpack Google Fonts loader's crash
when Google returns an extensionless `/l/font?kit=...` URL. It reads any file
extension from the URL pathname (ignoring query strings and fragments) and
otherwise uses WOFF2, the format requested by Next's Google Fonts fetcher.

Upstream issue: https://github.com/vercel/next.js/issues/99114

pnpm applies this patch during installation through `patchedDependencies` in
`package.json`. Commit the patch, package configuration, and lockfile
together so Vercel applies it too. Run `pnpm test:fonts` after installing to
check the actual loader. When upgrading Next, verify the upstream fix is
included before removing the patch.
