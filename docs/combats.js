"use strict";

/**
 *
 */
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
  }
];

const ANIMATE_INTERBAL = 5;

class Combats {
  constructor(el, options) {
    this.canvas = el;
    this.ctx = this.canvas.getContext("2d");

    this.player = {
      position: {
        x: 10,
        y: 10
      },
      size: 10,
      animated: false,
      to: {
        x: null,
        y: null
      },
      location: options.location || "main"
    };
    this.mouse = {
      position: {
        x: 0,
        y: 0
      },
      hover: false
    };

    this.builds = null;
    this.intervalId = null;

    this.init();
  }

  /**
   * Инициализация проекта
   */
  init() {
    this.setLocation(this.player.location);

    this.render();
    this.canvas.addEventListener(
      "click",
      e => {
        const x = e.clientX - this.canvas.offsetLeft;
        const y = e.clientY - this.canvas.offsetTop;

        return this.playerMove(x, y);
      },

      false
    );
    // TODO: Не работает в safari
    // выполняется только один раз
    // так же выполняется если нажатить на cmd, alt ...
    this.canvas.onmousemove = e => {
      this.checkHoverBuild(e);
    };
  }
  /**
   * Если курсор находится на здании подсветим его
   * @param {Event} e
   */
  checkHoverBuild(e) {
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
      } else {
        item.hover = false;
      }
    });
  }
  /**
   * Отрисовка canvas
   */
  render() {
    this._clearCanvas();
    this.drawMap();
    this.drawExit();
    this.drawPlayer(this.player.position.x, this.player.position.y);
    this.drawBuilds();
    this.checkEnterBuild();
    this.checkEnterExit();

    requestAnimationFrame(this.render.bind(this));
  }
  _clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawMap() {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "green";
    this.ctx.fill();
    this.ctx.closePath();
  }
  drawExit() {
    this.exit.forEach(item => {
      this.ctx.beginPath();
      this.ctx.rect(item.position.x, item.position.y, item.width, item.height);
      this.ctx.fillStyle = item.color;
      this.ctx.fill();
      this.ctx.closePath();
    });
  }
  drawPlayer(x, y) {
    this.ctx.beginPath();
    this.ctx.rect(
      x - this.player.size / 2,
      y - this.player.size / 2,
      this.player.size,
      this.player.size
    );
    this.ctx.fillStyle = "red";
    this.ctx.fill();
    this.ctx.closePath();
  }
  drawBuilds() {
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
  }
  /**
   * Если персонаж зашел в здание, подсветим его
   */
  checkEnterBuild() {
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
  }
  /**
   * Если персонаж защел в зоню перехода, сменим локацию
   */
  checkEnterExit() {
    this.exit.forEach(item => {
      if (
        this.player.position.x > item.position.x &&
        this.player.position.x < item.position.x + item.width &&
        this.player.position.y > item.position.y &&
        this.player.position.y < item.position.y + item.height
      ) {
        this.setLocation(item.to);
        item.enter = 1;
      }
    });
  }
  /**
   * Запускаем интервальную функцию передвижения _animate()
   * @param {Number} x
   * @param {Number} y
   *
   */
  playerMove(x, y) {
    this.player.animated = true;
    this.player.to.x = x;
    this.player.to.y = y;

    if (this.player.animated) {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(this._animate.bind(this), ANIMATE_INTERBAL);
    }
  }
  /**
   * текущая позиция персонажа:
   * this.player.position.x
   * this.player.position.y
   *
   * Позиция куда необходимо перейти:
   * this.player.to.x
   * this.player.to.y
   */
  _animate() {
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
      this.player.to.x = null;
      this.player.to.y = null;
      clearInterval(this.intervalId);
    }
  }
  /**
   * Устанавливаем новую локацию при переходе,
   * для отрисовки новых точек на карте
   * @param {String} location
   */
  setLocation(location) {
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
  }
}
