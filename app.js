if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(() => {
    console.log("service worker registered.");
  });
} else {
  console.log("no service worker option available.");
}

const $installButton = document.querySelector(".btn__install-app");
const $enableNotifications = document.querySelector(
  ".btn__enable-notifications"
);

// hide install button
console.log("hide button");
$installButton.style.display = "none";

let deferredInstallEvent = null;
window.addEventListener("beforeinstallprompt", onPromptInstall);
$enableNotifications.addEventListener("click", enableNotifications);

function onPromptInstall(e) {
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
}

function enableNotifications() {
  if ("Notification" in window && "serviceWorker" in navigator)
    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        navigator.serviceWorker.ready.then((swReg) => {
          swReg.showNotification("Alright!", {
            body: "Allowed notification2222s",
            icon: "/logo-192.png",
            badge: "/logo-96.png",
            actions: [
              {
                action: "confirm-slug",
                title: "Confirm",
                icon: "/logo-192.png",
              },
              {
                action: "cancel-slug",
                title: "Cancel",
                icon: "/logo-192.png",
              },
            ],
          });
        });
      }
    });
}
