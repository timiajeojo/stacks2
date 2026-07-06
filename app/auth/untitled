"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquareCode } from "lucide-react";
import Ticker from "../components/Ticker";

type Mode = "signin" | "signup";

function AuthForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("signin");

  useEffect(() => {
    if (searchParams.get("mode") === "signup") setMode("signup");
  }, [searchParams]);

  return (
    <div className="screen">
      <div className="brand">
        <div className="logo">
          <span className="logo-mark">
            <MessageSquareCode size={15} strokeWidth={2.5} />
          </span>
          stacksnumber
        </div>

        <div className="brand-copy">
          <h1>
            One line.
            <br />
            One code.
            <br />
            Verified.
          </h1>
          <p>
            Real, working phone numbers for the minute it takes to receive an
            SMS. 61 countries, 220+ services, no contract.
          </p>
        </div>

        <Ticker />

        <div className="brand-foot">
          <div>
            <div className="num mono">61</div>
            <div className="label">countries</div>
          </div>
          <div>
            <div className="num mono">9s</div>
            <div className="label">avg. delivery</div>
          </div>
          <div>
            <div className="num mono">99.2%</div>
            <div className="label">success rate</div>
          </div>
        </div>
      </div>

      <div className="form-panel">
        <div className="form-box">
          <div className="tabs">
            <div
              className={`tab ${mode === "signin" ? "active" : ""}`}
              onClick={() => setMode("signin")}
            >
              Sign in
            </div>
            <div
              className={`tab ${mode === "signup" ? "active" : ""}`}
              onClick={() => setMode("signup")}
            >
              Create account
            </div>
          </div>

          {mode === "signin" ? (
            <div>
              <h2>Welcome back</h2>
              <div className="sub">
                Sign in to buy numbers and check incoming codes.
              </div>

              <div className="field">
                <label>EMAIL</label>
                <input type="email" placeholder="you@company.com" />
              </div>
              <div className="field">
                <label>PASSWORD</label>
                <input type="password" placeholder="••••••••••" />
              </div>
              <div className="row-between">
                <label className="remember">
                  <input type="checkbox" style={{ accentColor: "var(--blue)" }} />
                  Keep me signed in
                </label>
                <a href="#" className="forgot">
                  Forgot password?
                </a>
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: "100%" }}>
                Sign in →
              </button>

              <div className="switch-line" style={{ marginTop: "24px" }}>
                New to stacksnumber?{" "}
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    setMode("signup");
                  }}
                >
                  Create an account
                </a>
              </div>
            </div>
          ) : (
            <div>
              <h2>Create your account</h2>
              <div className="sub">
                Get a free verification credit — no card required.
              </div>

              <div className="field">
                <label>FULL NAME</label>
                <input type="text" placeholder="Oluwatimilehin Adebayo" />
              </div>
              <div className="field">
                <label>EMAIL</label>
                <input type="email" placeholder="you@company.com" />
              </div>
              <div className="field">
                <label>PASSWORD</label>
                <input type="password" placeholder="At least 8 characters" />
              </div>
              <div className="row-between" style={{ marginBottom: "20px" }}>
                <label className="remember">
                  <input type="checkbox" style={{ accentColor: "var(--blue)" }} />
                  I agree to the terms and acceptable use policy
                </label>
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: "100%" }}>
                Create account →
              </button>

              <div className="switch-line" style={{ marginTop: "24px" }}>
                Already have an account?{" "}
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    setMode("signin");
                  }}
                >
                  Sign in
                </a>
              </div>
            </div>
          )}

          <div className="terms">
            By continuing you agree to stacksnumber&apos;s{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm />
    </Suspense>
  );
}
