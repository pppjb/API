# 待办事项 API

这是一个适合初学者的 REST API 示例，只使用 Node.js 自带功能，不需要安装第三方依赖。

## 启动项目

最简单的方法是双击项目目录中的 `start-api.cmd`，并保持打开的命令窗口不要关闭。

也可以在 PowerShell 中运行：

```powershell
npm.cmd start
```

启动后，服务地址是 `http://127.0.0.1:3000`。开发时也可以使用 `npm.cmd run dev`，修改代码后服务会自动重启。

## 接口列表

| 方法 | 地址 | 作用 |
| --- | --- | --- |
| GET | `/health` | 检查服务是否正常 |
| GET | `/api/tasks` | 获取全部待办 |
| POST | `/api/tasks` | 新增待办 |
| GET | `/api/tasks/:id` | 获取一个待办 |
| PATCH | `/api/tasks/:id` | 修改待办 |
| DELETE | `/api/tasks/:id` | 删除待办 |

## 调用示例

新增待办：

```powershell
Invoke-RestMethod -Method Post `
  -Uri http://localhost:3000/api/tasks `
  -ContentType "application/json" `
  -Body '{"title":"学习接口"}'
```

查看全部待办：

```powershell
Invoke-RestMethod http://localhost:3000/api/tasks
```

修改待办时，把下面地址中的 `<id>` 换成新增接口返回的 `id`：

```powershell
Invoke-RestMethod -Method Patch `
  -Uri http://localhost:3000/api/tasks/<id> `
  -ContentType "application/json" `
  -Body '{"completed":true}'
```

删除待办：

```powershell
Invoke-RestMethod -Method Delete http://localhost:3000/api/tasks/<id>
```

## 运行测试

```powershell
npm.cmd test
```

当前数据保存在内存中，所以服务重启后数据会清空。这是为了先把接口的请求、响应和增删改查学明白，后续可以再接数据库。

## 部署到公网

项目包含 `render.yaml`，可以部署到 Render：

1. 在 GitHub 创建一个公开仓库，并把本项目文件上传到仓库根目录。
2. 登录 Render，选择 **New +**、**Blueprint**。
3. 连接刚创建的 GitHub 仓库，Render 会读取 `render.yaml`。
4. 创建服务并等待部署完成。
5. Render 会提供类似 `https://beginner-task-api.onrender.com` 的公网地址。

把公网地址中的 `/health` 和 `/api/tasks` 分别打开，确认健康检查和待办列表都能正常返回。免费服务可能会在长时间无人访问后休眠，第一次打开通常需要等待几十秒。

同时附上 GitHub 源码地址和 Render 公网演示地址。当前版本使用内存存储，适合作品演示，不适合保存长期业务数据。
