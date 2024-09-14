
const style = document.createElement('style')
style.textContent = `

:root {
  --font-family: PingFang SC, Lantinghei SC, Microsoft Yahei, Hiragino Sans GB,
    Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif;
  --font-size: 14px;
  --mono-font-family: Courier, "Courier New", monospace;
}

body {
  background-color: #f5f5f5;
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: calc(var(--font-size) * 1.5);
}

p {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: calc(var(--font-size) * 1.5);
}
a {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: calc(var(--font-size) * 1.5);
}
pre code {
  font-family: var(--mono-font-family);
  font-size: var(--font-size);
}
.exdownbtn {
  font-family: var(--font-family);
}
`

document.head.append(style)