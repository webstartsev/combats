const maps = [
  {
    name: "main",
    builds: [
      {
        name: "house",
        positionX: 50,
        positionY: 50,
        width: 50,
        height: 50,
        padding: 10,
        color: "white",
        status: 0
      },
      {
        name: "doc",
        positionX: 130,
        positionY: 10,
        width: 50,
        height: 50,
        padding: 10,
        color: "black",
        status: 0
      },
      {
        name: "temple",
        positionX: 150,
        positionY: 150,
        width: 50,
        height: 50,
        padding: 10,
        color: "blue",
        status: 0
      }
    ],
    exit: [
      {
        to: "aaa",
        position: {
          x: 470,
          y: 150
        },
        width: 10,
        height: 50,
        color: "yellow"
      },
      {
        to: "bbb",
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
    name: "aaa",
    builds: [
      {
        name: "house",
        positionX: 300,
        positionY: 150,
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
    name: "bbb",
    builds: [
      {
        name: "doc",
        positionX: 330,
        positionY: 10,
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
        positionX: 350,
        positionY: 350,
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

function Canvas(el, options) {
  this.persRadius = 10;

  this.persX = 10;
  this.persY = 10;
  this.animateStep = 2;
  this.toX = 0;
  this.toY = 0;

  this.persLocation = options.location || "";

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
    this.persX = 10;
    this.persY = 10;

    this.persLocation = location;
  };

  this.init = location => {
    this.canvas = el;
    this.ctx = this.canvas.getContext("2d");

    this.changeLocation(location);

    this.render();
    el.addEventListener("click", this.changePositionPers, false);
  };

  this.changePositionPers = e => {
    this.animateGo = true;

    this.toX = e.clientX - this.canvas.offsetLeft;
    this.toY = e.clientY - this.canvas.offsetTop;

    if (this.animateGo) {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(this._animate, ANIMATE_INTERBAL);
    }
  };

  this._animate = () => {
    if (this.persX < this.toX) {
      this.persX++;
    } else if (this.persX > this.toX) {
      this.persX--;
    }
    if (this.persY < this.toY) {
      this.persY++;
    } else if (this.persY > this.toY) {
      this.persY--;
    }

    if (this.persX == this.toX && this.persY == this.toY) {
      this.animateGo = false;
      clearInterval(this.intervalId);
    }
  };

  this.render = () => {
    this._clearCanvas();
    this.drawMap();
    this.drawExit();
    this.drawPers(this.persX, this.persY);
    this.drawBuilds();
    this.enterBuild();
    this.enterExit();

    requestAnimationFrame(this.render);
  };

  this._clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  // DRAW
  this.drawPers = (x, y) => {
    this.ctx.beginPath();
    this.ctx.rect(
      x - this.persRadius / 2,
      y - this.persRadius / 2,
      this.persRadius,
      this.persRadius
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
      let buildX = item.positionX;
      let buildY = item.positionY;

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
        this.persX > item.positionX &&
        this.persX < item.positionX + item.width &&
        this.persY > item.positionY &&
        this.persY < item.positionY + item.height
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
        this.persX > item.position.x &&
        this.persX < item.position.x + item.width &&
        this.persY > item.position.y &&
        this.persY < item.position.y + item.height
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
