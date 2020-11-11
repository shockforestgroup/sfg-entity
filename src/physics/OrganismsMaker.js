import Matter, {
  Body,
  Composite,
  Engine,
  Events,
  Runner,
  World,
  Bodies,
} from "matter-js";
import MatterAttractors from "matter-attractors";
import getRandomInRange from "../helpers/getRandomInRange";

Matter.use(MatterAttractors);

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
              x: (bodyA.position.x - bodyB.position.x) * 1e-8,
              y: (bodyA.position.y - bodyB.position.y) * 1e-8,
            };
          },
        ],
      },
    });

    World.add(world, attractiveBody);

    // add some bodies that to be attracted

    const DISTANCE = this.circle.radius;

    let bodies = [];
    for (let i = 0; i < 10; i += 1) {
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
      const body = Bodies.circle(
        getRandomInRange(-DISTANCE, DISTANCE),
        getRandomInRange(-DISTANCE, DISTANCE),
        10
      );
      bodies.push(body);
      World.add(world, body);
    }

    World.add(world, {});

    Events.on(runner, "afterUpdate", () => {
      console.log("after update");
      //const bodies = Composite.allBodies(engine.world);
      this.onUpdate(bodies);

      /* Comment */
      //Runner.stop(runner);
    });
    return Composite.allBodies(engine.world);
  }
}

export default EntityOrganisms;
