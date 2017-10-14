import * as g from "../grid";

/**
 * The most practical datastructure ever.
 * 
 * It works like a dice. You can flip it around and one side will be on the bottom. On each side you can insert values and retrieve them again one by one in the opposite order.
 * That means this class offers 6 stacks at once. But it gets even better. It's possible to retrieve on the other side, making it work like a queue.
 */
export class Cube<T> implements g.Collection {
    // The sides of the cube with their adjacent sides in clockwise fashion, needed for flipping
    private readonly sides: {[key:number]:number[]} = {
        1 : [2,3,5,4],
        2 : [1,4,6,3],
        3 : [1,2,6,5],
        4 : [1,5,6,2],
        5 : [1,3,6,4],
        6 : [2,4,5,3]
    }
    // The directions ordered in a clockwise fashion, needed for flipping
    private readonly angles = [g.Angle.UP, g.Angle.RIGHT, g.Angle.DOWN, g.Angle.LEFT];
    private bottomNum = 1;
    private lastMove = g.Angle.DOWN;
    private lastNum = 2;
    private stacks: {[key:number]:T[]} = {
        1 : [],
        2 : [],
        3 : []
    }

    /** 
     * Flips the cube in the given direction
     */
    public flip(move: g.Angle): void{
        /* 
        * Rotation is determined by index and direction from last time
        * e.g.
        * 2 is bottom and 1 is facing north
        * Last direction was down, the next direction is left
        * 1. Count the amount of steps to take in the sides array
        *    From the opposite of the last move (+2) count the offset to the desired direction
        *    => Last move was down (index 2) opposite is up (index 2+2=4 -> 0)
        *    => Steps needed to go left = 3
        * 2. In the sides array, look up the index of the previous number
        *    Add the result from 1. to it to get the index of the next number
        *    => Current number 2 (sides [1,4,6,3])
        *    => Index of last number is 0
        *    => Result from 1. is index 3 => new bottom number is 3
        */

        // Count how many steps in the array we have to take
        let prevIndex = this.angles.indexOf(this.lastMove) + 2;
        let index = 0;
        while(move != this.angles[prevIndex % 4]){
            prevIndex++; index++;
        }

        // Offset for the previous position in the array
        index = (index + this.sides[this.bottomNum].indexOf(this.lastNum)) % 4;

        this.lastNum = this.bottomNum;
        this.bottomNum = this.sides[this.lastNum][index];
        this.lastMove = move;
    }

    private getIndex(): number {
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

    public insert(val:T): void{
        if(this.bottomNum > 3){
            this.stacks[this.getIndex()].unshift(val);
        } else {
            this.stacks[this.getIndex()].push(val);
        }
    }
    
    public retrieve(): T{
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
