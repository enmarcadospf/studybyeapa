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

    setProfileMessage({ type: "success", text: "Perfil actualizado." });
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
    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <section className="profile-layout-eapa">
      <section className="soft-card profile-summary-eapa">
        <div className="profile-avatar-eapa">👩🏻‍⚕️</div>
        <h2>{student.fullName}</h2>
        <p>{student.email}</p>
        <span className="profile-badge-eapa">Estudiante</span>
      </section>

      <section className="soft-card profile-form-card-eapa">
        <h2>Datos personales</h2>
        <form className="form-stack-eapa" onSubmit={handleProfileSubmit}>
          <div className="profile-form-grid-eapa">
            <label className="form-label-eapa">
              Nombre completo
              <input className="input-eapa" defaultValue={student.fullName} name="fullName" type="text" />
            </label>
            <label className="form-label-eapa">
              Correo electronico
              <input className="input-eapa" defaultValue={student.email} disabled type="email" />
            </label>
            <label className="form-label-eapa">
              Universidad
              <input className="input-eapa" defaultValue={student.university} name="university" type="text" />
            </label>
            <label className="form-label-eapa">
              Estado
              <input className="input-eapa" defaultValue="Republica Dominicana" disabled type="text" />
            </label>
          </div>
          <label className="form-label-eapa">
            Nota de perfil
            <textarea
              className="input-eapa profile-textarea-eapa"
              defaultValue={student.profileNote}
              name="profileNote"
              rows={4}
            />
          </label>
          {profileMessage ? (
            <p className={`form-message ${profileMessage.type === "error" ? "form-message-error" : "form-message-success"}`}>
              {profileMessage.text}
            </p>
          ) : null}
          <button className="primary-btn" type="submit">Guardar cambios</button>
        </form>
      </section>

      <section className="soft-card profile-side-info-eapa">
        <h2>Informacion de cuenta</h2>
        <div className="side-stats-eapa">
          <div><span>Miembro desde</span><b>{new Date(student.createdAt).toLocaleDateString("es-DO")}</b></div>
          <div><span>Plan actual</span><b>{activeSubscriptions.length ? "Estudiante Premium" : "Sin plan activo"}</b></div>
          <div><span>Renovacion</span><b>{activeSubscriptions[0] ? new Date(activeSubscriptions[0].expiresAt).toLocaleDateString("es-DO") : "Pendiente"}</b></div>
          <div><span>Dispositivos activos</span><b>{activeDevices.length}</b></div>
          <div><span>Dispositivos extra</span><b>{extraChargeDevices.length}</b></div>
        </div>
        <button className="secondary-btn secondary-btn-full" type="button">
          Gestionar suscripcion
        </button>
      </section>

      <section className="soft-card profile-wide-card-eapa">
        <h2>Cambiar contrasena</h2>
        <form className="form-stack-eapa" onSubmit={handlePasswordSubmit}>
          <div className="profile-form-grid-eapa">
            <label className="form-label-eapa">
              Contrasena actual
              <input className="input-eapa" name="currentPassword" type="password" />
            </label>
            <label className="form-label-eapa">
              Nueva contrasena
              <input className="input-eapa" name="nextPassword" type="password" />
            </label>
            <label className="form-label-eapa">
              Confirmar nueva contrasena
              <input className="input-eapa" name="nextPasswordConfirmation" type="password" />
            </label>
          </div>
          {passwordMessage ? (
            <p className={`form-message ${passwordMessage.type === "error" ? "form-message-error" : "form-message-success"}`}>
              {passwordMessage.text}
            </p>
          ) : null}
          <button className="primary-btn" type="submit">Actualizar contrasena</button>
        </form>
      </section>

      <section className="soft-card profile-wide-card-eapa">
        <h2>Control de dispositivos</h2>
        <div className="device-list-eapa">
          {student.devices.length ? (
            student.devices.map((device) => (
              <div key={device.id} className="device-item-eapa">
                <div>
                  <h3>{device.label}</h3>
                  <p>{device.userAgent}</p>
                </div>
                <div className="device-actions-eapa">
                  <span>{device.status === "active" ? "Activo" : "Recargo"}</span>
                  <button className="secondary-btn small-pill-eapa" onClick={() => handleRevokeDevice(device.id)} type="button">
                    {revokingDeviceId === device.id ? "Cerrando..." : "Cerrar"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-text-eapa">Todavia no hay dispositivos registrados.</p>
          )}
        </div>
      </section>

      <section className="soft-card profile-wide-card-eapa">
        <h2>Cursos y vigencia</h2>
        <div className="device-list-eapa">
          {courses.map((course) => (
            <div key={course.id} className="device-item-eapa">
              <div>
                <h3>{course.title}</h3>
                <p>Acceso por 3 meses · recargo extra dispositivo del 50%</p>
              </div>
              <div className="device-actions-eapa">
                <span>USD {course.priceUsd}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
