"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

export function InstallPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [supportsPrompt, setSupportsPrompt] = useState(false);
  const [manualHint, setManualHint] = useState("");

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isiPhoneOrIPad = /iphone|ipad|ipod/.test(userAgent);
    const isSafari =
      /safari/.test(userAgent) &&
      !/crios|fxios|edgios|chrome|android/.test(userAgent);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // Safari iOS exposes this legacy flag when added to the home screen.
      ("standalone" in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone));

    if (isStandalone) {
      setInstalled(true);
    }

    if (isiPhoneOrIPad) {
      if (isSafari) {
        setManualHint(
          'En iPhone o iPad, instala desde Safari usando "Compartir" y luego "Agregar a pantalla de inicio".',
        );
      } else {
        setManualHint(
          "En iPhone o iPad, abre esta pagina en Safari para poder instalarla como app.",
        );
      }
    } else {
      setManualHint(
        "Si no aparece la instalacion automatica, abre esta pagina en Chrome o Edge y usa el menu del navegador para instalarla.",
      );
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setSupportsPrompt(true);
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js");
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installEvent) {
      return;
    }

    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  return (
    <div className="install-box">
      {installed ? (
        <p>La app ya fue instalada en este dispositivo.</p>
      ) : installEvent ? (
        <>
          <p>Este navegador permite lanzar la instalacion directa.</p>
          <button
            className="install-button"
            onClick={() => void installApp()}
            type="button"
          >
            Instalar app
          </button>
        </>
      ) : (
        <div className="install-help">
          <p>
            {supportsPrompt
              ? "La instalacion no esta disponible ahora mismo."
              : "Este navegador no esta mostrando el instalador automatico."}
          </p>
          <p>{manualHint}</p>
        </div>
      )}
    </div>
  );
}
