import { useEffect, useRef, useState } from "react";
import { Input, Modal, Typography } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { LockKeyhole, ShieldCheck } from "lucide-react";

import { apiUrl, fetchWithTimeout } from "@/lib/api";

const MAX_ATTEMPTS = 3;

export function AdminPinModal() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastTapRef = useRef<number | null>(null);

  useEffect(() => {
  }, [open]);

  const reset = () => {
    setOpen(false);
    setPin("");
    setAttempts(MAX_ATTEMPTS);
    setError("");
    setIsSubmitting(false);
  };

  const handleOpen = () => {
    setAttempts(MAX_ATTEMPTS);
    setError("");
    setPin("");
    setOpen(true);
  };

  const handleHiddenTrigger = () => {
    const now = Date.now();
    const lastTap = lastTapRef.current ?? 0;
    if (now - lastTap < 300) {
      handleOpen();
      lastTapRef.current = null;
      return;
    }
    lastTapRef.current = now;
  };

  const handleContinue = async () => {
    if (!pin.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetchWithTimeout(apiUrl("/auth/admin-pin"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const payload = await response.json();

      if (response.ok && payload?.data?.valid) {
        reset();
        await navigate({ to: "/admin/login" });
        return;
      }

      const remainingAttempts = attempts - 1;
      const message =
        remainingAttempts === 0
          ? "PIN incorrecto. Intenta nuevamente."
          : `PIN incorrecto. Intenta nuevamente.`;

      setPin("");
      setAttempts(remainingAttempts);
      setError(message);

      if (remainingAttempts === 0) {
        window.setTimeout(() => {
          reset();
        }, 0);
      }
    } catch {
      setError("PIN incorrecto. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onDoubleClick={handleOpen}
        onTouchStart={handleHiddenTrigger}
        aria-haspopup="dialog"
        aria-label="Abrir acceso administrativo"
        className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:border-aether/30 hover:bg-aether/5 hover:text-aether"
      >
        <ShieldCheck className="size-3.5 transition-transform group-hover:scale-110" />
        Administración
      </button>
      <Modal
        open={open}
        className="dyc-pin-modal"
        title={
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-aether/10 text-aether">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <div className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                DYC
              </div>
              <div className="text-lg font-semibold text-foreground">Acceso administrativo</div>
            </div>
          </div>
        }
        okText="Continuar"
        cancelText="Cancelar"
        confirmLoading={isSubmitting}
        onOk={handleContinue}
        onCancel={reset}
        destroyOnHidden
        width={420}
        centered
      >
        <div className="space-y-4 pb-2 pt-2">
          <div className="relative overflow-hidden rounded-2xl border border-aether/20 bg-gradient-to-br from-aether/10 via-background to-purple/10 p-4 shadow-soft">
            <div className="pointer-events-none absolute -right-5 -top-7 size-24 rounded-full bg-aether/15 blur-xl" />
            <div className="relative flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-xl bg-aether text-aether-foreground shadow-float">
                <LockKeyhole className="size-4" />
              </div>
              <div>
                <Typography.Paragraph className="!mb-1 text-sm font-medium text-foreground">
                  Introduce el código autorizado para continuar.
                </Typography.Paragraph>
                <Typography.Paragraph className="!mb-0 text-sm text-muted-foreground">
                  Solo el personal autorizado puede continuar a la pantalla de login administrativo.
                </Typography.Paragraph>
              </div>
            </div>
          </div>

          <Input.Password
            aria-label="PIN de acceso"
            placeholder="PIN de acceso"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            onPressEnter={handleContinue}
            status={error ? "error" : ""}
            autoFocus
            maxLength={8}
            className="!h-14 !rounded-2xl !border-input !bg-background !px-4 !text-lg !shadow-soft"
          />

          {error ? (
            <Typography.Text type="danger" role="alert" aria-live="assertive" className="block text-sm">
              {error}
            </Typography.Text>
          ) : null}
        </div>
      </Modal>
    </>
  );
}
