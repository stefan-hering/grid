// mygenerator.js
let fs = require("fs");
let jison = require("jison");

function getParser(){
    let grammar = fs.readFileSync("src/parser/parser.jison", "utf8");
    let parser = new jison.Parser(grammar);
    return parser;
}

// generate source, ready to be written to disk
//var parserSource = parser.generate();

// you can also use the parser directly from memory

//parser.parse("adfe34bc e82a");
// returns true

//parser.parse("adfe34bc zxg");

export {getParser};