import { useBlockProps } from "@wordpress/block-editor";
import React from "react";

export default function save() {
	return (
		<div id="search-main" {...useBlockProps.save()}></div>
	);
}
