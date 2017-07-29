import {getParser} from "../src/parser/parser";
import { suite, test, slow, timeout } from "mocha-typescript";


suite("Parse", () => {
    test("Should parse stuff", () => {
        var x = getParser().parse("i\ni = 3 left\n i = 5 right");
        console.log(x);
    });
});