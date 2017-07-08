import {Token} from "./lextoken";

/**
 * Helper interface to
 */
export interface Lexer {
    constructor(defunct? : (chr : String) => void) : Lexer;

    addRule(pattern : RegExp,
        action : (result :String) 
                    => any) : Lexer;
    setInput(input : String) : Lexer;
    lex() : Token;
    scan() : String[];
}
