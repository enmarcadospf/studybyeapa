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

    const result = (await response.json()) as {
      message?: string;
      redirectTo?: string;
    };

    if (!response.ok) {
      setError(result.message ?? "No se pudo crear la cuenta.");
      setIsSubmitting(false);
      return;
    }

    router.push(result.redirectTo ?? "/student");
    router.refresh();
  }

  return (
    <form className="form-stack-eapa" onSubmit={handleSubmit}>
      <label className="form-label-eapa">
        Nombre completo
        <input className="input-eapa" name="fullName" placeholder="Ingresa tu nombre completo" type="text" />
      </label>
      <label className="form-label-eapa">
        Correo
        <input className="input-eapa" name="email" placeholder="ejemplo@correo.com" type="email" />
      </label>
      <label className="form-label-eapa">
        Contrasena
        <input className="input-eapa" name="password" placeholder="Crea una contrasena segura" type="password" />
      </label>
      <label className="form-label-eapa">
        Confirmar contrasena
        <input
          className="input-eapa"
          name="passwordConfirmation"
          placeholder="Repite tu contrasena"
          type="password"
        />
      </label>

      {error ? <p className="form-message form-message-error">{error}</p> : null}

      <button className="primary-btn w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}
