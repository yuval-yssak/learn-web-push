if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(() => {
    console.log("service worker registered.");
  });
} else {
  console.log("no service worker option available.");
}

const $installButton = document.querySelector(".install-app");

// hide install button
console.log("hide button");
$installButton.style.display = "none";

let deferredInstallEvent = null;
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("BEFORE INSTALL PROMPT", e);
  e.preventDefault();

  deferredInstallEvent = e;

  $installButton.style.display = "block";

  $installButton.addEventListener("click", () => {
    if (deferredInstallEvent) {
      deferredInstallEvent.prompt();

      deferredInstallEvent.userChoice().then((result) => {
        if (result === "accepted") console.log("user agreed to install");
        else console.log("user declined to install");

        deferredInstallEvent = null;
      });
    }
  });
});
