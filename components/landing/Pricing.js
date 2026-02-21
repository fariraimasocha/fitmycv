"use client";

import { motion } from "motion/react";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/stores/checkout-store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  "AI-powered CV tailoring",
  "Smart cover letter generation",
  "Job requirement analysis",
  "PDF export & download",
  "Unlimited generations",
];

export default function Pricing() {
  const { data: session } = useSession();
  const router = useRouter();
  const setPendingCheckout = useCheckoutStore((s) => s.setPendingCheckout);

  const handleGetStarted = () => {
    if (session?.user) {
      router.push("/api/polar/checkout");
    } else {
      setPendingCheckout(true);
      router.push("/auth");
    }
  };

  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Pricing
        </h2>
        <p className="mt-2 text-gray-500">
          Simple pricing for smarter applications.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex justify-center"
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-lg">Premium</CardTitle>
            <CardDescription>
              Everything you need to land your next role.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">$4.99</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>

            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon
                    weight="fill"
                    className="size-5 text-primary shrink-0"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter>
            <Button onClick={handleGetStarted} className="w-full" size="lg">
              Get Started
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </section>
  );
}
