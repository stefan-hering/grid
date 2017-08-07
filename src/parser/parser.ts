import {Cell} from "../grid";
let fs = require("fs");
let jison = require("jison");

let grammar = fs.readFileSync("src/parser/parser.jison", "utf8");

class Parser {
    private jisonParser = new jison.Parser(grammar);

    public parse(cell : string): Cell{
        return this.jisonParser.parse(cell);
    }
}

export {Parser};