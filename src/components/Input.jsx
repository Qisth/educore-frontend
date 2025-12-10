import React from "react";

export default function Input(props) {
  const style = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    boxSizing: "border-box",
    ...props.style,
  };

  return <input {...props} style={style} />;
}
