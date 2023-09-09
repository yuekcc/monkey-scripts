// ==UserScript==
// @name         导出
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  导出 V2ex 帖子为 Markdown
// @author       zhanlefeng
// @match        https://v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        none
// ==/UserScript==

!(function () {
  function printMarkdown(threads) {
    return threads
      .map((thread, index) => {
        const headerLevel = index === 0 ? 1 : 2;

        if (headerLevel === 1) {
          const lines = [`#`.repeat(headerLevel) + ' ' + thread.title, `#`.repeat(headerLevel + 1) + ` __${thread.time}__ ${thread.author}`, thread.content];
          return lines.join('\n\n');
        }

        const lines = [`#`.repeat(headerLevel) + ` __${thread.time}__ ${thread.author}`, thread.content];
        return lines.join('\n\n');
      })
      .join('\n\n');
  }

  function parseReplyThread(el) {
    const boxes = [...el.querySelectorAll(`.cell td[align='left']`)];
    if (boxes.length === 0) {
      return [];
    }

    return boxes.map(box => {
      const author = box.querySelector('strong')?.textContent;
      const time = box.querySelector('.ago')?.title;
      const content = box.querySelector('.reply_content').textContent;

      return {
        author,
        time,
        content,
      };
    });
  }

  function parseMainThread(tempDiv) {
    var titleElement = tempDiv.querySelector('h1');
    var title = titleElement.textContent.trim();
    var usernameElement = tempDiv.querySelector('.header .gray a[href^="/member/"]');
    var author = usernameElement.textContent.trim();
    var timestampElement = tempDiv.querySelector('.header .gray span');
    var time = timestampElement.getAttribute('title');
    var contentElement = tempDiv.querySelector('.topic_content .markdown_body');
    var content = contentElement.textContent.trim();

    return {
      title,
      author,
      time,
      content,
    };
  }

  const threadBoxes = [...document.querySelector('#Main').querySelectorAll('.box')];
  const [mainThreadBox, ...otherBoxes] = threadBoxes;

  const result = [];
  result.push(parseMainThread(mainThreadBox));
  otherBoxes
    .map(parseReplyThread)
    .flat()
    .forEach(it => result.push(it));

  const doc = printMarkdown(result);
  navigator.clipboard.writeText(doc).then(() => alert('已复制到粘贴板'));
})();
