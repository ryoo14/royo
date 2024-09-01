import { Hono } from "hono"
import type { Todo } from "./types.ts"
import db from "./db.ts"
import { AddToDo, TodoItem, renderer } from "./components.tsx"

const app = new Hono()

app.notFound((c) => {
  return c.text("Not Found", 404)
})

app.get("*", renderer)

app.get("/", (c) => {
  try {
    const todos: Todo[] = db.selectAllTodos()

    return c.render(
      <div>
        <AddToDo />
        {todos.map((todo) => {
          return <TodoItem todo={todo} />
        })}
        <div id="royo" />
      </div>
    )
  } catch (_e) {
    return c.text("Internal Server Error", 500)
  }
})

app.post("/todos", async (c) => {
  try {
    const formData = await c.req.formData()
    const category = formData.get("category") as string
    const content = formData.get("content") as string
    const deadline = formData.get("deadline") as string
    //const { category, content, deadline } = c.req.valid("form")

    if (category == null || content == null  || deadline == null) {
      return c.text("Bad Request", 400)
    }

    const todo = db.createTodo(category, content, new Date(deadline))

    return c.html(<TodoItem todo={todo} />)
  } catch (e) {
    console.log(e)
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
    
    return c.json(deletedTodo)
  } catch (_e) {
    return c.text("Internal Server Error", 500)
  }
})

Deno.serve({ port: 3000 }, app.fetch)
