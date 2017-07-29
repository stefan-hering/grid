import {Lexer as LexType} from "./lex";
import {Token, TokenType} from "./lextoken";
let Lexer = require("lex");

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
    new Rule(/(\/|\*|\-|\+)/,(result) => {
        return new Token(result,TokenType.MATH_OPERATOR);
    }),
    new Rule(/[a-zA-Z\_]{1}[a-zA-Z0-9\_\-]*/,(result) => {
        return new Token("VAR",TokenType.IDENTIFIER);
    }),
    new Rule(/\-?[0-9]+/,(result) => {
        return new Token("NUMBER",TokenType.NUMBER);
    }),
    new Rule(/[ \t\n]+/,(result) => {
        return new Token(null,TokenType.WHITESPACE);
    }),
    new Rule(/$/,(result) => {
        return new Token("EOF",TokenType.WHITESPACE);
    })
];


function lexGridCell(input : String) : Token[]{
    let tokens : Token[] = [];
    var l:LexType = new Lexer;
    for(let rule of rules){
        l.addRule(rule.regex, rule.matchFunction);
    }
    l.setInput(input);
    let token : Token = l.lex();
    while(token){
        tokens.push(token);
        token = l.lex();
    }
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
        return this.lexer.lex().token;
    }
}

export {lexGridCell, GridLexer};
