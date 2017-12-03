import * as g from "../grid";
import {Cube} from "../stdlib/cube";

interface Heap {[key:string]:any};

/**
 * This replaces code generation 
 */
class CellExecutor {
    // "Heap", just a map of what's in the context
    private heap : Heap = {};

    constructor(private readonly io : IO){
    }

    private handleParam = (param : any): any => {
        if(g.isConcatenation(param)){
            return this.evaluateConcatenation(param);
        } else if(g.isMathExpression(param)){
            return this.evaluateMathExpression(param);
        } else if(g.isVar(param)){
            if(param.pushValue != null){
                this.heap[param.identifier].insert(this.handleParam(param.pushValue));
            }
            return this.heap[param.identifier];
        } else {
            return param;
        }
    }

    private evaluateConcatenation = (concatenation : g.Concatenation): g.Value => {
        let left = this.handleParam(concatenation.left);
        let right = this.handleParam(concatenation.right);
        return "" + left + right;
    }

    private evaluateMathExpression = (mathExpression : g.MathExpression): g.Value => {
        let left = this.handleParam(mathExpression.left);
        let right = this.handleParam(mathExpression.right);

        switch(mathExpression.operator){
            case g.MathOperator.PLUS:
                return left + right;
            case g.MathOperator.MINUS:
                return left - right;
            case g.MathOperator.TIMES:
                return left * right;
            case g.MathOperator.DIVIDED_BY:
                return left / right;
            case g.MathOperator.MODULO:
                return left % right;
        }
    }

    private evaluateCondition = (condition : g.Condition): boolean => {
        if(condition == null){
            return true;
        }
        if(g.isComparison(condition)){
            let left = this.handleParam(condition.left);
            let right = this.handleParam(condition.right);

            switch(condition.operator){
                case "=":
                    return left === right;
                case "<":
                    return left < right;
                case ">":
                    return left > right;
                case ">=":
                    return left >= right;
                case "<=":
                    return left <= right;
            }
        } else {
            return this.heap[condition.identifier] != null;
        }
    }

    private evaluateParams = (params : g.Param[]) : g.Value[] => {
        let values : g.Value[] = [];
        for(let i = 0; i < params.length; i++){
            values[i] = this.handleParam(params[i]);
        }
        return values;
    }
    
    executeCell = (cell : g.RegularCell, params? : g.Value[]): [g.Angle, g.Value[]] => {
        if(params){
            for(let i = 0; i < params.length; i++){
                this.heap[cell.declarations[i].identifier] = params[i];
                if(cell.declarations[i].popIdentifier !== "") {
                    this.heap[cell.declarations[i].popIdentifier] = (<Cube<any>>params[i]).retrieve();
                }
            }
        }
        for(let direction of cell.directions){
            if(this.evaluateCondition(direction.condition)){
                let angle = direction.direction;
                if(g.isAngle(direction.direction)){
                    return [direction.direction, this.evaluateParams(direction.params)];
                } else {
                    switch(direction.direction){
                        case "print":
                            this.io.out(this.evaluateParams(direction.params)[0]);
                            break;
                        // Dumb way of just ending execution
                        case "end":
                            throw new EndError;
                    }
                }
            }
        }
        throw new EndError;
    }
}

class RuntimeError extends Error{}


class EndError extends RuntimeError{
    public readonly type = "exit";
}

interface IO {
    out : (o:g.Value) => void;
    in : () => string;
    kill : boolean;
}


let executeGrid = async (grid : g.Grid, start : g.Position, io : IO, params? : g.Value[], runAsync : boolean = false): Promise<void>  => {
    let cell : g.Cell = grid.cellAt(start);
    if(cell.type !== g.CellType.REGULAR){
        throw new RuntimeError("Trying to start at empty cell");
    }
    let current : g.Position = start;
    let currentParams = params;

    if(cell.declarations != null) {
        for(let i = 0; i < cell.declarations.length; i++){  
            if(cell.declarations[i].type != typeof params[i]) {
                if (cell.declarations[i].type !== "cube") {
                    throw new RuntimeError("Parameter mismatch");
                }
            }
        }
    }  

    while(true){
        try {
            if(io.kill){
                break;
            }
            // Very necessary to not crash the browser
            if(runAsync) {
                await new Promise(_ => setTimeout(_, 1));
            }
            let executor = new CellExecutor(io);
            let executionResult = executor.executeCell(cell,currentParams);
            currentParams = executionResult[1];
            for(let param of currentParams){
                if(param instanceof Cube){
                    param.flip(executionResult[0]);
                }
            }
            let traverseResult =  g.traverse(grid, executionResult[0], current);
            current = traverseResult[1];
            cell = traverseResult[0];
        } catch(e){
            if(e.type !== "exit") {
                console.log(e);
            }
            break;
        }
    }
}

export {executeGrid, IO, RuntimeError};