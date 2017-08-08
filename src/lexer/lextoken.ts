
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
    TYPE_DECLARE,
    EOF
}

export class Token {
    constructor(public readonly token: string, 
                public readonly type:TokenType){
    }
}