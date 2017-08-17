import {lexGridCell} from "../src/lexer/lexer";
import { suite, test, slow, timeout } from "mocha-typescript";
import {readGrid} from "../src/gridreader";
import { expect } from 'chai';
let fs = require("fs");

suite("Lexer", () => {
    test("Should parse grid cells into tokens", () => {
        lexGridCell("i:number\ni = 3 left(i)\n i = 5 right(i)");
        lexGridCell("i:number,j:number\ni=0 end()\ni % 3 = 0 left(i,j)\n i % 5 = 0 right(i,j,\"test\")");
        let testgrid : string = fs.readFileSync("test/grids/fizzbuzz.grid", "utf8");
        let grid : string[][] = readGrid(testgrid);
        for(let row of grid){
            for(let cell of row){
                lexGridCell(cell);
            }
        }
    });
});
