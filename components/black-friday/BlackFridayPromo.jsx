"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BlackFridayBanner from "@/components/black-friday/BlackFridayBanner";
import { isBlackFridayActive } from "@/lib/black-friday";

// Banner only. The interruptive popup was removed after it drove bounce
// without meaningful code copies.
export default function BlackFridayPromo({ children }) {
  const { data: session } = useSession();
  const [active, setActive] = useState(() => isBlackFridayActive());

  useEffect(() => {
    setActive(isBlackFridayActive());
  }, []);

  const showChrome = active && !session?.user?.isPremium;

  return (
    <>
      {showChrome ? <BlackFridayBanner /> : null}
      {children}
    </>
  );
}
