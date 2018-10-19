import React from "react";
import { convertToHTML } from "draft-convert";

export function stateToHTML(state) {
  return toHTML(state);
}

const toHTML = convertToHTML({
  styleToHTML: style => {
    if (style === "BOLD") {
      return <b />;
    }
    if (style === "ITALIC") {
      return <i />;
    }
    if (style === "SIZE1") {
      return <font size="1" />;
    }
    if (style === "SIZE2") {
      return <font size="2" />;
    }
    if (style === "SIZE3") {
      return <font size="3" />;
    }
    if (style === "SIZE4") {
      return <font size="4" />;
    }
    if (style === "SIZE5") {
      return <font size="5" />;
    }
    if (style === "SIZE6") {
      return <font size="6" />;
    }
  },
  blockToHTML: block => {
    if (block.type === "PARAGRAPH") {
      return <p align="left"/>;
    }
    if (block.type === "left") {
      return <p align="left"/>;
    }
    if (block.type === "center") {
      return <p align="center"/>;
    }
    if (block.type === "right") {
      return <p align="right"/>;
    }
    if (block.type === "justify") {
      return <p align="justify"/>;
    }
  },
  entityToHTML: (entity, originalText) => {
    if (entity.type === "dinfield") {
      return <dinfield path={entity.data.path}></dinfield>;
    }
    return originalText;
  }
});
