import { Database } from "@db/sqlite"
import type { Todo } from "./types.ts"

const royoDB = Deno.env.get("ROYO_DB") as string

const db = new Database(royoDB)
const selectAllStatement = db.prepare("SELECT * FROM todos")
const selectOneStatement = db.prepare("SELECT * FROM todos WHERE id = ?")
const insertOneStatement = db.prepare("INSERT INTO todos (content, deadline) values (?, ?)")
const updateOneStatement = db.prepare("UPDATE todos SET completed = ? where id = ?")
const deleteOneStatement = db.prepare("DELETE FROM todos where id = ?")

function selectAllTodos(): Todo[] {
  try {
    const todos: Todo[] = selectAllStatement.all()

    return todos
  } catch (e) {
    console.log(e)
    throw new Error()
  }
}

function selectTodo(todoId: number): Todo | undefined {
  try {
    const todo: Todo | undefined = selectOneStatement.get(todoId)

    return todo
  } catch (e) {
    console.log(e)
    throw new Error()
  }
}

function createTodo(content: string, deadline: Date): Todo {
  try {
    const insertResult: number = insertOneStatement.run(content, deadline)

    if (insertResult !== 1) {
      throw new Error("Failed to insert for some reason.")
    }

    const todos: Todo[] = selectAllStatement.all()
    const insertColumn: Todo = todos[todos.length - 1]

    return insertColumn
  } catch (e) {
    console.log(e)
    throw new Error()
  }
}

function toggleTodoCompletion(todoId: number, completeFlag: boolean): Todo | undefined {
  try {
    const todo: Todo | undefined = selectOneStatement.get(todoId)

    if (todo === undefined) {
      return todo
    }

    const updateResult = updateOneStatement.run(completeFlag, todoId)

    if (updateResult !== 1) {
      throw new Error("Failed to update for some reason.")
    }

    return todo
  } catch (e) {
    console.log(e)
    throw new Error()
  }
}

function deleteTodo(todoId: number): Todo | undefined {
  try {
    const todo: Todo | undefined = selectOneStatement.get(todoId)

    if (todo === undefined) {
      return todo
    }

    const deleteResult = deleteOneStatement.run(todoId)

    if (deleteResult !== 1) {
      throw new Error("Failed to delete for some reason.")
    }

    return todo
  } catch (e) {
    console.log(e)
    throw new Error()
  }
}

export default {
  selectAllTodos,
  selectTodo,
  createTodo,
  toggleTodoCompletion,
  deleteTodo,
}
