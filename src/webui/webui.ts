import {Parser} from "../parser/parser";
import {initUI} from "./components";

// Require our static assets first
require("./grid-editor.html");
require("./editor.scss");


export class GridEditorSettings {
    // React typing expect input values to be strings
    constructor(public width : string, public height : string){
    }
}

let settings = new GridEditorSettings("3","3");

initUI(settings);
