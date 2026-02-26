import express from "express";
import { renderToPipeableStream } from "react-dom/server";
import App from "./App.jsx";

const app = express();

app.use("/static", express.static("dist"));

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");

  const { pipe } = renderToPipeableStream(
    <html>
      <head>
        <title>Dehydrated Suspense + Context Repro</title>
      </head>
      <body>
        <div id="root">
          <App />
        </div>
        <script type="module" src="/static/client.js" />
      </body>
    </html>,
    {
      onAllReady() {
        res.statusCode = 200;
        pipe(res);
      },
      onError(err) {
        console.error("SSR error:", err);
      },
    },
  );
});

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
