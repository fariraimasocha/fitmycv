"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { CheckCircleIcon, DeviceMobileIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { useRouter as useLocaleRouter } from "@/i18n/navigation";
import { useCheckoutStore } from "@/stores/checkout-store";
import { requestJson } from "@/lib/request-json";
import { trackEvent } from "@/lib/analytics";

const SLOW_AFTER_MS = 2 * 60 * 1000;

const BUTTONS = {
  landing: ["landing-primary-btn", "landing-secondary-btn"],
  dashboard: ["dashboard-primary-btn", "dashboard-secondary-btn"],
};

// Pay with EcoCash through Pesepay, for Zimbabwe visitors only. The buyer
// types their number, approves the PIN prompt on their phone, and this polls
// until Pesepay says paid or failed.
// options: [{ plan: "lifetime" | "single", price: "16.99", label }]
export default function EcocashCheckout({ options, cvId = null, variant = "landing", source }) {
  const t = useTranslations("pages.pricingCards.ecocash");
  const { data: session } = useSession();
  const localeRouter = useLocaleRouter();
  const setPendingCheckout = useCheckoutStore((s) => s.setPendingCheckout);
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState(null); // { id, plan, price }
  const [slowId, setSlowId] = useState(null);
  const slow = Boolean(payment?.id) && slowId === payment.id;

  const start = useMutation({
    mutationFn: ({ plan }) =>
      requestJson("/api/pesepay/ecocash", { method: "POST", body: { plan, phone, cvId } }),
    onSuccess: (data, option) => setPayment({ id: data.paymentId, plan: option.plan, price: option.price }),
  });

  const status = useQuery({
    queryKey: ["ecocash-payment", payment?.id],
    queryFn: () => requestJson(`/api/pesepay/ecocash/${payment.id}`),
    enabled: Boolean(payment?.id),
    refetchInterval: (query) => (query.state.data?.status === "pending" || !query.state.data ? 3000 : false),
    refetchIntervalInBackground: true,
  });
  const state = status.data?.status;

  // Past two minutes, offer a way out instead of a spinner with no end.
  useEffect(() => {
    const id = payment?.id;
    if (!id) return;
    const timer = setTimeout(() => setSlowId(id), SLOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [payment?.id]);

  useEffect(() => {
    if (state !== "paid" || !payment) return;
    trackEvent("ecocash_paid", { plan: payment.plan, source });
    // Same endings as Polar: the success page waits for Pro, a single CV opens.
    const next =
      payment.plan === "single" && cvId
        ? `/dashboard/tailored/${cvId}?unlock=pending`
        : `/payment/success?plan=${payment.plan}`;
    const timer = setTimeout(() => window.location.assign(next), 1200);
    return () => clearTimeout(timer);
  }, [state, payment, cvId, source]);

  const reset = () => {
    setPayment(null);
    start.reset();
  };

  const pay = (option) => {
    if (start.isPending) return;
    trackEvent("checkout_start", { tier: "africa", plan: option.plan, source, provider: "ecocash" });
    if (!session?.user) {
      setPendingCheckout(true, "ecocash");
      localeRouter.push("/auth");
      return;
    }
    start.mutate(option);
  };

  if (payment && state === "paid") {
    return (
      <div role="status" className="flex flex-col items-center gap-2 py-2 text-center">
        <CheckCircleIcon size={32} weight="fill" className="text-[var(--landing-success)]" aria-hidden="true" />
        <p className="font-outfit text-base font-semibold text-[var(--landing-ink)]">{t("paidTitle")}</p>
        <p className="text-sm text-[var(--landing-ink-soft)]">
          {t(payment.plan === "single" ? "paidSingle" : "paidLifetime")}
        </p>
      </div>
    );
  }

  if (payment && state !== "failed") {
    return (
      <div role="status" aria-live="polite" className="flex flex-col gap-3 rounded-xl border border-[var(--landing-line)] p-4">
        <div className="flex items-start gap-3">
          <DeviceMobileIcon size={24} className="mt-0.5 shrink-0 text-[var(--landing-accent)]" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <p className="font-outfit text-sm font-semibold text-[var(--landing-ink)]">{t("waitingTitle")}</p>
            <p className="text-sm text-[var(--landing-ink-soft)]">
              {t("waitingBody", { phone, price: payment.price })}
            </p>
          </div>
        </div>
        {slow ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-[var(--landing-ink-soft)]">{t("slow")}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => status.refetch()} className={`${BUTTONS[variant][1]} flex-1 rounded-xl text-sm`}>
                {t("checkAgain")}
              </button>
              <button type="button" onClick={reset} className={`${BUTTONS[variant][1]} flex-1 rounded-xl text-sm`}>
                {t("tryAgain")}
              </button>
            </div>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-xs text-[var(--landing-ink-soft)]">
            <SpinnerGapIcon size={14} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
            {t("checking")}
          </p>
        )}
      </div>
    );
  }

  const error = state === "failed" ? t("failed") : start.error?.message;

  return (
    <form
      className="flex w-full flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        pay(options[0]);
      }}
    >
      {session?.user ? (
        <label className="flex flex-col gap-1.5 text-left">
          <span className="text-xs font-medium text-[var(--landing-ink)]">{t("phoneLabel")}</span>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="077 123 4567"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (error) reset();
            }}
            required
            aria-invalid={Boolean(error)}
            className="h-11 w-full rounded-xl border border-[var(--landing-line)] bg-[var(--landing-surface)] px-3 text-base text-[var(--landing-ink)] tabular-nums outline-none focus:border-[var(--landing-accent)]"
          />
        </label>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
      {options.map((option, i) => (
        <button
          key={option.plan}
          type={i === 0 ? "submit" : "button"}
          onClick={i === 0 ? undefined : () => pay(option)}
          disabled={start.isPending}
          aria-busy={start.isPending && start.variables?.plan === option.plan}
          className={`${BUTTONS[variant][i === 0 ? 0 : 1]} w-full cursor-pointer rounded-xl font-outfit text-sm disabled:cursor-wait disabled:opacity-60`}
        >
          {option.label}
        </button>
      ))}
      <p className="text-center text-xs text-[var(--landing-ink-soft)]">{t("note")}</p>
    </form>
  );
}
