import {Cell,EmptyCell,RegularCell} from "../grid";
let fs = require("fs");
let jison = require("jison");

let grammar = fs.readFileSync("src/parser/parser.jison", "utf8");

class Parser {
    private jisonParser = new jison.Parser(grammar);

    public parse(text : string): Cell{
        let cell :any = this.jisonParser.parse(text);
        if(cell === "empty cell"){
            return new EmptyCell;
        }
        let regCell : RegularCell;
        return;
    }

    public jisonResult(text: string): any {
        return this.jisonParser.parse(text);
    }
}

export {Parser};