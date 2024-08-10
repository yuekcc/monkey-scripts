// ==UserScript==
// @name    V2EX 导出
// @version    0.3
// @description    导出 V2EX 帖子为 Markdown 文本
// @author    zhanlefeng
// @match    https://v2ex.com/t/*
// @grant    GM_registerMenuCommand
// @grant    GM_setClipboard
// ==/UserScript==

!(() => {
// scripts/export_v2ex_thread/main.js
function doStuff() {
  function printMarkdown(threads) {
    const mainContent = threads.map((thread, index) => {
      const headerLevel = index === 0 ? 1 : 2;
      if (headerLevel === 1) {
        const lines2 = [
          `${"#".repeat(headerLevel)} ${thread.title}`,
          `\u539F\u6587\u5730\u5740\uFF1A[${location.href}](${location.href})`,
          `${"#".repeat(headerLevel + 1)} ${thread.author}`,
          `_${thread.time}_`,
          thread.content
        ];
        return lines2.join("\n\n");
      }
      const lines = [`${"#".repeat(headerLevel)} ${thread.author}`, `_${thread.time}_`, thread.content];
      return lines.join("\n\n");
    }).join("\n\n");
    const now = new Date;
    const footer = `\n\n---\n\n- ${now.getFullYear()}\u5E74${now.getMonth() + 1}\u6708${now.getDate()}\u65E5\uFF0C\u8F6C\u8F7D

`;
    return mainContent + footer;
  }
  function parseHtmlToStr(innerHtml) {
    if (!innerHtml) {
      return "";
    }
    const p = new DOMParser;
    const doc2 = p.parseFromString(innerHtml, "text/html");
    const result2 = [];
    doc2.body.childNodes.forEach((node) => {
      if (node.tagName === "BR") {
        result2.push("\n\n");
        return;
      }
      result2.push(node.textContent);
    });
    return result2.join("");
  }
  function parseReplyThread(el) {
    const boxes = Array.from(el.querySelectorAll(`.cell td[align='left']`) || []);
    if (boxes.length === 0) {
      return [];
    }
    return boxes.map((box) => {
      const author = box.querySelector("strong")?.textContent;
      const time = box.querySelector(".ago")?.title;
      const content = parseHtmlToStr(box.querySelector(".reply_content")?.innerHTML);
      return {
        author,
        time,
        content
      };
    });
  }
  function parseMainThread(tempDiv) {
    const titleElement = tempDiv.querySelector("h1");
    const title = titleElement.textContent.trim();
    const usernameElement = tempDiv.querySelector('.header .gray a[href^="/member/"]');
    const author = usernameElement.textContent.trim();
    const timestampElement = tempDiv.querySelector(".header .gray span");
    const time = timestampElement.getAttribute("title");
    const contentElement = tempDiv.querySelector(".topic_content");
    const content = parseHtmlToStr(contentElement.innerHTML);
    return {
      title,
      author,
      time,
      content
    };
  }
  const threadBoxes = [...document.querySelector("#Main").querySelectorAll(".box")];
  const [mainThreadBox, ...otherBoxes] = threadBoxes;
  const result = [];
  result.push(parseMainThread(mainThreadBox));
  otherBoxes.flatMap(parseReplyThread).forEach((it) => result.push(it));
  const doc = printMarkdown(result);
  GM_setClipboard(doc, "text/plain");
  setTimeout(() => {
    alert("\u5DF2\u590D\u5236\u5230\u7C98\u8D34\u677F");
  }, 50);
}
GM_registerMenuCommand("\u5BFC\u51FA\u8BA8\u8BBA\u8D34", doStuff);

})();