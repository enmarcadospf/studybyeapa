export default function LoginPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div>
          <p className="eyebrow">Acceso</p>
          <h1>Entrar a la plataforma</h1>
          <p className="auth-copy">
            Aqui iran el inicio de sesion de estudiantes, profesores y
            administradores.
          </p>
        </div>

        <form className="auth-form">
          <label>
            Correo
            <input name="email" placeholder="tu@correo.com" type="email" />
          </label>
          <label>
            Contrasena
            <input name="password" placeholder="********" type="password" />
          </label>
          <button className="primary-action" type="submit">
            Ingresar
          </button>
        </form>

        <p className="auth-footer">
          Aun sin cuenta? <a href="/auth/register">Crear una cuenta</a>
        </p>
      </section>
    </main>
  );
}
