import * as React from "react";
import {GridEditorSettings} from "../webui";

let ace = require('brace');
require('brace/theme/dreamweaver');

interface EditorGridProps {
    readonly setEditor : (row : number, column : number, editor : any) => void;
    readonly width : string;
    readonly height : string;
}

export class EditorGrid extends React.Component<EditorGridProps,any> {
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
        // Need to trigger a resize so editors can redraw properly with their new dimensions
        window.dispatchEvent(new Event('resize'));
    }

    componentDidMount() {
        this.initEditors();
    }

    renderEditor(key : number) {
        return (
        <div className="col editor-container" key={key}>
            <div className="editor"></div>
        </div>);
    }

    render() {
        let rows = [];
        for(let i = 0; i < parseInt(this.props.height,10); i++){
            let cells = [];
            for(let j = 0; j < parseInt(this.props.width,10); j++){
                cells[j] = this.renderEditor((1+i) * 1000 + j);
            }
            rows[i] = <div className="row editor-grid-row" key={i}>{cells}</div>;
        }
        return <div className="container-fluid editor-grid">{rows}</div>;
    }
}
