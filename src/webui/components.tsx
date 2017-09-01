import * as React from "react";
import * as ReactDOM from "react-dom";
import {GridEditorSettings} from "./webui";

let ace = require('brace');
require('brace/theme/dreamweaver');

interface MenuProps extends GridEditorSettings{
    readonly onSettingsChange : (event : any) => void;
    readonly triggerRedraw : () => void;
    readonly execute : () => void;
}

interface EditorGridProps extends GridEditorSettings{
    readonly setEditor : (row : number, column : number, editor : any) => void;
}

class GridPlayground extends React.Component<GridEditorSettings,any> {
    private currentSettings : {[key:string] : string} = {};
    private editors : any[][] = [];

    constructor(props:GridEditorSettings){
        super(props);
        this.state = JSON.parse(JSON.stringify(props));
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

    execute = () => {
        let grid : string[][] = [];
        for(let row = 0; row < this.editors.length; row++){
            for(let column = 0; column < this.editors[row].length; column++){
                if(this.editors[row][column] != null){
                    console.log(this.editors[row][column].getValue());
                } else {
                    console.log(row + ":" + column + " is null");
                }

            }
        }
    }

    render(){
        return (
        <div id="playground">
            <div className="container-fluid grid-menu" id="grid-menu">
                <Menu onSettingsChange={this.settingChanged} triggerRedraw={this.gridResize} execute={this.execute} {...this.props} />
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-8 grid-editors" id="grid-editors">
                        <EditorGrid setEditor={this.setEditor} {...this.state} />
                    </div>
                    <div className="col" id="grid-output">
                    <div className="grid-output"></div>
                    </div>
                </div>
            </div>
        </div>)
    }
}

class Menu extends React.Component<MenuProps,any> {
    render() {
      return (
        <div className="row">
            <div className="col">
                <div className="grid-settings grid-settings--size">
                    <input name="width" type="number" defaultValue={this.props.width} id="grid-width" onChange={this.props.onSettingsChange} />
                    x 
                    <input name="height" type="number" defaultValue={this.props.height} id="grid-height" onChange={this.props.onSettingsChange} />
                    <button className="btn btn-primary grid-button" id="grid-resize" onClick={this.props.triggerRedraw} >Resize</button>
                </div>
            </div>
            <div className="grid-settings grid-settings--run">
                <div className="col">
                    <button className="btn btn-primary grid-button" id="grid-run" onClick={this.props.execute} >Run</button>
                </div>
            </div>
        </div>);
    }
} 

class EditorGrid extends React.Component<EditorGridProps,any> {
    initEditors = () => {
        let editors = document.querySelectorAll(".editor");
        for(let i = 0; i < editors.length; i++){
            if(editors[i].getAttribute("initialized") != "true") {
                let editor = ace.edit(editors[i]);
                editor.setTheme("ace/theme/dreamweaver");
                this.props.setEditor(Math.floor(i / parseInt(this.props.width,10)),i % parseInt(this.props.width,10),editor);
                editors[i].setAttribute("initialized", "true");
            }
        }
    }

    componentDidUpdate() {
        this.initEditors();
    }

    componentDidMount() {
        this.initEditors();
    }

    renderEditor(key : number) {
        return(
        <div className="col" key={key}>
            <div className="editor"></div>
        </div>)
    };

    render() {
        let rows = [];
        for(let i = 0; i < parseInt(this.props.height,10); i++){
            let cells = [];
            for(let j = 0; j < parseInt(this.props.width,10); j++){
                cells[j] = this.renderEditor((1+i) * 1000 + j);
            }
            rows[i] = <div className="row" key={i}>{cells}</div>;
        }
        return <div className="container-fluid">{rows}</div>;
    };

}



let initUI = (settings : GridEditorSettings) =>{
    ReactDOM.render(<GridPlayground {...settings} />, 
        document.querySelector("#content"));
}

export {initUI}