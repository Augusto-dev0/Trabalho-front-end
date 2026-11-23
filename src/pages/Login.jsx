import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login, explicarErro } from "../api/auth.js";

export default function Login() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await login(email, senha);
      navigate(state?.de ?? "/categorias", { replace: true });
    } catch (err) {
      setErro(explicarErro(err));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="auth">
      <aside className="auth-lado">
        <h1>Biblioteca</h1>
        <p>Entre para gerenciar o acervo.</p>
      </aside>

      <form className="auth-form" onSubmit={enviar}>
        <h2>Entrar</h2>
        {state?.msg && <p className="ok">{state.msg}</p>}

        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" required autoComplete="email"
               value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="senha">Senha</label>
        <input id="senha" type="password" required autoComplete="current-password"
               value={senha} onChange={(e) => setSenha(e.target.value)} />

        {erro && <p className="erro" role="alert">{erro}</p>}

        <button disabled={carregando}>{carregando ? "Entrando..." : "Entrar"}</button>
        <p className="troca">Ainda não tem conta? <Link to="/cadastro">Criar conta</Link></p>
      </form>
    </main>
  );
}
