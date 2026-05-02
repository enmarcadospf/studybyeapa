"use client";

import Link from "next/link";
import { useState } from "react";
import type { Course, CourseLevel } from "@academia/shared";

type CourseCatalogProps = {
  courses: Course[];
  enrolledCourseSlugs: string[];
};

type CourseIconName =
  | "anatomy"
  | "heart"
  | "molecule"
  | "pill"
  | "cells"
  | "microbe"
  | "stethoscope"
  | "book";

const levelLabel: Record<CourseLevel, string> = {
  beginner: "Básico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const progressMap: Record<string, number> = {
  "semiologia-clinica": 65,
  infectologia: 42,
  anatomia: 70,
  "fisiologia-medica": 48,
  "bioquimica-medica": 36,
  "farmacologia-general": 30,
  "patologia-general": 25,
  microbiologia: 40,
};

const iconMap: Record<string, CourseIconName> = {
  "semiologia-clinica": "stethoscope",
  infectologia: "microbe",
  anatomia: "anatomy",
  "fisiologia-medica": "heart",
  "bioquimica-medica": "molecule",
  "farmacologia-general": "pill",
  "patologia-general": "cells",
  microbiologia: "microbe",
};

function CourseIcon({ name }: { name: CourseIconName }) {
  if (name === "anatomy") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 6v36" />
        <path d="M16 10c-4 4-5 10-4 16 1 7 5 11 12 16" />
        <path d="M32 10c4 4 5 10 4 16-1 7-5 11-12 16" />
        <path d="M15 18h18" />
        <path d="M13 26h22" />
        <path d="M17 34h14" />
      </svg>
    );
  }

  if (name === "heart") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 40s-15-9.4-18.4-19.4C3.7 14.8 7 10 12.6 10c3.5 0 6.3 1.8 8.1 4.4C22.4 11.8 25.3 10 28.8 10c5.6 0 8.9 4.8 7 10.6C32.4 30.6 24 40 24 40Z" />
        <path d="M10 25h7l3-6 5 12 4-8h9" />
      </svg>
    );
  }

  if (name === "molecule") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="13" cy="15" r="5" />
        <circle cx="34" cy="12" r="5" />
        <circle cx="31" cy="34" r="6" />
        <circle cx="14" cy="33" r="4" />
        <path d="m18 16 11-3" />
        <path d="m17 30 10-12" />
        <path d="m18 33 7 1" />
      </svg>
    );
  }

  if (name === "pill") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M17 36 36 17a8 8 0 0 0-11-11L6 25a8 8 0 0 0 11 11Z" />
        <path d="m18 13 17 17" />
      </svg>
    );
  }

  if (name === "cells") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="17" cy="18" r="8" />
        <circle cx="31" cy="16" r="6" />
        <circle cx="29" cy="31" r="9" />
        <path d="M17 18h.1" />
        <path d="M31 16h.1" />
        <path d="M29 31h.1" />
      </svg>
    );
  }

  if (name === "microbe") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="10" />
        <path d="M24 7v7" />
        <path d="M24 34v7" />
        <path d="m8.5 15 6 3.5" />
        <path d="m33.5 29.5 6 3.5" />
        <path d="m39.5 15-6 3.5" />
        <path d="m14.5 29.5-6 3.5" />
        <path d="M20 22h.1" />
        <path d="M28 26h.1" />
        <path d="M27 19h.1" />
      </svg>
    );
  }

  if (name === "stethoscope") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M14 10v10c0 7 4.5 12 10 12s10-5 10-12V10" />
        <path d="M24 32v3c0 4 3 7 7 7s7-3 7-7v-3" />
        <circle cx="38" cy="30" r="4" />
        <path d="M11 10h6" />
        <path d="M31 10h6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M10 12c5.8-2.1 10.5-1.1 14 3v25c-3.5-4.1-8.2-5.1-14-3V12Z" />
      <path d="M24 15c3.5-4.1 8.2-5.1 14-3v25c-5.8-2.1-10.5-1.1-14 3V15Z" />
    </svg>
  );
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function CourseCatalog({
  courses,
  enrolledCourseSlugs,
}: CourseCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [compactView, setCompactView] = useState(false);

  const categories = Array.from(new Set(courses.map((course) => course.category))).sort();
  const normalizedQuery = normalizeText(query.trim());
  const visibleCourses = courses
    .filter((course) => {
      const matchesSearch = normalizedQuery
        ? normalizeText(`${course.title} ${course.summary} ${course.category}`).includes(
            normalizedQuery,
          )
        : true;
      const matchesCategory = category === "all" || course.category === category;
      const matchesLevel = level === "all" || course.level === level;

      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return a.priceUsd - b.priceUsd;
      }

      if (sortBy === "price-high") {
        return b.priceUsd - a.priceUsd;
      }

      if (sortBy === "lessons") {
        return b.lessons - a.lessons;
      }

      return Number(b.featured) - Number(a.featured);
    });

  return (
    <>
      <div className="courses-filters-eapa" aria-label="Filtros del catálogo">
        <label className="course-search-eapa">
          <span aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
          </span>
          <input
            className="input-eapa"
            placeholder="Buscar cursos..."
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <select
          className="input-eapa"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filtrar por categoría"
        >
          <option value="all">Categoría: Todas</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className="input-eapa"
          value={level}
          onChange={(event) => setLevel(event.target.value)}
          aria-label="Filtrar por nivel"
        >
          <option value="all">Nivel: Todos</option>
          <option value="beginner">Básico</option>
          <option value="intermediate">Intermedio</option>
          <option value="advanced">Avanzado</option>
        </select>

        <select
          className="input-eapa"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          aria-label="Ordenar cursos"
        >
          <option value="featured">Ordenar: Relevancia</option>
          <option value="lessons">Más lecciones</option>
          <option value="price-low">Precio menor</option>
          <option value="price-high">Precio mayor</option>
        </select>

        <button
          className={compactView ? "grid-button-eapa is-active" : "grid-button-eapa"}
          type="button"
          onClick={() => setCompactView((current) => !current)}
          aria-pressed={compactView}
          aria-label="Cambiar vista del catálogo"
        >
          ▦
        </button>
      </div>

      <div className={compactView ? "courses-grid-eapa is-compact" : "courses-grid-eapa"}>
        {visibleCourses.map((course) => {
          const progress = progressMap[course.slug] ?? 0;
          const hasAccess = enrolledCourseSlugs.includes(course.slug);
          const icon = iconMap[course.slug] ?? "book";

          return (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="course-card-eapa"
            >
              <div className="course-card-visual-eapa">
                <div className="course-card-icon-eapa">
                  <CourseIcon name={icon} />
                </div>
                <span className={hasAccess ? "course-status-pill is-active" : "course-status-pill"}>
                  {hasAccess ? "Acceso activo" : `USD ${course.priceUsd}`}
                </span>
              </div>
              <h3>{course.title}</h3>
              <p>{course.summary}</p>
              <div className="course-card-meta-eapa">
                <span>{course.lessons} lecciones</span>
                <span>{course.durationHours} h</span>
                <strong>{levelLabel[course.level] ?? course.level}</strong>
              </div>
              <div className="course-progress-eapa">
                <div>
                  <span>{hasAccess ? "Tu progreso" : "Vista previa"}</span>
                  <strong>{hasAccess ? `${progress}%` : "3 meses"}</strong>
                </div>
                <div className="progress-track-eapa">
                  <div
                    className="progress-fill-eapa"
                    style={{ width: hasAccess ? `${progress}%` : "18%" }}
                  />
                </div>
              </div>
              <div className="course-card-action-eapa">
                <span>{hasAccess ? "Continuar curso" : "Ver módulos y suscripción"}</span>
                <strong>→</strong>
              </div>
            </Link>
          );
        })}

        {visibleCourses.length === 0 ? (
          <div className="soft-card course-empty-eapa">
            <strong>No encontramos ese curso todavía.</strong>
            <p>
              Prueba otro término o limpia los filtros. Luego agregaremos más materias desde
              el editor de contenido.
            </p>
            <button
              className="secondary-btn"
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setLevel("all");
                setSortBy("featured");
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
