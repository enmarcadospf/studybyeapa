"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      passwordConfirmation: String(formData.get("passwordConfirmation") ?? ""),
    };

    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setError(result.message ?? "No se pudo crear la cuenta.");
      setIsSubmitting(false);
      return;
    }

    router.push("/student");
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
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

      {error ? <p className="form-message form-message-error">{error}</p> : null}

      <button className="primary-action" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}
