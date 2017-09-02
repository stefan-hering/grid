import {Analyzer} from "../src/analysis/analyzer";
import {parseWholeGrid,ParserError} from "../src/parser/parser";
import {readGrid} from "../src/gridreader";
import {executeGrid, IO} from "../src/execution/runtime";
import * as g from "../src/grid";
import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
let fs = require("fs");

suite("Executor", () => {
    test("Should execute the fizzbuzz grid", () => {
        let testgrid : string = fs.readFileSync("test/grids/fizzbuzz.grid", "utf8");
        let parsedGrid : g.Grid = parseWholeGrid(readGrid(testgrid));
        new Analyzer(parsedGrid).analyzeGrid();
        let targetResult = [1,2,"Fizz",4,"Buzz","Fizz",7,8,"Fizz","Buzz",11,"Fizz",13,14,"FizzBuzz",16];
        let actualResult : g.Value[] = [];
        let io : IO = {
            in : () : string => {
                return "";
            },
            out : (o : g.Value) => {
                actualResult.push(o);
            }
        }
        executeGrid(parsedGrid, new g.Position(1,1),io,[1,16]);
        expect(targetResult).to.deep.equal(actualResult);
    });
});