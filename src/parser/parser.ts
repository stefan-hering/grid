// mygenerator.js
let fs = require("fs");
let jison = require("jison");

function getParser(){
    let grammar = fs.readFileSync("src/parser/parser.jison", "utf8");
    let parser = new jison.Parser(grammar);
    return parser;
}

export {getParser};