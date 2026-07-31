"use client";
import { useRef } from "react";
import { MapPin, User as UserIcon } from "lucide-react";
import { COLORS, STATUS } from "@/lib/theme";

export default function ProjectCapsule({ project, taskCount, onOpen, onDrag, onDragEnd, dragging }) {
  const ref = useRef(null);
  const dragInfo = useRef(null);

  const onPointerDown = (e) => {
    dragInfo.current = { startX: e.clientX, startY: e.clientY, origX: project.x, origY: project.y, moved: false };
    ref.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragInfo.current) return;
    const dx = e.clientX - dragInfo.current.startX;
    const dy = e.clientY - dragInfo.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragInfo.current.moved = true;
    if (dragInfo.current.moved) onDrag(project.id, Math.max(0, dragInfo.current.origX + dx), Math.max(0, dragInfo.current.origY + dy));
  };
  const onPointerUp = () => {
    if (dragInfo.current && !dragInfo.current.moved) onOpen(project.id);
    else if (dragInfo.current) onDragEnd(project.id);
    dragInfo.current = null;
  };

  const st = STATUS[project.status] || STATUS.verde;
  const width = 250 + Math.min(taskCount, 6) * 14;

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "absolute", left: project.x, top: project.y, width,
        background: COLORS.surface, border: `1.5px solid ${st.solid}22`, borderRadius: 999,
        padding: "16px 22px", cursor: dragging === project.id ? "grabbing" : "grab", userSelect: "none",
        boxShadow: dragging === project.id ? "0 22px 40px -16px rgba(20,22,26,0.3)" : "0 10px 24px -16px rgba(20,22,26,0.15)",
        transition: dragging === project.id ? "none" : "box-shadow .15s",
        touchAction: "none", zIndex: dragging === project.id ? 5 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: st.solid, flexShrink: 0 }} />
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14.5, color: COLORS.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.name}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: COLORS.inkSoft, marginBottom: 3 }}>
        <MapPin size={11} /> {project.city} · {project.client}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: COLORS.inkSoft, marginBottom: 10 }}>
        <UserIcon size={11} /> {project.responsible}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ flex: 1, marginRight: 12 }}>
          <div style={{ height: 5, borderRadius: 3, background: "#F0EFEB", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${project.progress}%`, background: st.solid, borderRadius: 3 }} />
          </div>
        </div>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: st.solid, flexShrink: 0 }}>{project.progress}%</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: st.solid, background: st.soft, padding: "3px 9px", borderRadius: 999 }}>{st.label}</span>
        <span style={{ fontSize: 11, color: COLORS.inkSoft }}>{taskCount} tareas · entrega {project.delivery_date?.slice(5) || "—"}</span>
      </div>
    </div>
  );
}
