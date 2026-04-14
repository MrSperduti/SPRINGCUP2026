let deferredPrompt = null;

document.addEventListener("DOMContentLoaded", () => {
  const installBtn = document.getElementById("installAppButton");
  const installHelp = document.getElementById("installHelp");

  function isIOS() {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  }

  function isInStandaloneMode() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  if (isInStandaloneMode()) {
    if (installBtn) installBtn.style.display = "none";
    if (installHelp) {
      installHelp.style.display = "block";
      installHelp.textContent = "✅ App già installata sul dispositivo.";
    }
    return;
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (installBtn) {
      installBtn.style.display = "flex";
    }

    if (installHelp) {
      installHelp.style.display = "block";
      installHelp.textContent = "Puoi installare l'app direttamente sul dispositivo.";
    }
  });

  if (installBtn) {
    installBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      if (!deferredPrompt) {
        if (isIOS()) {
          if (installHelp) {
            installHelp.style.display = "block";
            installHelp.innerHTML = "Su iPhone: apri in <strong>Safari</strong>, poi tocca <strong>Condividi</strong> e scegli <strong>Aggiungi a Home</strong>.";
          }
        } else {
          if (installHelp) {
            installHelp.style.display = "block";
            installHelp.textContent = "Installazione non disponibile ora. Prova dal menu del browser.";
          }
        }
        return;
      }

      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        if (installHelp) {
          installHelp.style.display = "block";
          installHelp.textContent = "✅ Installazione avviata.";
        }
      } else {
        if (installHelp) {
          installHelp.style.display = "block";
          installHelp.textContent = "Installazione annullata.";
        }
      }

      deferredPrompt = null;
      installBtn.style.display = "none";
    });
  }

  if (isIOS() && installBtn) {
    installBtn.style.display = "flex";
    if (installHelp) {
      installHelp.style.display = "block";
      installHelp.innerHTML = "Su iPhone: apri in <strong>Safari</strong>, poi tocca <strong>Condividi</strong> e scegli <strong>Aggiungi a Home</strong>.";
    }
  }
});
