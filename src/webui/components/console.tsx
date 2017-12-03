import * as React from "react";
import {IO} from "../../execution/runtime";

interface ConsoleProps {
    lines?: string[];
}

export class Console extends React.Component<ConsoleProps,ConsoleProps> implements IO {
    private lines: string[] = [];

    out = (s: string) => {
        if(this.lines.length > 1000){
            this.lines.shift();
        }
        this.lines.push("" + s);
        this.setState({
            lines: this.lines
        });
    }
    in = () => {
        return "";
    }

    kill = false;

    clear = () => {
        this.lines = [];
    }

    toggleKill = () => {
        this.kill = true;
        setTimeout(() => {
            this.kill = false;
        }, 100);
    }

    render(){
        let output: any;
        if(this.state != null) {
            output = this.state.lines.map((line, index) => {
                return <span key={index} className="console-line">{line}</span> 
            });
        } else {
            output = "Grid console";
        }
        return (
        <div className="console">
            <span className="grid-kill" onClick={this.toggleKill}>X</span>
            <div className="console-output">
                {output}
            </div>
        </div>);
    }
}
