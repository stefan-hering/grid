import {readGrid} from "../src/gridreader";
import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from 'chai';
let fs = require("fs");

suite("Reader", () => {
    test("Should read the individual cells of a grid", () => {
        let testgrid : string = fs.readFileSync("test/grids/fizzbuzz.grid", "utf8");
        let grid : string[][] = readGrid(testgrid);
        expect(grid.length).to.equal(3);
        expect(grid[0].length).to.equal(3);
    });
    test("Should read a minimal grid", () => {
        let testgrid : string = fs.readFileSync("test/grids/minimum.grid", "utf8");
        let grid : string[][] = readGrid(testgrid);
        expect(grid.length).to.equal(2);
        expect(grid[0].length).to.equal(2);
    });
    test("Should read the horizontal grid", () => {
        let testgrid : string = fs.readFileSync("test/grids/horizontal.grid", "utf8");
        let grid : string[][] = readGrid(testgrid);
        expect(grid.length).to.equal(2);
        expect(grid[0].length).to.equal(8);
    });
    test("Should read the vertical grid", () => {
        let testgrid : string = fs.readFileSync("test/grids/vertical.grid", "utf8");
        let grid : string[][] = readGrid(testgrid);
        expect(grid.length).to.equal(8);
        expect(grid[0].length).to.equal(2);
    });
});