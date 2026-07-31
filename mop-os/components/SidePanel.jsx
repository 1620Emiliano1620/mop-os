"use client";
import { useRef, useState } from "react";
import {
  X, MapPin, Check, Plus, ArrowRight, Paperclip, Image as ImageIcon,
  BarChart3, ListChecks, CheckSquare, MessageSquare, Loader2,
} from "lucide-react";
import { COLORS, STATUS } from "@/lib/theme";

const TABS = [
  { key: "resumen", label: "Resumen", icon: BarChart3 },
  { key: "tareas", label: "Tareas", icon: ListChecks },
  { key: "checklist", label: "Checklist", icon: CheckSquare },
  { key: "archivos", label: "Archivos", icon: Paperclip },
  { key: "fotos", label: "Fotos", icon: ImageIcon },
  { key: "comentarios", label: "Comentarios", icon: MessageSquare },
];

export default function SidePanel({
  project, tasks, checklist, comments, files, currentUserEmail,
  onClose, onUpdateProject, onAddTask, onUpdateTask,
  onAddChecklistItem, onToggleChecklistItem,
  onAddComment, onUploadFile,
}) {
  const [tab, setTab] = useState("resumen");
  const [commentText, setCommentText] = useState("");
  const [checkText, setCheckText] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  if (!project) return null;
  const st = STATUS[project.status] || STATUS.verde;

  const handleFilePick = async (e, kind) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await onUploadFile(project.id, file, kind);
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 420, maxWidth: "94vw", background: COLORS.surface, borderLeft: `1px solid ${COLORS.line}`, boxShadow: "-24px 0 48px -24px rgba(20,22,26,0.25)", zIndex: 50, display: "flex", flexDirection: "column", animation: "slideIn .22s ease" }}>
      <div style={{ padding: "20px 22px 14px", borderBottom: `1px solid ${COLORS.line}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <input value={project.name} onChange={(e) => onUpdateProject(project.id, { name: e.target.value })}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, color: COLORS.ink, border: "none", outline: "none", width: "100%", padding: 0 }} />
            <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}><MapPin size={11} /> {project.city} · {project.client}</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#F2F1ED", borderRadius: 8, padding: 6, cursor: "pointer", color: COLORS.inkSoft, flexShrink: 0 }}><X size={16} /></button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.entries(STATUS).map(([k, s]) => (
            <button key={k} onClick={() => onUpdateProject(project.id, { status: k })}
              style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 999, border: project.status === k ? `1.5px solid ${s.solid}` : "1px solid transparent", background: s.soft, color: s.solid, cursor: "pointer" }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.line}`, overflowX: "auto" }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "10px 12px", border: "none", background: "none", borderBottom: active ? `2px solid ${COLORS.accent}` : "2px solid transparent", color: active ? COLORS.accent : COLORS.inkSoft, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              <Icon size={13} /> {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px" }}>
        {tab === "resumen" && (
          <div style={{ fontSize: 13, color: COLORS.ink }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              <div><div style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 3 }}>Responsable</div><div style={{ fontWeight: 500 }}>{project.responsible}</div></div>
              <div><div style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 3 }}>Avance</div><div style={{ fontWeight: 500 }}>{project.progress}%</div></div>
              <div><div style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 3 }}>Inicio</div><div style={{ fontWeight: 500 }}>{project.start_date || "—"}</div></div>
              <div><div style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 3 }}>Entrega</div><div style={{ fontWeight: 500 }}>{project.delivery_date || "—"}</div></div>
            </div>
            <div style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 6 }}>Avance del proyecto</div>
            <input type="range" min="0" max="100" value={project.progress} onChange={(e) => onUpdateProject(project.id, { progress: Number(e.target.value) })} style={{ width: "100%", marginBottom: 18, accentColor: COLORS.accent }} />
            <div style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 6 }}>Descripción</div>
            <textarea defaultValue={project.description} onBlur={(e) => onUpdateProject(project.id, { description: e.target.value })} rows={3}
              style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 10, fontSize: 13, resize: "vertical", marginBottom: 18, outline: "none" }} />
            <div style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 6 }}>Equipo asignado</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
              {(project.team || []).map((m, i) => <span key={i} style={{ fontSize: 12, background: COLORS.accentSoft, color: COLORS.accent, padding: "4px 10px", borderRadius: 999, fontWeight: 500 }}>{m}</span>)}
            </div>
            <div style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 6 }}>Observaciones</div>
            <textarea defaultValue={project.observations} onBlur={(e) => onUpdateProject(project.id, { observations: e.target.value })} rows={2} placeholder="Sin observaciones"
              style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 10, fontSize: 13, resize: "vertical", outline: "none" }} />
          </div>
        )}

        {tab === "tareas" && (
          <div>
            {tasks.map((t) => (
              <div key={t.id} style={{ border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 12, marginBottom: 10 }}>
                <input defaultValue={t.name} onBlur={(e) => onUpdateTask(t.id, { name: e.target.value })} style={{ fontWeight: 600, fontSize: 13, border: "none", outline: "none", width: "100%", marginBottom: 8 }} />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 11.5 }}>
                  <select value={t.status} onChange={(e) => onUpdateTask(t.id, { status: e.target.value })} style={{ border: `1px solid ${COLORS.line}`, borderRadius: 7, padding: "3px 6px" }}>
                    {["Pendiente", "En curso", "Completado"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <select value={t.priority} onChange={(e) => onUpdateTask(t.id, { priority: e.target.value })} style={{ border: `1px solid ${COLORS.line}`, borderRadius: 7, padding: "3px 6px" }}>
                    {["Baja", "Media", "Alta"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <span style={{ color: COLORS.inkSoft, alignSelf: "center" }}>{t.responsible} · vence {t.due_date || "—"}</span>
                </div>
              </div>
            ))}
            <button onClick={() => onAddTask(project.id)} style={{ display: "flex", alignItems: "center", gap: 5, border: `1px dashed ${COLORS.line}`, background: "none", borderRadius: 10, padding: "8px 12px", fontSize: 12.5, color: COLORS.accent, cursor: "pointer", width: "100%", justifyContent: "center" }}><Plus size={13} /> Añadir tarea</button>
          </div>
        )}

        {tab === "checklist" && (
          <div>
            {checklist.map((c) => (
              <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", fontSize: 13, cursor: "pointer", color: c.done ? COLORS.inkSoft : COLORS.ink, textDecoration: c.done ? "line-through" : "none" }}>
                <span onClick={() => onToggleChecklistItem(c.id, !c.done)} style={{ width: 17, height: 17, borderRadius: 5, border: `1.5px solid ${c.done ? COLORS.accent : COLORS.line}`, background: c.done ? COLORS.accent : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{c.done && <Check size={11} color="white" strokeWidth={3} />}</span>
                {c.text}
              </label>
            ))}
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              <input value={checkText} onChange={(e) => setCheckText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && checkText.trim()) { onAddChecklistItem(project.id, checkText.trim()); setCheckText(""); } }}
                placeholder="Nuevo ítem..." style={{ flex: 1, border: `1px solid ${COLORS.line}`, borderRadius: 9, padding: "7px 10px", fontSize: 13, outline: "none" }} />
              <button onClick={() => { if (checkText.trim()) { onAddChecklistItem(project.id, checkText.trim()); setCheckText(""); } }} style={{ border: "none", background: COLORS.ink, color: "white", borderRadius: 9, padding: "0 12px", cursor: "pointer" }}><Plus size={14} /></button>
            </div>
          </div>
        )}

        {(tab === "archivos" || tab === "fotos") && (
          <div>
            {files.filter((f) => (tab === "fotos" ? f.kind === "foto" : f.kind === "doc")).map((f) => (
              <a key={f.id} href={f.url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", border: `1px solid ${COLORS.line}`, borderRadius: 10, marginBottom: 7, fontSize: 12.5, color: COLORS.ink, textDecoration: "none" }}>
                {tab === "fotos" ? <ImageIcon size={14} color={COLORS.inkSoft} /> : <Paperclip size={14} color={COLORS.inkSoft} />} {f.name}
              </a>
            ))}
            <label style={{ display: "flex", alignItems: "center", gap: 5, border: `1px dashed ${COLORS.line}`, background: "none", borderRadius: 10, padding: "8px 12px", fontSize: 12.5, color: COLORS.accent, cursor: "pointer", justifyContent: "center" }}>
              {uploading ? <Loader2 size={13} className="spin" /> : <Plus size={13} />} {tab === "fotos" ? "Subir foto" : "Subir archivo"}
              <input ref={tab === "fotos" ? photoInputRef : fileInputRef} type="file" accept={tab === "fotos" ? "image/*" : undefined} style={{ display: "none" }} onChange={(e) => handleFilePick(e, tab === "fotos" ? "foto" : "doc")} />
            </label>
          </div>
        )}

        {tab === "comentarios" && (
          <div>
            {comments.map((c) => (
              <div key={c.id} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.ink }}>{c.author} <span style={{ fontWeight: 400, color: COLORS.inkSoft, marginLeft: 6, fontSize: 11 }}>{new Date(c.created_at).toLocaleString()}</span></div>
                <div style={{ fontSize: 13, color: COLORS.ink, marginTop: 2 }}>{c.text}</div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <input value={commentText} onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && commentText.trim()) { onAddComment(project.id, currentUserEmail, commentText.trim()); setCommentText(""); } }}
                placeholder="Escribe un comentario..." style={{ flex: 1, border: `1px solid ${COLORS.line}`, borderRadius: 9, padding: "7px 10px", fontSize: 13, outline: "none" }} />
              <button onClick={() => { if (commentText.trim()) { onAddComment(project.id, currentUserEmail, commentText.trim()); setCommentText(""); } }} style={{ border: "none", background: COLORS.ink, color: "white", borderRadius: 9, padding: "0 12px", cursor: "pointer" }}><ArrowRight size={14} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
