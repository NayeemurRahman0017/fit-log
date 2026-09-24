"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";

type IconProps = {
  size?: number;
  strokeWidth?: number;
};

const Menu = ({ size = 24, strokeWidth = 2 }: IconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6h16M4 12h16M4 18h16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);

const X = ({ size = 24, strokeWidth = 2 }: IconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6 6 18M6 6l12 12"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Temporary values.
  // Later connect these with your global plan/saved state.
  const planCount = 0;
  const savedCount = 0;

  return (
    <header className="sticky top-0 z-50 border-b border-[#24282E] bg-[#0B0D10]/95 backdrop-blur-md">
      <div className="mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-10 xl:px-12">

        {/* ================= DESKTOP / MAIN NAVBAR ================= */}
        <div className="flex h-18 items-center justify-between">

          {/* LEFT - LOGO */}
          <div className="flex items-center">

            {/* Mobile menu */}
            <button
              type="button"
              aria-label={
                isMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              onClick={() =>
                setIsMenuOpen((prev) => !prev)
              }
              className="
                mr-3
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                text-[#9A9EA5]
                transition
                hover:bg-[#15181D]
                hover:text-white
                lg:hidden
              "
            >
              {isMenuOpen ? (
                <X size={20} strokeWidth={1.8} />
              ) : (
                <Menu size={20} strokeWidth={1.8} />
              )}
            </button>

            <Link
              href="/"
              className="group flex items-center gap-2.5"
            >
              <Image
                src={logo}
                alt="FitLog"
                width={34}
                height={34}
                priority
                className="
                  h-8.5
                  w-8.5
                  object-contain
                  transition
                  group-hover:scale-105
                "
              />

              <span className="
                font-display
                text-[21px]
                font-bold
                tracking-[0.08em]
                text-white
              ">
                FITLOG
              </span>
            </Link>
          </div>

          {/* CENTER - NAVIGATION */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
            <div className="flex items-center gap-1">

              {/* WORKOUT */}
              <Link
                href="/"
                className="
                  relative
                  px-5
                  py-2.5
                  text-[12px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#C2F800]
                  transition
                  hover:text-[#C2F800]
                "
              >
                Workout

                {/* Active indicator */}
                <span className="
                  absolute
                  bottom-0
                  left-1/2
                  h-0.5
                  w-5
                  -translate-x-1/2
                  rounded-full
                  bg-[#C2F800]
                " />
              </Link>

              {/* MY PLAN */}
              <Link
                href="/my-plan"
                className="
                  px-5
                  py-2.5
                  text-[12px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#858A92]
                  transition
                  hover:text-white
                "
              >
                My Plan
              </Link>

            </div>
          </nav>

          {/* RIGHT - COUNTERS */}
          <div className="flex items-center gap-2">

            {/* PLAN */}
            <Link
              href="/my-plan"
              className="
                inline-flex
                h-8.5
                items-center
                gap-2
                rounded-full
                bg-[#C2F800]
                px-3.5
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.12em]
                text-[#080A0D]
                transition
                hover:brightness-110
                active:scale-95
              "
            >
              <span>PLAN</span>

              <span className="
                flex
                min-w-4.5
                items-center
                justify-center
                rounded-full
                bg-[#080A0D]/10
                px-1
                py-0.5
                text-[10px]
              ">
                {planCount}
              </span>
            </Link>

            {/* SAVED */}
            <Link
              href="/my-plan"
              className="
                inline-flex
                h-8.5
                items-center
                gap-2
                rounded-full
                border
                border-[#C2F800]
                px-3.5
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.12em]
                text-[#C2F800]
                transition
                hover:bg-[#C2F800]/10
                active:scale-95
              "
            >
              <span>SAVED</span>

              <span className="
                flex
                min-w-4.5
                items-center
                justify-center
                rounded-full
                bg-[#C2F800]/10
                px-1
                py-0.5
                text-[10px]
              ">
                {savedCount}
              </span>
            </Link>

          </div>
        </div>

        {/* ================= MOBILE NAVIGATION ================= */}
        {isMenuOpen && (
          <div className="
            border-t
            border-[#24282E]
            py-4
            lg:hidden
          ">

            <nav className="flex flex-col gap-1">

              <Link
                href="/"
                onClick={() =>
                  setIsMenuOpen(false)
                }
                className="
                  rounded-lg
                  px-4
                  py-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#C2F800]
                  transition
                  hover:bg-[#15181D]
                "
              >
                Workout
              </Link>

              <Link
                href="/my-plan"
                onClick={() =>
                  setIsMenuOpen(false)
                }
                className="
                  rounded-lg
                  px-4
                  py-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#858A92]
                  transition
                  hover:bg-[#15181D]
                  hover:text-white
                "
              >
                My Plan
              </Link>

            </nav>

          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;