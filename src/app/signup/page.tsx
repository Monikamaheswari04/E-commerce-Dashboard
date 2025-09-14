

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = () => {
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((u: any) => u.email === email)) {
      toast.error("User already exists, please login");
      router.push("/login");
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    users.push({ name, email, password: hashedPassword });
    localStorage.setItem("users", JSON.stringify(users));

    toast.success("Signup successful! Redirecting...");
    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create Account</h2>
      <input
        className="w-full mb-3 px-3 py-2 border rounded"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full mb-3 px-3 py-2 border rounded"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full mb-3 px-3 py-2 border rounded"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignup}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Sign Up
      </button>
      <p className="text-sm mt-3 text-center">
        Already have an account?{" "}
        <span
          onClick={() => router.push("/login")}
          className="text-blue-600 cursor-pointer"
        >
          Login
        </span>
      </p>
    </div>
  );
}