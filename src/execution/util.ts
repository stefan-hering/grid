import {executeGrid,IO} from "./runtime";
import {parseWholeGrid} from "../parser/parser";
import {Analyzer} from "../analysis/analyzer";
import * as g from "../grid";
var readline = require("readline");

class ConsoleIO implements IO {
    in = () => {
        return readline();
    }
    out =(value : g.Type) => {
        console.log(value);
    }
}

let compileAndExecute = (grid : string[][], start : g.Position, io : IO, params? : g.Value[]): void => {
    let parsedGrid : g.Grid = parseWholeGrid(grid);
    new Analyzer(parsedGrid).analyzeGrid();
    executeGrid(parsedGrid,start,io,params);
}

export {compileAndExecute,ConsoleIO}