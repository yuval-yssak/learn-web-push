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
          configurePushSubscription(swReg);
        });
      }
    });
}

function displayConfirmaNotification(swReg) {
  swReg.showNotification("Alright!", {
    body: "You have enabled notifications",
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
}

async function configurePushSubscription(swReg) {
  const vapidPublicKey =
    "BAX_0TF8ANYwXuAIxcgcmjokFlq2XlT3HHWUyEQTy7Aze2_U_tRnD2NwDLw0hZrWm77C1765FOro81lLn6O8PuU";
  const convertedKey = convertDataURIToBinary(vapidPublicKey);
  if (!("serviceWorker" in navigator)) return;

  const subscription = await swReg.pushManager.getSubscription();

  if (subscription === null) {
    // create a new subscription
    const newSubscription = await swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey,
    });

    const response = await fetch("http://localhost:4000/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newSubscription),
    });
    if (response.ok) displayConfirmaNotification(swReg);
    else alert("could not push subscription to server");
  } else {
    // we have a subscription
  }
}

function convertDataURIToBinary(base64string) {
  const padding = "=".repeat((4 - (base64string.length % 4)) % 4);
  const base64 = (base64string + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
