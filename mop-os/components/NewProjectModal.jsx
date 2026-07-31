"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { COLORS, STATUS, inputStyle } from "@/lib/theme";

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: COLORS.ink, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

export default function NewProjectModal({ onClose, onCreate }) {
  const [f, setF] = useState({ name: "", client: "", city: "", start: "", delivery: "", responsible: "", description: "", status: "verde", team: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim()) return;
    onCreate({
      name: f.name, client: f.client, city: f.city,
      start_date: f.start || null, delivery_date: f.delivery || null,
      responsible: f.responsible, description: f.description, status: f.status,
      team: f.team.split(",").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,22,26,0.4)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} style={{ background: COLORS.surface, borderRadius: 20, padding: 28, width: 460, maxWidth: "100%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 30px 70px -20px rgba(20,22,26,0.4)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, color: COLORS.ink }}>Nuevo proyecto</div>
          <button type="button" onClick={onClose} style={{ border: "none", background: "#F2F1ED", borderRadius: 8, padding: 6, cursor: "pointer", color: COLORS.inkSoft }}><X size={16} /></button>
        </div>
        {[["name", "Nombre del proyecto"], ["client", "Cliente"], ["city", "Ubicación / ciudad"], ["responsible", "Director / responsable"]].map(([k, label]) => (
          <Field key={k} label={label}><input value={f[k]} onChange={set(k)} style={inputStyle(false, false)} required={k === "name"} /></Field>
        ))}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><Field label="Fecha inicio"><input type="date" value={f.start} onChange={set("start")} style={inputStyle(false, false)} /></Field></div>
          <div style={{ flex: 1 }}><Field label="Fecha entrega"><input type="date" value={f.delivery} onChange={set("delivery")} style={inputStyle(false, false)} /></Field></div>
        </div>
        <Field label="Descripción"><textarea value={f.description} onChange={set("description")} rows={3} style={{ ...inputStyle(false, false), resize: "vertical" }} /></Field>
        <Field label="Equipo asignado (separado por comas)"><input value={f.team} onChange={set("team")} placeholder="Laura Gómez, Kevin Ruiz" style={inputStyle(false, false)} /></Field>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: COLORS.ink, marginBottom: 6 }}>Estado / color</label>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(STATUS).map(([k, s]) => (
              <button key={k} type="button" onClick={() => setF({ ...f, status: k })} style={{ flex: 1, padding: "8px 0", borderRadius: 9, cursor: "pointer", fontSize: 11.5, fontWeight: 600, border: f.status === k ? `1.5px solid ${s.solid}` : `1px solid ${COLORS.line}`, background: s.soft, color: s.solid }}>{s.label}</button>
            ))}
          </div>
        </div>
        <button type="submit" style={{ width: "100%", padding: "11px 0", background: COLORS.ink, color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Crear proyecto</button>
      </form>
    </div>
  );
}
