import { convertFromHTML } from "draft-convert";

export function htmlToState(html, dados) {

  const fromHTML = convertFromHTML({
    htmlToStyle: (nodeName, node, currentStyle) => {
      if (nodeName === "b") return currentStyle.add("BOLD");
      if (nodeName === "i") return currentStyle.add("ITALIC");
      if (nodeName === "big") return currentStyle.add("BIG");
      if (nodeName === "small") return currentStyle.add("SMALL");
      return currentStyle;
    },
    htmlToBlock: (nodeName, node) => {
      if (nodeName === 'p') {
        return {
          type: node.getAttribute("align") || "left",
          data: {}
        };
      }
    },
    htmlToEntity: (nodeName, node, createEntity) => {
      if (nodeName === "dinfield") {
        return createEntity("dinfield", "SEGMENTED", {
          path: node.getAttribute("path"),
          dados,
        });
      }
    }
  });

  return fromHTML(html || "");
}

