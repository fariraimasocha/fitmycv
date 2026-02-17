"use client";

import { motion } from "motion/react";
import { signIn } from "next-auth/react";
import { GoogleLogoIcon, ReadCvLogoIcon } from "@phosphor-icons/react";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo + brand — same as navbar */}
        <div className="flex items-center gap-3">
          <motion.div
            className="w-8 h-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            <ReadCvLogoIcon size={32} />
          </motion.div>
          <span className="text-lg text-gray-900">fitmycv</span>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
        </div>

        {/* Google sign-in button */}
        <motion.button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="inline-flex items-center justify-center gap-3 w-full px-5 py-3 text-sm text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <GoogleLogoIcon size={20} weight="bold" />
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  );
}
