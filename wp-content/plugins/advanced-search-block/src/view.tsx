import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import ViewComponent from './ViewComponent';
import React from "react";

domReady(() => {
    const searchBlock = document.getElementById("search-main");
    if (searchBlock) {
        const placeholder = searchBlock.getAttribute('data-placeholder') || '';
        const itemsPerPage = Number(searchBlock.getAttribute('data-items-per-page')) || 0;
        const attributes = { placeholder, itemsPerPage };
        createRoot(searchBlock).render(<ViewComponent {...attributes} />);
    }
});
