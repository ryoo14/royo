import { html } from "hono/html"
import { jsxRenderer } from "hono/jsx-renderer"
import type { Todo } from "./types.ts"

export const renderer = jsxRenderer(({ children }) => {
  return html`
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
        <script src="https://unpkg.com/htmx.org@2.0.2" integrity="sha384-Y7hw+L/jvKeWIRRkqWYfPcvVxHzVzn5REgzbawhxAuQGwX1XWe70vji+VSeHOThJ" crossorigin="anonymous"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body {
            width: 100%;
            height: 1080px;
            display: flex;
            justify-content: center;
          }
        </style>
      </head>
      <body>
        <div id="container" class="flex justify-center items-center w-full h-full">
          ${children}
        </div>
        <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
        <script>
          flatpickr("#deadline", {
            enableTime: true,
            dateFormat: "Y-m-d H:i"
          })
        </script>
      </body>
    </html>
  `
})

export const AddToDo = () => (
  <form hx-post="/todos" hx-target="#todo" hx-swap="beforebegin" _="on htmx:afterRequest reset() me" class="flex flex-row justify-around w-full mb-10">
    <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-1/5" name="category" type="text" placeholder="category" list="dataList" />
    <datalist id="dataList">
      <option value="work" />
      <option value="hobby" />
      <option value="family" />
    </datalist>
    <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-1/5" name="content" type="text" placeholder="content" />
    <input id="deadline" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-1/5" name="deadline" type="text" placeholder="deadline" />
    <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-1/5" type="submit">
      Submit
    </button>
  </form>
)

export const TodoItem = ({ todo, bgColor }: { todo: Todo, bgColor: string }) => (
  <div id={`todo-${todo.id}`} class={`flex flex-row justify-around items-center w-full ${bgColor} p-3`}>
    <div class="w-1/6">{todo.id}</div>
    <div class="w-1/6">{todo.category}</div>
    <div class="w-1/6">{todo.content}</div>
    <div class="w-1/6">{todo.deadline}</div>
    <input type="checkbox" hx-patch={`/todos/${todo.id}/completed`} hx-trigger="change" checked={todo.completed ? true : false} class="h-6" />
    <button hx-delete={`/todos/${todo.id}`} hx-swap="outerHTML" hx-target={`#todo-${todo.id}`}>
      Delete
    </button>
  </div>
)
