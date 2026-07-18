"use client";

import { useState } from "react";
import { MessageSquareCode } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="fp-screen">
      <div className="fp-brand">
        <span className="logo-mark">
          <MessageSquareCode size={15} strokeWidth={2.5} />
        </span>
        <span>stacksnumber</span>
      </div>

      <div className="fp-card">
        <h1>Forgot password</h1>
        <div className="sub">Enter your email to receive a password reset link</div>

        <div className="field">
          <label>Email address</label>
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-lg" style={{ width: "100%" }}>
          Email password reset link
        </button>

        <div className="fp-return">
          Or, return to <a href="/auth?mode=signin">log in</a>
        </div>
      </div>
    </div>
  );
}
