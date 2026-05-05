"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const response = await fetch("/api/auth/login", {
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
      setError(result.message ?? "No se pudo iniciar sesion.");
      setIsSubmitting(false);
      return;
    }

    router.push(result.redirectTo ?? "/student");
    router.refresh();
  }

  return (
    <form className="form-stack-eapa" onSubmit={handleSubmit}>
      <label className="form-label-eapa">
        Correo
        <input className="input-eapa" name="email" placeholder="tu@correo.com" type="email" />
      </label>
      <label className="form-label-eapa">
        Contrasena
        <input className="input-eapa" name="password" placeholder="********" type="password" />
      </label>

      {error ? <p className="form-message form-message-error">{error}</p> : null}

      <button className="primary-btn w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Entrando..." : "Ingresar"}
      </button>
    </form>
  );
}
