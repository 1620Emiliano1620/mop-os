export const COLORS = {
  bg: "#FAFAF8",
  surface: "#FFFFFF",
  ink: "#14161A",
  inkSoft: "#6B7280",
  line: "#E7E5E0",
  accent: "#2F4FE0",
  accentSoft: "#EEF1FF",
  accentDeep: "#1E35A8",
  danger: "#D14343",
  dangerSoft: "#FDEDED",
};

export const STATUS = {
  verde: { label: "En tiempo", solid: "#1F9D55", soft: "#E7F7EE" },
  amarillo: { label: "Riesgo", solid: "#D69E1F", soft: "#FEF6E5" },
  rojo: { label: "Retrasado", solid: "#D14343", soft: "#FDEDED" },
  azul: { label: "Finalizado", solid: "#2F4FE0", soft: "#EEF1FF" },
};

export const ROLE_LABELS = {
  GERENTE: "Gerente",
  DIRECTOR_OBRA: "Director de obra",
  ARQUITECTO: "Arquitecto",
  COMPRAS: "Compras",
  COMERCIAL: "Comercial",
  CONTABILIDAD: "Contabilidad",
  CLIENTE: "Cliente",
};

export const inputStyle = (hasIcon, hasRightIcon) => ({
  width: "100%",
  boxSizing: "border-box",
  padding: `10px ${hasRightIcon ? 38 : 14}px 10px ${hasIcon ? 38 : 14}px`,
  borderRadius: 10,
  border: `1px solid ${COLORS.line}`,
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
  color: COLORS.ink,
});
