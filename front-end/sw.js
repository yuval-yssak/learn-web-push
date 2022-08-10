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

// respond to notification actions
self.addEventListener("notificationclick", (e) => {
  console.log(e);
  if (e.action === "cancel-slug") e.notification.close();
});

// respond to user clearing notification
self.addEventListener("notificationclose", (e) => {
  console.log("notification closed", e);
});

// listen to push notifications
self.addEventListener("push", (e) => {
  console.log("push notification received", e);

  if (e.data) {
    const data = JSON.parse(e.data.text());

    const options = {
      body: data.content,
      icon: "/logo-192.png",
      badge: "/logo-96.png",
    };

    e.waitUntil(self.registration.showNotification(data.title, options));
  } else {
    console.error("no data in event", e);
  }
});
