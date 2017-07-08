import {Lexer as LexType} from "LexType";
var Lexer = require("lex");



enum TokenType{
    DIRECTION,
    VARIABLE
}

class Token {
    constructor(public readonly token: String, 
                public readonly type:TokenType){
    }
}

function lexGridCell(input : String) : void{
    var l:LexType = new Lexer;
    l.addRule(/[a-zA-Z0-9]*/,(result) => {
        return new Token(result,TokenType.VARIABLE);
    });
    l.setInput(input);
    l.lex();
}

export {Token,TokenType,lexGridCell};
