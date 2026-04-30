# OpenAI y material real por leccion

Study by EAPA usa una ruta de servidor para hablar con OpenAI. La clave nunca
debe ir en componentes del navegador.

## Variables en Netlify

En Netlify, abre el proyecto y agrega estas variables en **Project configuration
-> Environment variables**:

- `OPENAI_API_KEY`: la clave secreta de OpenAI.
- `OPENAI_MODEL`: opcional. Si no se define, la app usa `gpt-5.5`.

Despues de guardar las variables, vuelve a desplegar el sitio. Si falta la
clave, la app mostrara un mensaje claro indicando que OpenAI aun no esta
configurado en Netlify.

## Flujo de IA

1. El estudiante entra a un curso y selecciona una leccion.
2. La app llama a `/api/ai/study`.
3. El servidor busca el material real guardado para esa leccion.
4. El servidor llama a OpenAI con ese material como fuente principal.
5. OpenAI devuelve JSON estructurado para respuesta, flashcards o quiz.

## Cargar material docente

En la pagina interna de configuracion (`/admin`) hay un bloque llamado
**Material real para flashcards y bancos de preguntas**.

Para cada leccion puedes pegar:

- guia docente,
- lectura del tema,
- transcripcion del video,
- apuntes corregidos,
- resumen oficial del curso.

Ese contenido se usa primero para generar flashcards, bancos de preguntas y
modo residente. Si una leccion no tiene material, la IA solo tiene el resumen
base de la leccion y debe indicarlo.

## Nota de produccion

El almacenamiento actual permite probar el flujo sin base de datos externa. En
Netlify, los archivos del despliegue son de solo lectura, por eso la app usa un
archivo temporal cuando no puede escribir en el proyecto.

Para produccion real y persistente, el siguiente paso recomendado es mover
usuarios, materiales, suscripciones, intentos de quiz y resultados a una base de
datos como Supabase/Postgres.
