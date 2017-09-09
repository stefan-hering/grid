import * as g from "../grid";


class Analyzer {
    private cells : g.Cell[][];
    constructor(private grid : g.Grid){
        this.cells = grid.grid;
    };
    public analyzeGrid(){
        // For every cell, check in every direction if params are ok
        for(let i = 0; i < this.cells.length; i ++){
            let row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                let cell = row[j];
                if(cell instanceof g.RegularCell){
                    this.checkCell(cell, new g.Position(i,j));
                }
            }
        }
    }

    private checkCell(cell: g.RegularCell, position: g.Position){
        for(let i = 0; i < cell.directions.length; i++){
            let direction : g.Direction = cell.directions[i];
            if(! g.isAngle(direction.direction)){
                continue;
            }
            // Directions without condition in any place but last means unreachable code
            if(i <  cell.directions.length - 1 && direction.condition == null){
                throw new AnalyzerError("Unreachable code at position: "
                    + position.cell + ":" + position.row + " for direction " + direction.direction, position);
            }
            this.matchParams(direction, position);
        }
    }

    private matchParams(direction : g.Direction, position : g.Position){
        if(! g.isAngle(direction.direction)){
            return;
        }

        let target = g.traverse(this.grid,direction.direction,position);

        // match the target grid input params with these params
        if(direction.params.length != target[0].declarations.length){
            throw new AnalyzerError("Not enough or too many parameters at position:" 
                + position.cell + ":" + position.row + " for direction " + direction.direction, position);
        }

        for(let i = 0; i < direction.params.length; i++){
            if(g.getTypeOfParam(direction.params[i]) 
                != g.getTypeOfParam(target[0].declarations[i])){
                throw new AnalyzerError("Parameters don't match target", direction);
            }
        }
    }
}

class AnalyzerError{
    public readonly name = "ParserError";
    constructor(public readonly message : string,public readonly source? : any){
    }
}

export {Analyzer};