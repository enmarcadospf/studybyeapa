# Modelo de datos inicial

## Entidades principales

### User

- id
- fullName
- email
- passwordHash
- role
- createdAt

### InstructorProfile

- id
- displayName
- bio
- isPrimaryOwner

### Course

- id
- slug
- title
- summary
- level
- category
- price
- published

### Lesson

- id
- courseId
- title
- summary
- contentType
- videoUrl
- readingContent
- orderIndex

### FlashcardSet

- id
- lessonId
- generationGuideVersion
- cardCount

### QuizAttempt

- id
- userId
- lessonId
- difficulty
- score
- createdAt

### FinalExam

- id
- courseId
- moduleName
- difficulty
- generatedFromGuideVersion

### Enrollment

- id
- userId
- courseId
- status
- progressPercent
- createdAt

### Payment

- id
- userId
- courseId
- amount
- currency
- status
- providerReference

## Relaciones base

- un `User` puede tener muchas `Enrollment`
- un `Course` puede tener muchas `Lesson`
- una `Lesson` puede tener un `FlashcardSet`
- un `User` puede tener muchos `QuizAttempt`
- un `Course` o modulo puede tener un `FinalExam`
- un `Payment` puede pertenecer a una inscripcion o a una tutoria

## Decision recomendada

Usar `PostgreSQL` como base principal y luego agregar ORM cuando el entorno tenga Node listo.
