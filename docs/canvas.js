const maps = [
  {
    name: "main",
    builds: [
      {
        name: "house",
        position: {
          x: 50,
          y: 50
        },
        width: 50,
        height: 50,
        padding: 10,
        color: "white",
        status: 0
      },
      {
        name: "doc",
        position: {
          x: 130,
          y: 10
        },
        width: 50,
        height: 50,
        padding: 10,
        color: "black",
        status: 0
      },
      {
        name: "temple",
        position: {
          x: 150,
          y: 150
        },
        width: 50,
        height: 50,
        padding: 10,
        color: "blue",
        status: 0
      }
    ],
    exit: [
      {
        to: "oasis",
        position: {
          x: 470,
          y: 150
        },
        width: 10,
        height: 50,
        color: "yellow"
      },
      {
        to: "plato",
        position: {
          x: 150,
          y: 310
        },
        width: 50,
        height: 10,
        color: "yellow"
      }
    ]
  },
  {
    name: "oasis",
    builds: [
      {
        name: "house",
        position: {
          x: 300,
          y: 150
        },
        width: 50,
        height: 50,
        padding: 10,
        color: "blue",
        status: 0
      }
    ],
    exit: [
      {
        to: "main",
        position: {
          x: 0,
          y: 150
        },
        width: 10,
        height: 50,
        color: "yellow"
      }
    ]
  },
  {
    name: "plato",
    builds: [
      {
        name: "doc",
        position: {
          x: 330,
          y: 10
        },
        width: 50,
        height: 50,
        padding: 10,
        color: "black",
        status: 0
      }
    ],
    exit: [
      {
        to: "main",
        position: {
          x: 150,
          y: 0
        },
        width: 50,
        height: 10,
        color: "yellow"
      }
    ]
  },
  {
    name: "ccc",
    builds: [
      {
        name: "temple",
        position: {
          x: 350,
          y: 350
        },
        width: 50,
        height: 50,
        padding: 10,
        color: "blue",
        status: 0
      }
    ]
  }
];

const ANIMATE_INTERBAL = 5;

function Combats(el, options) {
  this.playerRadius = 10;

  this.playerX = 10;
  this.playerY = 10;
  this.animateStep = 2;
  this.toX = 0;
  this.toY = 0;

  this.playerLocation = options.location || "";

  this.builds = null;

  this.animateGo = false;
  this.requestId = null;
  this.intervalId = null;

  this.changeLocation = location => {
    maps.forEach(item => {
      if (item.name == location) {
        this.builds = item.builds;
        this.exit = item.exit;
        return false;
      }
    });

    clearInterval(this.intervalId);
    this.playerX = 10;
    this.playerY = 10;

    this.playerLocation = location;
  };

  this.init = location => {
    this.canvas = el;
    this.ctx = this.canvas.getContext("2d");

    this.changeLocation(location);

    this.render();
    el.addEventListener("click", this.moveTo, false);
  };

  this.moveTo = e => {
    this.animateGo = true;

    this.toX = e.clientX - this.canvas.offsetLeft;
    this.toY = e.clientY - this.canvas.offsetTop;

    if (this.animateGo) {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(this._animate, ANIMATE_INTERBAL);
    }
  };

  this._animate = () => {
    if (this.playerX < this.toX) {
      this.playerX++;
    } else if (this.playerX > this.toX) {
      this.playerX--;
    }
    if (this.playerY < this.toY) {
      this.playerY++;
    } else if (this.playerY > this.toY) {
      this.playerY--;
    }

    if (this.playerX == this.toX && this.playerY == this.toY) {
      this.animateGo = false;
      clearInterval(this.intervalId);
    }
  };

  this.render = () => {
    this._clearCanvas();
    this.drawMap();
    this.drawExit();
    this.drawplayer(this.playerX, this.playerY);
    this.drawBuilds();
    this.enterBuild();
    this.enterExit();

    requestAnimationFrame(this.render);
  };

  this._clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  // DRAW
  this.drawplayer = (x, y) => {
    this.ctx.beginPath();
    this.ctx.rect(
      x - this.playerRadius / 2,
      y - this.playerRadius / 2,
      this.playerRadius,
      this.playerRadius
    );
    this.ctx.fillStyle = "red";
    this.ctx.fill();
    this.ctx.closePath();
  };
  this.drawMap = () => {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "green";
    this.ctx.fill();
    this.ctx.closePath();
  };

  this.drawExit = () => {
    this.exit.forEach(item => {
      this.ctx.beginPath();
      this.ctx.rect(item.position.x, item.position.y, item.width, item.height);
      this.ctx.fillStyle = item.color;
      this.ctx.fill();
      this.ctx.closePath();
    });
  };

  this.drawBuilds = () => {
    this.builds.forEach(item => {
      let buildX = item.position.x;
      let buildY = item.position.y;

      this.ctx.beginPath();
      this.ctx.rect(buildX, buildY, item.width, item.height);
      this.ctx.fillStyle = item.color;
      this.ctx.fill();
      if (item.status) {
        this.ctx.strokeStyle = "red";
        this.ctx.stroke();
      }
      this.ctx.closePath();
    });
  };

  this.enterBuild = () => {
    this.builds.forEach(item => {
      if (
        this.playerX > item.position.x &&
        this.playerX < item.position.x + item.width &&
        this.playerY > item.position.y &&
        this.playerY < item.position.y + item.height
      ) {
        item.status = 1;
      } else {
        item.status = 0;
      }
    });
  };

  this.enterExit = () => {
    this.exit.forEach(item => {
      if (
        this.playerX > item.position.x &&
        this.playerX < item.position.x + item.width &&
        this.playerY > item.position.y &&
        this.playerY < item.position.y + item.height
      ) {
        console.log(item.to);
        this.changeLocation(item.to);
        item.status = 1;
      }
    });
  };

  this.init(options.location);

  return this;
}
