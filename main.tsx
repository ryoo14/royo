import { Hono } from "hono"
import { serveStatic } from 'hono/node-server/serve-static'
import type { Todo } from "./types.ts"
import db from "./db.ts"
import { AddTodo, renderer, TodoHeader, TodoItem, Todos } from "./components.tsx"

const app = new Hono()

app.get("/css/*", serveStatic({ root: "./public"}))
app.get("/js/*", serveStatic({ root: "./public"}))
app.get("/fonts/*", serveStatic({ root: "./public"}))


app.notFound((c) => {
  return c.text("Not Found", 404)
})

app.get("*", renderer)

app.get("/", (c) => {
  try {
    const todos: Todo[] = db.selectAllTodos()

    return c.render(
      <Todos>
        <AddTodo />
        <TodoHeader />
        <div id="todos">
          {todos.map((todo, index) => {
            // 偶数行の背景色を灰色に
            return <TodoItem todo={todo} bgColor={index % 2 === 0 ? "bg-gray-100" : ""} />
          })}
          <div id="todo" />
        </div>
      </Todos>
    )
  } catch (_e) {
    return c.text("Internal Server Error", 500)
  }
})

app.get("/todos/:sortParam", (c) => {
  try {
    const matchPath = c.req.param("sortParam")
    const todos: Todo[] = db.selectAllTodos()
    if (matchPath === "asc") {
      todos.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    } else if (matchPath === "desc") {
      todos.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
    } else {
      return c.notFound()
    }

    return c.html(
      <>
        {todos.map((todo, index) => {
          // 偶数行の背景色を灰色に
          return <TodoItem todo={todo} bgColor={index % 2 === 0 ? "bg-gray-100" : ""} />
        })}
        <div id="todo" />
      </>
    )
  } catch (_e) {
    console.error(_e);
    return c.text("Internal Server Error", 500)
  }
})

app.post("/todos", async (c) => {
  try {
    const formData = await c.req.formData()
    const category = formData.get("category") as string
    const content = formData.get("content") as string
    const deadline = formData.get("deadline") as string

    if (category == null || content == null || deadline == null) {
      return c.text("Bad Request", 400)
    }

    // 2024-11-28 12:00 -> 2024-11-28T03:00:00.000Z
    const deadlineDate = new Date(deadline)
    // 2024-11-28T03:00:00.000Z -> 2024-11-28 12:00:00
    const deadlineString = deadlineDate.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    const todo = db.createTodo(category, content, deadlineString)

    return c.html(<TodoItem todo={todo} bgColor="bg-orange-200" />)
  } catch (_e) {
    return c.text("Internal Server Error", 500)
  }
})

app.get("/todos/:todoId", (c) => {
  try {
    const todoId: number = Number(c.req.param("todoId"))
    if (Number.isNaN(todoId)) {
      return c.text("bad request", 400)
    }
    const todo: Todo | undefined = db.selectTodo(todoId)
    if (todo === undefined) {
      return c.notFound()
    }

    return c.json(todo)
  } catch (_e) {
    return c.text("Internal Server Error", 500)
  }
})

app.patch("/todos/:todoId/completed", (c) => {
  try {
    const todoId = Number(c.req.param("todoId"))

    if (Number.isNaN(todoId)) {
      return c.text("Bad Request", 400)
    }

    const updatedTodo = db.toggleTodoCompletion(todoId)
    if (updatedTodo === undefined) {
      return c.notFound()
    }

    return c.body(updatedTodo.completed ? "1" : "0", 200)
  } catch (_e) {
    return c.text("Internal Server Error", 500)
  }
})

app.delete("/todos/:todoId", (c) => {
  try {
    const todoId: number = Number(c.req.param("todoId"))

    if (Number.isNaN(todoId)) {
      return c.text("bad request", 400)
    }

    const deletedTodo = db.deleteTodo(todoId)
    if (deletedTodo === undefined) {
      return c.notFound()
    }

    return c.body(null)
  } catch (_e) {
    return c.text("Internal Server Error", 500)
  }
})

Deno.serve({ port: 3000 }, app.fetch)
