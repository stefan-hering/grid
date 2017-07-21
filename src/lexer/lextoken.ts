
export enum TokenType{
    DIRECTION,
    VARIABLE,
    COMPARE_OPERATOR,
    MATH_OPERATOR,
    WHITESPACE
}

export class Token {
    constructor(public readonly token: String, 
                public readonly type:TokenType){
    }
}