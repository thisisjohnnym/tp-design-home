import Matter from "matter-js";

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const DESKTOP_MIN_WIDTH = 1280;
const TABLET_MIN_WIDTH = 768;
const GRAVITY_CIRCLE_SCALE = 0.05;

function loadTexture(src: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Failed to load texture: ${src}`));
    image.src = src;
  });
}

export class InteractiveDotsScene {
  private readonly sceneNode: HTMLElement;

  private BALLS_LIMIT = 1000;
  private readonly BALLS_PER_TICK = 20;
  private readonly BALLS_LIMIT_XL = 1000;
  private readonly BALLS_LIMIT_MD = 500;
  private readonly BALLS_LIMIT_SM = 250;
  private readonly PARTICLE_IMG = "/interactive-dots/particle.svg";
  private readonly PARTICLE_SCALE = 0.2;
  private readonly WALL_THICKNESS = 20;
  private readonly WALL_BIG_WIDTH = 8000;

  private particles: Matter.Body[] = [];
  private isPressed = false;
  private started = false;
  private useSpriteTextures = true;

  private cw = 0;
  private ch = 0;

  private engine!: Matter.Engine;
  private render!: Matter.Render;
  private runner!: Matter.Runner;
  private world!: Matter.World;

  private circle?: Matter.Body;
  private mouseConstraint?: Matter.MouseConstraint;

  private topWall?: Matter.Body;
  private leftWall?: Matter.Body;
  private bottomWall?: Matter.Body;
  private rightWall?: Matter.Body;

  private resizeHandler?: () => void;
  private tickHandler?: () => void;

  constructor(sceneNode: HTMLElement) {
    this.sceneNode = sceneNode;
  }

  async start() {
    if (this.started) return;

    const { clientWidth, clientHeight } = this.sceneNode;
    if (clientWidth === 0 || clientHeight === 0) return;

    try {
      await loadTexture(this.PARTICLE_IMG);
      this.useSpriteTextures = true;
    } catch {
      this.useSpriteTextures = false;
    }

    this.setup();
    this.addWalls();
    this.addCircle();
    this.addMouse();
    this.initRunnerEvents();
    this.initResizeEvent();
    this.started = true;
  }

  stop() {
    if (!this.started) return;
    this.cleanup();
    this.started = false;
  }

  cleanup() {
    if (!this.started) return;

    if (this.tickHandler) {
      Matter.Events.off(this.runner, "tick", this.tickHandler);
      this.tickHandler = undefined;
    }

    Matter.Render.stop(this.render);
    Matter.Runner.stop(this.runner);
    Matter.Composite.clear(this.world, false);
    Matter.Engine.clear(this.engine);

    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
      this.resizeHandler = undefined;
    }

    this.render.canvas.remove();
    this.render.canvas = null as unknown as HTMLCanvasElement;
    this.render.context = null as unknown as CanvasRenderingContext2D;
    this.render.textures = {};

    this.particles = [];
    this.circle = undefined;
    this.mouseConstraint = undefined;
    this.topWall = undefined;
    this.leftWall = undefined;
    this.bottomWall = undefined;
    this.rightWall = undefined;
    this.isPressed = false;
  }

  handleMouseDown(clientX: number, clientY: number) {
    if (!this.started) return;
    this.isPressed = true;
    this.addParticle(clientX, clientY);
  }

  handleMouseUp() {
    if (!this.started) return;
    this.isPressed = false;
  }

  handleMouseMove(clientX: number, clientY: number) {
    if (!this.started || !this.circle) return;

    const target = { x: clientX, y: clientY };
    const direction = Matter.Vector.sub(target, this.circle.position);
    if (Matter.Vector.magnitude(direction) < 0.001) return;

    const force = Matter.Vector.mult(Matter.Vector.normalise(direction), 0.5);
    Matter.Body.setPosition(this.circle, target);
    Matter.Body.applyForce(this.circle, this.circle.position, force);
  }

  private setup() {
    const { clientWidth, clientHeight } = this.sceneNode;

    if (this.isDesktop(clientWidth)) {
      this.BALLS_LIMIT = this.BALLS_LIMIT_XL;
    } else if (clientWidth > TABLET_MIN_WIDTH) {
      this.BALLS_LIMIT = this.BALLS_LIMIT_MD;
    } else {
      this.BALLS_LIMIT = this.BALLS_LIMIT_SM;
    }

    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
      element: this.sceneNode,
      engine,
      options: {
        width: clientWidth,
        height: clientHeight,
        wireframes: false,
        background: "transparent",
      },
    });

    Matter.Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    this.cw = clientWidth;
    this.ch = clientHeight;
    this.engine = engine;
    this.render = render;
    this.runner = runner;
    this.world = engine.world;
  }

  private addCircle() {
    const circle = Matter.Bodies.circle(
      0.5 * this.cw,
      0.5 * this.ch,
      GRAVITY_CIRCLE_SCALE * this.cw,
      {
        restitution: 0.2,
        friction: 0,
        render: { visible: false },
      },
    );

    Matter.Composite.add(this.world, [circle]);
    this.circle = circle;
  }

  private addMouse() {
    const mouse = Matter.Mouse.create(this.render.canvas);
    Matter.Mouse.setElement(mouse, this.render.canvas);
    this.syncMouseScale(mouse);

    const mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      mouse,
      constraint: {
        stiffness: 1,
        render: { visible: false },
      },
    });

    mouseConstraint.collisionFilter.mask = 0;

    Matter.Composite.add(this.world, mouseConstraint);
    this.mouseConstraint = mouseConstraint;
  }

  private syncMouseScale(mouse: Matter.Mouse) {
    const canvas = this.render.canvas;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    mouse.pixelRatio = 1;
    mouse.scale = {
      x: canvas.width / rect.width,
      y: canvas.height / rect.height,
    };
  }

  private addParticle(x?: number, y?: number, radius?: number) {
    const spawnX = x ?? randomBetween(0, 1) * this.cw;
    const spawnY = y ?? randomBetween(0.7, 1) * this.ch;
    const particleRadius = radius ?? randomBetween(6, 12);

    if (this.particles.length >= this.BALLS_LIMIT) {
      const oldest = this.particles.shift();
      if (oldest) {
        Matter.Composite.remove(this.world, [oldest]);
      }
    }

    const body = Matter.Bodies.polygon(spawnX, spawnY, 5, particleRadius, {
      restitution: 0.6,
      friction: 0.1,
      render: this.useSpriteTextures
        ? {
            sprite: {
              texture: this.PARTICLE_IMG,
              xScale: this.PARTICLE_SCALE,
              yScale: this.PARTICLE_SCALE,
            },
          }
        : {
            fillStyle: "#8a8a8a",
            strokeStyle: "#6e6e6e",
            lineWidth: 1,
          },
    });

    Matter.Composite.add(this.world, [body]);
    this.particles.push(body);
  }

  private addWalls() {
    const wallOptions: Matter.IChamferableBodyDefinition = {
      isStatic: true,
      render: { visible: false },
    };

    const leftWall = Matter.Bodies.rectangle(
      -(this.WALL_THICKNESS / 2),
      0.5 * this.ch,
      this.WALL_THICKNESS,
      this.ch,
      wallOptions,
    );
    const rightWall = Matter.Bodies.rectangle(
      this.cw + this.WALL_THICKNESS / 2,
      0.5 * this.ch,
      this.WALL_THICKNESS,
      this.ch,
      wallOptions,
    );
    const topWall = Matter.Bodies.rectangle(
      0.5 * this.cw,
      -(this.WALL_THICKNESS / 2),
      this.WALL_BIG_WIDTH,
      this.WALL_THICKNESS,
      wallOptions,
    );
    const bottomWall = Matter.Bodies.rectangle(
      0.5 * this.cw,
      this.ch + this.WALL_THICKNESS / 2,
      this.WALL_BIG_WIDTH,
      this.WALL_THICKNESS,
      wallOptions,
    );

    Matter.Composite.add(this.world, [topWall, rightWall, bottomWall, leftWall]);

    this.topWall = topWall;
    this.leftWall = leftWall;
    this.bottomWall = bottomWall;
    this.rightWall = rightWall;
  }

  private initResizeEvent() {
    this.resizeHandler = () => {
      if (!this.started) return;

      const { clientWidth, clientHeight } = this.sceneNode;
      this.cw = clientWidth;
      this.ch = clientHeight;

      this.render.options.width = clientWidth;
      this.render.options.height = clientHeight;
      this.render.canvas.width = clientWidth;
      this.render.canvas.height = clientHeight;

      if (this.mouseConstraint) {
        this.syncMouseScale(this.mouseConstraint.mouse);
      }

      if (this.isDesktop()) {
        this.BALLS_LIMIT = this.BALLS_LIMIT_XL;
      } else if (clientWidth > TABLET_MIN_WIDTH) {
        this.BALLS_LIMIT = this.BALLS_LIMIT_MD;
      } else {
        this.BALLS_LIMIT = this.BALLS_LIMIT_SM;
      }

      this.repositionWalls();
    };

    window.addEventListener("resize", this.resizeHandler);
  }

  private initRunnerEvents() {
    this.tickHandler = () => {
      for (let index = 0; index < this.particles.length; index += 1) {
        const particle = this.particles[index];
        const { x, y } = particle.position;

        if (x > this.cw || x < 0 || y > this.ch || y < 0) {
          Matter.Composite.remove(this.world, [particle]);
          this.particles.splice(index, 1);
          index -= 1;
        }
      }

      if (this.isPressed && this.mouseConstraint) {
        this.addParticle(
          this.mouseConstraint.mouse.position.x,
          this.mouseConstraint.mouse.position.y,
        );
      }

      if (this.particles.length < this.BALLS_LIMIT - this.BALLS_PER_TICK) {
        for (let index = 0; index < this.BALLS_PER_TICK; index += 1) {
          this.addParticle();
        }
      }
    };

    Matter.Events.on(this.runner, "tick", this.tickHandler);
  }

  private isDesktop(width = this.cw) {
    return width >= DESKTOP_MIN_WIDTH;
  }

  private repositionWalls() {
    if (!this.leftWall || !this.rightWall || !this.topWall || !this.bottomWall) {
      return;
    }

    Matter.Body.setPosition(this.leftWall, {
      x: -(this.WALL_THICKNESS / 2),
      y: 0.5 * this.ch,
    });
    Matter.Body.setPosition(this.rightWall, {
      x: this.cw + this.WALL_THICKNESS / 2,
      y: 0.5 * this.ch,
    });
    Matter.Body.setPosition(this.topWall, {
      x: 0.5 * this.cw,
      y: -(this.WALL_THICKNESS / 2),
    });
    Matter.Body.setPosition(this.bottomWall, {
      x: 0.5 * this.cw,
      y: this.ch + this.WALL_THICKNESS / 2,
    });
  }
}
