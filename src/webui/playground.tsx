import * as React from "react";
import * as ReactDOM from "react-dom";
import {GridEditorSettings,SerializableGrid} from "./webui";
import * as g from "../grid";
import {Menu} from "./components/menu";
import {EditorGrid} from "./components/editor";
import {Console} from "./components/console";
import {Cube}  from "../stdlib/cube";
import {compileAndExecute,ConsoleIO} from "../execution/util";

class GridPlayground extends React.Component<GridEditorSettings,any> {
    private currentSettings: {[key:string] : string} = {};
    private editors: any[][] = [];
    private console: Console;

    constructor(props:GridEditorSettings){
        super(props);
        this.state = JSON.parse(JSON.stringify(props));
        this.currentSettings = JSON.parse(JSON.stringify(props));
    }

    settingChanged = (event : any) => {
        this.currentSettings[event.target.name] = event.target.value;
    }

    setEditor = (row : number, column : number, editor : any) => {
        if(this.editors[row] == null){
            this.editors[row] = [];
        }
        this.editors[row][column] = editor;
    }

    gridResize = () => {
        this.setState(this.currentSettings);
    }

    setValues = (grid : string[][]) => {
        // First clear every editor
        for(let row = 0; row < this.state.height; row++){
            for(let column = 0; column < this.state.width; column++){
                this.editors[row][column].setValue("");
            }
        }
        this.currentSettings["width"] = grid[0].length.toString();
        this.currentSettings["height"] = grid.length.toString();
        (this.refs.menu as any).setValues(this.currentSettings);
        this.gridResize();
        for(let row = 0; row < grid.length; row++){
            for(let column = 0; column < grid[row].length; column++){
                this.editors[row][column].setValue(grid[row][column]);
            }
        }
    }

    save = (fileName: string) => {
        let cells : string[][] = [];
        for(let editorRow of this.editors) {
            let row : string[] = [];
            for(let editor of editorRow) {
                row.push(editor.getValue());
            }
            cells.push(row);
        }
        let gridToSave: SerializableGrid = {
            cells : cells,
            settings : this.currentSettings as any
        }
        localStorage.setItem("grid-"+fileName, JSON.stringify(gridToSave));
        let savedGrids = JSON.parse(localStorage.getItem("savedGrids"));
        savedGrids.push(fileName);
        localStorage.setItem("savedGrids",JSON.stringify(savedGrids));
    }

    load = (fileName: string) => {
        let loadedGrid = JSON.parse(localStorage.getItem("grid-" + fileName));
        this.currentSettings = loadedGrid.settings;
        this.gridResize();
        this.setValues(loadedGrid.cells);
    }

    execute = () => {
        let grid : string[][] = [];
        for(let row = 0; row < this.editors.length; row++){
            for(let column = 0; column < this.editors[row].length; column++){
                if(column == 0){
                    grid[row] = [];
                }
                grid[row][column] = this.editors[row][column].getValue();
            }
        }
        this.console.clear();
        try {
            compileAndExecute(grid,
                new g.Position(parseInt(this.currentSettings["startX"],10),
                    parseInt(this.currentSettings["startY"],10)), 
                this.console,
                eval(this.currentSettings["params"]));
        } catch(e) {
            this.console.out(e.message);
            if(e.source != null) {
                if(e.source.direction != null) {
                    let message;
                    switch(e.source.direction) {
                        case g.Angle.UP:
                            message = "up";
                            break;
                        case g.Angle.DOWN:
                            message = "down";
                            break;
                        case g.Angle.LEFT:
                            message = "left";
                            break;
                        case g.Angle.RIGHT:
                            message = "right";
                            break;
                        default:
                            message = e.source.direction;
                    }
                    this.console.out("At direction: " + message);
                } else if(typeof e.source === "string") {
                    this.console.out(e.source);                    
                }
            }

        }
    }

    render(){
        return (
        <div id="playground">
            <div className="container-fluid grid-menu" id="grid-menu">
                <Menu ref="menu"
                    onSettingsChange={this.settingChanged} 
                    triggerRedraw={this.gridResize} 
                    execute={this.execute} 
                    save={this.save}
                    load={this.load}
                    height={this.state.height}
                    width={this.state.width}
                    startX={this.state.startX}
                    startY={this.state.startY}
                    params={this.state.params} />
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-lg-9 grid-editors" id="grid-editors">
                        <EditorGrid setEditor={this.setEditor} 
                            width={this.state.width} 
                            height={this.state.height} />
                    </div>
                    <div className="col-12 col-lg-3" id="grid-output">
                        <Console 
                            ref={(c) => {
                                this.console = c;
                            }}/>
                    </div>
                </div>
            </div>
        </div>)
    }
}

let initUI = (grid: SerializableGrid) =>{
    let playground : any = ReactDOM.render(<GridPlayground {...grid.settings} />, 
        document.querySelector("#content"));

    if(grid.cells != null){
        playground.setValues(grid.cells);
    }
}

export {initUI}
