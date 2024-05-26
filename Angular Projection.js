let initialSpeed;
let theta;
let gravity;
let x, y;
let t;
let paused = false;
let distance = 0;
let simSpeed;
let inputs = {};
let ballPositions = [];

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight * 0.6);
  canvas.parent('simulation'); // Place canvas in the 'simulation' div
  textSize(15);
  fill(255);

  // Default values
  resetSimulation();
}

function draw() {
  background(0);
  drawAxes();
  if (!paused) {
    updateProjectile();
  }
  drawProjectile();
  displayInfo();
}

function resetSimulation() {
  inputs.initialSpeed = parseFloat(document.getElementById('initialSpeed').value);
  inputs.theta = parseFloat(document.getElementById('theta').value);
  inputs.gravity = parseFloat(document.getElementById('gravity').value);
  inputs.simSpeed = parseFloat(document.getElementById('Speed').value);

  x = 0;
  y = height - 50; // Start simulation from the origin of the axes
  t = 0;
  distance = 0;
  paused = false; // Ensure simulation is not paused when reset
  ballPositions = []; // Reset ball positions

  // Remove focus from any input field
  document.activeElement.blur();
}


function updateProjectile() {
  let deltaTime = 0.0125 * inputs.simSpeed;
  t += deltaTime;

  x = inputs.initialSpeed * cos(radians(inputs.theta)) * t;
  y = height - (inputs.initialSpeed * sin(radians(inputs.theta)) * t - 0.5 * inputs.gravity * t * t) - 50; // Adjust y position to start from the origin

  distance = x; // Horizontal distance is the x position

  if (y >= height - 50) { // If the projectile reaches the x-axis
    y = height - 50; // Clamp y value to the x-axis level
    paused = true; // Pause the simulation automatically
  }

  // Store the current position of the ball
  ballPositions.push({ x: x + 50, y: y });
}

function drawAxes() {
  stroke(255);
  strokeWeight(1);
  
  // Draw x-axis
  line(50, height - 50, width - 50, height - 50);
  for (let i = 50; i < width - 50; i += 100) {
    line(i, height - 50, i, height - 55);
    text(i - 50, i, height - 35);
  }
  
  // Draw y-axis
  line(50, height - 50, 50, 50);
  for (let j = height - 150; j > 0; j -= 100) {
    line(45, j, 50, j);
    text(height - 50 - j, 20, j);
  }
}

function drawProjectile() {
  fill(255, 0, 0);
  ellipse(x + 50, y, 10, 10); // Adjust x position to start from the origin

  // Draw the path of the ball
  stroke(243, 12, 85);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let pos of ballPositions) {
    vertex(pos.x, pos.y);
  }
  endShape();
}

function displayInfo() {
  stroke(242, 60, 138); // Set stroke color for the path
  fill(255); // Set fill color to white for the text
  stroke(255, 0); // Set stroke color to transparent for the text border
  textSize(15); // Set text size

  const heightCovered = inputs.initialSpeed * sin(radians(inputs.theta)) * t - 0.5 * inputs.gravity * t * t; // Calculate height covered
  let roundedHeight = heightCovered < 1 ? heightCovered.toFixed(2) : Math.round(heightCovered); // Round height value to two decimal places or nearest integer if close to zero
  
  // If the simulation is paused and the projectile has landed, set the final height to zero
  if (paused && y >= height - 50) {
    roundedHeight = 0;

    // Calculate maximum height (Hm) and time to maximum height (Tm)
    const halfFinalTime = t / 2;
    const max_height_covered = inputs.initialSpeed * sin(radians(inputs.theta)) * halfFinalTime - 0.5 * inputs.gravity * halfFinalTime * halfFinalTime;
    const roundedMaxHeight = max_height_covered < 1 ? max_height_covered.toFixed(2) : Math.round(max_height_covered);
    const finalDistance = distance;

    // Display Hm and Tm above Distance, Time, and Height information
    fill(255); // Set fill color to white for the text
    stroke(255, 0); // Set stroke color to transparent for the text border
    text(`Maximum Height (Hₘ): ${roundedMaxHeight} m`, x + 70, y - 160); // Adjust text position for Hm
    text(`Time of Flight (Tₘ): ${halfFinalTime.toFixed(2)} s`, x + 70, y - 140); // Adjust text position for Tm
    text(`Horizontal Range (R): ${finalDistance.toFixed(2)} m`, x + 70, y - 120);
  }
  
  // Calculate ux and uy
  const ux = inputs.initialSpeed * cos(radians(inputs.theta));
  const uy = - inputs.initialSpeed * sin(radians(inputs.theta)) + inputs.gravity * t;

  fill(255); // Set fill color to white for the text
  stroke(255, 0); // Set stroke color to transparent for the text border
  text(`Distance: ${distance.toFixed(2)} m`, x + 70, y - 20); // Adjust text position for Distance
  text(`Time: ${t.toFixed(2)} s`, x + 70, y - 40); // Adjust text position for Time
  text(`Height: ${roundedHeight} m`, x + 70, y - 60); // Adjust text position for Height
  text(`Vertical Velocity (uᵧ): ${uy.toFixed(2)} m/s`, x + 70, y - 80); // Adjust text position for uy
  text(`Horizontal Velocity (uₓ): ${ux.toFixed(2)} m/s`, x + 70, y - 100); // Adjust text position for ux
}

function keyPressed() {
  if (key === ' ' || key === 'Spacebar') { // Pause/resume simulation on Spacebar press
    togglePause();
  }
}

function togglePause() {
  paused = !paused; // Toggle the paused state
}

// Resize canvas when browser window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight * 0.6);
}