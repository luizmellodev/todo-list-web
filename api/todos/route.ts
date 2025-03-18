import { NextResponse } from "next/server"

// This is a mock implementation
// In a real app, you would connect to your FastAPI backend

const todos = [
  { id: "1", text: "Comprar leite", completed: false },
  { id: "2", text: "Responder emails", completed: true },
  { id: "3", text: "Preparar apresentação", completed: false },
]

export async function GET() {
  // In a real app, you would fetch from your FastAPI backend
  // const response = await fetch("https://your-fastapi-backend.com/todos");
  // const data = await response.json();

  return NextResponse.json(todos)
}

export async function POST(request: Request) {
  const todo = await request.json()

  // In a real app, you would send to your FastAPI backend
  // const response = await fetch("https://your-fastapi-backend.com/todos", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(todo),
  // });
  // const data = await response.json();

  todos.push(todo)
  return NextResponse.json(todo)
}

