import React from "react";
import { render } from "react-dom";

import App from "./App.js";
import "./index.css";

/* FIXME */
/* Dirty setTimeout is used for allowing the custom (google) fonts to load before text is drawn on canvas. */
/* TODO: Solve this properly, e.g. by using  something like Fontobserver: https://fontfaceobserver.com/ */
/* Also see this article on Konva.js: https://konvajs.org/docs/sandbox/Custom_Font.html */

window.setTimeout(() => {
  render(<App />, document.getElementById("root"));
}, 2000);
