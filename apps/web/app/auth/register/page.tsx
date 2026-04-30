export default function RegisterPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div>
          <p className="eyebrow">Registro</p>
          <h1>Crea tu cuenta de estudio</h1>
          <p className="auth-copy">
            Este flujo sera la puerta de entrada para estudiantes, profesores y
            administradores segun el rol que definas.
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
            Rol inicial
            <select defaultValue="student" name="role">
              <option value="student">Estudiante</option>
              <option value="teacher">Profesor</option>
              <option value="admin">Administrador</option>
            </select>
          </label>
          <label>
            Contrasena
            <input name="password" placeholder="********" type="password" />
          </label>
          <button className="primary-action" type="submit">
            Crear cuenta
          </button>
        </form>
      </section>
    </main>
  );
}
