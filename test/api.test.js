import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createTaskApp } from "../src/app.js";

let server;
let baseUrl;

before(async () => {
  server = createTaskApp();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("health check returns ok", async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("root shows API information", async () => {
  const response = await fetch(`${baseUrl}/`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.message, "待办事项 API 已启动");
  assert.equal(body.endpoints.listTasks, "GET /api/tasks");
});

test("task CRUD flow works", async () => {
  const createResponse = await fetch(`${baseUrl}/api/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: "学习调用接口" }),
  });
  assert.equal(createResponse.status, 201);

  const created = (await createResponse.json()).data;
  assert.equal(created.title, "学习调用接口");
  assert.equal(created.completed, false);

  const updateResponse = await fetch(`${baseUrl}/api/tasks/${created.id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ completed: true }),
  });
  assert.equal(updateResponse.status, 200);
  assert.equal((await updateResponse.json()).data.completed, true);

  const listResponse = await fetch(`${baseUrl}/api/tasks`);
  assert.equal(listResponse.status, 200);
  assert.equal((await listResponse.json()).data.length, 1);

  const deleteResponse = await fetch(`${baseUrl}/api/tasks/${created.id}`, {
    method: "DELETE",
  });
  assert.equal(deleteResponse.status, 204);

  const missingResponse = await fetch(`${baseUrl}/api/tasks/${created.id}`);
  assert.equal(missingResponse.status, 404);
});

test("invalid task title is rejected", async () => {
  const response = await fetch(`${baseUrl}/api/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: "   " }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "title 必须是非空字符串" });
});

test("invalid JSON is rejected", async () => {
  const response = await fetch(`${baseUrl}/api/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{not-json}",
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "请求体必须是合法的 JSON" });
});
