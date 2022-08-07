if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(() => {
    console.log("service worker registered.");
  });
} else {
  console.log("no service worker option available.");
}
