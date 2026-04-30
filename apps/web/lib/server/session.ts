import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getStudentById } from "./student-store";

const SESSION_COOKIE = "studybyeapa_session";
const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "studybyeapa-dev-session-secret";

function signValue(value: string) {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

export function createSessionCookieValue(studentId: string) {
  return `${studentId}.${signValue(studentId)}`;
}

function verifySessionCookieValue(value: string) {
  const [studentId, signature] = value.split(".");

  if (!studentId || !signature) {
    return null;
  }

  const expectedSignature = signValue(studentId);
  const incomingBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (incomingBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(incomingBuffer, expectedBuffer)) {
    return null;
  }

  return studentId;
}

export async function getCurrentStudentSession() {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(SESSION_COOKIE)?.value;

  if (!rawSession) {
    return null;
  }

  const studentId = verifySessionCookieValue(rawSession);

  if (!studentId) {
    return null;
  }

  return getStudentById(studentId);
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}
