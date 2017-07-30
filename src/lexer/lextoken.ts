
export enum TokenType{
    DIRECTION,
    IDENTIFIER,
    COMPARE_OPERATOR,
    MATH_OPERATOR,
    WHITESPACE,
    NUMBER,
    SEPARATOR,
    STRING,
    BRACKET,
    EOF
}

export class Token {
    constructor(public readonly token: String, 
                public readonly type:TokenType){
    }
}