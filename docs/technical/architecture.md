# Arquitectura inicial

## Propuesta

Separar la solucion en tres capas:

- `apps/web`: experiencia web del estudiante y panel interno del creador
- `apps/api`: servicios y reglas de negocio
- `packages/shared`: contratos compartidos

## Modulos de backend

- auth
- users
- courses
- lessons
- study-tools
- assessments
- payments
- notifications

## Entidades base

- User
- Role
- Course
- Lesson
- Flashcard
- Quiz
- QuestionTemplate
- FinalExam
- Enrollment
- Payment

## Decisiones pendientes

- framework del frontend
- framework del backend
- proveedor de pagos
- estrategia de generacion automatica de preguntas
- base de datos final
