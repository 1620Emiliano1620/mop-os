"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserIcon, Lock, Eye, EyeOff, Check, ArrowRight, Loader2, AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { COLORS, ROLE_LABELS, inputStyle } from "@/lib/theme";
import Logo from "@/components/Logo";

function Field({ label, icon: Icon, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: COLORS.ink, marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        {Icon && <Icon size={16} color={COLORS.inkSoft} style={{ position: "absolute", left: 13, top: 12, pointerEvents: "none" }} />}
        {children}
      </div>
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <Lock size={16} color={COLORS.inkSoft} style={{ position: "absolute", left: 13, top: 12, pointerEvents: "none" }} />
      <input
        value={value} onChange={onChange} type={show ? "text" : "password"} placeholder={placeholder}
        style={inputStyle(true, true)}
        onFocus={(e) => (e.target.style.borderColor = COLORS.accent)}
        onBlur={(e) => (e.target.style.borderColor = COLORS.line)}
      />
      <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: 10, top: 9, background: "none", border: "none", cursor: "pointer", padding: 4, color: COLORS.inkSoft }}>
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [role, setRole] = useState("DIRECTOR_OBRA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isLogin = mode === "login";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setNotice("");
    if (!email.trim() || !pw) { setError("Ingresa usuario y contraseña."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw });
    setLoading(false);
    if (err) { setError("Correo o contraseña incorrectos."); return; }
    router.push("/dashboard");
    router.refresh();
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); setNotice("");
    if (!email.trim() || !pw || !pw2) { setError("Completa todos los campos."); return; }
    if (pw.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (pw !== pw2) { setError("Las contraseñas no coinciden."); return; }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({ email: email.trim(), password: pw });
    if (err) { setLoading(false); setError(err.message === "User already registered" ? "Ya existe una cuenta con ese correo. Inicia sesión." : err.message); return; }

    if (data.user) {
      await supabase.from("profiles").upsert({ id: data.user.id, email: email.trim(), role });
    }
    setLoading(false);

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setNotice("Cuenta creada. Revisa tu correo para confirmar el acceso antes de iniciar sesión.");
      setMode("login");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 24 }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        <defs>
          <pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M 34 0 L 0 0 0 34" fill="none" stroke="#E7E5E0" strokeWidth="1" /></pattern>
          <radialGradient id="fade" cx="50%" cy="35%" r="70%"><stop offset="0%" stopColor="white" stopOpacity="0" /><stop offset="100%" stopColor="white" stopOpacity="0.9" /></radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#fade)" />
      </svg>

      <form
        onSubmit={isLogin ? handleLogin : handleSignup}
        style={{ position: "relative", width: 380, maxWidth: "100%", background: COLORS.surface, border: `1px solid ${COLORS.line}`, borderRadius: 20, padding: "40px 32px 32px", boxShadow: "0 20px 60px -20px rgba(20,22,26,0.15)" }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <Logo size={40} />
          <div style={{ marginTop: 16, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, color: COLORS.ink }}>MOP OS</div>
          <div style={{ marginTop: 4, fontSize: 13, color: COLORS.inkSoft }}>Modular Places · Plataforma interna</div>
        </div>

        <div style={{ display: "flex", background: "#F2F1ED", borderRadius: 10, padding: 3, marginBottom: 22 }}>
          <button type="button" onClick={() => { setMode("login"); setError(""); setNotice(""); }}
            style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: isLogin ? COLORS.surface : "transparent", color: isLogin ? COLORS.ink : COLORS.inkSoft, boxShadow: isLogin ? "0 1px 4px rgba(20,22,26,0.1)" : "none" }}>
            Iniciar sesión
          </button>
          <button type="button" onClick={() => { setMode("signup"); setError(""); setNotice(""); }}
            style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: !isLogin ? COLORS.surface : "transparent", color: !isLogin ? COLORS.ink : COLORS.inkSoft, boxShadow: !isLogin ? "0 1px 4px rgba(20,22,26,0.1)" : "none" }}>
            Crear cuenta
          </button>
        </div>

        <Field label="Correo" icon={UserIcon}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@mopmodular.com" style={inputStyle(true, false)}
            onFocus={(e) => (e.target.style.borderColor = COLORS.accent)} onBlur={(e) => (e.target.style.borderColor = COLORS.line)} />
        </Field>

        <Field label={isLogin ? "Contraseña" : "Crear contraseña"}>
          <PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" />
        </Field>

        {!isLogin && (
          <>
            <Field label="Confirmar contraseña">
              <PasswordInput value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Repite la contraseña" />
            </Field>
            <Field label="Rol en el equipo">
              <select value={role} onChange={(e) => setRole(e.target.value)} style={{ ...inputStyle(false, false), padding: "10px 14px", background: "white", cursor: "pointer" }}>
                {Object.entries(ROLE_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </Field>
          </>
        )}

        {isLogin && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 13, color: COLORS.accent, textDecoration: "none", fontWeight: 500 }}>¿Olvidaste tu contraseña?</a>
          </div>
        )}

        {error && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 7, background: COLORS.dangerSoft, color: COLORS.danger, borderRadius: 9, padding: "9px 11px", fontSize: 12.5, marginBottom: 16 }}>
            <AlertCircle size={14} style={{ marginTop: 1, flexShrink: 0 }} /> {error}
          </div>
        )}
        {notice && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 7, background: COLORS.accentSoft, color: COLORS.accent, borderRadius: 9, padding: "9px 11px", fontSize: 12.5, marginBottom: 16 }}>
            <Check size={14} style={{ marginTop: 1, flexShrink: 0 }} /> {notice}
          </div>
        )}

        <button type="submit" disabled={loading}
          style={{ width: "100%", padding: "11px 0", background: COLORS.ink, color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: loading ? 0.75 : 1 }}>
          {loading ? <Loader2 size={15} className="spin" /> : isLogin ? <>Ingresar <ArrowRight size={15} /></> : <>Crear cuenta <ArrowRight size={15} /></>}
        </button>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: COLORS.inkSoft }}>
          Cuenta compartida del equipo MOP · autenticación real vía Supabase
        </div>
      </form>
    </div>
  );
}
