"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Mail,
  Lock,
  ArrowRight,
  User,
  Loader2,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AuthPage = ({ type }: { type: "sign-in" | "register" }) => {
  const isSignIn = type === "sign-in";
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4400/api/auth/google");
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError("Could not initialize Google login");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const endpoint = isSignIn ? "/auth/login" : "/auth/register";

    try {
      const response = await fetch(`http://localhost:4400/api${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      if (isSignIn) {
        localStorage.setItem("token", data.session.access_token);
        router.push("/");
      } else {
        setShowOtp(true); // Switch to OTP view inside the card
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:4400/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: otpCode }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("token", data.session.access_token);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-svh w-screen bg-[#fdf8f1] dark:bg-[#0a0a0a] flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-5xl w-full flex flex-col lg:flex-row bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] overflow-hidden border border-primary/10 dark:border-white/5 max-h-[90vh]">
        {/* LEFT COLUMN: Visual Side (Stay Static) */}
        <div className="hidden lg:flex w-1/2 bg-[#5F745D] dark:bg-[#0f1a11] relative overflow-hidden flex-col justify-center p-12">
          <h1 className="text-5xl font-serif font-bold text-white leading-[1.1]">
            Turn the page <br />
            <span className="text-[#D4A373] italic">together.</span>
          </h1>
        </div>

        {/* RIGHT COLUMN: Form Container */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
          <div className="max-w-sm w-full space-y-6">
            {/* If not showing OTP, show Login/Register */}
            {!showOtp ? (
              <>
                <div className="space-y-1">
                  <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                    {isSignIn ? "Welcome Back" : "Create Account"}
                  </h2>
                  {error && (
                    <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg">
                      {error}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center space-x-3 border-2 py-3 rounded-2xl hover:bg-gray-50 transition-all"
                >
                  <GoogleIcon />
                  <span className="font-bold text-gray-700 text-sm">
                    Continue with Google
                  </span>
                </button>

                <form className="space-y-3.5" onSubmit={handleSubmit}>
                  {!isSignIn && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          name="username"
                          required
                          value={formData.username}
                          onChange={handleChange}
                          type="text"
                          className="w-full pl-12 pr-5 py-3 bg-gray-50 dark:bg-[#262626] rounded-2xl border-none text-sm"
                          placeholder="John Doe"
                        />
                        <User
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        className="w-full pl-12 pr-5 py-3 bg-gray-50 dark:bg-[#262626] rounded-2xl border-none text-sm"
                        placeholder="name@email.com"
                      />
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        className="w-full pl-12 pr-5 py-3 bg-gray-50 dark:bg-[#262626] rounded-2xl border-none text-sm"
                        placeholder="••••••••"
                      />
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#5F745D] text-white py-3.5 rounded-2xl font-bold shadow-lg flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <span>{isSignIn ? "Sign In" : "Get Started"}</span>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* OTP FORM VIEW (Inside the same design) */
              <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="space-y-1">
                  <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                    Verify Email
                  </h2>
                  <p className="text-gray-500 text-sm">
                    We sent a 6-digit code to <br />
                    <span className="font-bold text-primary">
                      {formData.email}
                    </span>
                  </p>
                  {error && (
                    <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg mt-2">
                      {error}
                    </p>
                  )}
                </div>

                <form className="space-y-4" onSubmit={handleVerifyOtp}>
                  <div className="relative">
                    <input
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full text-center text-2xl tracking-[0.5em] font-bold py-4 bg-gray-50 dark:bg-[#262626] rounded-2xl border-2 border-primary/20 focus:border-primary focus:ring-0 text-gray-900 dark:text-white"
                      placeholder="000000"
                      required
                    />
                    <KeyRound
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      size={20}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#5F745D] text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <span>Verify & Join</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowOtp(false)}
                    className="w-full text-gray-400 text-sm hover:underline"
                  >
                    Entered wrong email? Go back
                  </button>
                </form>
              </div>
            )}

            <p className="text-center text-gray-500 text-sm">
              {isSignIn ? "New reader?" : "Already a member?"}{" "}
              <Link
                href={isSignIn ? "/register" : "/login"}
                className="text-[#D4A373] font-bold hover:underline"
              >
                {isSignIn ? "Create account" : "Sign in here"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default AuthPage;
