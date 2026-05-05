"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import type { AdminUser } from "../../lib/server/admin-store";

type AdminUserManagerProps = {
  admins: AdminUser[];
  currentAdminEmail: string;
  isOwner: boolean;
};

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

export function AdminUserManager({
  admins,
  currentAdminEmail,
  isOwner,
}: AdminUserManagerProps) {
  const [adminList, setAdminList] = useState(admins);
  const [message, setMessage] = useState<MessageState>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [removingEmail, setRemovingEmail] = useState("");

  async function handleAddAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSaving(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: String(formData.get("email") ?? ""),
      }),
    });
    const payload = (await response.json()) as {
      admins?: AdminUser[];
      message?: string;
    };

    setIsSaving(false);

    if (!response.ok || !payload.admins) {
      setMessage({
        type: "error",
        text: payload.message ?? "No se pudo agregar el admin.",
      });
      return;
    }

    form.reset();
    setAdminList(payload.admins);
    setMessage({ type: "success", text: "Admin agregado correctamente." });
  }

  async function handleRemoveAdmin(email: string) {
    setMessage(null);
    setRemovingEmail(email);

    const response = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const payload = (await response.json()) as {
      admins?: AdminUser[];
      message?: string;
    };

    setRemovingEmail("");

    if (!response.ok || !payload.admins) {
      setMessage({
        type: "error",
        text: payload.message ?? "No se pudo quitar el admin.",
      });
      return;
    }

    setAdminList(payload.admins);
    setMessage({ type: "success", text: "Admin removido correctamente." });
  }

  return (
    <div className="admin-users-manager-eapa">
      <div className="section-heading">
        <span>Seguridad</span>
        <h2>Admins autorizados</h2>
        <p>
          Solo estos correos pueden abrir el editor interno después de iniciar
          sesión con contraseña. Tu correo propietario es el único que puede
          agregar o quitar admins.
        </p>
      </div>

      {isOwner ? (
        <form className="admin-add-form-eapa" onSubmit={handleAddAdmin}>
          <label className="material-field">
            Agregar correo admin
            <input
              className="material-input"
              name="email"
              placeholder="correo@ejemplo.com"
              type="email"
            />
          </label>
          <button className="primary-action" disabled={isSaving} type="submit">
            {isSaving ? "Agregando..." : "Agregar admin"}
          </button>
        </form>
      ) : (
        <p className="form-message form-message-error">
          Estás dentro como admin, pero solo el propietario puede administrar
          otros correos.
        </p>
      )}

      {message ? (
        <p
          className={
            message.type === "error"
              ? "form-message form-message-error"
              : "form-message form-message-success"
          }
        >
          {message.text}
        </p>
      ) : null}

      <div className="management-list">
        {adminList.map((admin) => (
          <article className="management-list-item" key={`${admin.source}-${admin.email}`}>
            <div>
              <h3>{admin.email}</h3>
              <p>
                {admin.role === "owner"
                  ? "Propietario principal"
                  : `Agregado por ${admin.createdBy}`}
              </p>
            </div>
            <div className="management-list-meta">
              <span>{admin.role === "owner" ? "Propietario" : "Admin"}</span>
              <small>{admin.email === currentAdminEmail ? "Tu sesión actual" : admin.source === "server" ? "Seguro" : "Base de datos"}</small>
              {isOwner && admin.source === "database" ? (
                <button
                  className="secondary-btn small-pill-eapa"
                  onClick={() => handleRemoveAdmin(admin.email)}
                  type="button"
                >
                  {removingEmail === admin.email ? "Quitando..." : "Quitar"}
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
