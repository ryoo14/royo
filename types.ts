export type Todo = {
  id: number
  type: string
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
