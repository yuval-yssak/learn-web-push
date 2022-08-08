self.addEventListener("install", (event) =>
  console.log("[service-worker] Installing service worker...", event)
);

self.addEventListener("activate", (event) =>
  console.log("[service-worker] Activating service worker...", event)
);

// trick chrome into detecting offline availability, to allow installation
self.addEventListener("fetch", (event) => {
  console.log("fetch", event);
});
