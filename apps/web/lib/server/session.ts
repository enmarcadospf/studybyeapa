import { randomUUID, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getAdminAccessByEmail } from "./admin-store";
import { getStudentById } from "./student-store";

const SESSION_COOKIE = "studybyeapa_session";
const DEVICE_COOKIE = "studybyeapa_device";
const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "studybyeapa-dev-session-secret";

function signValue(value: string) {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

export function createSessionCookieValue(studentId: string) {
  return `${studentId}.${signValue(studentId)}`;
}

function verifySignedCookieValue(value: string) {
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

  const studentId = verifySignedCookieValue(rawSession);

  if (!studentId) {
    return null;
  }

  return getStudentById(studentId);
}

export async function getCurrentAdminSession() {
  const student = await getCurrentStudentSession();

  if (!student) {
    return null;
  }

  const access = await getAdminAccessByEmail(student.email);

  if (!access.isAdmin) {
    return null;
  }

  return {
    id: student.id,
    email: student.email,
    fullName: student.fullName,
    role: "admin" as const,
    isOwner: access.isOwner,
  };
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getDeviceCookieName() {
  return DEVICE_COOKIE;
}

export function getOrCreateDeviceId(existingDeviceId?: string) {
  return existingDeviceId && existingDeviceId.trim()
    ? existingDeviceId
    : randomUUID();
}
