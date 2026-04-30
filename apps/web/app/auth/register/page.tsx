export default function RegisterPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div>
          <p className="eyebrow">Registro</p>
          <h1>Crea tu cuenta de estudiante</h1>
          <p className="auth-copy">
            Este registro es solo para estudiantes. Desde aqui podran entrar a
            sus cursos, repasar con flashcards y resolver quiz o examenes.
          </p>
        </div>

        <form className="auth-form">
          <label>
            Nombre completo
            <input name="fullName" placeholder="Tu nombre" type="text" />
          </label>
          <label>
            Correo
            <input name="email" placeholder="tu@correo.com" type="email" />
          </label>
          <label>
            Contrasena
            <input name="password" placeholder="********" type="password" />
          </label>
          <label>
            Confirmar contrasena
            <input
              name="passwordConfirmation"
              placeholder="********"
              type="password"
            />
          </label>
          <button className="primary-action" type="submit">
            Crear cuenta
          </button>
        </form>

        <p className="auth-footer">
          El acceso de administrador y creador se gestiona internamente.
        </p>
      </section>
    </main>
  );
}
