// ==UserScript==
// @name    网站字体重置
// @version    0.1
// @description    重置网站字体
// @author    zhanlefeng
// @match    *://*/*
// @grant    GM_addStyle
// @run-at    document-start
// ==/UserScript==

!(() => {
// scripts/reset_fonts/main.js
var colorEmojiFont = "Noto Color Emoji";
var emojiFont = "Noto Emoji";
var genericFont = "HarmonyOS Sans SC";
var genericFallbackFont = "更纱黑体 UI SC";
var codeFont = "Maple Mono Normal";
var replaceFont = (fontFamily, fontName, unicodeRange = "") => {
  return `@font-face {
    font-family: ${JSON.stringify(fontFamily)};
    src: local(${JSON.stringify(fontName)});
    ${unicodeRange ? `unicode-range: ${unicodeRange};` : ""}
  }
`;
};
GM_addStyle(`
${replaceFont("Color Emoji", colorEmojiFont)}
${replaceFont("Apple Color Emoji", colorEmojiFont)}
${replaceFont("Monochrome Emoji", emojiFont)}
${replaceFont("Apple Monochrome Emoji", emojiFont)}
${replaceFont("Segoe UI Emoji", emojiFont)}

${replaceFont("SF Mono", codeFont)}
${replaceFont("Menlo", codeFont)}
${replaceFont("Monaco", codeFont)}
${replaceFont("Consolas", codeFont)}
${replaceFont("Courier New", codeFont)}

${replaceFont("Segoe UI", genericFont)}
${replaceFont("微软雅黑", genericFont)}
${replaceFont("Microsoft YaHei", genericFont)}
${replaceFont("Microsoft YaHei UI", genericFont)}
${replaceFont("等线", genericFont)}


:root {
  --generic-font-family: ${JSON.stringify(genericFont)}, ${JSON.stringify(genericFallbackFont)};
  --code-font-family: ${JSON.stringify(codeFont)};
}

:not(#_#_) {
  /** google-symbols https://fonts.google.com/icons,
    * font-awesome https://fontawesome.com/iconsother,
    * other icons
    */
  :not([class*="-symbols"], [class*="fa-"], [class*="icon"]) {
    /* generic fonts, except mathjax, <i> <s> for icons, <a> <span> for inherited */
    &:not(a, i, s, span, textarea, button *):not(
        math,
        math *,
        mjx-container,
        mjx-container *,
        [aria-hidden="true"],
        [role="presentation"],
        [role="none"],
        [aria-hidden="true"] *,
        [role="presentation"] *,
        [role="none"] *
      ) {
      font-family: var(--generic-font-family);
      /** mono fonts and code editors:
        * Ace https://ace.c9.io/,
        * CodeMirror https://codemirror.net/ https://codemirror.net/5/,
        * Monaco https://microsoft.github.io/monaco-editor/,
        * TailwindCSS https://tailwindcss.com/docs/font-family 
        */
      &:where(code, kbd, pre, samp, var),
      &:where([class*="ace_editor"], [class*="cm-"], [class*="monaco-editor"], [class*="font-mono"]) {
        font-family: var(--code-font-family);
        /* <i> for icon, <a> <span> for inherited */
        & :not(a, i, span) {
          font-family: var(--code-font-family);
        }
      }
      /* for github readme*/
      &:where([class*="code"]:not(#readme, .readme)) {
        font-family: var(--code-font-family);
      }
    }
  }
  /* discuz */
  :is(a[class*="xst"]) {
    font-family: var(--generic-font-family);
  }
}
`);

})();