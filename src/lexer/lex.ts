import {Token} from "./lextoken";

/**
 * Helper interface to wrap the lex npm package
 */
export interface Lexer {
    constructor(defunct? : (chr : String) => void) : Lexer;

    addRule(pattern : RegExp,
        action : (result :String) 
                    => Token) : Lexer;
    setInput(input : String) : Lexer;
    lex() : Token;
    scan() : String[];
}
