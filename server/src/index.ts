import express from "express";
import cors from "cors";
import * as webPush from "web-push";
const app = express();

app.use(express.json());
app.use(cors());

const subscriptions: webPush.PushSubscription[] = [];
app.post("/subscribe", async (req, res) => {
  subscriptions.push(req.body);

  console.log(req.body);
  res.send("ok");
});

app.get("/push", async (_, res) => {
  webPush.setVapidDetails(
    "mailto:test@example.com",
    "BAX_0TF8ANYwXuAIxcgcmjokFlq2XlT3HHWUyEQTy7Aze2_U_tRnD2NwDLw0hZrWm77C1765FOro81lLn6O8PuU",
    "fOnmhJk_p-owQHBrUC2U7bkqq-AJ48SNJcJzoM1iW6Y"
  );

  for (let i = subscriptions.length - 1; i >= 0; i--) {
    try {
      const pushResult = await webPush.sendNotification(
        subscriptions[i],
        JSON.stringify({
          title: "New Post",
          content: "hello",
          openUrl: "https://bbc.com",
        })
      );
    } catch (err) {
      const typedError = err as webPush.WebPushError;

      if (typedError.statusCode === 410) {
        // client removed
        subscriptions.splice(i, 1);
      } else {
        throw err;
      }
    }
  }

  res.send(`sent to ${subscriptions.length} subscribers`);
});

app.listen(4000, () => console.log("listening on 4000"));
