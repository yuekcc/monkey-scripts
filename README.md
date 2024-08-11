# monkey-scripts

用于 Violentmonkey 的用户脚本。需要 [Violentmonkey 扩展](https://violentmonkey.github.io/get-it/)。

## 脚本列表

- [V2EX 帖子导出为 Markdown 文本](dist/export_v2ex_thread.js)

## 构建

```sh
bun run build
```

## Greasemonkey、Violentmonkey、Tampermonkey

Violentmonkey 与 Tampermonkey 都是由 Greasemonkey 发展而来，都支持用户脚本。通过用户脚本可以修改页面上内容。

- Greasemonkey（油猴）是针对 Firefox 开发的一款用户脚本扩展。免费使用，并开放源代码。Greasemonkey 并不支持 Chrome。
- Violentmonkey（暴力猴）支持的 API 接近原版的 Greasemonkey，免费使用，并开放源代码。Violentmonkey 支持 Firefox、Chrome 游览器。
- Tampermonkey（篡改猴）则支持更多功能，比如更强大的在线编辑功能，支持右键菜单。Tampermonkey 免费使用，但最新 5.x 系列并不是开源软件。Tampermonkey 支持 Firefox、Chrome 游览器。

大部分情况下，这两者的脚本可以兼容使用，选择自己喜欢的扩展即可。来自世界各地的开发者贡献了不少有趣的用户脚本，可以在 [https://greasyfork.org/](https://greasyfork.org/) 找找看。

## LICENSE

[MIT](LICENSE)
