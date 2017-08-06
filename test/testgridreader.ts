import {readGrid} from "../src/gridreader";
import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from 'chai';
let fs = require("fs");

suite("Reader", () => {
    test("Should read the individual cells of a grid", () => {
        let testgrid : String = fs.readFileSync("test/grids/test.grid", "utf8");
        let grid : String[][] = readGrid(testgrid);
        expect(grid.length).to.equal(3);
        expect(grid[0].length).to.equal(3);
    });
});