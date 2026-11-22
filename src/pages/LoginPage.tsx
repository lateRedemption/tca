import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try { await signIn(email, password); navigate("/favoritos"); }
    catch (err) { setError(err instanceof Error ? err.message : "Não foi possível entrar."); }
    finally { setLoading(false); }
  }

  return <section className="auth-panel"><p className="eyebrow">BEM-VINDO DE VOLTA</p><h1>Entrar</h1><p className="muted">Acesse sua biblioteca pessoal.</p>
    <form className="auth-form" onSubmit={submit}>
      <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label>Senha<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required /></label>
      {error && <p className="error">{error}</p>}
      <button className="button" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
    </form>
    <p className="auth-switch">Ainda não tem conta? <Link to="/cadastro">Criar conta</Link></p>
  </section>;
}