import cors from "cors";
import express from "express";
import {
  adminAlerts,
  APP_NAME,
  courses,
  features,
  lessons,
  platformStats,
  roles,
  studentCourseProgress,
  teacherTasks,
  tutoringOffers,
} from "@academia/shared";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "academia-api",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/config", (_request, response) => {
  response.json({
    appName: APP_NAME,
    features,
    roles,
  });
});

app.get("/api/stats", (_request, response) => {
  response.json(platformStats);
});

app.get("/api/courses", (_request, response) => {
  response.json(courses);
});

app.get("/api/courses/:slug", (request, response) => {
  const course = courses.find((item) => item.slug === request.params.slug);

  if (!course) {
    response.status(404).json({
      message: "Curso no encontrado",
    });
    return;
  }

  response.json(course);
});

app.get("/api/courses/:slug/lessons", (request, response) => {
  response.json(
    lessons.filter((lesson) => lesson.courseSlug === request.params.slug),
  );
});

app.get("/api/tutoring", (_request, response) => {
  response.json(tutoringOffers);
});

app.get("/api/student/courses", (_request, response) => {
  response.json(studentCourseProgress);
});

app.get("/api/teacher/tasks", (_request, response) => {
  response.json(teacherTasks);
});

app.get("/api/admin/alerts", (_request, response) => {
  response.json(adminAlerts);
});

app.listen(port, () => {
  console.log(`${APP_NAME} API disponible en http://localhost:${port}`);
});
