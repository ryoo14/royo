import { Hono } from "hono"
import type { Todo } from "./types.ts"
import db from "./db.ts"
import { Main } from "./components.tsx"

const app = new Hono()

app.notFound((c) => {
  return c.text("Not Found", 404)
})

app.get("/", (c) => {
  return c.html(<Main />)
})

app.get("/todos", (c) => {
  try {
    const todos: Todo[] = db.selectAllTodos()

    return c.json(todos)
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

app.post("/todos", async (c) => {
  try {
    const requestBody = await c.req.json()
    const category = requestBody.category
    const content = requestBody.content
    const deadline = requestBody.deadline

    if (category == null || content == null  || deadline == null) {
      return c.text("Bad Request", 400)
    }

    const todo = db.createTodo(category, content, new Date(deadline))

    return c.json(todo)
  } catch (_e) {
    return c.text("Internal Server Error", 500)
  }
})

app.patch("/todos/:todoId/completed", async (c) => {
  try {
    const todoId = Number(c.req.param("todoId"))
    const requestBody = await c.req.json()
    const completedFlag: boolean = requestBody.completed

    if (Number.isNaN(todoId) || typeof completedFlag !== "boolean") {
      return c.text("Bad Request", 400)
    }

    const updatedTodo = db.toggleTodoCompletion(todoId, completedFlag)
    if (updatedTodo === undefined) {
      return c.notFound()
    }

    return c.json(updatedTodo)
  } catch (_e) {
    return c.text("Internal Server Error", 500)
  }
})

app.delete("/todos/:todoId", async (c) => {
  try {
    const todoId: number = Number(c.req.param("todoId"))

    if (Number.isNaN(todoId)) {
      return c.text("bad request", 400)
    }

    const deletedTodo = await db.deleteTodo(todoId)
    if (deletedTodo === undefined) {
      return c.notFound()
    }
    
    return c.json(deletedTodo)
  } catch (_e) {
    return c.text("Internal Server Error", 500)
  }
})

Deno.serve({ port: 3000 }, app.fetch)
