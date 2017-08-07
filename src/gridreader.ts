import {Grid} from "grid";

export function readGrid(grid : String) : String[][] {
    let tillFirstAt : String = grid.split("@")[0]
    // The height is simply the number of linebreaks before the first @
    let height : number = tillFirstAt.match(/\n/g).length;
    // The width is the amount of characters between the @ and the previous linebreak
    let width : number = tillFirstAt.split("\n")[height].length;
    // The number of cells in one row of the grid
    let horizontalCells : number = Math.floor((grid.indexOf("\n") + 1) / (width + 1));

    let parsedGrid : String[][] = [];
    let lines : String[] = grid.split("\n");
    let row = 0;
    parsedGrid[0] = [];

    for(let i = 0; i < lines.length; i++){
        if(i % (height + 1) == height){
            // Each (height + 1)th row is a placeholder, so we just increase the row counter
            row++;
            parsedGrid[row] = [];
        } else {
            for(let j = 0; j < horizontalCells; j++){
                parsedGrid[row][j] = lines[i].slice(j * (width + 1),
                    j * (width + 1) + width) + "\n";
            }
        }
    }

    return parsedGrid;
}