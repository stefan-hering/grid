import {Parser} from "../src/parser/parser";
import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from 'chai';


suite("Parse", () => {
    test("Should parse stuff", () => {
        let parser = new Parser;

        expect(parser.jisonResult("")).to.equal("empty cell");
        expect(parser.jisonResult("  \n\t\n   \n\t")).to.equal("empty cell");

        expect(parser.jisonResult("i:int down(i)")).to.deep.equal({ 
            declarations: [{
                "type": "int",
                "varname" : "i"
            }],
            functions: [{
                type: 'direction',
                direction: 'down', 
                params: [{type:'var',identifier:'i'}] 
            }]
        });
        
        expect(parser.jisonResult("i:int,j:int\ni = 3 left(i-1,j)\n i % 5 = 0 right(i-1,j)\nup(i,j)")).to.deep.equal({
            declarations: [{
                "type": "int",
                "varname" : "i"
            },{
                "type": "int",
                "varname" : "j"
            }],
            functions: [
            {
                type: 'direction',
                condition: {
                    type: 'comparison',
                    operator: '=', 
                    values: [{type:'var',identifier:'i'},3] 
                },
                direction: 'left',
                params: [ {
                        type: 'math',
                        operator:'-',
                        params: [{type:'var',identifier:'i'},1]
                    },
                    {type:'var',identifier:'j'}
                ],
            },
            {
                type: 'direction',
                condition: {
                    type: 'comparison',
                    operator: '=', 
                    values: [{
                        type: 'math',
                        operator:'%',
                        params: [{type:'var',identifier:'i'},5]
                        },
                        0] 
                },
                direction: 'right',
                params: [ {
                        type: 'math',
                        operator:'-',
                        params: [{type:'var',identifier:'i'},1]
                    },
                    {type:'var',identifier:'j'}
                ]
            },
            {
                type: "direction",
                direction: "up",
                params:[{type:'var',identifier:'i'},{type:'var',identifier:'j'}]
            }]
        });
    });
});