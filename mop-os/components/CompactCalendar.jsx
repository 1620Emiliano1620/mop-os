"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COLORS, STATUS } from "@/lib/theme";

function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function firstWeekday(y, m) { return new Date(y, m, 1).getDay(); }
const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const WEEK_LABELS = ["D","L","M","M","J","V","S"];

export default function CompactCalendar({ projects, selectedDate, onSelectDate }) {
  const today = new Date();
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const dim = daysInMonth(cursor.y, cursor.m);
  const startWd = firstWeekday(cursor.y, cursor.m);
  const cells = Array(startWd).fill(null).concat(Array.from({ length: dim }, (_, i) => i + 1));

  const deliveriesByDay = {};
  projects.forEach((p) => {
    if (!p.delivery_date) return;
    const d = new Date(p.delivery_date + "T00:00:00");
    if (d.getFullYear() === cursor.y && d.getMonth() === cursor.m) {
      deliveriesByDay[d.getDate()] = deliveriesByDay[d.getDate()] || [];
      deliveriesByDay[d.getDate()].push(p.status);
    }
  });

  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}`, borderRadius: 16, padding: 14, width: 240, boxShadow: "0 8px 24px -14px rgba(20,22,26,0.15)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={() => setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }))} style={{ border: "none", background: "none", cursor: "pointer", color: COLORS.inkSoft, padding: 4 }}><ChevronLeft size={15} /></button>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.ink, fontFamily: "'Space Grotesk', sans-serif" }}>{MONTH_NAMES[cursor.m]} {cursor.y}</div>
        <button onClick={() => setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }))} style={{ border: "none", background: "none", cursor: "pointer", color: COLORS.inkSoft, padding: 4 }}><ChevronRight size={15} /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {WEEK_LABELS.map((w, i) => <div key={i} style={{ fontSize: 10, color: COLORS.inkSoft, textAlign: "center", fontWeight: 500 }}>{w}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const isToday = d === today.getDate() && cursor.m === today.getMonth() && cursor.y === today.getFullYear();
          const isSelected = selectedDate && d === selectedDate.d && cursor.m === selectedDate.m && cursor.y === selectedDate.y;
          const dots = deliveriesByDay[d];
          return (
            <div key={i} onClick={() => onSelectDate({ y: cursor.y, m: cursor.m, d })}
              style={{ position: "relative", height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, borderRadius: 7, cursor: "pointer", color: isToday ? "white" : COLORS.ink, background: isToday ? COLORS.ink : isSelected ? COLORS.accentSoft : "transparent", fontWeight: isToday ? 600 : 400 }}>
              {d}
              {dots && <div style={{ position: "absolute", bottom: 1, display: "flex", gap: 1.5 }}>{dots.slice(0, 3).map((s, j) => <div key={j} style={{ width: 3, height: 3, borderRadius: "50%", background: STATUS[s]?.solid || COLORS.inkSoft }} />)}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
