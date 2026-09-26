import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { functionAccess, type AdminPlan } from "@/lib/admin/controls";
import type { AdminPayout } from "@/lib/admin/copy";
import { useAdminState, useFunctionAccess } from "@/lib/admin/use-copy";
import { useExamStore } from "@/lib/exam/store";

export const Route = createFileRoute("/subscriptions")({ component: SubscriptionsPage });

function payAmount(price: string) {
  const amount = price.replace(/[^\d.]/g, "");
  return amount || "0";
}

function upiUrl(payout: AdminPayout, plan: AdminPlan) {
  const params = new URLSearchParams({
    pa: payout.upi,
    pn: payout.accountName || "SetPaper",
    am: payAmount(plan.price),
    cu: "INR",
    tn: `SetPaper ${plan.name}`,
  });
  return `upi://pay?${params.toString()}`;
}

function SubscriptionsPage() {
  const admin = useAdminState();
  const view = useFunctionAccess("subscriptions.view");
  const buy = useFunctionAccess("subscriptions.buy");
  const purchasePlan = useExamStore((s) => s.purchasePlan);
  const plans = admin.controls.plans.filter((plan) => plan.enabled);
  const locked = admin.controls.functions.filter((item) => item.enabled && item.planId && functionAccess(admin, item.id).reason === "locked");
  const [payId, setPayId] = useState<string | null>(null);
  const paying = plans.find((plan) => plan.id === payId) ?? null;
  const payout = admin.payout;
  const canPay = Boolean(payout.upi || payout.phonePe || payout.accountNumber);

  return (
    <StudyShell title="Subscriptions">
      <div className="mx-auto grid max-w-lg gap-4 p-4 pb-8">
        <p className="text-sm text-muted-foreground">
          Payment goes to the admin account. The plus button and locked functions open only after the fee is paid.
        </p>
        {!view.allowed ? (
          <p className="rounded-xl border border-border bg-card px-4 py-6 text-sm">Subscriptions are turned off.</p>
        ) : (
          <ul className="grid gap-3">
            {plans.map((plan) => {
              const owned = admin.purchases.includes(plan.id);
              const included = admin.controls.functions.filter((item) => item.enabled && item.planId === plan.id);
              return (
                <li key={plan.id} className="surface-3d grid gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold">{plan.name}</p>
                      <p className="text-sm text-muted-foreground">{plan.blurb}</p>
                    </div>
                    <p className="text-sm font-semibold">{plan.price}</p>
                  </div>
                  <ul className="grid gap-1 text-sm">
                    {included.length === 0 ? <li className="text-muted-foreground">No functions assigned yet.</li> : null}
                    {included.map((item) => (
                      <li key={item.id}>{item.name}</li>
                    ))}
                  </ul>
                  {owned ? (
                    <p className="inline-flex items-center gap-2 text-sm text-primary">
                      <BadgeCheck className="size-4" /> Unlocked
                    </p>
                  ) : (
                    <Button type="button" disabled={!buy.allowed} onClick={() => setPayId(plan.id)}>
                      {buy.allowed ? `Pay ${plan.price || plan.name}` : "Buying is turned off"}
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {locked.length ? (
          <section className="grid gap-2">
            <h2 className="px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">Locked right now</h2>
            <ul className="surface-3d divide-y divide-border">
              {locked.map((item) => {
                const plan = admin.controls.plans.find((row) => row.id === item.planId);
                return (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                    <Lock className="size-4 text-muted-foreground" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{plan?.name}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}
      </div>
      <Dialog open={Boolean(paying)} onOpenChange={(open) => { if (!open) setPayId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay {paying?.price || paying?.name}</DialogTitle>
            <DialogDescription>Send the fee to the admin, then confirm. The plus button unlocks after payment.</DialogDescription>
          </DialogHeader>
          {!canPay ? <p className="text-sm text-muted-foreground">The admin has not added a UPI ID, PhonePe number, or account yet.</p> : null}
          {payout.upi ? <p className="text-sm">UPI: <span className="font-medium">{payout.upi}</span></p> : null}
          {payout.phonePe ? <p className="text-sm">PhonePe: <span className="font-medium">{payout.phonePe}</span></p> : null}
          {payout.accountNumber ? (
            <p className="text-sm">
              Account: <span className="font-medium">{payout.accountName || "Admin"}</span> · {payout.accountNumber}
              {payout.ifsc ? ` · ${payout.ifsc}` : ""}
            </p>
          ) : null}
          <div className="grid gap-2">
            {payout.upi && paying ? (
              <Button type="button" variant="outline" onClick={() => { window.location.href = upiUrl(payout, paying); }}>
                Pay with UPI
              </Button>
            ) : null}
            {payout.phonePe && paying ? (
              <Button type="button" variant="outline" onClick={() => { window.location.href = payout.upi ? upiUrl(payout, paying) : `tel:${payout.phonePe}`; }}>
                Pay with PhonePe
              </Button>
            ) : null}
            <Button
              type="button"
              disabled={!canPay || !paying}
              onClick={() => {
                if (!paying) return;
                purchasePlan(paying.id);
                setPayId(null);
                toast.success("Payment recorded. Plus is unlocked.");
              }}
            >
              I have paid
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </StudyShell>
  );
}
