"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import { Eye, EyeOff, MessageSquareCode } from "lucide-react";
import { auth } from "../../lib/firebase";

function friendlyCodeError(code?: string): string {
  switch (code) {
    case "auth/expired-action-code":
      return "This reset link has expired. Please request a new one.";
    case "auth/invalid-action-code":
      return "This reset link is invalid or has already been used.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "We couldn't find an account for this reset link.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
  }
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [verifying, setVerifying] = useState(true);
  const [validEmail, setValidEmail] = useState<string | null>(null);
  const [codeError, setCodeError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setCodeError("This reset link is missing or invalid.");
      setVerifying(false);
      return;
    }
    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setValidEmail(email);
      })
      .catch((err) => {
        setCodeError(friendlyCodeError(err?.code));
      })
      .finally(() => setVerifying(false));
  }, [oobCode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!oobCode) return;
    setSubmitError("");

    if (newPassword !== confirmPassword) {
      setSubmitError("Passwords don't match.");
      return;
    }
    if (newPassword.length < 8) {
      setSubmitError("Password should be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setSubmitError(friendlyCodeError(err?.code));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fp-screen">
      <div className="fp-brand">
        <span className="logo-mark">
          <MessageSquareCode size={15} strokeWidth={2.5} />
        </span>
        <span>stacksnumber</span>
      </div>

      <div className="fp-card">
        {verifying ? (
          <>
            <h1>Verifying link…</h1>
            <div className="sub">Just a moment.</div>
          </>
        ) : success ? (
          <>
            <h1>Password reset</h1>
            <div className="sub">
              Your password has been changed successfully. You can now sign
              in with your new password.
            </div>
            <a href="/auth?mode=signin" className="btn btn-primary btn-lg" style={{ width: "100%", display: "flex", justifyContent: "center", textDecoration: "none" }}>
              Sign in →
            </a>
          </>
        ) : codeError ? (
          <>
            <h1>Link invalid</h1>
            <div className="sub">{codeError}</div>
            <a
              href="/auth/forgot-password"
              className="btn btn-primary btn-lg"
              style={{ width: "100%", display: "flex", justifyContent: "center", textDecoration: "none" }}
            >
              Request a new link
            </a>
          </>
        ) : (
          <>
            <h1>Set a new password</h1>
            <div className="sub">
              Resetting password for <b>{validEmail}</b>
            </div>

            {submitError && (
              <div
                style={{
                  background: "rgba(255,92,92,0.1)",
                  border: "1px solid rgba(255,92,92,0.35)",
                  color: "#ff9b9b",
                  fontSize: "13px",
                  borderRadius: "9px",
                  padding: "10px 14px",
                  marginBottom: "18px",
                  textAlign: "left",
                }}
              >
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>New password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showNewPw ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                    required
                    style={{ paddingRight: "42px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw((v) => !v)}
                    aria-label={showNewPw ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      padding: 0,
                      display: "flex",
                      color: "var(--paper-dim)",
                      cursor: "pointer",
                    }}
                  >
                    {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="field">
                <label>Confirm password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ paddingRight: "42px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw((v) => !v)}
                    aria-label={showConfirmPw ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      padding: 0,
                      display: "flex",
                      color: "var(--paper-dim)",
                      cursor: "pointer",
                    }}
                  >
                    {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitting}
                style={{ width: "100%", opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? "Saving…" : "Reset password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
