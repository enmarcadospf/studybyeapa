"use client";

import type { Course, StudentAccount } from "@academia/shared";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

type AccountHubProps = {
  student: StudentAccount;
  courses: Course[];
};

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

export function AccountHub({ student, courses }: AccountHubProps) {
  const router = useRouter();
  const [profileMessage, setProfileMessage] = useState<MessageState>(null);
  const [passwordMessage, setPasswordMessage] = useState<MessageState>(null);
  const [revokingDeviceId, setRevokingDeviceId] = useState("");

  const activeDevices = useMemo(
    () => student.devices.filter((device) => device.status === "active"),
    [student.devices],
  );
  const extraChargeDevices = useMemo(
    () => student.devices.filter((device) => device.status === "extra-charge"),
    [student.devices],
  );
  const activeSubscriptions = useMemo(
    () => student.subscriptions.filter((subscription) => subscription.status === "active"),
    [student.subscriptions],
  );

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileMessage(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/student/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: String(formData.get("fullName") ?? ""),
        university: String(formData.get("university") ?? ""),
        profileNote: String(formData.get("profileNote") ?? ""),
      }),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setProfileMessage({
        type: "error",
        text: result.message ?? "No se pudo actualizar el perfil.",
      });
      return;
    }

    setProfileMessage({
      type: "success",
      text: "Perfil actualizado.",
    });
    router.refresh();
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/student/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword: String(formData.get("currentPassword") ?? ""),
        nextPassword: String(formData.get("nextPassword") ?? ""),
        nextPasswordConfirmation: String(
          formData.get("nextPasswordConfirmation") ?? "",
        ),
      }),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setPasswordMessage({
        type: "error",
        text: result.message ?? "No se pudo cambiar la contrasena.",
      });
      return;
    }

    event.currentTarget.reset();
    setPasswordMessage({
      type: "success",
      text: result.message ?? "Contrasena actualizada.",
    });
  }

  async function handleRevokeDevice(deviceId: string) {
    setRevokingDeviceId(deviceId);

    const response = await fetch(`/api/student/devices/${deviceId}`, {
      method: "DELETE",
    });

    setRevokingDeviceId("");

    if (!response.ok) {
      return;
    }

    router.refresh();
  }

  return (
    <section className="account-hub">
      <div className="account-hub-grid">
        <section className="student-panel">
          <div className="section-heading">
            <span>Perfil</span>
            <h2>Tu informacion</h2>
          </div>
          <form className="account-form" onSubmit={handleProfileSubmit}>
            <label>
              Nombre completo
              <input defaultValue={student.fullName} name="fullName" type="text" />
            </label>
            <label>
              Correo
              <input defaultValue={student.email} disabled type="email" />
            </label>
            <label>
              Universidad o centro
              <input
                defaultValue={student.university}
                name="university"
                placeholder="Tu universidad"
                type="text"
              />
            </label>
            <label>
              Nota de perfil
              <textarea
                defaultValue={student.profileNote}
                name="profileNote"
                placeholder="En que area quieres enfocarte ahora"
                rows={4}
              />
            </label>
            {profileMessage ? (
              <p
                className={`form-message ${
                  profileMessage.type === "error"
                    ? "form-message-error"
                    : "form-message-success"
                }`}
              >
                {profileMessage.text}
              </p>
            ) : null}
            <button className="primary-action" type="submit">
              Guardar perfil
            </button>
          </form>
        </section>

        <section className="student-panel">
          <div className="section-heading">
            <span>Seguridad</span>
            <h2>Cambio de contrasena</h2>
          </div>
          <form className="account-form" onSubmit={handlePasswordSubmit}>
            <label>
              Contrasena actual
              <input name="currentPassword" type="password" />
            </label>
            <label>
              Nueva contrasena
              <input name="nextPassword" type="password" />
            </label>
            <label>
              Confirmar nueva contrasena
              <input name="nextPasswordConfirmation" type="password" />
            </label>
            {passwordMessage ? (
              <p
                className={`form-message ${
                  passwordMessage.type === "error"
                    ? "form-message-error"
                    : "form-message-success"
                }`}
              >
                {passwordMessage.text}
              </p>
            ) : null}
            <button className="primary-action" type="submit">
              Actualizar contrasena
            </button>
          </form>
        </section>
      </div>

      <div className="account-hub-grid">
        <section className="student-panel">
          <div className="section-heading">
            <span>Suscripcion</span>
            <h2>Configuracion de cursos y vigencia</h2>
          </div>
          <div className="subscription-policy-card">
            <strong>Cada curso se activa por 3 meses.</strong>
            <p>
              La regla actual queda definida asi: una cuenta puede usar hasta 4
              dispositivos. A partir del quinto, se genera un cargo extra del 50%
              del curso activo correspondiente.
            </p>
          </div>
          <div className="management-list">
            {activeSubscriptions.length ? (
              activeSubscriptions.map((subscription) => (
                <article className="management-list-item" key={subscription.id}>
                  <div>
                    <h3>{subscription.courseTitle}</h3>
                    <p>
                      Vigencia hasta{" "}
                      {new Date(subscription.expiresAt).toLocaleDateString("es-DO")}
                    </p>
                  </div>
                  <div className="management-list-meta">
                    <span>USD {subscription.priceUsd}</span>
                    <small>Recargo extra dispositivo: USD {subscription.extraDeviceFeeUsd}</small>
                  </div>
                </article>
              ))
            ) : (
              <article className="student-course-card">
                <h3>No tienes una suscripcion activa</h3>
                <p>
                  Cuando conectemos el cobro real, cada curso se activara por 90
                  dias y quedara visible aqui con su fecha de vencimiento.
                </p>
              </article>
            )}
          </div>
          <div className="course-topic-row">
            {courses.map((course) => (
              <span className="topic-chip" key={course.id}>
                {course.title} · 3 meses · USD {course.priceUsd}
              </span>
            ))}
          </div>
        </section>

        <section className="student-panel">
          <div className="section-heading">
            <span>Dispositivos</span>
            <h2>Control de acceso por cuenta</h2>
          </div>
          <div className="account-summary-row account-summary-row-compact">
            <article className="dashboard-card">
              <span className="dashboard-label">Activos</span>
              <strong>{activeDevices.length}</strong>
            </article>
            <article className="dashboard-card">
              <span className="dashboard-label">Con recargo</span>
              <strong>{extraChargeDevices.length}</strong>
            </article>
          </div>
          <div className="management-list">
            {student.devices.length ? (
              student.devices.map((device) => (
                <article className="management-list-item" key={device.id}>
                  <div>
                    <h3>{device.label}</h3>
                    <p>{device.userAgent}</p>
                    <p>
                      Ultimo acceso:{" "}
                      {new Date(device.lastSeenAt).toLocaleString("es-DO")}
                    </p>
                  </div>
                  <div className="management-list-meta">
                    <span>
                      {device.status === "active" ? "Activo" : "Recargo"}
                    </span>
                    {device.extraChargeUsd ? (
                      <small>USD {device.extraChargeUsd}</small>
                    ) : null}
                    <button
                      className="ghost-action"
                      disabled={revokingDeviceId === device.id}
                      onClick={() => handleRevokeDevice(device.id)}
                      type="button"
                    >
                      {revokingDeviceId === device.id ? "Cerrando..." : "Cerrar"}
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="empty-copy">Todavia no hay dispositivos registrados.</p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
