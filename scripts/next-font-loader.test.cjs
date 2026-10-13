const assert = require("node:assert/strict")
const { test } = require("node:test")

const fontModule = "next/dist/compiled/@next/font/dist/google/"
const cssFetcher = require(`${fontModule}fetch-css-from-google-fonts`)
const fontFetcher = require(`${fontModule}fetch-font-file`)

// Exercise the installed loader so this also verifies pnpm applied the patch.
const cases = [
  ["https://fonts.gstatic.com/s/cinzel/v1/font.woff2", "woff2"],
  ["https://fonts.gstatic.com/s/cinzel/v1/font.woff?v=1#font", "woff"],
  ["https://fonts.gstatic.com/s/cinzel/v1/font.TTF?v=1", "ttf"],
  ["https://fonts.gstatic.com/l/font?kit=abc&skey=123&v=v20", "woff2"],
  ["https://fonts.gstatic.com/l/font?kit=abc.woff", "woff2"],
]

for (const [fontUrl, expectedExtension] of cases) {
  test(`loads Google font URL ${fontUrl}`, async (t) => {
    const css = `/* latin */\n@font-face {
      font-family: 'Cinzel';
      font-style: normal;
      font-weight: 400;
      src: url(${fontUrl}) format('${expectedExtension}');
    }`
    const fontBuffer = Buffer.from("downloaded font")
    t.mock.method(cssFetcher, "fetchCSSFromGoogleFonts", async () => css)
    t.mock.method(fontFetcher, "fetchFontFile", async (url) => {
      assert.equal(url, fontUrl)
      return fontBuffer
    })

    // A fresh loader gives each case its own internal CSS/font caches.
    const loaderPath = require.resolve(`${fontModule}loader`)
    delete require.cache[loaderPath]
    const loader = require(loaderPath).default
    const emitted = []
    const selfHostedUrl = `/_next/static/media/cinzel.${expectedExtension}`
    const result = await loader({
      functionName: "Cinzel",
      data: [{ subsets: ["latin"], weight: "400" }],
      isDev: false,
      isServer: true,
      emitFontFile(buffer, extension, preload) {
        emitted.push({ buffer, extension, preload })
        return selfHostedUrl
      },
    })

    assert.equal(emitted.length, 1)
    assert.equal(emitted[0].buffer, fontBuffer)
    assert.equal(emitted[0].extension, expectedExtension)
    assert.equal(emitted[0].preload, true)
    assert.equal(result.css, css.replace(fontUrl, selfHostedUrl))
  })
}
