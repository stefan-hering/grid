import {lexGridCell} from "../src/lexer";
import { suite, test, slow, timeout } from "mocha-typescript";


suite("Lexer", () => {
    test("Should parse grid cells into tokens", () => {
        lexGridCell("test");
        console.log(lexGridCell("i\ni = 3 left\n i = 5 right"));
    });
});
