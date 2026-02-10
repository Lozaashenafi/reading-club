"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Search, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Added for active state

const PageTurnHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname(); // Get current route

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to check if link is active
  const isActive = (path: string) => pathname === path;

  // Helper to close mobile menu
  const closeMenu = () => setIsOpen(false);

  if (!mounted) return null;

  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-6">
      <div className="max-w-6xl mx-auto relative">
        {/* Decorative Tree Branch with Leaf */}
        <div className="absolute -top-2 left-36 z-20 pointer-events-none select-none">
          <svg
            width="160"
            height="120"
            viewBox="0 0 160 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 80C50 75 70 50 130 55"
              stroke="#9e6752"
              strokeWidth="7"
              strokeLinecap="round"
              className="drop-shadow-sm"
            />
            <path
              d="M60 65C65 55 75 52 80 45"
              stroke="#9e6752"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M125 55C125 55 150 35 145 20C125 15 115 45 125 55Z"
              fill="#1a3f22"
              className="drop-shadow-sm"
            />
            <path
              d="M80 45C80 45 100 25 90 10C75 10 70 35 80 45Z"
              fill="#1a3f22"
              className="drop-shadow-sm"
            />
            <path
              d="M40 73C40 73 25 55 10 60C10 75 30 85 40 73Z"
              fill="#1a3f22"
              className="drop-shadow-sm"
              opacity="0.9"
            />
            <path
              d="M125 55L138 32"
              stroke="#fed7a5"
              strokeWidth="1"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Main Navigation Bar */}
        <nav className="bg-[#fdf8f1] border border-[#9e6752]/20 rounded-md px-6 py-3 shadow-sm flex items-center justify-between">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
          >
            <div className="bg-[#9e6752] p-2 rounded-sm">
              <BookOpen className="text-[#fdf8f1]" size={20} />
            </div>
            <span className="text-2xl font-serif font-bold text-[#2d2d2d] tracking-tight">
              BookPulse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <Link
              href="/"
              className={`${
                isActive("/") ? "text-[#9e6752]" : "text-[#7a7a7a]"
              } hover:text-[#9e6752] font-medium transition-colors`}
            >
              Home
            </Link>
            <Link
              href="/explore"
              className={`${
                isActive("/explore") ? "text-[#9e6752]" : "text-[#7a7a7a]"
              } hover:text-[#9e6752] font-medium transition-colors`}
            >
              Explore
            </Link>
            <Link
              href="/my-clubs"
              className={`bg-[#fed7a5] text-[#9e6752] px-6 py-2 rounded-sm border-b-2 ${
                isActive("/my-clubs")
                  ? "border-[#9e6752]"
                  : "border-transparent"
              } hover:border-[#9e6752] font-medium transition-all`}
            >
              My Clubs
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            <button className="text-[#7a7a7a] hover:text-[#9e6752]">
              <Search size={20} />
            </button>
            <Link
              href="/login"
              className="hidden sm:block bg-[#fed7a5] text-[#9e6752] px-5 py-2 rounded-sm font-bold text-sm shadow-sm hover:brightness-95 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/get-started"
              className="hidden sm:block bg-[#9e6752] text-white px-5 py-2 rounded-sm font-bold text-sm shadow-sm hover:bg-[#8a5a48] transition-all"
            >
              Get Started
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#9e6752]"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-[#fdf8f1] border border-[#9e6752]/20 rounded-md p-4 flex flex-col space-y-4 shadow-xl md:hidden">
            <Link
              href="/"
              onClick={closeMenu}
              className={`${isActive("/") ? "text-[#9e6752]" : "text-[#7a7a7a]"} font-medium text-center`}
            >
              Home
            </Link>
            <Link
              href="/explore"
              onClick={closeMenu}
              className={`${isActive("/explore") ? "text-[#9e6752]" : "text-[#7a7a7a]"} font-medium text-center`}
            >
              Explore
            </Link>
            <Link
              href="/my-clubs"
              onClick={closeMenu}
              className={`${isActive("/my-clubs") ? "bg-[#fed7a5]" : ""} text-[#9e6752] font-bold text-center py-2 rounded-sm`}
            >
              My Clubs
            </Link>
            <hr className="border-[#9e6752]/10" />
            <Link
              href="/login"
              onClick={closeMenu}
              className="text-[#9e6752] font-bold text-center"
            >
              Sign In
            </Link>
            <Link
              href="/get-started"
              onClick={closeMenu}
              className="bg-[#9e6752] text-white px-5 py-2 rounded-sm font-bold text-center"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default PageTurnHeader;
