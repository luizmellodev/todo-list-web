import { NextResponse } from "next/server"

// This is a mock implementation
// In a real app, you would connect to your FastAPI backend

let todos = [
  { id: "1", text: "Comprar leite", completed: false },
  { id: "2", text: "Responder emails", completed: true },
  { id: "3", text: "Preparar apresentação", completed: false },
]

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const { completed } = await request.json()

  // In a real app, you would update your FastAPI backend
  // const response = await fetch(`https://your-fastapi-backend.com/todos/${id}`, {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ completed }),
  // });
  // const data = await response.json();

  todos = todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo))

  const updatedTodo = todos.find((todo) => todo.id === id)

  return NextResponse.json(updatedTodo)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  // In a real app, you would delete from your FastAPI backend
  // const response = await fetch(`https://your-fastapi-backend.com/todos/${id}`, {
  //   method: "DELETE",
  // });

  todos = todos.filter((todo) => todo.id !== id)

  return NextResponse.json({ success: true })
}

