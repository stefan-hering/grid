import * as g from "../grid";
import * as jp from "./jison-parser";

class Parser {
    private jisonParser = new jp.Parser;
    private declarations : {[key:string]:g.Type};
    private directions : g.Direction[];

    private convertMathOperator(operator : string) : g.MathOperator {
        switch(operator){
            case "+":
                return g.MathOperator.PLUS;
            case "-":
                return g.MathOperator.MINUS;
            case "*":
                return g.MathOperator.TIMES;
            case "/":
                return g.MathOperator.DIVIDED_BY;
            case "%":
                return g.MathOperator.MODULO;
        }
        throw new ParserError("Unexpected operator",operator);
    }

    private convertMathExpression(mathExpression : any) : g.MathExpression{
        if(mathExpression.type !== "math"){
            throw new ParserError("Expected math, got " + mathExpression.type, mathExpression);
        }
        let left : g.Param = this.convertParam(mathExpression.params[0]);
        let right : g.Param = this.convertParam(mathExpression.params[1]);

        let type = g.getTypeOfParam(left);
        if(type != g.getTypeOfParam(right)){
            throw new ParserError("Type mismatch", mathExpression);
        }

        return new g.MathExpression(left,
            this.convertMathOperator(mathExpression.operator),
            right,
            g.Type.NUMBER);
    }

    private convertCondition(condition : any) : g.Condition {
        if(condition.type === "comparison"){
            let left : g.Param = this.convertParam(condition.params[0]);
            let right : g.Param = this.convertParam(condition.params[1]);
    
            if(g.getTypeOfParam(left) != g.getTypeOfParam(right)){
                throw new ParserError("Type mismatch", condition);
            }
            return new g.Comparison(left,condition.operator,right);
        } else if(condition.type == "exists") {
            return new g.ExistsCheck(condition.identifier);
        }
        throw new ParserError("Expected comparison, got " + condition.type, condition);
    }

    private convertConcatenation(concatenation : any) : g.Concatenation{
        if(concatenation.type !== "concat"){
            throw new ParserError("Expected concat, got " + concatenation.type, concatenation);
        }
        let left : g.Param = this.convertParam(concatenation.params[0]);
        let right : g.Param = this.convertParam(concatenation.params[1]);

        return new g.Concatenation(left,right);
    }

    private convertParams(params : any) : g.Param[]{
        let parsedParams : g.Param[] = [];
        if(typeof params === "undefined"){
            return parsedParams;
        }
        for(let param of params){
            parsedParams.push(this.convertParam(param));
        }
        return parsedParams;
    }

    private convertParam(param : any) : g.Param {
        if(typeof param === "number" || typeof param === "string"){
            return param;
        }
        if(param.type === "var"){
            if(param.identifier in this.declarations){
                if(param.push != null) {
                    return new g.Var(param.identifier,this.declarations[param.identifier],this.convertParam(param.push));
                } else {
                    return new g.Var(param.identifier,this.declarations[param.identifier]);
                }
            } else {
                throw new ParserError("Unexpected identifier " + param.identifier);
            }
        }
        if(param.type === "math"){
            return this.convertMathExpression(param);
        }
        if(param.type === "concat"){
            return this.convertConcatenation(param);
        }
        throw new ParserError("Could not convert param",param);
    }

    private convertDirection(direction : any) : g.Direction {
        let directionFunction : g.GridFunction;
        switch(direction.direction){
            case "up":
                directionFunction = g.Angle.UP;
                break;
            case "down":
                directionFunction = g.Angle.DOWN;
                break;
            case "left":
                directionFunction = g.Angle.LEFT;
                break;
            case "right":
                directionFunction = g.Angle.RIGHT;
                break;
            default:
                directionFunction = direction.direction;
        }

        if(direction.condition != undefined){
            return new g.Direction(directionFunction,
                this.convertParams(direction.params),
                this.convertCondition(direction.condition)
            );
        } else {
            return new g.Direction(directionFunction,
                this.convertParams(direction.params)
            );
        }
    }

    private convertType(type : string): g.Type {
        switch(type){
            case "number":
                return g.Type.NUMBER;
            case "string":
                return g.Type.STRING;
            case "Cube":
                return g.Type.CUBE;
        }
        throw new ParserError("Unknown type", type);
    }

    /**
     * Parses one cell into a more usable [[Cell]] object.
     * Throws erros on duplicate declarations and undeclared variables.
     * @param text 
     */
    public parse(text : string): g.Cell{
        let cell :any = this.jisonParser.parse(text);
        if(cell === "empty cell"){
            return new g.EmptyCell;
        }
        this.declarations = {};
        this.directions = [];
        let parsedDeclarations : g.Declaration[] = [];

        for(let declaration of cell.declarations){
            if(declaration.varname in this.declarations){
                throw new ParserError(declaration.varname + " is already defined");
            }
            this.declarations[declaration.varname] = this.convertType(declaration.type);

            if(declaration.pop != null){
                this.declarations[declaration.pop] = this.convertType(declaration.generic);
            }
            let type : g.Type;

            parsedDeclarations.push(
                new g.Declaration(declaration.varname, 
                    this.convertType(declaration.type),
                    declaration.pop)
            );
        }

        for(let direction of cell.functions){
            this.directions.push(
                this.convertDirection(direction)
            );
        }

        return new g.RegularCell(parsedDeclarations, this.directions);
    }

    public jisonResult(text: string): any {
        return this.jisonParser.parse(text);
    }
}

class ParserError implements Error{
    public readonly name = "ParserError";
    constructor(public readonly message : string,public readonly source? : any){
    }
}

function parseWholeGrid(texts : string[][]) : g.Grid{
    let cells : g.Cell[][] = [];
    let parser : Parser = new Parser();
    for(let rowIndex = 0; rowIndex < texts.length; rowIndex++) {
        let row = texts[rowIndex];
        let parsedCells : g.Cell[] = [];
        for(let columnIndex = 0; columnIndex < row.length; columnIndex++) {
            try {
                parsedCells.push(parser.parse(row[columnIndex]));
            } catch(e) {
                e.message = e.message + " in cell " + (rowIndex + 1) + ":" + (columnIndex + 1);
                throw e;
            }
        }
        cells.push(parsedCells);
    }
    return new g.Grid(cells);
}

function parseGridCell(text : string) : g.Cell {
    return new Parser().parse(text);
}

function parseGridCellToJison(text : string) {
    return new Parser().jisonResult(text);
}

export {Parser,parseGridCell,parseGridCellToJison,parseWholeGrid,ParserError};