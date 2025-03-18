"use client";

import dynamic from "next/dynamic";

const DynamicLoginForm = dynamic(() => import("@/components/login-form"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">Tickr</h1>
          <p className="text-blue-600">Your todo list app!</p>
        </div>
        <DynamicLoginForm />
      </div>
    </main>
  );
}
