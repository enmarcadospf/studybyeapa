"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

type SimulacroStatus = "available" | "completed";
type SimulacroTab = "available" | "completed" | "results";

type Simulacro = {
  id: string;
  title: string;
  courseSlug: string;
  courseName: string;
  questions: number;
  durationHours: number;
  dateLabel: string;
  status: SimulacroStatus;
  score: number | null;
  strengths: Array<{ label: string; value: number }>;
};

type SimulacrosPanelProps = {
  isLoggedIn: boolean;
  enrolledCourseSlugs: string[];
};

const simulacros: Simulacro[] = [
  {
    id: "sim-anatomia-1",
    title: "Simulacro EAPA 2026 · Anatomía y Fisiología",
    courseSlug: "anatomia",
    courseName: "Anatomía",
    questions: 60,
    durationHours: 3,
    dateLabel: "15 Mayo, 2026",
    status: "completed",
    score: 84,
    strengths: [
      { label: "Anatomía", value: 85 },
      { label: "Fisiología", value: 76 },
      { label: "Farmacología", value: 42 },
    ],
  },
  {
    id: "sim-infectologia-1",
    title: "Simulacro EAPA 2026 · Infectología clínica",
    courseSlug: "infectologia",
    courseName: "Infectología",
    questions: 70,
    durationHours: 3,
    dateLabel: "22 Mayo, 2026",
    status: "completed",
    score: 68,
    strengths: [
      { label: "Antibióticos", value: 70 },
      { label: "Síndrome febril", value: 66 },
      { label: "Microbiología", value: 61 },
    ],
  },
  {
    id: "sim-patologia-1",
    title: "Simulacro EAPA 2026 · Patología general",
    courseSlug: "patologia-general",
    courseName: "Patología",
    questions: 80,
    durationHours: 4,
    dateLabel: "12 Junio, 2026",
    status: "available",
    score: null,
    strengths: [
      { label: "Lesión celular", value: 0 },
      { label: "Inflamación", value: 0 },
      { label: "Neoplasia", value: 0 },
    ],
  },
  {
    id: "sim-microbiologia-1",
    title: "Simulacro EAPA 2026 · Microbiología",
    courseSlug: "microbiologia",
    courseName: "Microbiología",
    questions: 60,
    durationHours: 3,
    dateLabel: "26 Junio, 2026",
    status: "available",
    score: null,
    strengths: [
      { label: "Bacterias", value: 0 },
      { label: "Virus", value: 0 },
      { label: "Hongos", value: 0 },
    ],
  },
];

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function SimulacrosPanel({
  isLoggedIn,
  enrolledCourseSlugs,
}: SimulacrosPanelProps) {
  const completed = useMemo(
    () => simulacros.filter((simulacro) => simulacro.status === "completed"),
    [],
  );
  const available = useMemo(
    () => simulacros.filter((simulacro) => simulacro.status === "available"),
    [],
  );
  const averageScore = completed.length
    ? Math.round(
        completed.reduce((total, simulacro) => total + (simulacro.score ?? 0), 0) /
          completed.length,
      )
    : 0;
  const bestScore = completed.reduce(
    (best, simulacro) => Math.max(best, simulacro.score ?? 0),
    0,
  );
  const [activeTab, setActiveTab] = useState<SimulacroTab>("available");
  const [selectedResultId, setSelectedResultId] = useState(completed[0]?.id ?? "");
  const selectedResult =
    completed.find((simulacro) => simulacro.id === selectedResultId) ?? completed[0];

  const activeList =
    activeTab === "completed"
      ? completed
      : activeTab === "available"
        ? available
        : selectedResult
          ? [selectedResult]
          : [];

  return (
    <div className="simulacros-grid-eapa">
      <aside className="soft-card side-card-eapa sim-summary-card-eapa">
        <h2>Tu rendimiento general</h2>
        <div
          className="score-ring-eapa score-ring-dynamic-eapa"
          style={{ "--score": `${clampScore(averageScore)}%` } as CSSProperties}
        >
          <div>
            <p>{averageScore}%</p>
            <span>Promedio general</span>
          </div>
        </div>
        <div className="side-stats-eapa">
          <div><span>Simulacros realizados</span><b>{completed.length}</b></div>
          <div><span>Promedio de aciertos</span><b>{averageScore}%</b></div>
          <div><span>Mejor puntaje</span><b>{bestScore}%</b></div>
        </div>
        <div className="strength-tags-eapa">
          <span>Anatomía 85%</span>
          <span>Fisiología 76%</span>
          <span>Farmacología 42%</span>
        </div>
        {!isLoggedIn ? (
          <div className="sim-login-note-eapa">
            <strong>Inicia sesión para guardar resultados.</strong>
            <Link href="/auth/login">Entrar</Link>
          </div>
        ) : null}
      </aside>

      <section className="soft-card content-card-eapa sim-content-card-eapa">
        <div className="sim-content-head-eapa">
          <div>
            <h2>Simulacros disponibles</h2>
            <p>Practica con preguntas por materia y revisa tus resultados.</p>
          </div>
          <div className="sim-tabs-eapa" role="tablist" aria-label="Secciones de simulacros">
            <button
              className={activeTab === "available" ? "is-active" : ""}
              onClick={() => setActiveTab("available")}
              type="button"
            >
              Disponibles
            </button>
            <button
              className={activeTab === "completed" ? "is-active" : ""}
              onClick={() => setActiveTab("completed")}
              type="button"
            >
              Realizados
            </button>
            <button
              className={activeTab === "results" ? "is-active" : ""}
              onClick={() => setActiveTab("results")}
              type="button"
            >
              Resultados
            </button>
          </div>
        </div>

        <div className="sim-list-eapa">
          {activeList.map((item) => {
            const hasCourseAccess = enrolledCourseSlugs.includes(item.courseSlug);
            const canStart = isLoggedIn && hasCourseAccess;

            return (
              <article key={item.id} className="sim-item-eapa">
                <div className="sim-item-main-eapa">
                  <div className="sim-icon-eapa">☑</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>
                      {item.questions} preguntas · {item.durationHours} horas · {item.dateLabel}
                    </p>
                  </div>
                </div>
                <div className="sim-item-meta-eapa">
                  <span className={item.status === "completed" ? "status-ok-eapa" : "status-pending-eapa"}>
                    {item.status === "completed" ? "Completado" : "Disponible"}
                  </span>
                  <strong>{item.score ? `${item.score}%` : "-"}</strong>
                  {item.status === "completed" ? (
                    <button
                      className="secondary-btn small-btn-eapa"
                      onClick={() => {
                        setSelectedResultId(item.id);
                        setActiveTab("results");
                      }}
                      type="button"
                    >
                      Ver resultado
                    </button>
                  ) : (
                    <Link
                      className={canStart ? "primary-btn small-btn-eapa" : "secondary-btn small-btn-eapa"}
                      href={
                        !isLoggedIn
                          ? "/auth/login"
                          : canStart
                            ? `/courses/${item.courseSlug}#ai-study`
                            : `/courses/${item.courseSlug}`
                      }
                    >
                      {!isLoggedIn ? "Entrar" : canStart ? "Comenzar" : "Ver curso"}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {activeTab === "results" && selectedResult ? (
          <div className="sim-result-detail-eapa">
            <div>
              <h3>{selectedResult.title}</h3>
              <p>
                Resultado: <strong>{selectedResult.score}%</strong>. Usa este resumen
                para saber qué repasar antes del próximo intento.
              </p>
            </div>
            <div className="sim-strength-bars-eapa">
              {selectedResult.strengths.map((area) => (
                <div key={area.label}>
                  <div>
                    <span>{area.label}</span>
                    <strong>{area.value}%</strong>
                  </div>
                  <div className="progress-track-eapa">
                    <span style={{ width: `${area.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
