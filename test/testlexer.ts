import {lexGridCell} from "../src/lexer/lexer";
import { suite, test, slow, timeout } from "mocha-typescript";


suite("Lexer", () => {
    test("Should parse grid cells into tokens", () => {
        lexGridCell("i\ni = 3 left(i)\n i = 5 right(i)");
        lexGridCell("i,j\ni=0 end()\ni % 3 = 0 left(i,j)\n i % 5 = 0 right(i,j)");
    });
});
