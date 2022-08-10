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
  console.log("clicked on notification", e);
  e.waitUntil(
    (async () => {
      const windowClients = await self.clients.matchAll();

      const windowClient = windowClients.find(
        (w) => w.visibilityState === "visible"
      );
      if (windowClient) {
        await windowClient.navigate(e.notification.data.url);
        await windowClient.focus();
      } else {
        await self.clients.openWindow(e.notification.data.url);
      }
    })()
  );
  e.notification.close();
});

// respond to user clearing notification
self.addEventListener("notificationclose", (e) => {
  console.log("notification closed", e);
});

// listen to push notifications
self.addEventListener("push", (e) => {
  console.log("push notification received", e);

  var data;
  if (e.data) {
    data = JSON.parse(e.data.text());
  } else {
    data = {
      title: "new message from server",
      content: "unknown content",
      openUrl: "/",
    };
  }

  console.log({ data });

  const options = {
    body: data.content,
    icon: "/logo-192.png",
    badge: "/logo-96.png",
    data: { url: data.openUrl },
  };

  e.waitUntil(self.registration.showNotification(data.title, options));
});
