import {Analyzer} from "../src/analysis/analyzer";
import {parseWholeGrid,ParserError} from "../src/parser/parser";
import {readGrid} from "../src/gridreader";
import * as g from "../src/grid";
import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
let fs = require("fs");

let getAnalyer = (gridPath : string): Analyzer => {
    let testgrid : string = fs.readFileSync(gridPath, "utf8");
    let parsedGrid : g.Grid = parseWholeGrid(readGrid(testgrid));
    return new Analyzer(parsedGrid);
}

suite("Analyzer", () => {
    test("Should analyze the fizzbuzz grid", () => {
        let notThrowing = function(){
            getAnalyer("test/grids/fizzbuzz.grid").analyzeGrid();
        }
        expect(notThrowing).to.not.throw();
    });
    test("Should find errors", () => {
        let throwing = function(){
            getAnalyer("test/grids/analyzer-error.grid").analyzeGrid();
        }
        expect(throwing).to.throw();
        throwing = function(){
            getAnalyer("test/grids/analyzer-error2.grid").analyzeGrid();
        }
        expect(throwing).to.throw();
        throwing = function(){
            getAnalyer("test/grids/analyzer-error3.grid").analyzeGrid();
        }
        expect(throwing).to.throw();
    });
    test("Should analyze the loop-around grid", () => {
        let notThrowing = function(){
            getAnalyer("test/grids/loop-around.grid").analyzeGrid();
        }
        expect(notThrowing).to.not.throw();
    });
});