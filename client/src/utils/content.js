const allowedTags = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "blockquote",
  "ul",
  "ol",
  "li",
  "pre",
  "code",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "div",
  "a",
  "span",
]);

export function sanitizeHtml(html = "") {
  const document = new DOMParser().parseFromString(html, "text/html");

  const walk = (element) => {
    [...element.children].forEach((child) => {
      const tagName = child.tagName.toLowerCase();

      if (!allowedTags.has(tagName)) {
        const textNode = document.createTextNode(child.textContent || "");
        child.replaceWith(textNode);
        return;
      }

      [...child.attributes].forEach((attribute) => {
        const attributeName = attribute.name.toLowerCase();

        if (attributeName.startsWith("on")) {
          child.removeAttribute(attribute.name);
          return;
        }

        if (tagName !== "a" && attributeName !== "class") {
          child.removeAttribute(attribute.name);
          return;
        }

        if (tagName === "a" && !["href", "target", "rel", "class"].includes(attributeName)) {
          child.removeAttribute(attribute.name);
        }
      });

      if (tagName === "a") {
        const href = child.getAttribute("href") || "";

        if (!href.startsWith("http://") && !href.startsWith("https://") && !href.startsWith("/")) {
          child.removeAttribute("href");
        }

        child.setAttribute("rel", "noreferrer noopener");
      }

      walk(child);
    });
  };

  walk(document.body);
  return document.body.innerHTML;
}

export function extractPlainText(html = "") {
  return new DOMParser().parseFromString(html, "text/html").body.textContent?.replace(/\s+/g, " ").trim() || "";
}