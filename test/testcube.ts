import {Cube} from "../src/stdlib/cube";
import * as g from "../src/grid";
import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";

suite("Cube", () => {
    test("Should be flip correctly", () => {
        let cube = new Cube;
        expect(cube.getBottom()).to.equal(1);
        cube.flip(g.Angle.DOWN);
        expect(cube.getBottom()).to.equal(5);
        cube.flip(g.Angle.DOWN);
        expect(cube.getBottom()).to.equal(6);
        cube.flip(g.Angle.LEFT);
        expect(cube.getBottom()).to.equal(4);
        cube.flip(g.Angle.DOWN);
        expect(cube.getBottom()).to.equal(2);
        cube.flip(g.Angle.RIGHT);
        expect(cube.getBottom()).to.equal(6);
        cube.flip(g.Angle.RIGHT);
        expect(cube.getBottom()).to.equal(5);
        cube.flip(g.Angle.RIGHT);
        expect(cube.getBottom()).to.equal(1);
        cube.flip(g.Angle.RIGHT);
        expect(cube.getBottom()).to.equal(2);
        cube.flip(g.Angle.UP);
        expect(cube.getBottom()).to.equal(4);
        cube.flip(g.Angle.LEFT);
        expect(cube.getBottom()).to.equal(1);
        cube.flip(g.Angle.UP);
        expect(cube.getBottom()).to.equal(5);
        cube.flip(g.Angle.LEFT);
        expect(cube.getBottom()).to.equal(3);
    });
    
    test("Should work like 6 stacks", () => {
        let cube = new Cube<number>();
        cube.insert(1);
        cube.flip(g.Angle.DOWN);
        cube.insert(2);
        cube.insert(3);
        cube.flip(g.Angle.DOWN);
        cube.insert(4);
        cube.flip(g.Angle.DOWN);
        cube.insert(5);
        cube.flip(g.Angle.DOWN);
        cube.flip(g.Angle.LEFT);
        cube.insert(6);
        cube.flip(g.Angle.RIGHT);
        cube.flip(g.Angle.RIGHT);
        cube.insert(7);
        cube.insert(8);
        cube.insert(9);
        cube.flip(g.Angle.LEFT);
        
        expect(cube.retrieve()).to.equal(1);
        cube.flip(g.Angle.DOWN);
        expect(cube.retrieve()).to.equal(3);
        expect(cube.retrieve()).to.equal(2);
        cube.flip(g.Angle.DOWN);
        expect(cube.retrieve()).to.equal(4);
        cube.flip(g.Angle.DOWN);
        expect(cube.retrieve()).to.equal(5);
        cube.flip(g.Angle.DOWN);
        cube.flip(g.Angle.RIGHT);
        expect(cube.retrieve()).to.equal(9);
        cube.flip(g.Angle.LEFT);
        cube.flip(g.Angle.LEFT);
        expect(cube.retrieve()).to.equal(6);
    });
    
    test("Should work like 3 queues", () => {
        let cube = new Cube<number>();
        cube.insert(1);
        cube.insert(2);
        cube.flip(g.Angle.DOWN);
        cube.insert(3);
        cube.insert(4);
        cube.flip(g.Angle.UP);
        cube.flip(g.Angle.LEFT);
        cube.insert(5);
        cube.insert(6);
        
        cube.flip(g.Angle.LEFT);
        expect(cube.retrieve()).to.equal(1);
        expect(cube.retrieve()).to.equal(2);
        cube.flip(g.Angle.LEFT);
        expect(cube.retrieve()).to.equal(5);
        expect(cube.retrieve()).to.equal(6);
        cube.flip(g.Angle.UP);
        expect(cube.retrieve()).to.equal(3);
        expect(cube.retrieve()).to.equal(4);
    });
});