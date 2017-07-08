import {lexGridCell} from "../src/lexer";
import 'mocha'; 


describe("Lexer", () => {
    it("Should parse grid cells into tokens", () => {
        lexGridCell("test");
    });
});