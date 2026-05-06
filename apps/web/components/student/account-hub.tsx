"use client";

import type { Course, StudentAccount } from "@academia/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

type AccountHubProps = {
  student: StudentAccount;
  courses: Course[];
  isAdmin: boolean;
  isOwnerAdmin: boolean;
};

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

type SettingsTab =
  | "profile"
  | "preferences"
  | "security"
  | "notifications"
  | "billing";

const settingsTabs: { id: SettingsTab; label: string }[] = [
  { id: "profile", label: "Mi perfil" },
  { id: "preferences", label: "Preferencias" },
  { id: "security", label: "Seguridad" },
  { id: "notifications", label: "Notificaciones" },
  { id: "billing", label: "Facturación" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function StudentAvatar({ name }: { name: string }) {
  return (
    <div className="profile-avatar-eapa" aria-hidden="true">
      <svg viewBox="0 0 120 120" role="img">
        <circle cx="60" cy="60" r="58" fill="#EAF3FF" />
        <path
          d="M34 77c5-13 15-20 26-20s21 7 26 20v19H34V77Z"
          fill="#2D6CC4"
        />
        <circle cx="60" cy="47" r="22" fill="#FFE0C8" />
        <path
          d="M34 49c4-20 17-31 33-27 12 3 20 13 20 29-8-3-17-10-23-20-5 12-16 18-30 18Z"
          fill="#0D2B5E"
        />
        <path d="M51 50c2 3 5 3 7 0" stroke="#0D2B5E" strokeWidth="3" strokeLinecap="round" />
        <path d="M66 50c2 3 5 3 7 0" stroke="#0D2B5E" strokeWidth="3" strokeLinecap="round" />
        <path d="M53 61c4 5 10 5 14 0" stroke="#0D2B5E" strokeWidth="3" strokeLinecap="round" />
        <circle cx="44" cy="56" r="5" fill="#FFB6B6" opacity="0.75" />
        <circle cx="76" cy="56" r="5" fill="#FFB6B6" opacity="0.75" />
      </svg>
      <span>{getInitials(name)}</span>
    </div>
  );
}

export function AccountHub({
  student,
  courses,
  isAdmin,
  isOwnerAdmin,
}: AccountHubProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [profileMessage, setProfileMessage] = useState<MessageState>(null);
  const [passwordMessage, setPasswordMessage] = useState<MessageState>(null);
  const [billingMessage, setBillingMessage] = useState<MessageState>(null);
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
  const enrolledCourses = useMemo(
    () => courses.filter((course) => student.enrolledCourseSlugs.includes(course.slug)),
    [courses, student.enrolledCourseSlugs],
  );
  const availableCourses = useMemo(
    () => courses.filter((course) => !student.enrolledCourseSlugs.includes(course.slug)),
    [courses, student.enrolledCourseSlugs],
  );
  const nextRenewal = activeSubscriptions
    .map((subscription) => subscription.expiresAt)
    .sort()[0];

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
        text: result.message ?? "No se pudo cambiar la contraseña.",
      });
      return;
    }

    event.currentTarget.reset();
    setPasswordMessage({
      type: "success",
      text: result.message ?? "Contraseña actualizada.",
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
    <section className="settings-panel-eapa">
      <div className="profile-tabs-eapa" role="tablist" aria-label="Configuración del estudiante">
        {settingsTabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" ? (
        <section className="profile-tab-grid-eapa">
          <section className="soft-card profile-summary-eapa">
            <StudentAvatar name={student.fullName} />
            <h2>{student.fullName}</h2>
            <p>{student.email}</p>
            <div className="profile-role-row-eapa">
              <span className="profile-badge-eapa">Estudiante</span>
              {isAdmin ? (
                <span className="profile-badge-eapa profile-badge-admin-eapa">
                  {isOwnerAdmin ? "Admin propietario" : "Admin"}
                </span>
              ) : null}
            </div>
            <div className="profile-mini-progress-eapa">
              <span>Cursos activos</span>
              <strong>{activeSubscriptions.length}</strong>
            </div>
          </section>

          <section className="soft-card profile-form-card-eapa">
            <div className="profile-card-head-eapa">
              <div>
                <span>Información personal</span>
                <h2>Datos personales</h2>
              </div>
              <b>Cuenta activa</b>
            </div>
            <form className="form-stack-eapa" onSubmit={handleProfileSubmit}>
              <div className="profile-form-grid-eapa">
                <label className="form-label-eapa">
                  Nombre completo
                  <input className="input-eapa" defaultValue={student.fullName} name="fullName" type="text" />
                </label>
                <label className="form-label-eapa">
                  Correo electrónico
                  <input className="input-eapa" defaultValue={student.email} disabled type="email" />
                </label>
                <label className="form-label-eapa">
                  Universidad
                  <input className="input-eapa" defaultValue={student.university} name="university" placeholder="Ej. UASD, UNIBE, PUCMM..." type="text" />
                </label>
                <label className="form-label-eapa">
                  País
                  <input className="input-eapa" defaultValue="República Dominicana" disabled type="text" />
                </label>
              </div>
              <label className="form-label-eapa">
                Nota de perfil
                <textarea
                  className="input-eapa profile-textarea-eapa"
                  defaultValue={student.profileNote}
                  name="profileNote"
                  placeholder="Ej. Estoy preparándome para semiología e infectología."
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
            <h2>Información de cuenta</h2>
            <div className="side-stats-eapa">
              <div><span>Miembro desde</span><b>{formatDate(student.createdAt)}</b></div>
              <div><span>Plan actual</span><b>{activeSubscriptions.length ? "Estudiante Premium" : "Sin plan activo"}</b></div>
              <div><span>Renovación</span><b>{nextRenewal ? formatDate(nextRenewal) : "Pendiente"}</b></div>
              <div><span>Dispositivos</span><b>{activeDevices.length}/4</b></div>
              <div><span>Extras</span><b>{extraChargeDevices.length}</b></div>
            </div>
            <button
              className="secondary-btn secondary-btn-full"
              type="button"
              onClick={() => setActiveTab("billing")}
            >
              Gestionar suscripción
            </button>
          </section>
        </section>
      ) : null}

      {activeTab === "preferences" ? (
        <section className="settings-two-column-eapa">
          <section className="soft-card profile-wide-card-eapa">
            <div className="profile-card-head-eapa">
              <div>
                <span>Preferencias</span>
                <h2>Tu forma de estudiar</h2>
              </div>
            </div>
            <div className="preference-list-eapa">
              <label>
                <span>
                  <b>Modo enfoque</b>
                  <small>Oculta distracciones durante las lecciones.</small>
                </span>
                <input type="checkbox" defaultChecked />
              </label>
              <label>
                <span>
                  <b>Quiz después de cada tema</b>
                  <small>Recuérdame practicar al terminar una lectura o video.</small>
                </span>
                <input type="checkbox" defaultChecked />
              </label>
              <label>
                <span>
                  <b>Flashcards automáticas</b>
                  <small>Sugerir tarjetas clave cuando haya material cargado.</small>
                </span>
                <input type="checkbox" defaultChecked />
              </label>
            </div>
          </section>

          <section className="soft-card profile-wide-card-eapa">
            <h2>Idioma y experiencia</h2>
            <div className="settings-choice-grid-eapa">
              <button className="is-active" type="button">Español</button>
              <button type="button">Modo claro</button>
              <button type="button">Azul Study</button>
            </div>
            <p className="settings-note-eapa">
              Estas preferencias visuales quedan listas en la interfaz. La persistencia en base de datos la hacemos cuando creemos la tabla de preferencias.
            </p>
          </section>
        </section>
      ) : null}

      {activeTab === "security" ? (
        <section className="settings-security-grid-eapa">
          <section className="soft-card profile-wide-card-eapa">
            <div className="profile-card-head-eapa">
              <div>
                <span>Seguridad</span>
                <h2>Cambiar contraseña</h2>
              </div>
            </div>
            <form className="form-stack-eapa" onSubmit={handlePasswordSubmit}>
              <div className="profile-form-grid-eapa">
                <label className="form-label-eapa">
                  Contraseña actual
                  <input className="input-eapa" name="currentPassword" type="password" />
                </label>
                <label className="form-label-eapa">
                  Nueva contraseña
                  <input className="input-eapa" name="nextPassword" type="password" />
                </label>
                <label className="form-label-eapa">
                  Confirmar nueva contraseña
                  <input className="input-eapa" name="nextPasswordConfirmation" type="password" />
                </label>
              </div>
              {passwordMessage ? (
                <p className={`form-message ${passwordMessage.type === "error" ? "form-message-error" : "form-message-success"}`}>
                  {passwordMessage.text}
                </p>
              ) : null}
              <button className="primary-btn" type="submit">Actualizar contraseña</button>
            </form>
          </section>

          <section className="soft-card device-policy-card-eapa">
            <span>Límite de cuenta</span>
            <h2>{activeDevices.length}/4 dispositivos</h2>
            <p>
              Cada cuenta puede usar hasta 4 dispositivos activos. Si se agrega otro,
              se marca como recargo por el 50% del curso activo.
            </p>
          </section>

          <section className="soft-card profile-wide-card-eapa settings-full-row-eapa">
            <h2>Control de dispositivos</h2>
            <div className="device-list-eapa">
              {student.devices.length ? (
                student.devices.map((device) => (
                  <div key={device.id} className="device-item-eapa">
                    <div>
                      <h3>{device.label}</h3>
                      <p>Último acceso: {formatDate(device.lastSeenAt)}</p>
                      <small>{device.userAgent}</small>
                    </div>
                    <div className="device-actions-eapa">
                      <span className={device.status === "active" ? "status-ok-eapa" : "status-warning-eapa"}>
                        {device.status === "active" ? "Activo" : `Extra USD ${device.extraChargeUsd}`}
                      </span>
                      <button className="secondary-btn small-pill-eapa" onClick={() => handleRevokeDevice(device.id)} type="button">
                        {revokingDeviceId === device.id ? "Cerrando..." : "Cerrar"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-text-eapa">Todavía no hay dispositivos registrados.</p>
              )}
            </div>
          </section>
        </section>
      ) : null}

      {activeTab === "notifications" ? (
        <section className="settings-two-column-eapa">
          <section className="soft-card profile-wide-card-eapa">
            <div className="profile-card-head-eapa">
              <div>
                <span>Correo</span>
                <h2>Notificaciones de estudio</h2>
              </div>
            </div>
            <div className="preference-list-eapa">
              <label>
                <span>
                  <b>Bienvenida al inscribirse</b>
                  <small>Activa. Se envía a {student.email} cuando se crea la cuenta.</small>
                </span>
                <input type="checkbox" defaultChecked disabled />
              </label>
              <label>
                <span>
                  <b>Recordatorios de estudio</b>
                  <small>Resumen semanal de progreso y próximos temas.</small>
                </span>
                <input type="checkbox" defaultChecked />
              </label>
              <label>
                <span>
                  <b>Vencimiento de acceso</b>
                  <small>Avisar antes de que terminen los 3 meses del curso.</small>
                </span>
                <input type="checkbox" defaultChecked />
              </label>
            </div>
          </section>

          <section className="soft-card email-preview-eapa">
            <span>Vista previa</span>
            <h2>Bienvenido a Study by EAPA</h2>
            <p>
              Tu cuenta de estudiante fue creada correctamente. Ya puedes entrar,
              explorar cursos y comenzar a aprender medicina fácil y feliz.
            </p>
          </section>
        </section>
      ) : null}

      {activeTab === "billing" ? (
        <section className="settings-billing-grid-eapa">
          <section className="soft-card profile-wide-card-eapa">
            <div className="profile-card-head-eapa">
              <div>
                <span>Suscripción</span>
                <h2>Cursos activos</h2>
              </div>
              <button
                className="secondary-btn small-pill-eapa"
                type="button"
                onClick={() =>
                  setBillingMessage({
                    type: "success",
                    text: "El portal de pagos se conectará cuando activemos Stripe. Por ahora puedes revisar precios y accesos.",
                  })
                }
              >
                Gestionar pagos
              </button>
            </div>
            {billingMessage ? (
              <p className={`form-message ${billingMessage.type === "error" ? "form-message-error" : "form-message-success"}`}>
                {billingMessage.text}
              </p>
            ) : null}
            <div className="device-list-eapa">
              {activeSubscriptions.length ? (
                activeSubscriptions.map((subscription) => (
                  <div key={subscription.id} className="device-item-eapa">
                    <div>
                      <h3>{subscription.courseTitle}</h3>
                      <p>
                        Acceso por {subscription.cycleLabel} · vence el {formatDate(subscription.expiresAt)}
                      </p>
                    </div>
                    <div className="device-actions-eapa">
                      <span className="status-ok-eapa">Activo</span>
                      <b>USD {subscription.priceUsd}</b>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-billing-eapa">
                  <strong>No tienes cursos activos todavía.</strong>
                  <p>Cuando compres un curso, aquí verás la vigencia de 3 meses y el historial de acceso.</p>
                  <Link href="/courses" className="primary-btn">Explorar cursos</Link>
                </div>
              )}
            </div>
          </section>

          <section className="soft-card profile-wide-card-eapa">
            <h2>Precios disponibles</h2>
            <div className="billing-course-grid-eapa">
              {[...enrolledCourses, ...availableCourses].slice(0, 8).map((course) => {
                const hasAccess = student.enrolledCourseSlugs.includes(course.slug);

                return (
                  <Link key={course.id} href={`/courses/${course.slug}`} className="billing-course-card-eapa">
                    <span>{hasAccess ? "Activo" : "Disponible"}</span>
                    <strong>{course.title}</strong>
                    <small>3 meses · {course.lessons} lecciones</small>
                    <b>USD {course.priceUsd}</b>
                  </Link>
                );
              })}
            </div>
          </section>
        </section>
      ) : null}
    </section>
  );
}
