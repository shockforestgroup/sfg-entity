import React, { Component } from "react";
// import { Path } from "react-konva";
import Matter, {
  Composite,
  Engine,
  Events,
  Render,
  Runner,
  World,
  Bodies,
  Common,
  Mouse,
  MouseConstraint,
} from "matter-js";

//eslint-disable-next-line no-unused-vars
import MatterAttractors from "matter-attractors";

Matter.use(MatterAttractors);

export default class EntityOrganismPhysics extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.refEntityOrganismPhysics = React.createRef();
  }

  componentDidMount() {
    const engine = Engine.create();

    const renderer = Render.create({
      element: this.refEntityOrganismPhysics.current,
      engine: engine,
      options: {
        width: 500,
        height: 500,
        wireframes: true,
      },
    });

    const runner = Runner.create();
    Runner.run(runner, engine);

    Render.run(renderer);

    // create demo scene
    const world = engine.world;
    world.gravity.scale = 0;

    // create a body with an attractor
    const attractiveBody = Bodies.circle(
      renderer.options.width / 2,
      renderer.options.height / 2,
      100,
      {
        isStatic: true,

        // example of an attractor function that
        // returns a force vector that applies to bodyB
        plugin: {
          attractors: [
            function (bodyA, bodyB) {
              return {
                x: (bodyA.position.x - bodyB.position.x) * 1e-5,
                y: (bodyA.position.y - bodyB.position.y) * 1e-5,
              };
            },
          ],
        },
      }
    );

    World.add(world, attractiveBody);

    // add some bodies that to be attracted
    for (let i = 0; i < 2; i += 1) {
      // var body = Bodies.circle(210, 100, 30, { restitution: 0.5 });
      const size = Common.random(10, 20);
      const body = Bodies.rectangle(
        Common.random(0, renderer.options.width),
        Common.random(0, renderer.options.height),
        size,
        size,
        {
          chamfer: {
            radius: [size * 0.75, size * 0.3, size * 0.75, size * 0.3],
          },
        }
      );

      console.log("Body", body.position);

      World.add(world, body);
    }

    // var ballA = Bodies.circle(210, 100, 30, { restitution: 0.5 });
    // var ballB = Bodies.circle(110, 50, 30, { restitution: 0.5 });
    // World.add(engine.world, [
    //   // walls
    //   Bodies.rectangle(200, 0, 600, 50, { isStatic: true }),
    //   Bodies.rectangle(200, 600, 600, 50, { isStatic: true }),
    //   Bodies.rectangle(260, 300, 50, 600, { isStatic: true }),
    //   Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
    // ]);

    // World.add(engine.world, [ballA, ballB]);

    // add mouse control
    // var mouse = Mouse.create(render.canvas);

    // Events.on(engine, 'afterUpdate', function() {
    //     if (!mouse.position.x) {
    //       return;
    //     }

    //     // smoothly move the attractor body towards the mouse
    //     Body.translate(attractiveBody, {
    //         x: (mouse.position.x - attractiveBody.position.x) * 0.25,
    //         y: (mouse.position.y - attractiveBody.position.y) * 0.25
    //     });
    // });

    const mouse = Mouse.create(renderer.canvas);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: true,
        },
      },
    });

    World.add(engine.world, mouseConstraint);

    Events.on(mouseConstraint, "mousedown", function (event) {});
    Events.on(runner, "afterUpdate", () => {
      console.log("after update");
      const bodies = Composite.allBodies(engine.world);

      this.props.onChange(bodies);
      //Runner.stop(runner);
    });
  }

  render() {
    return (
      <div
        style={{
          position: "absolute",
          border: "2px solid red",
        }}
        ref={this.refEntityOrganismPhysics}
      />
    );
  }
}
