import {Grid} from "grid";

export function readGrid(grid : String) : String[][] {
    let atIndex : number = grid.indexOf("@");
    // The height is simply the number of linebreaks before the first @
    let height : number = grid.split("@")[0].match("\n").length;
    // The width is the index of the first add minus the length of all the lines above it.
    let width : number = atIndex - (grid.indexOf("\n") + 1) * height;
    // The number of cells in one row of the grid
    let horizontalCells : number = (grid.indexOf("\n") + 1) / (width + 1);

    let parsedGrid : String[][] = [];
    let lines : String[] = grid.split("\n");
    let row = 0;

    for(let i = 0; i < lines.length; i++){
        if(i % (height + 1) == height){
            // Each (height + 1)th row is a placeholder, so we just increase the row counter
            row++;
        } else {
            for(let j = 0; j < horizontalCells; j++){
                parsedGrid[row][j] = lines[i].slice(j * (width + 1),
                    j * (width + 1) + width) + "\n";
            }
        }
    }

    return parsedGrid;
}