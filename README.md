# Academia Online

Base real para una plataforma educativa separada del sistema de facturacion, pensada como sitio web de estudio.

## Objetivo

Este proyecto esta pensado para manejar:

- cursos medicos por sistemas o temas
- lectura y video por leccion
- repaso con flashcards
- repaso con quiz
- examen final por tema o modulo
- estudiantes
- un solo profesor/creador
- pagos
- panel administrativo

## Stack base

- `Next.js` para la plataforma web
- `Express + TypeScript` para la API
- `shared` para tipos, constantes y contratos comunes

## Estructura

```text
academia-online/
  apps/
    api/          # backend y reglas de negocio
    web/          # frontend del sitio educativo
  packages/
    shared/       # tipos, utilidades y contratos compartidos
  docs/
    product/      # definicion funcional
    technical/    # arquitectura y decisiones tecnicas
```

## Enfoque recomendado

- `apps/web`: experiencia del estudiante y panel interno del creador
- `apps/api`: autenticacion, cursos, evaluaciones y progreso
- `packages/shared`: modelos comunes para evitar duplicacion

## Como iniciar

```bash
npm install
npm run dev:api
npm run dev:web
```

- web: `http://localhost:3000`
- api: `http://localhost:4000`

## Siguientes pasos

1. Conectar la base de datos.
2. Implementar autenticacion.
3. Crear modulos de cursos, lecciones y evaluaciones.
4. Integrar pagos.

## Modulos sugeridos

- autenticacion y roles
- catalogo de cursos
- gestion de lecciones
- flashcards automaticas por tema
- quizzes configurables por dificultad
- examen final tipo residente por modulo
- pagos y suscripciones
- panel administrativo
- seguimiento de progreso
