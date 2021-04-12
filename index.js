const { World, Engine, Render, Runner, Bodies } = Matter;

const cells = 3;
const width = 800;
const height = 600;

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

//Walls
const walls = [
    Bodies.rectangle(width/2, 0, width, 40, {isStatic: true}),   //top wall
    Bodies.rectangle(width/2, height, width, 40, {isStatic: true}),  //bottom wall
    Bodies.rectangle(0, height / 2, 40, height, {isStatic: true}),         // left wall
    Bodies.rectangle(width, height / 2, 40, height, {isStatic: true})       // right wall      
];

World.add(world, walls);


// MAZE GENERATION

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
    .map(() => Array(cells  ).fill(false));

    console.log(verticals, horizontals);