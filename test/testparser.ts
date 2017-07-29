import {getParser} from "../src/parser/parser";
import { suite, test, slow, timeout } from "mocha-typescript";


suite("Parse", () => {
    test("Should parse stuff", () => {
        let parser = getParser();
        let x = parser.parse("");
        //x = getParser().parse("i");
        //x = getParser().parse("i\ni = 3 left\n i = 5 right");
    });
});