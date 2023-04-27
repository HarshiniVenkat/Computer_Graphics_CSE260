var vertexBuffer;
var shape;
var segments;
var figure_vertices;



let VERTEX_SHADER = `
  precision mediump float;
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;  
  uniform mat4 u_GlobalRotateMatrix;
    void main(){
        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    }
`;
let FRAGMENT_SHADER = `
  precision mediump float;
  
  uniform vec4 u_Color;

    void main(){
        gl_FragColor = u_Color;
    }
`;


function main(){
    canvas = document.getElementById("webgl");
    rotateAngle = 0;
    openBill = false;
    HeadRotateAngle = 5;
    EvilEye = false;
    wantSnack = false;
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


    
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    

    if (!gl){
        console.log("Failed to get webGL");
        return -1;
    } 

    if(!initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER)){
        console.log("Falied to load shaders");
        return -1;
    }

    setupBuffer();
    canvas.onmousedown = function(ev){click(ev);};
    canvas.addEventListener('click', specialAnimation);
    canvas.addEventListener('mousemove', specialAnimation, false);
    clearCanvas();

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if(!u_GlobalRotateMatrix){
        console.log("Failed to access u_ModelMatrix");
        return;
    }

    requestAnimationFrame(tick);
    gl.enable(gl.DEPTH_TEST);

    document.getElementById('CameraAngle').addEventListener("mousemove",function() { rotateAngle = this.value; slider_drag=true;});
    document.getElementById('feetmovement').addEventListener("mousemove",function() { feetAngle = this.value; RenderScene()});
    document.getElementById('legmovement').addEventListener("mousemove",function() { legAngle = this.value; RenderScene()});
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

function setupBuffer(){
    var vertices  = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log("Failed to create buffer");
        return -1;
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, 0, 0, 0 );
    gl.enableVertexAttribArray(a_Position);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}

function click(ev) {
    console.log("Inside Click!!");
    var [x,y] = convertCoordinatesEventToGL(ev);
    console.log(x,y);
    if(shape=='triangle'){drawTriangle();}
    if(shape=='square'){drawSquare();}
    if(shape=='circle'){drawCircle();}
 }

function setupColor(red, green, blue, alpha)
{
    u_Color = gl.getUniformLocation(gl.program, "u_Color");
    gl.uniform4f(u_Color, red, green, blue, alpha);

}

function updateMatrix(matrix)
{
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if(!u_ModelMatrix){
        console.log("Failed to access u_ModelMatrix");
        return;
    }
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick(){
    g_seconds = performance.now()/1000.0 - g_startTime;
    RenderScene();
    //console.log("Inside Tick");

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


function RenderScene()
{
    var start_time = performance.now() / 1000.0;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

    var globalRotMat = new Matrix4().rotate(rotateAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    var body = new Cube([0, 153/225, 153/225, 1]);
    if(special_animation){
        body.matrix.translate(0, 0.3*Math.sin(g_seconds), 0);
    }
    body.matrix.translate(-0.65, -0.5, 0.2);
    body.matrix.rotate(25, 0, 1, 0);
    if(bodyswim){
        body.matrix.rotate(10*Math.sin(g_seconds), 1, 0, 1);
    }
    else{
        body.matrix.rotate(-5, 1, 0, 1);
    }
    body.matrix.scale(0.8, 0.5, 0.6);
    body.render();

    var head = new Cube([0, 153/225, 153/225, 1]);
    head.matrix = new Matrix4(body.matrix);
    head.matrix.translate(0.8, 0.65, 0);
    if(wantSnack){
        head.matrix.rotate(20*(Math.sin(g_seconds)), 0,0, 1);}
    else{
        head.matrix.rotate(HeadRotateAngle*(Math.sin(g_seconds)), 0, 1, 0);
    }
    head.matrix.scale(0.5, 0.8,1);
    head.render();

    var temp_head_mat = new Cube(head.matrix);
    temp_head_mat.matrix.rotate(90, 0, 1, 0)
    temp_head_mat.matrix.translate(-1.2, 0, 0.75)
    setupColor(1, 1, 1, 1.0)
    if(EvilEye){setupColor(1, 0, 0, 1.0)}
    drawCircles(1, 0.7, 0.3, 0.15, temp_head_mat)
    drawCircles(0.4, 0.7, 0.3, 0.15, temp_head_mat)
    setupColor(0, 0, 0, 1.0)
    if(EvilEye){setupColor(0, 0, 0, 1.0)}
    drawCircles(1, 0.7, 0.31, 0.05, temp_head_mat)
    drawCircles(0.4, 0.7, 0.31, 0.05, temp_head_mat)

    var topbeak = new Cube([1, 0.5, 0, 1]);
    topbeak.matrix = new Matrix4(head.matrix);
    topbeak.matrix.translate(1, 0.2, 0);
    if(openBill){
        topbeak.matrix.rotate(25*Math.abs(Math.sin(g_seconds)), 0, 0, 1);
    }
    else{
        topbeak.matrix.rotate(25, 0, 0, 1);
    }
    topbeak.matrix.scale(0.3, 0.1, 1);
    topbeak.render();


    var bottombeak = new Cube([1, 0.5, 0, 1]);
    bottombeak.matrix = new Matrix4(head.matrix);
    bottombeak.matrix.translate(1, 0.2, 0);

    if(openBill){
        bottombeak.matrix.rotate(-25*Math.abs(Math.sin(g_seconds)), 0, 0, 1);
    }
    else{
        bottombeak.matrix.rotate(-25, 0, 0, 1);
    }
    bottombeak.matrix.scale(0.3, 0.1, 1);
    bottombeak.render();


    // if(EvilEye){
    //     var lefteye = new Cube([0, 0, 0, 1]);}
    // else{
    //     var lefteye = new Cube([1, 1, 1, 1]);
    // }
    // lefteye.matrix = new Matrix4(head.matrix);
    // lefteye.matrix.translate(1, 0.5, 0);
    // lefteye.matrix.scale(0.1, 0.2, 0.2);
    // lefteye.render();

    // if(EvilEye){
    // var leftretina = new Cube([1, 0, 0, 1]);}
    // else{
    //     var leftretina = new Cube([0, 0, 0, 1]);
    // }
    // leftretina.matrix = new Matrix4(head.matrix);
    // leftretina.matrix.translate(1.05, 0.55, 0.05);
    // leftretina.matrix.scale(0.05, 0.1, 0.1);
    // leftretina.render();

    // if(EvilEye){
    //     var righteye = new Cube([0, 0, 0, 1])
    // }
    // else{
    // var righteye = new Cube([1, 1, 1, 1]);}
    // righteye.matrix = new Matrix4(head.matrix);
    // righteye.matrix.translate(1, 0.5, 0.8);
    // righteye.matrix.scale(0.1, 0.2, 0.2);
    // righteye.render();

    // if(EvilEye){
    //     var rightretina = new Cube([1, 0, 0, 1])
    // }
    // else{
    // var rightretina = new Cube([0, 0, 0, 1]);}
    // rightretina.matrix = new Matrix4(head.matrix);
    // rightretina.matrix.translate(1.05, 0.55, 0.85);
    // rightretina.matrix.scale(0.05, 0.1, 0.1);
    // rightretina.render();

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
    var end_time = performance.now() / 1000.0;
    document.getElementById('fps').innerHTML = "FPS: " + Math.round(1 / (end_time-start_time), 2)


}

function OpenBillON(){
    openBill = true;
}
function OpenBillOFF(){
    openBill = false;
}
function EvilEyeON(){
    EvilEye = true;
}
function EvilEyeOFF(){
    EvilEye = false;
}
function WantSnack(){
    wantSnack = true;
}
function DoNothing(){
    noSnack = false;
    wantSnack = false;
}
function Swim(){
    flapTail = true;
    swim = true;
    bodyswim = true;
}
function stopSwim(){
    flapTail = true;
    HeadRotateAngle = 5;
    swim = false;
    bodyswim = false;
}
function stopAnimation(){
    special_animation=false;
    flapTail = false;
    HeadRotateAngle = 0;
    feetAngle = 0;
    legAngle = 0;
    bodyswim = false;
    swim = false;
}
function startAnimation(){
    flapTail = true;
    HeadRotateAngle = 5;
}


function DrawFigureTriangle(vertices){
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);
}

function drawCircles(x, y, z, shape, head_mat)
{
    //console.log("initial z:", z)
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