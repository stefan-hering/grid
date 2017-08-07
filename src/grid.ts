
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
    readonly type = CellType.REGULAR;
}

export {Grid,CellType, Cell,EmptyCell,RegularCell};