// DrawTriangle.js (c) 2012 matsuda
function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById("cnv1");  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  }
  

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');

  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
  ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color
  ctx.strokeStyle = 'red';


  let v1 = new Vector3([2.25, 2.25, 0.0])
  drawVector(v1,'red');
}

function drawVector(v, color){
  ctx.strokeStyle = color;
  let cx = canvas.width/2;
  let cy = canvas.height/2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + v.elements[0]*20, cy - v.elements[1]*20, v.elements[2]*20);
  ctx.stroke();
}

function handleDrawEvent(){

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height); 
  let v1x = document.getElementById("v1x").value;
  let v1y = document.getElementById("v1y").value;

  let v2x = document.getElementById("v2x").value;
  let v2y = document.getElementById("v2y").value;

  let v1 = new Vector3([parseFloat(v1x), parseFloat(v1y), 0.0]);
  let v2 = new Vector3([parseFloat(v2x), parseFloat(v2y), 0.0]);
  drawVector(v1, 'red');
  drawVector(v2, 'blue');
}

function handleDrawOperationEvent(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height); 
  let v1x = document.getElementById("v1x").value;
  let v1y = document.getElementById("v1y").value;

  let v2x = document.getElementById("v2x").value;
  let v2y = document.getElementById("v2y").value;

  let v1 = new Vector3([parseFloat(v1x), parseFloat(v1y), 0.0]);
  let v2 = new Vector3([parseFloat(v2x), parseFloat(v2y), 0.0]);
  drawVector(v1, 'red');
  drawVector(v2, 'blue');


  let operation = document.getElementById("operation").value;
  let scalar = document.getElementById("scalar").value;
  if(operation=='add')
  {let v3 = v1.add(v2);
  drawVector(v3, 'green');}

  if(operation=='sub')
  {let v3 = v1.sub(v2);
    drawVector(v3, 'green');}

  if(operation=='mult')
  {let v3 = v1.mul(scalar);
    drawVector(v3, 'green');

    let v4 = v2.mul(scalar);
    drawVector(v4, 'green');}

  if(operation=='div')
  {let v3 = v1.div(scalar);
    drawVector(v3, 'green');

    let v4 = v2.div(scalar);
    drawVector(v4, 'green');}

  if(operation=='mag')
  {
    m = v1.magnitude();
    console.log("Magnitude of V1:",m)
    m = v2.magnitude();
    console.log("Magnitude of V2:",m)
  }

  if(operation=='norm')
  {
    v3 = v1.normalize();
    drawVector(v3, 'green');
    v4 = v2.normalize();
    drawVector(v4, 'green');
  }

  if(operation=='angle')
  {
    angleBetween(v1, v2);
  }

  if(operation=='area')
  {
    areaTriangle(v1, v2);
  }

}

function angleBetween(v1, v2){
  let d = Vector3.dot(v1, v2);
  let mag_1 = v1.magnitude();
  let mag_2 = v2.magnitude();
  let angle = Math.acos(d/(mag_1*mag_2))*(180/Math.PI);
  console.log("Angle:", angle);
}

function areaTriangle(v1, v2){
  let c = Vector3.cross(v1, v2);
  c = 0.5 * c.magnitude();
  console.log("Area of Triangle:", c);
}
