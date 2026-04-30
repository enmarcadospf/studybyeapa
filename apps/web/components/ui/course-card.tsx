import Link from "next/link";
import type { Course } from "@academia/shared";

type CourseCardProps = {
  course: Course;
  topics: string[];
};

function iconForCourse(slug: string) {
  switch (slug) {
    case "anatomia":
      return "A";
    case "infectologia":
      return "I";
    case "semiologia-clinica":
      return "S";
    default:
      return "M";
  }
}

export function CourseCard({ course, topics }: CourseCardProps) {
  return (
    <article className="course-browser-card">
      <div className="course-browser-top">
        <div className="course-browser-icon">{iconForCourse(course.slug)}</div>
        <span className="course-price-pill">USD {course.priceUsd}</span>
      </div>
      <p className="course-category">{course.category}</p>
      <h3>{course.title}</h3>
      <p className="course-copy">{course.summary}</p>
      <div className="course-topic-row">
        {topics.map((topic) => (
          <span className="topic-chip" key={topic}>
            {topic}
          </span>
        ))}
      </div>
      <div className="course-meta">
        <span>{course.lessons} lecciones</span>
        <span>{course.durationHours} h</span>
        <span>{course.level}</span>
      </div>
      <Link className="eapa-button" href={`/courses/${course.slug}`}>
        Ver curso
      </Link>
    </article>
  );
}
