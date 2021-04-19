const { World, Engine, Render, Runner, Bodies, Body, Events } = Matter;

const cellsHorizontal = 15;
const cellsVertical = 12;
const width = window.innerWidth;    // canvas (maze) width
const height = window.innerHeight;   // canvas (maze) height

const unitLengthX = width / cellsHorizontal;  // cell width
const unitLengthY = height / cellsVertical;  // cell height

const engine = Engine.create();
engine.world.gravity.y = 0;  // disabling gravity in Y direction for ball
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,  // colors bodies
        width,
        height
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Maze boundaries
const walls = [
    Bodies.rectangle(width/2, 0, width, 5, {isStatic: true}),       //top wall
    Bodies.rectangle(width/2, height, width, 5, {isStatic: true}),  //bottom wall
    Bodies.rectangle(0, height / 2, 5, height, {isStatic: true}),         // left wall
    Bodies.rectangle(width, height / 2, 5, height, {isStatic: true})       // right wall      
];

World.add(world, walls);


// MAZE GENERATION

const shuffle = (arr) => {
    let counter = arr.length;
    while(counter > 0) {
        const index = Math.floor(Math.random() * counter);

        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
}

// Making grid
// I way
// const grid = [];

// for(let i = 0; i < 3; i++){      
//     grid.push([]);                  // pushed indivudual row
//     for(let j = 0; j < 3; j++){
//         grid[i].push(false);
//     }
// }

// II way
 const grid = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false)); 

// making vertical walls
const verticals = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal - 1).fill(false));

// making horizontal walls
const horizontals = Array(cellsVertical - 1)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false));

    const startRow = Math.floor(Math.random() * cellsVertical);      // Starting point
    const startColumn = Math.floor(Math.random() * cellsHorizontal);   // Starting point



    const stepThroughCell = (row, column) => {

        // if I have visited cell at [row, column] then return
        if(grid[row][column]){
            return;
        }

        // Mark this cell as being visited
        grid[row][column] = true;

        // Assemble randomly ordered list of neighbors
        const neighbours = shuffle([
            [row - 1, column, 'up'],      
            [row, column + 1, 'right'],      
            [row + 1, column, 'down'],      
            [row, column - 1, 'left']       
        ]);
        
        // For each neighbor...
        for(let neighbor of neighbours) {
            const[nextRow, nextColumn, direction] = neighbor;  // next neighbor with thinking off
            

            // Check if neighbor is out of bounds
            if (
                nextRow < 0 ||
                nextRow >= cellsVertical ||
                nextColumn < 0 ||
                nextColumn >= cellsHorizontal
              ) {
                continue;    // continue wiht other neighbor
              }

            // If we have visited that neighbor, continue with other neighbor
            if(grid[nextRow][nextColumn]) {  // if this is true
                continue;
            }
            // Remove wall from horizontals or verticals
            if(direction === 'left'){
                verticals[row][column - 1] = true;
            } else if (direction === 'right'){
                verticals[row][column] = true;
            } else if(direction === 'up'){
                horizontals[row - 1][column] = true;
            } else if(direction === 'down'){
                horizontals[row][column] = true;
            }

            stepThroughCell(nextRow, nextColumn);
        }
    };
    
  stepThroughCell(startRow, startColumn);



// Drawing wall in a cell

  horizontals.forEach((row, rowIndex) => {    
      row.forEach((open, columnIndex) => { 
          if(open){
              return;
          }

    const wall = Bodies.rectangle(
              columnIndex * unitLengthX + unitLengthX / 2,  // X coordinate
              rowIndex * unitLengthY + unitLengthY,         // Y coordinate
              unitLengthX,                                 // length of the wall
              10,                                         // height of the wall
              {
                label: 'wall',  
                isStatic: true,     //doesnt fly around
                render : {
                    fillStyle: 'red'
                }
              }
              );
            World.add(world, wall);
        });
  });

  verticals.forEach((row, rowIndex) => {    
    row.forEach((open, columnIndex) => { 
        if(open){
            return;
        }
    const wall = Bodies.rectangle(
        columnIndex * unitLengthX + unitLengthX,
        rowIndex * unitLengthY + unitLengthY / 2,
        10,
        unitLengthY,  // height of the wall
        {
            isStatic: true,
            label: 'wall',
            render : {
                fillStyle: 'red'
            }
        }
    );
World.add(world, wall);
    });
});


// GOAL / FINISH
const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * .7,
    unitLengthY * .7,
    {
        isStatic: true,
        label: 'goal',
        render: {
            fillStyle: 'green'
        }
    }
);
World.add(world, goal);


// BALL
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
    unitLengthX / 2,    // X coordinate
    unitLengthY / 2,    // Y coordinate
    ballRadius,   // diameter of ball
    {
        label: 'ball',
        render: {
            fillStyle: 'blue'
        }
    }    
);
World.add(world, ball);

document.addEventListener('keydown', event => {
   const {x, y} = ball.velocity;

    if(event.keyCode === 87) {
       Body.setVelocity(ball, { x: x, y: y - 5 });  // ball moves up
    }
    if(event.keyCode === 68) {
        Body.setVelocity(ball, { x: x + 5, y: y });  // ball moves right
    }
    if(event.keyCode === 83) {
        Body.setVelocity(ball, { x: x, y: y + 5 });  // ball moves down
    }
    if(event.keyCode === 65) {
        Body.setVelocity(ball, { x: x - 5, y: y });  // ball moves left
    }
});


// WINNING CONDITION

Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(collision => {
        const labels = ['ball', 'goal'];
        if (
        labels.includes(collision.bodyA.label) 
        && 
        labels.includes(collision.bodyB.label)
        ) 
        {
            document.querySelector('.winner').classList.remove('.hidden');
            world.gravity.y = 1;
            world.bodies.forEach(body => {
                if(body.label === 'wall') {
                    Body.setStatic(body, false);  // walls collapse after ball collides with goal
                }
            })
        }
    });
});