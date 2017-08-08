
class Grid {
    private grid : Cell[][];
}

enum CellType {
    EMPTY, REGULAR
}

interface Cell {
    readonly type: CellType;
}

class EmptyCell implements Cell {
    readonly type = CellType.EMPTY;
}

class RegularCell implements Cell {
    public readonly type = CellType.REGULAR;
    constructor(public readonly declarations : string[],
                public readonly directions : string[]){
    }
}

export {Grid,CellType, Cell,EmptyCell,RegularCell};