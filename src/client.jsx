import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App.jsx";

startTransition(() => {
  hydrateRoot(
    document,
    <html>
      <head>
        <title>Dehydrated Suspense + Context Repro</title>
      </head>
      <body>
        <div id="root">
          <App />
        </div>
      </body>
    </html>,
  );
});
