import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { username, password } = await request.json()

  // In a real app, you would register the user in your FastAPI backend
  // const response = await fetch("https://your-fastapi-backend.com/register", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ username, password }),
  // });

  // For demo purposes, we'll simulate a successful registration
  // In a real app, you would check the response from your backend

  return NextResponse.json({ success: true })
}

