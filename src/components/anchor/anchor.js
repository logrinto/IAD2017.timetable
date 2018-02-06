import React from "react";

const Anchor = ({ children, anchor, prefix }) => {
  return (
    <span>
      {anchor && <a href={`#${prefix || ""}${anchor}`}>{children}</a>}
      {!anchor && children}
    </span>
  );
};

export default Anchor;
