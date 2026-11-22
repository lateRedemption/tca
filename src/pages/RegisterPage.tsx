import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice(""); setLoading(true);
    try {
      await signUp(email, password);
      setNotice("Cadastro enviado. Se a confirmação de e-mail estiver habilitada, verifique sua caixa de entrada.");
      navigate("/login", { state: { notice: "Conta criada. Faça login para continuar." } });
    } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível criar a conta."); }
    finally { setLoading(false); }
  }

  return <section className="auth-panel"><p className="eyebrow">CRIE SUA BIBLIOTECA</p><h1>Criar conta</h1><p className="muted">Salve livros para encontrar depois.</p>
    <form className="auth-form" onSubmit={submit}>
      <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label>Senha<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required /></label>
      {error && <p className="error">{error}</p>}
      {notice && <p className="message">{notice}</p>}
      <button className="button" disabled={loading}>{loading ? "Criando..." : "Criar conta"}</button>
    </form>
    <p className="auth-switch">Já tem conta? <Link to="/login">Entrar</Link></p>
  </section>;
}