import {parseGridCell,parseGridCellToJison,ParserError} from "../src/parser/parser";
import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";


suite("Parse", () => {
    test("Should do the jison thing", () => {
        expect(parseGridCellToJison("")).to.equal("empty cell");
        expect(parseGridCellToJison("  \n\t\n   \n\t")).to.equal("empty cell");

        expect(parseGridCellToJison("i:number down(i)")).to.deep.equal({ 
            declarations: [{
                "type": "number",
                "varname" : "i"
            }],
            functions: [{
                type: "direction",
                direction: "down", 
                params: [{type:"var",identifier:"i"}] 
            }]
        });
        
        expect(parseGridCellToJison("i:number,j:number\ni = 3 left(i-1,j)\n i % 5 = 0 right(i-1,j)\nup(i,j)")).to.deep.equal({
            declarations: [{
                "type": "number",
                "varname" : "i"
            },{
                "type": "number",
                "varname" : "j"
            }],
            functions: [
            {
                type: "direction",
                condition: {
                    type: "comparison",
                    operator: "=", 
                    params: [{type:"var",identifier:"i"},3] 
                },
                direction: "left",
                params: [ {
                        type: "math",
                        operator:"-",
                        params: [{type:"var",identifier:"i"},1]
                    },
                    {type:"var",identifier:"j"}
                ],
            },
            {
                type: "direction",
                condition: {
                    type: "comparison",
                    operator: "=", 
                    params: [{
                        type: "math",
                        operator:"%",
                        params: [{type:"var",identifier:"i"},5]
                        },
                        0] 
                },
                direction: "right",
                params: [ {
                        type: "math",
                        operator:"-",
                        params: [{type:"var",identifier:"i"},1]
                    },
                    {type:"var",identifier:"j"}
                ]
            },
            {
                type: "direction",
                direction: "up",
                params:[{type:"var",identifier:"i"},{type:"var",identifier:"j"}]
            }]
        });
    });
    test("Should throw error on duplicate variables", () => {
        let notThrowing = function(){
            parseGridCell("i:number,j:number down(i)");
        }
        let throwing = function(){
            parseGridCell("i:number,i:number down(i)");
        }
        expect(throwing).to.throw();
        expect(notThrowing).to.not.throw();
    });
    test("Should throw error on undefined variables", () => {
        let notThrowing = function(){
            parseGridCell("i:number down(i)");
        }
        let throwing = function(){
            parseGridCell("i:number down(j)");
        }
        expect(throwing).to.throw();
        expect(notThrowing).to.not.throw();
    });
    
    test("Throw errors on type mismatches", () => {
        let notThrowing = function(){
            parseGridCell("i:number,j:number\ni = 3 left(i-1,j)\n i % 5 = 0 right(i-1,j)\nup(i,j)");
        }
        let throwing = function(){
            parseGridCell("i:number,j:string\ni = 3 left(i-1,j)\n i % 5 = 0 right(i-j,j)\nup(i,j)");
        }
        expect(throwing).to.throw();
        throwing = function(){
            parseGridCell("i:number,j:string\ni = 3 left(i-1,j)\n i % 5 = j right(i-1,j)\nup(i,j)");
        }
        expect(throwing).to.throw();
        expect(notThrowing).to.not.throw();
    });
});