import * as React from "react";
import * as ReactDOM from "react-dom";
import {GridEditorSettings} from "./webui";
import * as g from "../grid";
import {Menu} from "./components/menu";
import {EditorGrid} from "./components/editor";
import {Console} from "./components/console";
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
        for(let row = 0; row < grid.length; row++){
            for(let column = 0; column < grid[row].length; column++){
                this.editors[row][column].setValue(grid[row][column]);
            }
        }
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
        compileAndExecute(grid,
            new g.Position(parseInt(this.currentSettings["startX"],10),parseInt(this.currentSettings["startY"],10)), 
            this.console, eval(this.currentSettings["params"]));
    }

    render(){
        return (
        <div id="playground">
            <div className="container-fluid grid-menu" id="grid-menu">
                <Menu onSettingsChange={this.settingChanged} triggerRedraw={this.gridResize} 
                    execute={this.execute} {...this.props} />
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 grid-editors" id="grid-editors">
                        <EditorGrid setEditor={this.setEditor} {...this.state} />
                    </div>
                    <div className="col" id="grid-output">
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

let initUI = (settings : GridEditorSettings, initialValues? : string[][]) =>{
    let playground : any = ReactDOM.render(<GridPlayground {...settings} />, 
        document.querySelector("#content"));

    if(initialValues != null){
        playground.setValues(initialValues);
    }
}

export {initUI}
