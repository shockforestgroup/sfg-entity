import Matter, {
  Bodies,
  Common,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Runner,
  World,
} from "matter-js";
import MatterAttractors from "matter-attractors";
import getRandomInRange from "../helpers/getRandomInRange";

Matter.use(MatterAttractors);

const SETTINGS = {
  attractForce: 1e-8,
  amountOrganisms: 50,
  organismRadius: 20,
};

function createBody(radius, pos) {
  const DISTANCE = radius / 2;
  const position = pos || {
    x: getRandomInRange(-DISTANCE, DISTANCE),
    y: getRandomInRange(-DISTANCE, DISTANCE),
  };
  const size = Common.random(10, SETTINGS.organismRadius);

  return Bodies.rectangle(position.x, position.y, size, size, {
    chamfer: {
      radius: [size * 0.75, size * 0.3, size * 0.75, size * 0.3],
    },
    angle: Common.random(0, 6),
  });
}

class EntityOrganisms {
  constructor(options) {
    this.circle = options.circle;
    this.offset = options.offset || { x: 0, y: 0 };
    this.organisms = [];
    this.engine = null;
    this.mouse = null;
    this.world = null;
    this.draggedBody = null;
    this.onDragStart = options.onDragStart || (() => {});
    this.onDragEnd = options.onDragEnd || (() => {});
    this.onDragMove = options.onDragMove || (() => {});
    this.constraint = null;
    this._initPhysics();
  }

  spawnNewOrganism() {
    console.log("spawn");
    const body = createBody(this.circle.radius, { x: 0, y: 0 });
    World.add(this.world, body);
    this.organisms.push(body);
  }

  killOrganism(id) {
    console.log("kill");
    const body = this.organisms.find((el) => el.id === id);
    if (!body) {
      return;
    }
    World.remove(this.world, body);
    const index = this.organisms.findIndex((el) => el.id === id);
    this.organisms.splice(index, 1);
  }

  getOrganisms() {
    return this.organisms;
  }

  updateMouseOffset(offset) {
    this.offset = offset;
    Mouse.setOffset(this.mouse, offset);
  }

  _initPhysics() {
    const engine = Engine.create();
    const runner = Runner.create();
    Runner.run(runner, engine);

    // create demo scene
    const world = engine.world;
    world.gravity.scale = 0;

    // create a body with an attractor
    const attractiveBody = Bodies.circle(0, 0, 0, {
      isStatic: true,
      // example of an attractor function that
      // returns a force vector that applies to bodyB

      plugin: {
        attractors: [
          function (bodyA, bodyB) {
            return {
              x: (bodyA.position.x - bodyB.position.x) * SETTINGS.attractForce,
              y: (bodyA.position.y - bodyB.position.y) * SETTINGS.attractForce,
            };
          },
        ],
      },
    });

    World.add(world, attractiveBody);

    // add some bodies that to be attracted
    let bodies = [];
    for (let i = 0; i < SETTINGS.amountOrganisms; i += 1) {
      const body = createBody(this.circle.radius);
      World.add(world, body);
      bodies.push(body);
    }

    this.constraint = Matter.Constraint.create({
      length: this.circle.radius,
      stiffness: 1e-10,
      pointA: { x: 0, y: 0 },
      //initialize with a random body, doesnt matter for now as long as stiffness isnt tangible
      bodyB: bodies[0],
    });

    World.add(world, this.constraint);

    /*************** Mouse Constraint ********************/
    const mouse = Mouse.create(document.body);
    Mouse.setOffset(mouse, this.offset);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.8, render: { visible: false } },
    });

    World.add(world, mouseConstraint);

    /*************** Mouse Events....!!! ********************/
    Events.on(mouseConstraint, "startdrag", (event) => {
      console.log("Drag start!");
      this.draggedBody = event.body;
      this.onDragStart(event);
    });

    Events.on(mouseConstraint, "enddrag", (event) => {
      console.log("Drag end!");
      console.log(event);
      this.onDragEnd(event, this.draggedBody);
      this.draggedBody = null;
      this.constraint.stiffness = 1e-10;
    });

    Events.on(mouseConstraint, "mousemove", (event) => {
      /* if we're actually dragging */
      if (this.draggedBody) {
        this.onDragMove(event, this.draggedBody);
      }
    });

    /*************** Behavior of organisms when they come close to the border ********************/

    Events.on(engine, "beforeUpdate", (event) => {
      if (!this.draggedBody) return;
      const distanceFromCenter = Math.hypot(
        this.draggedBody.position.x,
        this.draggedBody.position.y
      );

      if (distanceFromCenter > this.circle.radius) {
        this.constraint.bodyB = this.draggedBody;
        this.constraint.stiffness = 1;
        this.constraint.length = this.circle.radius;
      } else {
        this.constraint.stiffness = 1e-10;
      }
    });

    /*Events.on(runner, "afterUpdate", () => {
      this.onUpdate(bodies);
      //Runner.stop(runner);
    });*/

    this.engine = engine;
    this.mouse = mouse;
    this.organisms = bodies;
    this.world = world;
  }
}

export default EntityOrganisms;
