import * as g from "../grid";

/**
 * The most practical datastructure ever.
 * 
 * It works like a dice. You can flip it around and one side will be on the bottom. On each side you can insert values and retrieve them again one by one in the opposite order.
 * That means this class offers 6 stacks at once. But it gets even better. It's possible to retrieve on the other side, making it work like a queue.
 */
export class Cube<T> implements g.Collection {
    private bottomNum = 1;
    private lastMove = g.Angle.DOWN;
    private lastNum = 2;
    private sides : {[key:number]:number[]} = {
        1 : [2,3,5,4],
        2 : [1,4,6,3],
        3 : [1,2,6,5],
        4 : [1,5,6,2],
        5 : [1,3,6,4],
        6 : [2,4,5,3]
    }
    private stacks : {[key:number]:T[]} = {
        1 : [],
        2 : [],
        3 : []
    }

    // When side x is at the bottom, rotate to side y
    // rotation is determined by index and direction from last time
    // e.g. x is 1, y is 2, going down
    // now 2 is bottom and 1 is up, we want to go left, index of 2(0) plus clockwise degrees (90), (0+3%4) -> index 3 -> 3
    // now 3 is bottom and 2 is right and we go down (1+1%4) -> index 2 -> 6
    public flip(move : g.Angle){
        let x: number;

        // Define the angles in a clockwise motion around the cube
        let angles = [g.Angle.UP, g.Angle.RIGHT, g.Angle.DOWN, g.Angle.LEFT];

        // Count how many steps in the array we have to take
        let prevIndex = angles.indexOf(this.lastMove) + 2;
        let index = 0;
        while(move != angles[prevIndex % 4]){
            prevIndex++; index++;
        }

        // Offset for the previous position in the array
        index = (index + this.sides[this.bottomNum].indexOf(this.lastNum)) % 4;

        this.lastNum = this.bottomNum;
        this.bottomNum = this.sides[this.lastNum][index];
        this.lastMove = move;
    }

    private getIndex():number {
        if(this.bottomNum == 6){
            return 1;
        } else if(this.bottomNum == 5){
            return 2;
        } else if(this.bottomNum == 4){
            return 3;
        } else {
            return this.bottomNum;
        }
    }

    public insert(val:T){
        if(this.bottomNum > 3){
            this.stacks[this.getIndex()].unshift(val);
        } else {
            this.stacks[this.getIndex()].push(val);
        }
    }
    
    public retrieve():T{
        if(this.bottomNum > 3){
            return this.stacks[this.getIndex()].shift();
        } else {
            return this.stacks[this.getIndex()].pop();
        }
    }

    public getBottom(): number {
        return this.bottomNum;
    }
}