let trees = [];
let car;

const TREE_COUNT = 7;
const TREE_SPACING = 130;
const ROAD_HEIGHT = 60;

function setup() {
  createCanvas(550, 500);

  // making initial trees
  for (let i = 0; i < TREE_COUNT; i++) {
    trees.push(makeTree(width / 2 + i * TREE_SPACING, random(0.9, 1.3)));
  }

  // car 
  car = makeCar(-200, height - ROAD_HEIGHT + 5, 1);
}

function draw() {
  background(200, 220, 255);

  // road
  noStroke();
  fill(100);
  rect(0, height - ROAD_HEIGHT, width, ROAD_HEIGHT);

  // draw trees
  for (let t of trees) {
    t.draw();
  }

  // trees
  trees = trees.filter(t => t.x > -250);
  while (trees.length < TREE_COUNT) {
    trees.push(makeTree(width + 200, random(0.9, 1.3)));
  }

  // draw + move car
  car.draw();
  car.update();
}

// car
function makeCar(x, y, speed) {
  return {
    x,
    y,
    speed,
    draw() {
      push();
      translate(this.x, this.y);
      fill(220, 50, 50);
      rect(0, -30, 120, 30, 8);
      rect(20, -55, 80, 25, 8);
      fill(30);
      ellipse(25, 0, 30, 30);
      ellipse(95, 0, 30, 30);
      pop();
    },
    update() {
      this.x += this.speed;
      // ✅ Stop everything the moment the car exits the canvas
      if (this.x > width) {
        noLoop();
      }
    }
  };
}

// tree
function makeTree(x, scaleFactor) {
  let tree = {
    x,
    scaleFactor,
    branches: [],
    leaves: [],
    draw() {
      push();
      translate(this.x, height);
      scale(this.scaleFactor);

      // trunk
      stroke(80, 50, 20);
      strokeWeight(25);
      line(0, 0, 0, -250);

      // branches
      strokeWeight(8);
      for (let br of this.branches) {
        line(0, br.startY, br.x, br.y);
      }

      // leaves
      noStroke();
      for (let leaf of this.leaves) {
        push();
        translate(leaf.x, leaf.y);
        rotate(leaf.angle);
        fill(leaf.color);
        drawMapleLeaf(leaf.size);
        pop();
        updateLeaf(leaf);
      }

      pop();

      // move tree
      this.x -= 1 * this.scaleFactor;
    }
  };

  // branches
  for (let i = 0; i < 12; i++) {
    let startY = -80 - i * 15;
    let x = random(-100, 100);
    let y = startY - random(30, 60);
    tree.branches.push({ startY, x, y });
  }

  // leaves
  for (let i = 0; i < 120; i++) {
    let br = random(tree.branches);
    tree.leaves.push({
      x: br.x + random(-25, 25),
      y: br.y + random(-25, 25),
      size: random(2, 5),
      color: color(100, 200, 100),
      stage: "bud",
      angle: random(TWO_PI),
      age: 0
    });
  }

  return tree;
}

// leaves
function updateLeaf(leaf) {
  if (leaf.stage === "bud") {
    leaf.size += 0.07;
    if (leaf.size > 16) leaf.stage = "summer";
  } else if (leaf.stage === "summer") {
    leaf.age++;
    if (leaf.age > 200) leaf.stage = "autumn";
  } else if (leaf.stage === "autumn") {
    leaf.age++;
    let progress = map(leaf.age, 0, 300, 0, 1, true);
    if (progress < 0.33) {
      leaf.color = lerpColor(color(100, 200, 100), color(255, 255, 0), progress * 3);
    } else if (progress < 0.66) {
      leaf.color = lerpColor(color(255, 255, 0), color(255, 165, 0), (progress - 0.33) * 3);
    } else {
      leaf.color = lerpColor(color(255, 165, 0), color(200, 0, 0), (progress - 0.66) * 3);
    }
    if (leaf.age > 300 && random(1) < 0.01) {
      leaf.stage = "falling";
    }
  } else if (leaf.stage === "falling") {
    leaf.y += random(0.5, 2);
    leaf.x += random(-0.3, 0.3);
  }
}

// leaf shape
function drawMapleLeaf(s) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = i * PI / 3;
    let r1 = s * 1.8;
    let r2 = s * 0.8;
    vertex(cos(angle) * r1, sin(angle) * r1);
    vertex(cos(angle + PI / 6) * r2, sin(angle + PI / 6) * r2);
  }
  endShape(CLOSE);
}
