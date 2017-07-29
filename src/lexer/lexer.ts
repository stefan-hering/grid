import {Lexer as LexType} from "./lex";
import {Token, TokenType} from "./lextoken";
let Lexer = require("lex");

const EOF = "EOF";

class Rule {
    constructor(public readonly regex: RegExp, 
        public readonly matchFunction:(result :String)  => Token){
    }
}

let rules : Rule[] = [
    new Rule(/(left|right|up|down|end|print)/,(result) => {
        return new Token(result,TokenType.DIRECTION);
    }),
    new Rule(/(<|>|>=|<=|=)/,(result) => {
        return new Token(result,TokenType.COMPARE_OPERATOR);
    }),
    new Rule(/\,/,(result) => {
        return new Token(result,TokenType.SEPARATOR);
    }),
    new Rule(/(\/|\*|\-|\+)/,(result) => {
        return new Token(result,TokenType.MATH_OPERATOR);
    }),
    new Rule(/[a-zA-Z\_]{1}[a-zA-Z0-9\_\-]*/,(result) => {
        return new Token(result,TokenType.IDENTIFIER);
    }),
    new Rule(/\-?[0-9]+/,(result) => {
        return new Token(result,TokenType.NUMBER);
    }),
    new Rule(/\"[^"^\n]*\"/,(result) => {
        return new Token(result,TokenType.STRING);
    }),
    new Rule(/\s+/,(result) => {
        return new Token("",TokenType.WHITESPACE);
    })
];


function lexGridCell(input : String) : String[]{
    let tokens : String[] = [];
    let l:GridLexer = new GridLexer;
    l.setInput(input);
    let token : String = l.lex();
    while(token !== EOF){
        tokens.push(token);
        token = l.lex();
    }
    tokens.push(token);
    return tokens;
}

/**
 * A lexer that parses the language into its tokens and returns them as string.
 */
class GridLexer {
    private lexer : LexType;
    constructor() {
        this.lexer = new Lexer;
        for(let rule of rules){
            this.lexer.addRule(rule.regex, rule.matchFunction);
        }
    }
    public setInput(input : String): void {
        this.lexer.setInput(input);
    }
    public lex(): String {
        let token = this.lexer.lex();
        if(token == null){
            return EOF;
        }
        if(token.type == TokenType.WHITESPACE){
            return this.lex();
        } else {
            return token.token;
        }
    }
}

export {lexGridCell, GridLexer};
