// src/components/Button.jsx

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  style = {},
  ...props
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    justifyContent: "flex-start",
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    width: "80%",
    margin: "12px auto",
    boxSizing: "border-box",
  };

  const variants = {
    primary: {
      background: "#003cbd",
      color: "#fff",
      border: "none",
      boxShadow: "0 6px 14px rgba(0,60,189,0.12)",
    },
    menu: {
      background: "#fff",
      color: "#A52A2A",
      border: "1px solid #e0e0e0",
      boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
    },
    link: {
      background: "none",
      color: "#2b7fb6",
      border: "none",
      padding: "4px 6px",
      width: "auto",
      boxShadow: "none",
      margin: 0,
      justifyContent: "flex-start",
      fontFamily: "inherit",
      fontSize: "18px",
      fontWeight: 700,
    },
  };

  const appliedStyle = {
    ...base,
    ...(variants[variant] || variants.primary),
    ...style,
  };

  return (
    <button
      style={appliedStyle}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
