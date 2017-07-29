// mygenerator.js
import {GridLexer} from "../lexer/lexer";
var Parser = require("jison").Parser;

var grammar = {
    "operators": [
        ["left", "+", "-"],
        ["left", "*", "/"]
    ],
    "bnf": {
        "expressions" :[[ "e EOF",
                         "return" ]],
        "e" : [["",""

        ]],
        "me" : [["e + e", "$$ = $1 + $3"],
            ["e - e", "$$ = $1 - $3"],
            ["e * e", "$$ = $1 * $3"],
            ["e / e", "$$ = $1 / $3"],
            [ "- e",     "$$ = -$2;", {"prec": "UMINUS"} ],
            [ "( e )",   "$$ = $2;" ],
            [ "NUMBER",  "$$ = Number(yytext);" ],
        ]
    }
};

function getParser(){
    var parser = new Parser(grammar);
    parser.lexer = new GridLexer;
    return parser;
}

// generate source, ready to be written to disk
//var parserSource = parser.generate();

// you can also use the parser directly from memory

//parser.parse("adfe34bc e82a");
// returns true

//parser.parse("adfe34bc zxg");

export {getParser};