import * as g from "../grid";

interface Heap {[key:string]:any};

/**
 * This replaces code generation 
 */
class CellExecutor {
    // "Heap", just a map of what's in the context
    private heap : Heap = {};

    private handleParam = (param : any): any => {
        if(g.isMathExpression(param)){
            return this.evaluateMathExpression(param);
        } else if(g.isVar(param)){
            return this.heap[param.identifier];
        } else {
            return param;
        }
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
                            console.log(this.evaluateParams(direction.params));
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

let executeGrid = (grid : g.Grid, start : g.Position, params? : g.Value[]): void => {
    let cell : g.Cell = grid.cellAt(start);
    if(cell.type !== g.CellType.REGULAR){
        throw new RuntimeError("Trying to start at empty cell");
    }
    let current : g.Position = start;
    let currentParams = params;

    while(true){
        try {
            let executor = new CellExecutor;
            let executionResult = executor.executeCell(cell,currentParams);
            currentParams = executionResult[1];
            let traverseResult =  g.traverse(grid, executionResult[0], current);
            current = traverseResult[1];
            cell = traverseResult[0];
        } catch(e){
            break;
        }
    }
}

export {executeGrid};