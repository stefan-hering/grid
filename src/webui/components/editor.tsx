import * as React from "react";
import {GridEditorSettings} from "../webui";

let ace = require('brace');
require('brace/theme/dreamweaver');

interface EditorGridProps extends GridEditorSettings{
    readonly setEditor : (row : number, column : number, editor : any) => void;
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
    }

    componentDidMount() {
        this.initEditors();
    }

    renderEditor(key : number) {
        return (
        <div className="col" key={key}>
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
            rows[i] = <div className="row" key={i}>{cells}</div>;
        }
        return <div className="container-fluid">{rows}</div>;
    }
}
