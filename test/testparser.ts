import {getParser} from "../src/parser/parser";
import { suite, test, slow, timeout } from "mocha-typescript";


suite("Parse", () => {
    test("Should parse stuff", () => {
        let parser = getParser();
        let x = parser.parse("");
        x = parser.parse("i down(i)");
        x = parser.parse("i\ni = 3 left()\n i = 5 right()");
    });
});