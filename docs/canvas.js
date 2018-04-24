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
        color: "rgb(250, 93, 240)",
        enter: 0,
        hover: false
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
        enter: 0,
        hover: false
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
        enter: 0,
        hover: false
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
        enter: 0,
        hover: false
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
        enter: 0,
        hover: false
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
        enter: 0,
        hover: false
      }
    ]
  }
];

const ANIMATE_INTERBAL = 5;

function Combats(el, options) {
  this.canvas = el;
  this.ctx = this.canvas.getContext("2d");

  this.player = {
    position: {
      x: 10,
      y: 10
    },
    radius: 10,
    animated: false,
    to: {
      x: 0,
      y: 0
    },
    location: options.location || ""
  };
  this.mouse = {
    position: {
      x: 0,
      y: 0
    },
    hover: false
  };

  this.builds = null;
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
    this.player.position.x = 10;
    this.player.position.y = 10;

    this.player.location = location;
  };

  this.init = location => {
    this.changeLocation(location);

    this.render();
    el.addEventListener("click", this.moveTo, false);
    // console.log("this.canvas: ", this.canvas);
  };

  this.canvas.onmousemove = e => {
    let r = this.canvas.getBoundingClientRect();

    this.mouse.x = e.clientX - r.left;
    this.mouse.y = e.clientY - r.top;

    this.builds.forEach(item => {
      if (
        this.mouse.x > item.position.x &&
        this.mouse.x < item.position.x + item.width &&
        this.mouse.y > item.position.y &&
        this.mouse.y < item.position.y + item.height
      ) {
        item.hover = true;
        // this.mouse.hover = true;
      } else {
        item.hover = false;
        // this.mouse.hover = false;
      }
    });
  };

  this.moveTo = e => {
    this.player.animated = true;

    this.player.to.x = e.clientX - this.canvas.offsetLeft;
    this.player.to.y = e.clientY - this.canvas.offsetTop;

    if (this.player.animated) {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(this._animate, ANIMATE_INTERBAL);
    }
  };

  this._animate = () => {
    if (this.player.position.x < this.player.to.x) {
      this.player.position.x++;
    } else if (this.player.position.x > this.player.to.x) {
      this.player.position.x--;
    }
    if (this.player.position.y < this.player.to.y) {
      this.player.position.y++;
    } else if (this.player.position.y > this.player.to.y) {
      this.player.position.y--;
    }

    if (
      this.player.position.x == this.player.to.x &&
      this.player.position.y == this.player.to.y
    ) {
      this.player.animated = false;
      clearInterval(this.intervalId);
    }
  };

  this.render = () => {
    this._clearCanvas();
    this.drawMap();
    this.drawExit();
    this.drawplayer(this.player.position.x, this.player.position.y);
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
      x - this.player.radius / 2,
      y - this.player.radius / 2,
      this.player.radius,
      this.player.radius
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
      if (item.hover) {
        this.ctx.strokeStyle = "gold";
        this.ctx.stroke();
      } else if (item.enter) {
        this.ctx.strokeStyle = "red";
        this.ctx.stroke();
      }
      this.ctx.closePath();
    });
  };

  this.enterBuild = () => {
    this.builds.forEach(item => {
      if (
        this.player.position.x > item.position.x &&
        this.player.position.x < item.position.x + item.width &&
        this.player.position.y > item.position.y &&
        this.player.position.y < item.position.y + item.height
      ) {
        item.enter = 1;
      } else {
        item.enter = 0;
      }
    });
  };

  this.enterExit = () => {
    this.exit.forEach(item => {
      if (
        this.player.position.x > item.position.x &&
        this.player.position.x < item.position.x + item.width &&
        this.player.position.y > item.position.y &&
        this.player.position.y < item.position.y + item.height
      ) {
        console.log(item.to);
        this.changeLocation(item.to);
        item.enter = 1;
      }
    });
  };

  this.init(options.location);

  return this;
}
