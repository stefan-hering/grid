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

## Syntax

Every cell starts with parameters, seperated by comma, each with a type associated to it.

After the parameters the directions are declared. A direction consists out of an optional condition and one of the directions. The direction itself can have 0 or more parameters.

Whitespace does not matter. Usual math operators work `+`, `-`, `*`, `/`, `%`. String concatenation is done with `.`. Checking if a variable exists is done with `?`.

### Example cell:

```
i:number,j:number
i = 1 left(i + 1,j)
right(i * j)
```

This cell has two input parameters, a number named `i` and one names `j`. If `i` is 1, the result of `i * j` will be sent to the left. If `i` is not 1 the value of `i + 1` and the value of `j` will be sent right.

Note that to keep grid cells pure, no variables may be assigned. That means contrary to unpure programming languages, `i = 1` is a comparison instead.

## Datatypes

There are `number` and `string` and

### Cube

A cube is an incredible datastructure with 6 sides that can work as 6 stacks or as 3 queues or any combination of those. It has a generic type indicating which of the other 2 datatypes it holds. Each movement on the grid in a certain direction also flips the cube in that direction. A cube is declared in the parameters like this:

```
foo: Cube<string>
```

In a grid cell a single value can be retrieved from the cube with the -> operator:

```
foo: Cube<string> -> bar
```

Values can be inserted into the cube when going in a direction with the <- operator:

```
left(foo <- "Value")
```

When entering and retrieving values from the cube the side of the cube that currently on the bottom is important. Values that have been inserted can either be retrieved from the same side (works like pop on a stack) or on the other side (works like dequeue on a queue). For example, if the cube is flipped right 1 time, the inserted elements cannot be retried. If the cube is flipped right again, the elements can be dequeued. If the cube is flipped right 2 more times, the elements can be popped.

## Using this repo

Before doing anything, compile the jison by running gulp:

```
gulp jison
```

Running test can simply be done with `npm test`, bundling the demo ui is done with webpack `npm run build`.


## Demo page

https://stefan-hering.github.io/
