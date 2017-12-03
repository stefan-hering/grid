import * as React from "react";
import * as ReactDOM from "react-dom";

import {GridEditorSettings} from "../webui";

interface MenuProps extends GridEditorSettings {
    readonly onSettingsChange : (event : any) => void;
    readonly triggerRedraw : () => void;
    readonly save : (name : string) => void;
    readonly load : (name : string) => void;
    readonly execute : () => void;
}

enum FileOperation {
    SAVE,
    LOAD
}

interface FilesPopupProps {
    mode : FileOperation;
    save : (fileName: string) => void;
    load : (fileName: string) => void;
}

interface FilesPopupState {
    fileName : string;
}

class FilesPopup extends React.Component<FilesPopupProps,FilesPopupState> {
    constructor() {
        super();
        this.state ={fileName: JSON.parse(localStorage.getItem("savedGrids"))[0]};
    }

    do = () => {
        switch(this.props.mode) {
            case FileOperation.SAVE:
                this.props.save(this.state.fileName);
                break;
            case FileOperation.LOAD:
                this.props.load(this.state.fileName);
                break;
        }
    }

    setFileName = (fileName: string) => {
        this.setState({
            fileName : fileName
        });
    }

    handleInputChange = (event: any) => {
        this.setState({
            fileName : event.target.value
        });
    }

    render() {
        return (
        <div className="modal" role="dialog">
            <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Choose name</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="filesList">Existing grids</label>
                        <FilesList selectEvent={this.setFileName} htmlId="filesList" />
                        {this.props.mode == FileOperation.SAVE && 
                            <label htmlFor="saveAs">Save as</label>
                        }
                        {this.props.mode == FileOperation.SAVE && 
                            <input id="saveAs" className="form-control" value={this.state.fileName} onChange={this.handleInputChange} />
                        }
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={this.do} data-dismiss="modal">
                    {this.props.mode == FileOperation.SAVE ? "Save" : "Load"}
                    </button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
            </div>
        </div>);
    }
}

interface FilesListProps {
    htmlId : string;
    selectEvent : (selected: string) => void;
}

class FilesList extends React.Component<FilesListProps,any> {
    selectionChanged = (event: any) => {
        this.props.selectEvent(event.target.value);
    }

    render() {
        let savedGrids = JSON.parse(localStorage.getItem("savedGrids"));
        let options = savedGrids.map((grid: string) => 
            <option key={grid}>{grid}</option>
        );
        return (
            <select id={this.props.htmlId} className="form-control" onChange={this.selectionChanged}>
                {options}
            </select>
        );
    }
}

export class Menu extends React.Component<MenuProps,any> {
    constructor(props : MenuProps) {
        super(props);
        this.state = {
            localheight : this.props.height,
            localwidth : this.props.width,
            localstartX : this.props.startX,
            localstartY : this.props.startY,
            localparams : this.props.params
        }
    }
    loadClicked = () => {
        this.openPopup(FileOperation.LOAD);
    }

    saveClicked = () => {
        this.openPopup(FileOperation.SAVE);
    }

    openPopup = (mode : FileOperation) => {
        ReactDOM.render(
            <FilesPopup 
                mode={mode}
                save={this.props.save}
                load={this.props.load} />,
            document.getElementById("modal")
        );
        $("#modal").children(".modal").modal();
    }

    setValues = (values: GridEditorSettings) => {
        this.setState({
            localheight : values.height,
            localwidth : values.width,
            localstartX : values.startX,
            localstartY : values.startY,
            localparams : values.params
        });
    }

    onChange = (event : any) => {
        let newState: {[key:string]:string} = {};
        newState["local"+event.target.name] = event.target.value;
        this.setState(newState);
        this.props.onSettingsChange(event);
    }

    render() {
        return (
        <div className="row">
            <div className="col">
                <div className="grid-settings grid-settings--file">
                    <button className="btn btn-primary grid-button" id="grid-save" onClick={this.saveClicked} >Save</button>
                    <button className="btn btn-primary grid-button" id="grid-load" onClick={this.loadClicked} >Load</button>
                </div>
            </div>
            <div className="col">
                <div className="grid-settings grid-settings--size">
                    <label htmlFor="grid-width">Size</label>
                    <input name="width" type="number" value={this.state.localwidth} id="grid-width" onChange={this.onChange} />
                    x
                    <input name="height" type="number" value={this.state.localheight} id="grid-height" onChange={this.onChange} />
                    <button className="btn btn-primary grid-button" id="grid-resize" onClick={this.props.triggerRedraw} >Resize</button>
                </div>
            </div>
            <div className="col">
                <div className="grid-settings grid-settings--run">
                    <label htmlFor="grid-width">Start:</label>
                    <input name="startX" type="number" value={this.state.localstartX} id="grid-x" onChange={this.onChange} />
                    x 
                    <input name="startY" type="number" value={this.state.localstartY} id="grid-y" onChange={this.onChange} />
                    
                    <label htmlFor="grid-width">Params:</label>
                    <input name="params" type="text" value={this.state.localparams} id="grid-y" onChange={this.onChange} />
                    <button className="btn btn-primary grid-button" id="grid-run" onClick={this.props.execute} >Run</button>
                    <a className="grid-help" href="https://github.com/stefan-hering/grid" target="_blank">?</a>
                </div>
            </div>
        </div>);
    }
}