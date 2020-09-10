import React, { Component } from "react";
// import { Path } from "react-konva";
import Matter from "matter-js";
import MatterAttractors from "matter-attractors";


const CELL_SHAPES = [
  "M18 19.5C18 30.2696 12.8513 39 6.50001 39C0.148731 39 0.5 30.2696 0.5 19.5C0.5 8.73045 0.148731 0 6.50001 0C12.8513 0 18 8.73045 18 19.5Z",
  "M20 26.5C20 37.2696 16.2345 39 7.88873 39C-0.456997 39 0.00457863 30.2696 0.00457863 19.5C0.00457863 8.73045 -0.456997 0 7.88873 0C16.2345 0 20 15.7304 20 26.5Z",
  "M16.9991 23.9212C16.9991 31.6801 11.4215 36 6.85798 36C-2.02875 36 0.266203 25.7589 0.266203 18C0.266203 10.2411 -0.507573 0 8.37915 0C17.2659 0 16.9991 16.1623 16.9991 23.9212Z",
];

Matter.use('matter-attractors');


export default class EntityOrganismPhysics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shape: CELL_SHAPES[Math.floor(Math.random() * CELL_SHAPES.length)],
    };
  }

  componentDidMount() {

    var Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Events = Matter.Events,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Common = Matter.Common,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

    var engine = Engine.create({
      // positionIterations: 20
    });

    var render = Render.create({
      element: this.refs.entityOrganismPhysics,
      engine: engine,
      options: {
        width: 600,
        height: 600,
        wireframes: true
      }
    });

    // create runner
    var runner = Runner.create();
    
    Runner.run(runner, engine);
    Render.run(render);

      // create demo scene
    var world = engine.world;
    world.gravity.scale = 0;

    // create a body with an attractor
    var attractiveBody = Bodies.circle(
      render.options.width / 2,
      render.options.height / 2,
      0, 
      {
      isStatic: true,

      // example of an attractor function that 
      // returns a force vector that applies to bodyB
      plugin: {
        attractors: [
          function(bodyA, bodyB) {
            return {
              x: (bodyA.position.x - bodyB.position.x) * 1e-6,
              y: (bodyA.position.y - bodyB.position.y) * 1e-6,
            };
          }
        ]
      }
    });

    World.add(world, attractiveBody);

    // add some bodies that to be attracted
    for (var i = 0; i < 150; i += 1) {
      // var body = Bodies.circle(210, 100, 30, { restitution: 0.5 });
      var size = Common.random(10, 20);
      var body = Bodies.rectangle(
        Common.random(0, render.options.width), 
        Common.random(0, render.options.height),
        size,
        size,
        { 
          chamfer: { radius: [size*.75, size*.3, size*.75, size*.3] }
        }
      );

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

    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });

    World.add(engine.world, mouseConstraint);

    Matter.Events.on(mouseConstraint, "mousedown", function(event) {

    });
  }

  render() {
    return <div ref="entityOrganismPhysics" />;
  }
}
