import {Parser} from "../parser/parser";
import {initUI} from "./components";

// Require our static assets first
require("./grid-editor.html");
require("./editor.scss");


export interface GridEditorSettings {
    // React typing expect input values to be strings
    readonly width : string;
    readonly height : string;
}

let settings = {width:"3",height: "3"};

initUI(settings);
