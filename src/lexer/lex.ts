import {Token} from "./lextoken";

/**
 * Helper interface to wrap the lex npm package
 */
export interface Lexer {
    constructor(defunct? : (chr : string) => void) : Lexer;

    addRule(pattern : RegExp,
        action : (result :string) 
                    => Token) : Lexer;
    setInput(input : string) : Lexer;
    lex() : Token;
    scan() : string[];
}
