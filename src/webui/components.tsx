import * as React from "react";
import * as ReactDOM from "react-dom";
import {GridEditorSettings} from "./webui";

let ace = require('brace');
require('brace/theme/dreamweaver');

interface MenuProps extends GridEditorSettings{
    readonly onSettingsChange : any;
}

class GridPlayground extends React.Component<GridEditorSettings,any> {
    constructor(props:GridEditorSettings){
        super(props);
    }

    settingChanged = (event : any) => {
        this.state[event.target.name] = event.target.value;
    }

    render(){
        return (
        <div id="playground">
            <div className="container-fluid grid-menu" id="grid-menu">
                <Menu onSettingsChange={this.settingChanged} {...this.props} />
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-8 grid-editors" id="grid-editors">
                        <EditorGrid {...this.props} />
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
                    <button className="btn btn-primary grid-button" id="grid-resize" >Resize</button>
                </div>
            </div>
            <div className="grid-settings grid-settings--run">
                <div className="col">
                    <button className="btn btn-primary grid-button" id="grid-run" >Run</button>
                </div>
            </div>
        </div>);
    }
}

class EditorGrid extends React.Component<GridEditorSettings,any> {
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
      }
}



let initUI = (settings : GridEditorSettings) =>{
    ReactDOM.render(<GridPlayground {...settings} />, 
        document.querySelector("#content"));

    let editors = document.querySelectorAll(".editor");
    
    for(let i = 0; i < editors.length; i++){
        let editor = ace.edit(editors[i]);
        editor.setTheme("ace/theme/dreamweaver");
    }
}

export {initUI}