import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cadastrar, explicarErro } from "../api/auth.js";

export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmar: "" });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setErro("");

    if (form.senha.length < 6) return setErro("A senha precisa ter pelo menos 6 caracteres.");
    if (form.senha !== form.confirmar) return setErro("As senhas não são iguais.");

    setCarregando(true);
    try {
      await cadastrar(form.nome, form.email, form.senha);
      navigate("/login", { state: { msg: "Conta criada. Entre com seu e-mail e senha." } });
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
        <p>Crie sua conta para consultar o acervo.</p>
      </aside>

      <form className="auth-form" onSubmit={enviar}>
        <h2>Criar conta</h2>

        <label htmlFor="nome">Nome</label>
        <input id="nome" required autoComplete="name" value={form.nome} onChange={mudar("nome")} />

        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" required autoComplete="email"
               value={form.email} onChange={mudar("email")} />

        <label htmlFor="senha">Senha</label>
        <input id="senha" type="password" required autoComplete="new-password"
               value={form.senha} onChange={mudar("senha")} />

        <label htmlFor="confirmar">Repetir senha</label>
        <input id="confirmar" type="password" required autoComplete="new-password"
               value={form.confirmar} onChange={mudar("confirmar")} />

        {erro && <p className="erro" role="alert">{erro}</p>}

        <button disabled={carregando}>{carregando ? "Criando..." : "Criar conta"}</button>
        <p className="troca">Já tem conta? <Link to="/login">Entrar</Link></p>
      </form>
    </main>
  );
}
