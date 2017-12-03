import {executeGrid,IO} from "./runtime";
import {parseWholeGrid} from "../parser/parser";
import {Analyzer} from "../analysis/analyzer";
import {Cube} from "../stdlib/cube";
import * as g from "../grid";
var readline = require("readline");

class ConsoleIO implements IO {
    in = () => {
        return readline();
    }
    out = (value : g.Type) => {
        console.log(value);
    }
}

let compileAndExecute = (grid : string[][], start : g.Position, io : IO, params? : any[]): void => {
    let parsedGrid : g.Grid = parseWholeGrid(grid);
    new Analyzer(parsedGrid).analyzeGrid();
    
    for(let i = 0; i < params.length; i++){
        if(typeof params[i] === 'object'){
            let cube = new Cube;
            for(let j = 0; j < params[i].length; j++){
                cube.insert(params[i][j]);
            }
            params[i] = cube;
        }
    }
    executeGrid(parsedGrid,start,io,params);
}

export {compileAndExecute,ConsoleIO}