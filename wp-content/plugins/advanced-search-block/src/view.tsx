import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import ViewComponent from './ViewComponent';
import React from "react";

domReady(() => {
    const root = document.getElementById("search-main");
    if (root) {
        createRoot(root).render(<ViewComponent />);
    }
});
