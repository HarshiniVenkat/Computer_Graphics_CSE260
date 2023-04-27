var vertexBuffer;
var shape;
var segments;
var figure_vertices;
rotateAngle = 0;
showAgentPerry = false;
HeadRotateAngle = 5;
flapTail = true;
swim = false;
bodyswim = false;
feetAngle = 0;
legAngle = 0;
special_animation = false;
xclick =0;
yclick =0;
drag = false;
slider_drag=true;
angle_x=0;
angle_y=0;
init_x=0;
init_y=0;
var g_camera = new Camera();

let VERTEX_SHADER = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;  
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

    void main(){
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
    }
`;
let FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_Color;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform int u_whichTexture;

    void main(){
        if(u_whichTexture == -5){           //Brick Red Base
            gl_FragColor = texture2D(u_Sampler3, v_UV);
        }
        else if(u_whichTexture == -4){           //Chess.jpg
            gl_FragColor = texture2D(u_Sampler2, v_UV);
        }
        else if(u_whichTexture == -3){           //Chess.jpg
            gl_FragColor = texture2D(u_Sampler1, v_UV);
        }
        else if(u_whichTexture == -2){           //Use color
            gl_FragColor = u_Color;
        }
        else if(u_whichTexture == -1){      //Use UV debug color
            gl_FragColor = vec4(v_UV, 1.0, 1.0);
        }
        else if(u_whichTexture == 0){       // Stone Wall
            gl_FragColor = texture2D(u_Sampler0, v_UV);
        }
        else{                               //Error, put Redish
            gl_FragColor = vec4(1, .2, .2, 1);
        }

    }
`;


function main(){
    canvas = document.getElementById("webgl");

    ConnectVariablesToGLSL();
    setupBuffer();
    clearCanvas();
    initTextures();
    requestAnimationFrame(tick);
    gl.enable(gl.DEPTH_TEST);
    allHTMLfunctionCalls();
}

function ConnectVariablesToGLSL(){

    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl){
        console.log("Failed to get webGL");
        return -1;
    } 
    if(!initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER)){
        console.log("Falied to load shaders");
        return -1;
    }
    a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if(a_Position<0){
        console.log("Failed to get the storage location of a_Position");
        return;
    }
    vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log("Failed to create buffer");
        return -1;
    }
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if(!u_ModelMatrix){
        console.log("Failed to access u_ModelMatrix");
        return;
    }
    uvBuffer = gl.createBuffer();
    if(!uvBuffer){
        console.log("Failed to create UV buffer object");
        return -1;
    }
    a_UV = gl.getAttribLocation(gl.program, "a_UV");
    if(a_UV<0){
        console.log("Failed to get the storage location of a_UV");
        return;
    }
    texture = gl.createTexture();   // Create a texture object
    if (!texture) {
      console.log('Failed to create the texture object');
      return false;
    }
    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if(!u_whichTexture){
        console.log("Failed to create Texture Variable");
        return -1;
    }
  
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if(!u_GlobalRotateMatrix){
        console.log("Failed to access u_ModelMatrix");
        return;
    }
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if(!u_ProjectionMatrix){
        console.log("Failed to access u_ProjectionMatrix");
        return;
    }
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if(!u_ViewMatrix){
        console.log("Failed to access u_ViewMatrix");
        return;
    }

    // Get the storage location of u_Sampler
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
    if (!u_Sampler0 || !u_Sampler1 || !u_Sampler2 || !u_Sampler3) {
        console.log('Failed to get the storage location of u_Sampler');
        return false;
    }

    image0 = new Image();  
    image1 = new Image();  
    image2 = new Image();
    image3 = new Image();
    if (!image0|| !image1 || !image2 || !image3) {
        console.log('Failed to create the image object');
        return false;
      }

    texture0 = gl.createTexture(); 
    texture1 = gl.createTexture();
    texture2 = gl.createTexture();
    texture3 = gl.createTexture();
    if (!texture0 || !texture1 || !texture2|| !texture3) {
        console.log('Failed to create the texture object');
        return false;
      }

}

function clearCanvas(){
    gl.clearColor(81/225, 166/225, 240/225, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function convertCoordinatesEventToGL(ev){
    x= ev.clientX;
    y= ev.clientY;
    var rect = ev.target.getBoundingClientRect() ;

   // set coordinates based on origin
   x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
   y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

   return [x,y];
}
function allHTMLfunctionCalls(){
    canvas.onmousedown = function(ev){click(ev);};
    canvas.addEventListener('click', specialAnimation);
    canvas.addEventListener('mousemove', specialAnimation, false);
    document.getElementById('CameraAngle').addEventListener("mousemove",function() { rotateAngle = this.value; slider_drag=true;});
    document.onkeydown = keydown;
    canvas.onmousemove = function(ev){
        mouseCam(ev);    }

}

function setupBuffer(){

    var vertices  = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, 0, 0, 0 );
    gl.enableVertexAttribArray(a_Position);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}

function setupUVBuffer()
{
    var uv_vertices = new Float32Array([0, 0, 0, 0, 0, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uv_vertices, gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(a_UV);
}

function initTextures() {

    // Register the event handler to be called on loading an image
    image0.onload = function(){ loadTexture(texture0, u_Sampler0, image0, 0); };
    image1.onload = function(){ loadTexture(texture1, u_Sampler1, image1, 1); };
    image2.onload = function(){ loadTexture(texture2, u_Sampler2, image2, 2); };
    image3.onload = function(){ loadTexture(texture3, u_Sampler3, image3, 3); };

    
    // Tell the browser to load an image
    image0.src = 'stoneblur.png';
    image1.src = 'grass.png';
    image2.src = 'gold.png';
    image3.src = 'brickred.jpg';

    return true;
  }
  

var g_texUnit0 = false, g_texUnit1 = false, g_texUnit2 = false, g_texUnit3 = false; 
function loadTexture(texture, u_Sampler, image, texUnit) {

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);// Flip the image's y-axis
    // Make the texture unit active
    if (texUnit == 0) {
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    }
    if (texUnit == 1) {
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;
    } 
    if (texUnit == 2) {
        gl.activeTexture(gl.TEXTURE2);
        g_texUnit2 = true;
    } 
    if (texUnit == 3) {
        gl.activeTexture(gl.TEXTURE3);
        g_texUnit3 = true;
    } 

    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);   

    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the image to texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler, texUnit);   // Pass the texure unit to u_Sampler

    // Clear <canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // if (g_texUnit0 && g_texUnit1) {
    //     gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);   // Draw the rectangle
    // }
 }
  

function click(ev) {
    console.log("Inside Click!!");
    var [x,y] = convertCoordinatesEventToGL(ev);
    console.log(x,y);
 }



function keydown(ev){
    if(ev.keyCode ==68){ //D key
        g_camera.right();
    }
    if(ev.keyCode==65){ //A Key
        g_camera.left();
    }
    if(ev.keyCode==87){ // W Key
        g_camera.forward();
    }
    if(ev.keyCode==83){ // S Key
        g_camera.backward();
    }
    if(ev.keyCode==81){ // Q Key
        g_camera.rotLeft();
    }
    if(ev.keyCode==69){ // E Key
        g_camera.rotRight();
    }
    if(ev.keyCode==38){ // Arrow Up Key
        g_camera.upward();
    }
    if(ev.keyCode==40){ // Arrow Down Key
        g_camera.downward();
    }
}

function mouseCam(ev){
    coord = convertCoordinatesEventToGL(ev);
    if(coord[0] < 0){ // left side
       g_camera.rotLeft_mouse();
    } else{
       g_camera.rotRight_mouse();
    }
}

function setupColor(red, green, blue, alpha)
{
    u_Color = gl.getUniformLocation(gl.program, "u_Color");
    gl.uniform4f(u_Color, red, green, blue, alpha);

}

function updateMatrix(matrix)
{
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick(){
    g_seconds = performance.now()/1000.0 - g_startTime;
    RenderScene();

    requestAnimationFrame(tick);
}

function specialAnimation(ev) {
    if(ev.shiftKey & ev.type==="click"){
        console.log("Inside special ani");
        special_animation = true;
    }
    if(ev.type=="click" || ev.buttons===1){
        xclick = ev.clientX;
        yclick = ev.clientY;
        drag = true;
    }
}


let g_map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 3, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 6, 6, 6, 6, 6, 6, 4, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 2, 1, 0, 0, 0, 1, 2, 3, 4, 6, 7, 7, 7, 7, 6, 4, 3, 2, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 6, 7, 7.5, 7.5, 7, 6, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 6, 7, 7.5, 7.5, 7, 6, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 2, 0, 0, 0, 0, 0, 2, 3, 4, 6, 7, 7, 7, 7, 6, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 6, 6, 6, 6, 6, 6, 4, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1],
    [0, 0, 0, 0, 3, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0]
];

function drawMap(){
    // var c = new Cube();
    for(x=0; x<32; x++){
        for(y=0;y<32;y++){
            if(g_map[x][y] > 0 && g_map[x][y] < 6){   
                for(z=0; z<g_map[x][y]; z++){
                    var wall = new Cube([1,0,0,1]);
                    if(x>11 && x<26 && y>7 && y<22) wall.textureNum = -5;
                    else wall.textureNum = 0;
                    wall.matrix.translate(y-4, z-.75, x-4);
                    wall.renderfaster();
                }              
            }
            if(g_map[x][y] > 5){
                for(z=0; z<g_map[x][y]; z++){
                    var wall = new Cube([1,1,1,1]);
                    wall.textureNum = -4;
                    wall.matrix.translate(y-4, z-.75, x-4);
                    wall.renderfaster();
                }      
            }   
        }
    }
}


function RenderScene()
{
    var start_time = performance.now() / 1000.0;

    var ProjMatrix = new Matrix4();
    ProjMatrix.setPerspective(100, 1*canvas.width/canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, ProjMatrix.elements);

    var viewMatrix = new Matrix4();
    viewMatrix.setLookAt(
        g_camera.g_eye.elements[0], g_camera.g_eye.elements[1], g_camera.g_eye.elements[2],  
        g_camera.g_at.elements[0],  g_camera.g_at.elements[1],  g_camera.g_at.elements[2],
        g_camera.g_up.elements[0],  g_camera.g_up.elements[1],  g_camera.g_up.elements[2]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);


    var globalRotMat = new Matrix4().rotate(rotateAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawMap();
    if(showAgentPerry) displayPerry();

    if(slider_drag){
        rotateAngle = parseInt(document.getElementById("CameraAngle").value)
        slider_drag = false;
    }
    if(drag){
        angle_x = ((angle_x + (init_x - xclick))%360);
        angle_y = ((angle_y + (init_y - yclick))%360);
        document.getElementById("CameraAngle").value=parseInt(angle_x);
        rotateAngle = angle_x
        init_x =xclick;
        init_y = yclick;
        drag = false;
    }

    var floor = new Cube([1, 0, 0, 1]);
    floor.textureNum = -3;
    floor.matrix.translate(0, -1, -.5);
    floor.matrix.scale(40, .01, 40);
    floor.matrix.translate(-.15, 0, -.15);
    floor.render();


    var sky = new Cube([153/255, 214/255, 255/255]);
    sky.textureNum = -2;
    sky.matrix.translate(-1,0,-1);
    sky.matrix.scale(50,50,50);
    sky.matrix.translate(-.3,-.5,-.3);
    sky.render();

    var end_time = performance.now() / 1000.0;
    document.getElementById('fps').innerHTML = "FPS: " + Math.round(1 / (end_time-start_time), 2)

}

function displayPerry(){
    var body = new Cube([0, 153/225, 153/225, 1]);
    //body.textureNum = 0;
    if(special_animation){
        body.matrix.translate(0, 0.3*Math.sin(g_seconds), 0);
    }
    //body.matrix.translate(-0.65, -0.5, 0.2);
    body.matrix.translate(4, -0.5, 0.2);
    body.matrix.rotate(48, 0, 1, 0);
    if(bodyswim){
        body.matrix.rotate(10*Math.sin(g_seconds), 1, 0, 1);
    }
    else{
        body.matrix.rotate(-5, 1, 0, 1);
    }
    body.matrix.scale(0.95, 0.5, 0.6);
    body.render();

    var head = new Cube([0, 153/225, 153/225, 1]);
    head.matrix = new Matrix4(body.matrix);
    head.matrix.translate(0.8, 0.65, 0);
    head.matrix.rotate(HeadRotateAngle*(Math.sin(g_seconds)), 0, 1, 0);
    head.matrix.scale(0.5, 0.8,1);
    head.render();

    var temp_head_mat = new Cube(head.matrix);
    temp_head_mat.matrix.rotate(90, 0, 1, 0)
    temp_head_mat.matrix.translate(-1.2, 0, 0.75)
    setupColor(1, 1, 1, 1.0)
    drawCircles(1, 0.7, 0.3, 0.15, temp_head_mat)
    drawCircles(0.4, 0.7, 0.3, 0.15, temp_head_mat)
    setupColor(0, 0, 0, 1.0)
    drawCircles(1, 0.7, 0.31, 0.05, temp_head_mat)
    drawCircles(0.4, 0.7, 0.31, 0.05, temp_head_mat)

    var topbeak = new Cube([1, 0.5, 0, 1]);
    topbeak.matrix = new Matrix4(head.matrix);
    topbeak.matrix.translate(1, 0.2, 0);
    topbeak.matrix.rotate(25, 0, 0, 1);
    topbeak.matrix.scale(0.3, 0.1, 1);
    topbeak.render();


    var bottombeak = new Cube([1, 0.5, 0, 1]);
    bottombeak.matrix = new Matrix4(head.matrix);
    bottombeak.matrix.translate(1, 0.2, 0);
    bottombeak.matrix.rotate(-25, 0, 0, 1);
    bottombeak.matrix.scale(0.3, 0.1, 1);
    bottombeak.render();

    var hatbottom = new Cube([156/225, 68/225, 17/225, 1])
    hatbottom.matrix = new Matrix4(head.matrix);
    hatbottom.matrix.translate(0, 1, -0.15);
    hatbottom.matrix.scale(1, 0.25, 1.3);
    hatbottom.render();

    var hattop = new Cube([156/225, 68/225, 17/225, 1])
    hattop.matrix = new Matrix4(head.matrix);
    hattop.matrix.translate(0, 1, 0);
    hattop.matrix.scale(1, 0.65, 1);
    hattop.render();

    var tail = new Cube([1, 0.5, 0, 1]);
    tail.matrix = new Matrix4(body.matrix);
    tail.matrix.translate(0.1, 0.65, 0.1);
    if(flapTail){
        tail.matrix.rotate(30*Math.sin(g_seconds), 0, 0, 1);
    }
    tail.matrix.scale(-0.5, 0.2, 0.9);
    tail.render()

    var frontleftlegtop = new Cube([0, 153/225, 153/225, 1]);
    frontleftlegtop.matrix = new Matrix4(body.matrix);
    frontleftlegtop.matrix.translate(0.9, 0, -0.2)
    frontleftlegtop.matrix.rotate(legAngle, 0, 1, 0);
    frontleftlegtop.matrix.scale(0.05, 0.1, 0.2);
    frontleftlegtop.render();

    var frontleftlegbottom = new Cube([1, 0.5, 0, 1]);
    frontleftlegbottom.matrix = new Matrix4(frontleftlegtop.matrix);
    frontleftlegbottom.matrix.translate(0.3, -1.3, -0.1);
    if(swim){
        frontleftlegbottom.matrix.rotate(Math.abs(45*Math.sin(g_seconds)), 0, 1, 0);
    }
    frontleftlegbottom.matrix.rotate(feetAngle, 0, 0, 1);
    frontleftlegbottom.matrix.scale(3.5, 3.5, 0.3);
    frontleftlegbottom.render();

    var frontrightlegtop = new Cube([0, 153/225, 153/225, 1]);
    frontrightlegtop.matrix = new Matrix4(body.matrix);
    frontrightlegtop.matrix.translate(0.9, 0, 1);
    frontrightlegtop.matrix.rotate(legAngle, 0, 1, 0);
    frontrightlegtop.matrix.scale(0.05, 0.1, 0.2);
    frontrightlegtop.render();

    var frontrightlegbottom = new Cube([1, 0.5, 0, 1]);
    frontrightlegbottom.matrix = new Matrix4(frontrightlegtop.matrix);
    frontrightlegbottom.matrix.translate(0.3, -1.3, 0.75);
    if(swim){
        frontrightlegbottom.matrix.rotate(-Math.abs(45*Math.sin(g_seconds)), 0, 1, 0);
    }
    frontrightlegbottom.matrix.rotate(feetAngle, 0, 0, 1);
    frontrightlegbottom.matrix.scale(3.5, 3.5, 0.3);
    frontrightlegbottom.render();

    var backleftlegtop = new Cube([0, 153/225, 153/225, 1]);
    backleftlegtop.matrix = new Matrix4(body.matrix);
    backleftlegtop.matrix.translate(0.2, -0.15, -0.1)
    backleftlegtop.matrix.rotate(legAngle, 0, 1, 0);
    backleftlegtop.matrix.scale(0.05, 0.2, 0.1);
    backleftlegtop.render();

    var backleftlegbottom = new Cube([1, 0.5, 0, 1]);
    backleftlegbottom.matrix = new Matrix4(backleftlegtop.matrix);
    backleftlegbottom.matrix.translate(0, -0.33, -0.3);
    if(swim){
        backleftlegbottom.matrix.rotate(Math.abs(45*Math.sin(g_seconds)), 0, 1, 0);
    }
    backleftlegbottom.matrix.rotate(feetAngle, 0, 0, 1);
    backleftlegbottom.matrix.scale(4, 2, 0.3);
    backleftlegbottom.render();

    var backrightlegtop = new Cube([0, 153/225, 153/225, 1]);
    backrightlegtop.matrix = new Matrix4(body.matrix);
    backrightlegtop.matrix.translate(0.2, -0.15, 1)
    backrightlegtop.matrix.rotate(legAngle, 0, 1, 0);
    backrightlegtop.matrix.scale(0.05, 0.2, 0.1);
    backrightlegtop.render();

    var backrightlegbottom = new Cube([1, 0.5, 0, 1]);
    backrightlegbottom.matrix = new Matrix4(backrightlegtop.matrix);
    backrightlegbottom.matrix.translate(0, -0.33, 1.1);
    if(swim){
        backrightlegbottom.matrix.rotate(-Math.abs(75*Math.sin(g_seconds)), 0, 1, 0);
    }
    backrightlegbottom.matrix.rotate(feetAngle, 0, 0, 1);
    backrightlegbottom.matrix.scale(4, 2, 0.3);
    backrightlegbottom.render();

}


function showPerry(){
    showAgentPerry=true;
}
function hidePerry(){
    showAgentPerry=false;
}
function stopAnimation(){
    special_animation=false;
    flapTail = false;
    HeadRotateAngle = 0;
    bodyswim = false;
    swim = false;
}
function startAnimation(){
    flapTail = true;
    swim = true;
    bodyswim = true;
    HeadRotateAngle = 5;
}


function DrawFigureTriangle(vertices){
    setupBuffer();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);
}

function DrawTriangle3DUV(vertices, uv){
    setupBuffer();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);

    setupUVBuffer();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

}

function DrawFigureTriangle_renderFast(vertices){
    var n = vertices.length/3;

    console.log("Number of vertices:", n);

    vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log("Failed to create buffer");
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, 0, 0, 0 );
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);


}

function drawCircles(x, y, z, shape, head_mat)
{
    var segments = 15;
    var theta_in_degrees = (360 / segments);
    for (var segment_idx=1; segment_idx<(segments+1); segment_idx++)
    {
      var theta_in_radians = (theta_in_degrees * (segment_idx-1)) * (Math.PI / 180);
      var pt1_x = (x + (shape * Math.cos(theta_in_radians)));
      var pt1_y = (y + (shape * Math.sin(theta_in_radians)));
      theta_in_radians = (theta_in_degrees * segment_idx) * (Math.PI / 180);
      var pt2_x = (x + (shape * Math.cos(theta_in_radians)));
      var pt2_y = (y + (shape * Math.sin(theta_in_radians)));
      var result_1, result_2, result_3;
      result_1 = head_mat.matrix.multiplyVector3(new Vector3([x, y, z])).elements
      result_2 = head_mat.matrix.multiplyVector3(new Vector3([pt1_x, pt1_y, z])).elements
      result_3 = head_mat.matrix.multiplyVector3(new Vector3([pt2_x, pt2_y, z])).elements
      DrawFigureTriangle([result_1[0], result_1[1], result_1[2],
                      result_2[0], result_2[1], result_2[2],
                      result_3[0], result_3[1], result_3[2]]);
    }
}
