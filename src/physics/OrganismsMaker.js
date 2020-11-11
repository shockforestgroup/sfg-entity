import Matter, { Body, Engine, Events, Runner, World, Bodies } from "matter-js";
import MatterAttractors from "matter-attractors";
import getRandomInRange from "../helpers/getRandomInRange";

Matter.use(MatterAttractors);

const SETTINGS = {
  attractForce: 1e-6,
  amountOrganisms: 10,
  organismRadius: 30,
};

class EntityOrganisms {
  constructor(options) {
    this.circle = options.circle;
    this.organisms = this._initPhysics();
    this.onUpdate = options.onUpdate || (() => {});
  }

  setOrganismPosition(id, newPosition) {
    const body = this.organisms.find((o) => o.id === id);
    if (body) {
      Body.setPosition(body, newPosition);
    }
  }

  _initPhysics() {
    const engine = Engine.create();
    const runner = Runner.create();
    Runner.run(runner, engine);

    // create demo scene
    const world = engine.world;
    world.gravity.scale = 0;

    // create a body with an attractor
    const attractiveBody = Bodies.circle(0, 0, 10, {
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
      //const size = Common.random(10, 20);

      /*const body = Bodies.rectangle(
        getRandomInRange(-DISTANCE, DISTANCE),
        getRandomInRange(-DISTANCE, DISTANCE),
        size,
        size,
        {
          chamfer: {
            radius: [size * 0.75, size * 0.3, size * 0.75, size * 0.3],
          },
        }
      );*/

      const DISTANCE = this.circle.radius / 2;
      const body = Bodies.circle(
        getRandomInRange(-DISTANCE, DISTANCE),
        getRandomInRange(-DISTANCE, DISTANCE),
        SETTINGS.organismRadius
      );
      bodies.push(body);
      World.add(world, body);
    }

    Events.on(runner, "afterUpdate", () => {
      this.onUpdate(bodies);
    });

    return bodies;
  }
}

export default EntityOrganisms;
