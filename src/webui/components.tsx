import * as React from "react";
import * as ReactDOM from "react-dom";
import {GridEditorSettings} from "./webui";

let ace = require('brace');
require('brace/theme/dreamweaver');


class Menu extends React.Component<GridEditorSettings,any> {
    public readonly type = 'Menu';
    public readonly key = 'Menu';

    render() {
      return (
        <div className="row">
            <div className="col">
                <div className="grid-settings grid-settings--size">
                    <input type="number" defaultValue={this.props.width} id="grid-width"/> 
                    x 
                    <input type="number" defaultValue={this.props.height} id="grid-height" /> 
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
    public readonly type = 'Menu';
    public readonly key = 'Menu';
    
    renderEditor() {
        return(
        <div className="col">
            <div className="editor"></div>
        </div>)
    };

    render() {
        let rows = [];
        for(let i = 0; i < parseInt(this.props.height,10); i++){
            let cells = [];
            for(let j = 0; j < parseInt(this.props.width,10); j++){
                cells[j] = this.renderEditor();
            }
            rows[i] = <div className="row">{cells}</div>;
        }
        return <div className="container-fluid">{rows}</div>;
      }
}



let initUI = (settings : GridEditorSettings) =>{
    ReactDOM.render(<Menu {...settings} />, 
        document.querySelector("#grid-menu"));
    ReactDOM.render(<EditorGrid {...settings} />, 
        document.querySelector("#grid-editors"));

    let editors = document.querySelectorAll(".editor");
    
    for(let i = 0; i < editors.length; i++){
        let editor = ace.edit(editors[i]);
        editor.setTheme("ace/theme/dreamweaver");
    }
}

export {initUI}