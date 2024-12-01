import { html } from "hono/html"
import { jsxRenderer } from "hono/jsx-renderer"
import type { FC } from "hono/jsx"
import type { Todo } from "./types.ts"

export const renderer = jsxRenderer(({ children }) => {
  return html`
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <!-- for calender -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
        <!-- for font -->
        <link href="/css/main.css" rel="stylesheet">
        <!-- for htmx -->
        <script src="https://unpkg.com/htmx.org@2.0.2" integrity="sha384-Y7hw+L/jvKeWIRRkqWYfPcvVxHzVzn5REgzbawhxAuQGwX1XWe70vji+VSeHOThJ" crossorigin="anonymous"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
        <!-- for css -->
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div id="container" class="flex justify-center items-center w-full h-full pt-12 md:pt-36">
          ${children}
        </div>
        <!-- for calender -->
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

export const Todos: FC = (props) => {
  return (
    <div class="flex flex-col justify-center w-11/12 lg:w-2/3">
      {props.children}
    </div>
  )
}

export const AddTodo = () => (
  <form
    hx-post="/todos"
    hx-target="#new-todo"
    hx-swap="beforebegin"
    _="on htmx:afterRequest reset() me"
    class="flex flex-row justify-around align-center w-full h-10 mb-10"
  >
    <input
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-1/5 h-10"
      name="category"
      type="text"
      placeholder="category"
      list="dataList"
    />
    <datalist id="dataList">
      <option value="work" />
      <option value="hobby" />
      <option value="family" />
    </datalist>
    <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-1/5" name="content" type="text" placeholder="content" />
    <input id="deadline" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-1/5" name="deadline" type="text" placeholder="deadline" />
    <button
      class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-1/5 h-10"
      type="submit"
    >
      Submit
    </button>
  </form>
)

export const TodoHeader = () => (
  <div class="flex flex-row justify-around items-center flex-wrap w-full p-3">
    <div class="w-1/12">Id</div>
    <div class="w-2/12 md:w-1/12 pr-2">Cate</div>
    <div class="w-4/12 md:w-6/12 pr-2">Content</div>
    <div class="w-3/12 md:w-2/12 pr-2 flex flex-nowrap">
      <div class="mr-1">
        Deadline
      </div>
      <div hx-get="/todos/asc"
        hx-trigger="click"
        hx-target="#todos"
        hx-swap="innerHTML"
        class="">
        ↓
      </div>
      <div hx-get="/todos/desc"
        hx-trigger="click"
        hx-target="#todos"
        hx-swap="innerHTML"
        class="">
        ↑
      </div>
    </div>
    <div class="h-6 w-1/12">Flag</div>
    <div class="w-1/12">Delete</div>
  </div>
)

export const TodoItem = ({ todo, bgColor }: { todo: Todo; bgColor: string }) => (
  <div id={`todo-${todo.id}`} class={`flex flex-row justify-around items-center flex-warp w-full ${bgColor} p-3`}>
    <div class="w-1/12">{todo.id}</div>
    <div class="w-2/12 md:w-1/12 pr-2">{todo.category}</div>
    <div class="w-4/12 md:w-6/12 pr-2">{todo.content}</div>
    <div class="w-3/12 md:w-2/12 pr-2">{todo.deadline}</div>
    <input type="checkbox" hx-patch={`/todos/${todo.id}/completed`} hx-trigger="change" checked={todo.completed ? true : false} class="h-6 w-1/12" />
    <button hx-delete={`/todos/${todo.id}`} hx-swap="outerHTML" hx-target={`#todo-${todo.id}`} class="w-1/12">
      Del
    </button>
  </div>
)
