import {Parser} from "../parser/parser";
import {initUI} from "./components";

// Require our static assets first
require("./grid-editor.html");
require("./editor.scss");


export interface GridEditorSettings {
    // React typing expect input values to be strings
    width : string;
    height : string;
    startX : string;
    startY : string;
    params : string;
}

let settings = {width:"3",height: "3", startX: "1", startY: "1", params:"[1,100]"};

let  samples : {[key:string]:string[][]} = {
    "fizzbuzz": [
        ["","i:number,j:number\nprint(i)\ndown(i+1,j)",""],
        ["i:number,j:number\nprint(\"Fizz\")\nright(i+1,j)",
             "i:number,j:number\ni>j end()\ni%15=0 right(i,j)\ni%5=0 down(i,j)\ni%3=0 left(i,j)\nup(i,j)",
             "i:number,j:number\nprint(\"FizzBuzz\")\nleft(i+1,j)"],
        ["","i:number,j:number\nprint(\"Buzz\")\nup(i+1,j)",""]
     ]
 };

initUI(settings, samples["fizzbuzz"]);
