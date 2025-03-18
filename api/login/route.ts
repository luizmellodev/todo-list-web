import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { username, password } = await request.json()

  // In a real app, you would authenticate against your FastAPI backend
  // const response = await fetch("https://your-fastapi-backend.com/login", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ username, password }),
  // });

  // For demo purposes, we'll simulate a successful login
  // In a real app, you would check the response from your backend
  const isValidCredentials = username === "demo" && password === "password"

  if (isValidCredentials) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
}

