import type { Element } from "stylis";

const modernPrefixer = (element: Element): string | void => {
  if (element.type === 'decl' && element.return) {
    const modernProps = ["align-items", "align-self", "justify-content", "flex", "grid", "transform", "position"];
    if (modernProps.some(prop => element.value.includes(prop))) {
      element.return = element.value;
    }
  }
  return undefined;
};

export default modernPrefixer;