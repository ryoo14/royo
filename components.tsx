import { html } from "hono/html"
import { jsxRenderer } from "hono/jsx-renderer"
import type { Todo } from "./types.ts"

export const renderer = jsxRenderer(({ children }) => {
  return html`
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/htmx.org@2.0.2" integrity="sha384-Y7hw+L/jvKeWIRRkqWYfPcvVxHzVzn5REgzbawhxAuQGwX1XWe70vji+VSeHOThJ" crossorigin="anonymous"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
      </head>
      <body>
        <div id="container">
          ${children}
        </div>
      </body>
    </html>
  `
})

export const AddToDo = () => (
  <form hx-post="/todos" hx-target="#todo" hx-swap="beforebegin" _="on htmx:afterRequest reset() me">
    <div>
      <input name="category" type="text" />
      <input name="content" type="text" />
      <input name="deadline" type="text" />
    </div>
    <button type="submit">
      Submit
    </button>
  </form>
)

export const TodoItem = ({ todo }: { todo: Todo }) => (
  <div id={`todo-${todo.id}`}>
    <div>{todo.id}</div>
    <div>{todo.category}</div>
    <div>{todo.content}</div>
    <div>{todo.deadline}</div>
    <input type="checkbox" hx-patch={`/todos/${todo.id}/completed`} hx-trigger="change" checked={todo.completed ? true : false} />
    <button hx-delete={`/todos/${todo.id}`} hx-swap="outerHTML" hx-target={`#todo-${todo.id}`}>
      Delete
    </button>
  </div>
)
