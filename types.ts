export type Todo = {
  id: number
  content: string
  deadline: Date
  createdAt: Date
  completed: boolean
}

export class RecordNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "RecordNotFoundError"
  }
}
