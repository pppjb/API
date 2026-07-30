import { randomUUID } from "node:crypto";
import { createServer } from "node:http";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
};

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, JSON_HEADERS);
  response.end(JSON.stringify(body));
}

function sendNoContent(response) {
  response.writeHead(204);
  response.end();
}

async function readJson(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1_000_000) {
      const error = new Error("请求体不能超过 1 MB");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("请求体必须是合法的 JSON");
    error.statusCode = 400;
    throw error;
  }
}

function validateTitle(title) {
  if (typeof title !== "string" || title.trim().length === 0) {
    return "title 必须是非空字符串";
  }

  if (title.trim().length > 100) {
    return "title 不能超过 100 个字符";
  }

  return null;
}

export function createTaskApp() {
  const tasks = new Map();

  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url, `http://${request.headers.host ?? "localhost"}`);
      const taskMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)$/);

      if (request.method === "GET" && url.pathname === "/") {
        sendJson(response, 200, {
          message: "待办事项 API 已启动",
          endpoints: {
            health: "GET /health",
            listTasks: "GET /api/tasks",
            createTask: "POST /api/tasks",
            getTask: "GET /api/tasks/:id",
            updateTask: "PATCH /api/tasks/:id",
            deleteTask: "DELETE /api/tasks/:id",
          },
        });
        return;
      }

      if (request.method === "GET" && url.pathname === "/health") {
        sendJson(response, 200, { status: "ok" });
        return;
      }

      if (request.method === "GET" && url.pathname === "/api/tasks") {
        sendJson(response, 200, { data: [...tasks.values()] });
        return;
      }

      if (request.method === "POST" && url.pathname === "/api/tasks") {
        const body = await readJson(request);
        const titleError = validateTitle(body.title);

        if (titleError) {
          sendJson(response, 400, { error: titleError });
          return;
        }

        const task = {
          id: randomUUID(),
          title: body.title.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        };

        tasks.set(task.id, task);
        sendJson(response, 201, { data: task });
        return;
      }

      if (request.method === "GET" && taskMatch) {
        const task = tasks.get(taskMatch[1]);

        if (!task) {
          sendJson(response, 404, { error: "待办不存在" });
          return;
        }

        sendJson(response, 200, { data: task });
        return;
      }

      if (request.method === "PATCH" && taskMatch) {
        const task = tasks.get(taskMatch[1]);

        if (!task) {
          sendJson(response, 404, { error: "待办不存在" });
          return;
        }

        const body = await readJson(request);

        if (body.title !== undefined) {
          const titleError = validateTitle(body.title);
          if (titleError) {
            sendJson(response, 400, { error: titleError });
            return;
          }
          task.title = body.title.trim();
        }

        if (body.completed !== undefined) {
          if (typeof body.completed !== "boolean") {
            sendJson(response, 400, { error: "completed 必须是布尔值" });
            return;
          }
          task.completed = body.completed;
        }

        sendJson(response, 200, { data: task });
        return;
      }

      if (request.method === "DELETE" && taskMatch) {
        if (!tasks.delete(taskMatch[1])) {
          sendJson(response, 404, { error: "待办不存在" });
          return;
        }

        sendNoContent(response);
        return;
      }

      sendJson(response, 404, { error: "接口不存在" });
    } catch (error) {
      sendJson(response, error.statusCode ?? 500, {
        error: error.statusCode ? error.message : "服务器内部错误",
      });
    }
  });
}
