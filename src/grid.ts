
class Grid {
    constructor(public readonly grid : Cell[][]){};

    public cellAt = (p : Position) : Cell => {
        return this.grid[p.row][p.cell];
    }
}

enum CellType {
    EMPTY, REGULAR
}

enum Type {
    NUMBER, STRING, CUBE
}

enum MathOperator {
    PLUS, MINUS, TIMES, DIVIDED_BY, MODULO
}

enum Angle {
    UP, LEFT, DOWN, RIGHT
}

type GridFunction = Angle | string;

type Cell = EmptyCell | RegularCell;

class EmptyCell {
    public readonly type = CellType.EMPTY;
    constructor(){};
}

class RegularCell {
    public readonly type = CellType.REGULAR;
    constructor(public readonly declarations : ReadonlyArray<Declaration>,
        public readonly directions : ReadonlyArray<Direction>){}
}

class MathExpression {
    constructor(public readonly left : Param,
        public readonly operator : MathOperator,
        public readonly right : Param,
        public readonly returnType : Type){}
}

class Concatenation {
    public readonly returnType = Type.STRING;
    constructor(public readonly left : Param,
    public readonly right : Param){}
}

class Var {
    constructor(public readonly identifier : string,
        public readonly type : Type,
        public readonly pushValue? : Param){}
}

class Declaration {
    constructor(public readonly identifier: string,
        public readonly type : Type,
        public readonly popIdentifier : string = ""){}
}

type Value = number | string | Collection;

type Param = MathExpression | Concatenation | Var | Value;

type Condition = Comparison | ExistsCheck;

class Comparison {
    constructor(public readonly left : Param,
        public readonly operator : string,
        public readonly right : Param){}
}

class ExistsCheck {
    constructor(public readonly identifier : string){}
}

class Direction {
    constructor(public readonly direction : GridFunction,
        public readonly params : Param[],
        public readonly condition? : Condition){}
}

class Position {
    constructor(public readonly row: number,
        public readonly cell: number){};
}

interface Collection {}


/**
 * Utility function to find the next cell to be executed
 * @param g 
 * @param d 
 * @param p 
 */
let traverse = (g:Grid,d:Angle,p:Position): [RegularCell,Position] => {
    let cell : Cell = new EmptyCell;
    let position : Position = p;
    while(cell instanceof EmptyCell){
        // Advance position
        switch(d){
            case Angle.UP:
                if(position.row === 0){
                    position = new Position(g.grid.length - 1, position.cell);
                } else {
                    position = new Position(position.row - 1, position.cell);
                }
                break;
            case Angle.DOWN:
                position = new Position((position.row + 1) % g.grid.length, position.cell);
                break;
            case Angle.LEFT:
                if(position.cell === 0){
                    position = new Position(position.row, g.grid[0].length - 1);
                } else {
                    position = new Position(position.row, position.cell - 1);
                }
                break;
            case Angle.RIGHT:
                position = new Position(position.row, (position.cell + 1) % (g.grid[0].length));
                break;
        }
        cell = g.cellAt(position);
    }
    return [cell,position];
}

// Typeguards for Grid classes
function isMathExpression(mathExpression : Param): mathExpression is MathExpression {
    return (<MathExpression>mathExpression).left !== undefined;
}
function isVar(variable : Param) : variable is Var{
    return (<Var>variable).type !== undefined;
}
function isAngle(direction : GridFunction) : direction is Angle{
    return ! (typeof direction === "string");
}
function isComparison(condition : Condition) : condition is Comparison{
    return (typeof (<Comparison>condition).operator === "string");
}
function isConcatenation(concatenation : Param): concatenation is Concatenation {
    return (<Concatenation>concatenation).returnType === Type.STRING;
}


let getTypeOfParam = (param : Param): Type =>{
    if(isMathExpression(param)){
        return param.returnType;
    }
    if(isVar(param)){
        return param.type;
    }
    if(typeof param === "string"){
        return Type.STRING;
    }
    if(typeof param === "number"){
        return Type.NUMBER;
    }
}

export {Angle,CellType,Cell,Collection,Comparison,Condition,Concatenation,Declaration,Direction,EmptyCell,ExistsCheck,Grid,GridFunction,MathExpression,MathOperator,Param,Position,RegularCell,Type,Value,Var};
export {isAngle,isComparison,isConcatenation,isMathExpression,isVar,traverse,getTypeOfParam};
