const { World, Engine, Render, Runner, Bodies } = Matter;

const cells = 3;
const width = 600;
const height = 600;
const unitLength = width / cells;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: true, 
        width,
        height
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Maze boundaries
const walls = [
    Bodies.rectangle(width/2, 0, width, 40, {isStatic: true}),       //top wall
    Bodies.rectangle(width/2, height, width, 40, {isStatic: true}),  //bottom wall
    Bodies.rectangle(0, height / 2, 40, height, {isStatic: true}),         // left wall
    Bodies.rectangle(width, height / 2, 40, height, {isStatic: true})       // right wall      
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
 const grid = Array(cells)
    .fill(null)
    .map(() => Array(cells).fill(false)); 

// making vertical walls
const verticals = Array(cells)
    .fill(null)
    .map(() => Array(cells - 1).fill(false));

// making horizontal walls
const horizontals = Array(cells - 1)
    .fill(null)
    .map(() => Array(cells).fill(false));

    const startRow = Math.floor(Math.random() * cells);      // Starting point
    const startColumn = Math.floor(Math.random() * cells);   // Starting point



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
            console.log(nextRow);

            // Check if neighbor is out of bounds
            if (
                nextRow < 0 ||
                nextRow >= cells ||
                nextColumn < 0 ||
                nextColumn >= cells
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
              columnIndex * unitLength + unitLength / 2,  // X coordinate
              rowIndex * unitLength + unitLength,         // Y coordinate
              unitLength,                                 // length of the wall
              10,                                         // height of the wall
              {
                  isStatic: true     //doesnt fly around
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
        columnIndex * unitLength + unitLength,
        rowIndex * unitLength + unitLength / 2,
        10,
        unitLength,  // height of the wall
        {
            isStatic: true
        }
    );
World.add(world, wall);

    });
});
    