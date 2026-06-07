"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityAnalytics() {
  useEffect(() => {
    Clarity.init("x2ocj2is1a");
  }, []);

  return null;
}
