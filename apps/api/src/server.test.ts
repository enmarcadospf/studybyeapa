import test from "node:test";
import assert from "node:assert/strict";
import { APP_NAME } from "@academia/shared";

test("shared exports app name", () => {
  assert.equal(APP_NAME, "Academia Online");
});
