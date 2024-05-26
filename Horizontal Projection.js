let initialSpeed;
let height;
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

  // Initialize height with the correct value
  height = windowHeight * 0.6;

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
  inputs.height = parseFloat(document.getElementById('height').value);
  inputs.gravity = parseFloat(document.getElementById('gravity').value);
  inputs.simSpeed = parseFloat(document.getElementById('Speed').value);

  x = 0;
  y = height - inputs.height; // Start simulation from the given height above the x-axis
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

  // Update horizontal position
  x = inputs.initialSpeed * t + 50;

  // Update vertical position affected by gravity
  y = height - inputs.height + 0.5 * inputs.gravity * t * t - 50;

  distance = x; // Horizontal distance is the x position

  // Check if the projectile has reached the ground
  if (y >= height - 50) {
    y = height - 50; // Clamp y value to the ground level
    paused = true; // Pause the simulation automatically
  }

  // Store the current position of the ball
  ballPositions.push({ x: x, y: y });
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
  fill(148, 237, 18);
  ellipse(x, y, 10, 10); // Adjust x position to start from the origin

  // Draw the path of the ball
  stroke(148, 237, 18);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let pos of ballPositions) {
    vertex(pos.x, pos.y);
  }
  endShape();
}

function displayInfo() {
  stroke(182, 243, 94); // Set stroke color for the path
  fill(255); // Set fill color to white for the text
  stroke(255, 0); // Set stroke color to transparent for the text border
  textSize(15); // Set text size

  // If the simulation is paused and the projectile has reached the right boundary
  if (paused && x >= width - 50) {
    // Calculate time of flight
    const timeOfFlight = (width - 50) / inputs.initialSpeed;
    
    // Display time of flight information
    text(`Time of Flight: ${timeOfFlight.toFixed(2)} s`, x - 250, y - 20); // Adjust text position for Time of Flight
  }
  
  // Calculate ux
  const ux = inputs.initialSpeed;
  const uy = inputs.gravity * t;

  // Display information
  text(`Distance: ${(distance - 50).toFixed(2)} m`, x + 70, y - 20); // Adjust text position for Distance
  text(`Time: ${t.toFixed(2)} s`, x + 70, y - 40); // Adjust text position for Time
  text(`Vertical Velocity (uᵧ): ${uy.toFixed(2)} m/s`, x + 70, y - 60); // Adjust text position for uy
  text(`Horizontal Velocity (uₓ): ${ux.toFixed(2)} m/s`, x + 70, y - 80); // Adjust text position for ux
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
