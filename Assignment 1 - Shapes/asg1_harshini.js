// Shaders

// Input: an array of points comes from javascript.
// In this example, think of this array as the variable a_Position;
// Q: Why a_Position is not an array?
// A: Because the GPU process every vertex in parallel
// The language that we use to write the shaders is called GLSL

// Output: sends "an array of points" to the rasterizer.
var VERTEX_SHADER = `
    precision mediump float;

    attribute vec3 a_Position; // a_Position only has x and y coordinates;

    void main() {
        // a_Position is a variable of type vec4 (x,y,z,w)
        gl_Position = vec4(a_Position, 1.0); // return a_Position;
    }
`;

// Input: a fragment (a grid of pixels) comes from the rasterizer.
// It doesn't have vertices as input
// Ouput: a color goes to HTML canvas.
var FRAGMENT_SHADER = `
    precision mediump float;

    uniform vec3 u_Color;

    void main() {
        // Return color red.
        // Colors are defined as vec4, where x->red, y->green, z->blue, w->alpha
        gl_FragColor = vec4(u_Color, 1.0);
    }
`;

    // We will use HTML sliders to set this variable
color = [0.0, 0.25, 1.0];

var canvas;
var gl;
var a_Position;
var x, y;


function main() {
    canvas = document.getElementById("webgl");

    // Retrieve WebGl rendering context
    gl = getWebGLContext(canvas);
    if(!gl) {
        console.log("Failed to get WebGL context.")
        return -1;
    }

    canvas.onmousedown = function(ev){click(ev);};
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // A function to do all the drawing task outside of main
    drawTriangle(gl);
    document.getElementById('redS').addEventListener('mouseup', function(){color[0] = this.value/20; drawTriangle(gl, x, y);});
    document.getElementById('greenS').addEventListener('mouseup', function(){color[1] = this.value/20; drawTriangle(gl, x, y);});
    document.getElementById('blueS').addEventListener('mouseup', function(){color[2] = this.value/20; drawTriangle(gl, x, y);});
    document.getElementById('size').addEventListener('mouseup', function(){size = this.value; drawTriangle(gl, x, y);});
    


    // Change the red component in the color using the slider
    var shape = document.getElementById("square").value;
    if(shape == "traingle"){
    document.getElementById('redS').addEventListener('mouseup', function(){color[0] = this.value/20; draw();});
    document.getElementById('greenS').addEventListener('mouseup', function(){color[1] = this.value/20; draw();});
    document.getElementById('blueS').addEventListener('mouseup', function(){color[2] = this.value/20; draw();});
    }
    if(shape=="square"){
    document.getElementById('redS').addEventListener('mouseup', function(){color[0] = this.value/20; draw_square();});
    document.getElementById('greenS').addEventListener('mouseup', function(){color[1] = this.value/20; draw_square();});
    document.getElementById('blueS').addEventListener('mouseup', function(){color[2] = this.value/20; draw_square();});
    }
}

function draw(){
    // Setting the clear color to be black (0, 0, 0)
    // The last argument is the alpha channel
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Actually clear screen
    gl.clear(gl.COLOR_BUFFER_BIT);
    // We need to define a triangle.
    // A triangle is made out of three points: a, b, c.
    // In webGL, we normally define these points together in one array
    let triangle = new Float32Array([
                     -0.5, -0.5, 0.0, // a: bottom left
                      0.5, -0.5, 0.0, // b: bottom right
                      0.0,  0.5, 0.0  // c: top point
                  ]);

    console.log(triangle);

    // Remember that WebGL uses the GPU to render vertices on the screen.
    // Therefore, we need to send these points to the GPU. Because
    // the GPU is a different processing unit in your computer.

    // We have to compile the vertex and fragment shaders and
    // load them in the GPU
    if(!initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER)) {
        console.log("Failed to compile and load shaders.")
        return -1;
    }

    // Specify how to read points a, b and c from the triangle array
    // Create a WebGL buffer (an array in GPU memory), which is similar
    // to a javascript Array.
    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log("Buffer creation Failed");
        return -1;
    }

    // We have to bind this new buffer to the a_Position attribute in the
    // vertex shader.
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // To map this ARRAY_BUFFER called vertexBuffer to our attribute a_Position
    // in the vertex shader.
    // To do that, we first need to access the memory location of the
    // attribute a_Position. Remember that a_Position is a variable in
    // the GPU memory. So we need to grab that location.
    a_Position = gl.getAttribLocation(gl.program, "a_Position");


      // Register function (event handler) to be called on a mouse press

    // With the location of a_Position, we now have to specy how to split
    // the triangle into different vertices.
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Up to here, we have setup our vertex buffer in the GPU. We need
    // to send our vertices (in this case, a triangle) to this buffer.
    gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.STATIC_DRAW);



    // Change the uniform u_Color in the shader.
    u_Color = gl.getUniformLocation(gl.program, "u_Color");
    gl.uniform3f(u_Color, color[0], color[1], color[2]);

    // Finally, we can call a Draw function
    gl.drawArrays(gl.TRIANGLES, 0, triangle.length/3);
}


function draw_square(){
    // Setting the clear color to be black (0, 0, 0)
    // The last argument is the alpha channel
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Actually clear screen
    gl.clear(gl.COLOR_BUFFER_BIT);
    // We need to define a triangle.
    // A triangle is made out of three points: a, b, c.
    // In webGL, we normally define these points together in one array
    let tri1 = new Float32Array([
                     -0.5, -0.5, 0.0, // a: bottom left
                     0.5, -0.5, 0.0, // b: bottom right
                     -0.5,  0.5, 0.0  // c: top point
                  ]);
    let tri2 = new Float32Array([
                    -0.5, 0.5, 0.0, // a: bottom left
                    0.5, 0.5, 0.0, // b: bottom right
                    0.5,  -0.5, 0.0  // c: top point
                 ]);


    console.log(tri1);
    console.log(tri2);

    // Remember that WebGL uses the GPU to render vertices on the screen.
    // Therefore, we need to send these points to the GPU. Because
    // the GPU is a different processing unit in your computer.

    // We have to compile the vertex and fragment shaders and
    // load them in the GPU
    if(!initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER)) {
        console.log("Failed to compile and load shaders.")
        return -1;
    }

    // Specify how to read points a, b and c from the triangle array
    // Create a WebGL buffer (an array in GPU memory), which is similar
    // to a javascript Array.
    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log("Buffer creation Failed");
        return -1;
    }

    // We have to bind this new buffer to the a_Position attribute in the
    // vertex shader.
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // To map this ARRAY_BUFFER called vertexBuffer to our attribute a_Position
    // in the vertex shader.
    // To do that, we first need to access the memory location of the
    // attribute a_Position. Remember that a_Position is a variable in
    // the GPU memory. So we need to grab that location.
    a_Position = gl.getAttribLocation(gl.program, "a_Position");


      // Register function (event handler) to be called on a mouse press

    // With the location of a_Position, we now have to specy how to split
    // the triangle into different vertices.
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Up to here, we have setup our vertex buffer in the GPU. We need
    // to send our vertices (in this case, a triangle) to this buffer.
    gl.bufferData(gl.ARRAY_BUFFER, tri1, gl.STATIC_DRAW);

    // Change the uniform u_Color in the shader.
    u_Color = gl.getUniformLocation(gl.program, "u_Color");
    gl.uniform3f(u_Color, color[0], color[1], color[2]);

    // Finally, we can call a Draw function
    gl.drawArrays(gl.TRIANGLES, 0, tri1.length/3);

    gl.bufferData(gl.ARRAY_BUFFER, tri2, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, tri2.length/3);

}

function clearCanvas(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}



var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point

function convertCoordinatesEventToGL(ev){
    x= ev.clientX;
    y= ev.clientY;
    var rect = ev.target.getBoundingClientRect() ;

   // set coordinates based on origin
   x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
   y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

   // Print coordinate in console
   // console.log("("+x+","+y+")");

   return([x,y]);
}

function click(ev) {
    var [x,y] = convertCoordinatesEventToGL(ev);
    console.log([x,y]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    drawTriangle(gl,x,y);
 }

 function drawTriangle(gl,x,y){
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    console.log(gl);


    let triangle = new Float32Array([
        -0.5, -0.5, 0.0, // a: bottom left
         0.5, -0.5, 0.0, // b: bottom right
         0.0,  0.5, 0.0  // c: top point
     ]);
    

    console.log(triangle);
    if(!initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER)){
        console.log("Falied to load shaders");
        return -1;
    }

    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log("Failed to create buffer");
        return -1;
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, 0, 0, 0 );
    gl.enableVertexAttribArray(a_Position);

    gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.STATIC_DRAW);

    
    let u_Color = gl.getUniformLocation(gl.program, "u_Color");
    gl.uniform3f(u_Color, color[0], color[0], color[0]);

    gl.drawArrays(gl.TRIANGLES,0, triangle.length/3);

}



