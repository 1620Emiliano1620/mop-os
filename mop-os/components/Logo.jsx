"use client";
import { COLORS } from "@/lib/theme";

export default function Logo({ size = 30 }) {
  const s = size / 6;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: s * 2.6, height: s * 2.6, background: COLORS.ink, borderRadius: 4 }} />
      <div style={{ position: "absolute", left: s * 3, top: 0, width: s * 2.6, height: s * 2.6, background: COLORS.accent, borderRadius: 4 }} />
      <div style={{ position: "absolute", left: s * 1.5, top: s * 3, width: s * 2.6, height: s * 2.6, background: COLORS.ink, borderRadius: 4, opacity: 0.88 }} />
    </div>
  );
}
