
declare module "LexType" {

    export class Lexer {
        constructor(defunct? : (chr : String) => void);

        addRule(pattern : RegExp,
            action : (result :String) 
                     => any) : Lexer;
        setInput(input : String) : Lexer;
        lex() : void;
        scan() : String[];
    }
}