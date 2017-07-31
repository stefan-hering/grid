import {getParser} from "../src/parser/parser";
import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from 'chai';


suite("Parse", () => {
    test("Should parse stuff", () => {
        let parser = getParser();
        let x = parser.parse("");
        expect(parser.parse("i down(i)")).to.be.true;
        x = parser.parse("i\ni = 3 left()\n i = 5 right()");
    });
});