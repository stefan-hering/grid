import {Parser} from "../parser/parser";
import {initUI} from "./playground";

// Static assets-
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

export interface SerializableGrid {
    cells : string[][];
    settings : GridEditorSettings;
}

let settings = {
    width : "3",
    height : "3",
    startX : "1",
    startY : "1",
    params : "[1,100]"
};

let samples = {
    fizzbuzz: {
        cells: [
            ["","i:number,j:number\nprint(i)\ndown(i+1,j)",""],
            ["i:number,j:number\nprint(\"Fizz\")\nright(i+1,j)",
                "i:number,j:number\ni>j end()\ni%15=0 right(i,j)\ni%5=0 down(i,j)\ni%3=0 left(i,j)\nup(i,j)",
                "i:number,j:number\nprint(\"FizzBuzz\")\nleft(i+1,j)"],
            ["","i:number,j:number\nprint(\"Buzz\")\nup(i+1,j)",""]
        ],
        settings: {
            width : "3",
            height : "3",
            startX : "1",
            startY : "0",
            params : "[1,100]"
        }
    },
    listsum: {
        cells: [
            ["c:Cube<number> -> i,sum: number\ni ? right(c,sum + i)\nprint(sum)\nend()",
                "c:Cube<number>, sum: number\nleft(c,sum)"]
            ],
        settings: {
            width : "2",
            height : "1",
            startX : "0",
            startY : "0",
            params : "[[1,3,7],0]"
        }
    }
};

if(localStorage.getItem("savedGrids") == null) {
    localStorage.setItem("savedGrids",JSON.stringify(["fizzbuzz","listsum"]));
    localStorage.setItem("grid-fizzbuzz",JSON.stringify(samples["fizzbuzz"]));
    localStorage.setItem("grid-listsum",JSON.stringify(samples["listsum"]));
}

initUI(samples["fizzbuzz"]);
