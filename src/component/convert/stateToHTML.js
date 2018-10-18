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
    if (style === "BIG") {
      return <big />;
    }
    if (style === "SMALL") {
      return <small />;
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
