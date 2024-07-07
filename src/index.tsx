/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import "./index.css";

import { MetaProvider } from "./Tools/SolidMeta";
import { lazy } from "solid-js";

const Home = lazy(() => import("./Pages/Home"));

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <MetaProvider>
      <Router>
        <Route path="/" component={Home} />
      </Router>
    </MetaProvider>
  ),
  root!,
);
