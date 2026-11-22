import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <header className="site-header">
      <Link to="/" className="brand">book<span>catalog</span></Link>
      <nav>
        <NavLink to="/">Explorar</NavLink>
        {user && <NavLink to="/favoritos">Favoritos</NavLink>}
        {user ? (
          <>
            <span className="user-email">{user.email}</span>
            <button className="button button-quiet" onClick={handleSignOut}>Sair</button>
          </>
        ) : (
          <NavLink className="nav-login" to="/login">Entrar</NavLink>
        )}
      </nav>
    </header>
  );
}