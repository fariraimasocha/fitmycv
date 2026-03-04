"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { signIn } from "next-auth/react";
import { GoogleLogoIcon, ReadCvLogoIcon, WarningIcon, CopyIcon } from "@phosphor-icons/react";
import { useCheckoutStore } from "@/stores/checkout-store";
import toast from "react-hot-toast";

function isWebView() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram|Twitter|LinkedInApp|GSA|wv/.test(ua);
}

export default function AuthPage() {
  const getPendingCheckout = useCheckoutStore((s) => s.getPendingCheckout);
  const [inWebView, setInWebView] = useState(false);

  useEffect(() => {
    setInWebView(isWebView());
  }, []);

  const handleSignIn = () => {
    const callbackUrl = getPendingCheckout()
      ? "/dashboard?checkout=pending"
      : "/dashboard";
    signIn("google", { callbackUrl });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied! Paste it in Chrome or Safari.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        className="bg-white rounded-2xl shadow-lg border p-8 w-full max-w-sm flex flex-col items-center gap-6"
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

        {/* WebView warning banner */}
        {inWebView && (
          <div className="w-full rounded-xl bg-amber-50 border border-amber-200 p-4 flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <WarningIcon size={18} className="text-amber-600 mt-0.5 shrink-0" weight="fill" />
              <p className="text-sm text-amber-800">
                Google sign-in doesn&apos;t work in in-app browsers. Open this page in Chrome or Safari to continue.
              </p>
            </div>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-amber-800 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors"
            >
              <CopyIcon size={16} />
              Copy link to open in browser
            </button>
          </div>
        )}

        {/* Google sign-in button — disabled in WebView */}
        <motion.button
          onClick={handleSignIn}
          disabled={inWebView}
          className="inline-flex items-center justify-center gap-3 w-full px-5 py-3 text-sm text-white bg-black rounded-full hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          whileHover={inWebView ? {} : { scale: 1.02 }}
          whileTap={inWebView ? {} : { scale: 0.98 }}
        >
          <GoogleLogoIcon size={20} weight="bold" />
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  );
}
