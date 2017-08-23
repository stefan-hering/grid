import {Analyzer} from "../src/analysis/analyzer";
import {parseWholeGrid,ParserError} from "../src/parser/parser";
import {readGrid} from "../src/gridreader";
import {executeGrid} from "../src/execution/executor";
import * as g from "../src/grid";
import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
let fs = require("fs");

// TODO doesn't test anything yet
suite("Executor", () => {
    test("Should execute the fizzbuzz grid", () => {
        let testgrid : string = fs.readFileSync("test/grids/fizzbuzz.grid", "utf8");
        let parsedGrid : g.Grid = parseWholeGrid(readGrid(testgrid));
        new Analyzer(parsedGrid).analyzeGrid();
        executeGrid(parsedGrid, new g.Position(1,1), [1,100]);
    });
});