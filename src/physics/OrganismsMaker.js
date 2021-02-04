import Matter, {
  Body,
  Bodies,
  Common,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Runner,
  World,
} from "matter-js";
import Render from "./Render";
import MatterAttractors from "matter-attractors";
import getRandomInRange from "../helpers/getRandomInRange";

Matter.use(MatterAttractors);

const SETTINGS = {
  attractForce: 0.5e-6,
  amountOrganisms: 60,
  maxOrganismRadius: 10,
  minOrganismRadius: 30,
};

function createBody(center, radius, pos) {
  const DISTANCE = radius / 2;
  const position = pos || {
    x: center.x + getRandomInRange(-DISTANCE, DISTANCE),
    y: center.y + getRandomInRange(-DISTANCE, DISTANCE),
  };
  const size = Common.random(
    SETTINGS.minOrganismRadius,
    SETTINGS.maxOrganismRadius
  );

  return Bodies.rectangle(position.x, position.y, size, size, {
    chamfer: {
      radius: [
        Math.round(size * 0.75),
        Math.round(size * 0.3),
        Math.round(size * 0.75),
        Math.round(size * 0.3),
      ],
      //keep this at 3 (for organism sizes smaller than 30), since other values cause issues with performance and selfintersection. Auto quality setting also has these issues.
      quality: 3,
    },
    render: { fillStyle: "black", strokeStyle: "white", lineWidth: "2" },
    angle: Common.random(0, 6),
    frictionAir: 0.5,
    density: 0.001,
  });
}

class EntityOrganisms {
  constructor(options) {
    this.element = options.element;
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    this.circle = options.circle;
    this.center = { x: this.canvasWidth / 2, y: this.canvasHeight / 2 };
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
    this.isTouch = options.isTouch || false;
    this._initPhysics();
    window.addEventListener("resize", () => this.handleResize());
  }

  handleResize() {
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    this.element.width = this.canvasWidth;
    this.element.height = this.canvasHeight;
    this.attractiveBody.position.x = this.canvasWidth / 2;
    this.attractiveBody.position.y = this.canvasHeight / 2;
    this.center = { x: this.canvasWidth / 2, y: this.canvasHeight / 2 };
    this.constraint.pointA = this.center;
  }

  spawnNewOrganism() {
    const center = { x: this.canvasWidth / 2, y: this.canvasHeight / 2 };
    const body = createBody(null, null, center);
    World.add(this.world, body);
    this.organisms.push(body);
  }

  killOrganism(id) {
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

  updateHalo() {}

  _initPhysics() {
    console.log("this.element", this.element);
    const engine = Engine.create();
    const runner = Runner.create();
    const renderer = Render.create({
      canvas: this.element,
      engine: engine,
      options: {
        background: "transparent",
        width: this.canvasWidth,
        height: this.canvasHeight,
        //wireframeBackground: "transparent",
        wireframes: false,
        showHalos: true,
      },
    });
    this.renderer = renderer;
    Runner.run(runner, engine);
    Render.run(renderer);

    // create demo scene
    const world = engine.world;
    world.gravity.scale = 0;

    // create a body with an attractor
    this.attractiveBody = Bodies.circle(
      this.canvasWidth / 2,
      this.canvasHeight / 2,
      0,
      {
        isStatic: true,
        // example of an attractor function that
        // returns a force vector that applies to bodyB

        plugin: {
          attractors: [
            function (bodyA, bodyB) {
              return {
                x:
                  (bodyA.position.x - bodyB.position.x) * SETTINGS.attractForce,
                y:
                  (bodyA.position.y - bodyB.position.y) * SETTINGS.attractForce,
              };
            },
          ],
        },
      }
    );

    World.add(world, this.attractiveBody);

    // add some bodies that to be attracted
    let bodies = [];
    for (let i = 0; i < SETTINGS.amountOrganisms; i += 1) {
      const body = createBody(this.center, this.circle.radius);
      World.add(world, body);
      bodies.push(body);
    }

    this.constraint = Matter.Constraint.create({
      stiffness: 1e-10,
      pointA: this.center,
      //initialize with a random body, doesnt matter for now as long as stiffness isnt tangible
      bodyB: bodies[0],
      render: {
        visible: false,
      },
    });

    World.add(world, this.constraint);

    /*************** Mouse Constraint ********************/
    const mouse = Mouse.create(document.body);
    //Mouse.setOffset(mouse, this.offset);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        // allow bodies on mouse to rotate
        angularStiffness: 0,
        render: { visible: false },
      },
    });

    World.add(world, mouseConstraint);

    /*************** Mouse Events....!!! ********************/
    Events.on(mouseConstraint, "startdrag", (event) => {
      this.draggedBody = event.body;
      this.constraint.bodyB = this.draggedBody;
      if (this.isTouch) {
        //Body.scale(this.draggedBody, 2, 2);
      }
      this.onDragStart(event);
    });

    Events.on(mouseConstraint, "enddrag", (event) => {
      if (this.isTouch) {
        //Body.scale(this.draggedBody, 0.5, 0.5);
        //this.resetGradient();
      }

      this.onDragEnd(event, this.draggedBody);
      this.draggedBody = null;
      this.constraint.stiffness = 1e-10;
    });

    Events.on(mouseConstraint, "mousemove", (event) => {
      /* if we're actually dragging */
      if (this.draggedBody) {
        this.isTouch && this.updateHalo();
        this.onDragMove(event, this.draggedBody);
      }
    });

    /*************** Behavior of organisms when they come close to the border ********************/

    Events.on(engine, "beforeUpdate", (event) => {
      if (!this.draggedBody) return;

      let distanceFromCenter = Math.hypot(
        this.draggedBody.position.x - this.center.x,
        this.draggedBody.position.y - this.center.y
      );
      //make max distance slightly smaller than circle radius
      //to compensate from constraints not being perfectly stiff and make sure organism stays within circle bounds.
      let maxDistanceFromCenter =
        this.circle.radius + this.circle.radius * -0.06;
      if (distanceFromCenter > maxDistanceFromCenter) {
        this.constraint.stiffness = 2;
        this.constraint.length = maxDistanceFromCenter;
      } else {
        this.constraint.stiffness = 1e-10;
      }
    });

    this.engine = engine;
    this.mouse = mouse;
    this.organisms = bodies;
    this.world = world;
  }
}

export default EntityOrganisms;
