import * as React from "react";
import {GridEditorSettings} from "../webui";

interface MenuProps extends GridEditorSettings {
    readonly onSettingsChange : (event : any) => void;
    readonly triggerRedraw : () => void;
    readonly execute : () => void;
}
 
export class Menu extends React.Component<MenuProps,any> {
    render() {
        return (
        <div className="row">
            <div className="col">
                <div className="grid-settings grid-settings--size">
                    <label htmlFor="grid-width">Size</label>
                    <input name="width" type="number" defaultValue={this.props.width} id="grid-width" onChange={this.props.onSettingsChange} />
                    x 
                    <input name="height" type="number" defaultValue={this.props.height} id="grid-height" onChange={this.props.onSettingsChange} />
                    <button className="btn btn-primary grid-button" id="grid-resize" onClick={this.props.triggerRedraw} >Resize</button>
                </div>
            </div>
            <div className="col">
                <div className="grid-settings grid-settings--run">
                    <label htmlFor="grid-width">Start:</label>
                    <input name="startX" type="number" defaultValue={this.props.startX} id="grid-x" onChange={this.props.onSettingsChange} />
                    x 
                    <input name="startY" type="number" defaultValue={this.props.startY} id="grid-y" onChange={this.props.onSettingsChange} />
                    
                    <label htmlFor="grid-width">Params:</label>
                    <input name="params" type="text" defaultValue={this.props.params} id="grid-y" onChange={this.props.onSettingsChange} />
                    <button className="btn btn-primary grid-button" id="grid-run" onClick={this.props.execute} >Run</button>
                </div>
            </div>
        </div>);
    }
}