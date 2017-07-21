import {Lexer as LexType} from "./lex";
import {Token, TokenType} from "./lextoken";
var Lexer = require("lex");

function lexGridCell(input : String) : Token[]{
    let tokens = [];
    var l:LexType = new Lexer;
    l.addRule(/(left|right|up|down)/,(result) => {
        return new Token(result,TokenType.DIRECTION);
    });
    l.addRule(/(<|>|>=|<=|=)/,(result) => {
        return new Token(result,TokenType.COMPARE_OPERATOR);
    });
    l.addRule(/(\/|\*|\-|\+)/,(result) => {
        return new Token(result,TokenType.MATH_OPERATOR);
    });
    l.addRule(/[a-zA-Z0-9]+/,(result) => {
        return new Token(result,TokenType.VARIABLE);
    });
    l.addRule(/[ \t\n]+/,(result) => {
        return new Token("",TokenType.WHITESPACE);
    });
    l.setInput(input);
    let token : Token = l.lex();
    while(token){
        tokens.push(token);
        token = l.lex();
    }
    return tokens;
}

export {lexGridCell};
