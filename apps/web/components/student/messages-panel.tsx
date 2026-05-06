"use client";

import { type FormEvent, useState } from "react";

type StudentMessage = {
  id: string;
  from: string;
  subject: string;
  body: string;
  dateLabel: string;
  unread: boolean;
};

const initialMessages: StudentMessage[] = [
  {
    id: "welcome",
    from: "Study by EAPA",
    subject: "Bienvenido a tu espacio de estudio",
    body: "Aquí recibirás avisos importantes de cursos, vencimiento de acceso, materiales nuevos y recordatorios.",
    dateLabel: "Hoy",
    unread: true,
  },
  {
    id: "calendar",
    from: "Calendario",
    subject: "Organiza tus repasos",
    body: "Puedes agregar actividades y enviarlas a Google Calendar si deseas recibir notificaciones.",
    dateLabel: "Esta semana",
    unread: false,
  },
];

export function MessagesPanel() {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessageId, setSelectedMessageId] = useState(initialMessages[0].id);
  const selectedMessage =
    messages.find((message) => message.id === selectedMessageId) ?? messages[0];

  function markAsRead(messageId: string) {
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId ? { ...message, unread: false } : message,
      ),
    );
    setSelectedMessageId(messageId);
  }

  function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const subject = String(formData.get("subject") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();

    if (!subject || !body) {
      return;
    }

    const nextMessage: StudentMessage = {
      id: `sent-${Date.now()}`,
      from: "Tú",
      subject,
      body,
      dateLabel: "Ahora",
      unread: false,
    };

    setMessages((current) => [nextMessage, ...current]);
    setSelectedMessageId(nextMessage.id);
    event.currentTarget.reset();
  }

  return (
    <section className="student-tool-grid-eapa">
      <aside className="soft-card student-tool-list-eapa">
        <h2>Bandeja</h2>
        <div className="student-note-list-eapa">
          {messages.map((message) => (
            <button
              className={message.id === selectedMessage.id ? "is-active" : ""}
              key={message.id}
              onClick={() => markAsRead(message.id)}
              type="button"
            >
              <strong>{message.subject}</strong>
              <span>{message.from} · {message.dateLabel}</span>
              {message.unread ? <i>Nuevo</i> : null}
            </button>
          ))}
        </div>
      </aside>

      <section className="soft-card student-tool-detail-eapa">
        <span className="courses-eyebrow-eapa">{selectedMessage.from}</span>
        <h2>{selectedMessage.subject}</h2>
        <p>{selectedMessage.body}</p>
      </section>

      <form className="soft-card student-tool-form-eapa" onSubmit={handleSendMessage}>
        <h2>Mensaje rápido</h2>
        <label>
          Asunto
          <input name="subject" placeholder="Ej. Duda de anatomía" />
        </label>
        <label>
          Mensaje
          <textarea name="body" placeholder="Escribe tu mensaje..." />
        </label>
        <button className="primary-btn" type="submit">Guardar mensaje</button>
      </form>
    </section>
  );
}
