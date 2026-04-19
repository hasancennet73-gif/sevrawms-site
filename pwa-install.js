// SEVRA PWA Kurulum Yardımcısı
(function(){
  let deferredPrompt = null;

  function registerServiceWorker(){
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function(){
        navigator.serviceWorker.register("/service-worker.js")
          .then(() => console.log("SEVRA PWA aktif"))
          .catch(err => console.warn("SEVRA PWA service worker hatası:", err));
      });
    }
  }

  function createInstallButton(){
    if (document.getElementById("sevraInstallBtn")) return;

    const btn = document.createElement("button");
    btn.id = "sevraInstallBtn";
    btn.textContent = "SEVRA'yı Telefona Kur";
    btn.style.position = "fixed";
    btn.style.left = "16px";
    btn.style.right = "16px";
    btn.style.bottom = "16px";
    btn.style.zIndex = "9999";
    btn.style.border = "0";
    btn.style.borderRadius = "16px";
    btn.style.padding = "14px 16px";
    btn.style.fontWeight = "800";
    btn.style.background = "#f1c84d";
    btn.style.color = "#071326";
    btn.style.boxShadow = "0 18px 36px rgba(0,0,0,.32)";
    btn.style.display = "none";

    btn.addEventListener("click", async function(){
      if (!deferredPrompt) {
        alert("Android Chrome: Menüden 'Ana ekrana ekle' seçeneğini kullanabilirsiniz. iPhone Safari: Paylaş > Ana Ekrana Ekle.");
        return;
      }
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      btn.style.display = "none";
    });

    document.body.appendChild(btn);
  }

  window.addEventListener("beforeinstallprompt", function(e){
    e.preventDefault();
    deferredPrompt = e;
    createInstallButton();
    const btn = document.getElementById("sevraInstallBtn");
    if (btn) btn.style.display = "block";
  });

  registerServiceWorker();
})();
