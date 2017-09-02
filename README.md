# Javagrid

Javagrid a brutally impractical language inspired by [Befunge](https://en.wikipedia.org/wiki/Befunge). It follows 2 effective design principles:
* It's my language, I do what I want with it
* Whatever I did probably sounded like a good idea at the time

Code is written in cells. A cell consists of parameters and a number of directions with possible conditions. Parameters are optional, but the 
cell needs a direction or be entirely empty.

Code flow is simple and elegant by following one of 4 directions.
* Up
* Right
* Down
* Left

While traversing, empty cells will be ignored. The parameters of the direction need to match the parameters of the target cell.

Example cell:

```
i:number
i = 1 left(j)
right(i+1)
```

Note that to keep grid cells pure, no variables may be assigned. That means contrary to unpure programming languages, `i = 1` is a comparison instead.