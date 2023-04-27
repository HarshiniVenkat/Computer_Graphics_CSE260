var vertexBuffer;
var shape;
var segments;
var figure_vertices;



let VERTEX_SHADER = `
  precision mediump float;
  attribute vec3 a_Position;  
    void main(){
        gl_Position = vec4(a_Position, 1.0);
    }
`;
let FRAGMENT_SHADER = `
  precision mediump float;
  
  uniform vec3 u_Color;

    void main(){
        gl_FragColor = vec4(u_Color,1.0);
    }
`;

function main(){
    canvas = document.getElementById("webgl");
    shapeColor = [0.0,0.0,1.0];
    shapeSize = parseFloat(document.getElementById("size").value)/30;
    shape='triangle';
    segments = 10;


    
    // gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    

    if (!gl){
        console.log("Failed to get webGL");
        return -1;
    } 

    if(!initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER)){
        console.log("Falied to load shaders");
        return -1;
    }

    console.log(shape);

    setupBuffer();
    //var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    canvas.onmousedown = function(ev){click(ev);};
    canvas.onmousemove = function(ev){if(ev.buttons==1) click(ev);};
    clearCanvas();

    document.getElementById("redS").addEventListener("mouseup", function(){shapeColor[0] = this.value/20;});
    document.getElementById("greenS").addEventListener("mouseup", function(){shapeColor[1] = this.value/20;});
    document.getElementById("blueS").addEventListener("mouseup", function(){shapeColor[2] = this.value/20;});
    document.getElementById('size').addEventListener("mouseup",function() { shapeSize = this.value/30;});
}

function clearCanvas(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function setFigureSquare(){
    shape = "square";
}
function setFigureTriangle(){
    shape = "triangle";
}
function setFigureCircle(){
    shape = "circle";
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

function drawTriangle(){

    let triangle = new Float32Array([
        x, y + parseFloat(shapeSize), 0.0, // a: bottom left
         x - parseFloat(shapeSize), y - parseFloat(shapeSize), 0.0, // b: bottom right
         x+ parseFloat(shapeSize),  y - parseFloat(shapeSize), 0.0  // c: top point
     ]);


    gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.STATIC_DRAW);

    let u_Color = gl.getUniformLocation(gl.program, "u_Color");
    gl.uniform3f(u_Color, shapeColor[0], shapeColor[1], shapeColor[2]);

    gl.drawArrays(gl.TRIANGLES,0, triangle.length/3);

}

function drawSquare(){


    let tri1 = new Float32Array([x-parseFloat(shapeSize),y-parseFloat(shapeSize),0.0,
                    x + parseFloat(shapeSize),y-parseFloat(shapeSize),0.0,
                    x-parseFloat(shapeSize),y+parseFloat(shapeSize),0]);
     let tri2 = new Float32Array([x+parseFloat(shapeSize),y-parseFloat(shapeSize),0.0,
        x+parseFloat(shapeSize),y+parseFloat(shapeSize),0,
        x-parseFloat(shapeSize),y+parseFloat(shapeSize),0]);

    // let vertexBuffer = gl.createBuffer();

    gl.bufferData(gl.ARRAY_BUFFER, tri1, gl.STATIC_DRAW);

    let u_Color = gl.getUniformLocation(gl.program, "u_Color");
    gl.uniform3f(u_Color, shapeColor[0], shapeColor[1], shapeColor[2]);
    gl.drawArrays(gl.TRIANGLES,0, tri1.length/3);


    gl.bufferData(gl.ARRAY_BUFFER, tri2, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES,0, tri2.length/3);
}

function drawCircle(){
    segments = parseFloat(document.getElementById("segment").value);

    let angleStep = 360/segments;

    for(var angle=0; angle<360; angle = angle+angleStep)
    {
        let centrePt = [x,y];
        let angle1 = angle;
        let angle2 = angle+angleStep;
        let vec1 = [Math.cos(angle1*Math.PI/180)*shapeSize, Math.sin(angle1*Math.PI/180)*shapeSize];
        let vec2 = [Math.cos(angle2*Math.PI/180)*shapeSize, Math.sin(angle2*Math.PI/180)*shapeSize];
        let pt1 = [centrePt[0]+vec1[0], centrePt[1]+vec1[1]];
        let pt2 = [centrePt[0]+vec2[0], centrePt[1]+vec2[1]];

        renderCircle([centrePt[0], centrePt[1],0, pt1[0], pt1[1],0, pt2[0], pt2[1],0]);
    }

}

function renderCircle(vertices){

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    let u_Color = gl.getUniformLocation(gl.program, "u_Color");
    gl.uniform3f(u_Color, shapeColor[0], shapeColor[1], shapeColor[2]);
    gl.drawArrays(gl.TRIANGLES,0, vertices.length/3);

}


function DrawFigureTriangle(vertices, c1, c2, c3){
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.uniform3f(u_Color, c1, c2, c3);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);
}

function DrawFigure(){

    // The figure Displays
    //The moon and stars in the Night Sky
    //The ocean with the reflection of the moon
    //Mountains

    clearCanvas(); 
    u_Color = gl.getUniformLocation(gl.program, "u_Color");

    //Draw the Yellow Moon
    let angleStep = 360/20;
    let scale = 0.2;
    for(var angle=0; angle<360; angle = angle+angleStep)
    {
        let centrePt = [-0.70, 0.70];
        let angle1 = angle;
        let angle2 = angle+angleStep;
        let vec1 = [Math.cos(angle1*Math.PI/180)*scale, Math.sin(angle1*Math.PI/180)*scale];
        let vec2 = [Math.cos(angle2*Math.PI/180)*scale, Math.sin(angle2*Math.PI/180)*scale];
        let pt1 = [centrePt[0]+vec1[0], centrePt[1]+vec1[1]];
        let pt2 = [centrePt[0]+vec2[0], centrePt[1]+vec2[1]];

        let draw_figure_circle = [centrePt[0], centrePt[1],0, pt1[0], pt1[1],0, pt2[0], pt2[1],0];
        DrawFigureTriangle(draw_figure_circle, 246/225, 250/255, 171/225);
    }


    //Stars in the Sky
    let figure_vertices = new Float32Array([ -0.005,0.76, 0.0, //bottom left
         0.08,0.76 , 0.0, // b: bottom right
         0.042, 0.68,0.0 // c: top point
     ]);
     DrawFigureTriangle(figure_vertices, 239/225, 220/255, 26/225);
    figure_vertices = new Float32Array([ 0.04,0.78, 0.0, //bottom left
     -0.005,0.715, 0.0, // b: bottom right
     0.08, 0.71,0.0// c: top point
    ]);
    DrawFigureTriangle(figure_vertices, 239/225, 220/255, 26/225);


    figure_vertices = new Float32Array([ -0.38,0.385, 0.0, //bottom left
        -0.295,0.385 , 0.0, // b: bottom right
        -0.333, 0.305,0.0 // c: top point
    ]);
    DrawFigureTriangle(figure_vertices, 239/225, 220/255, 26/225);
   figure_vertices = new Float32Array([ -0.34,0.4, 0.0, //bottom left
    -0.385,0.335, 0.0, // b: bottom right
    -0.3, 0.33,0.0// c: top point
   ]);
   DrawFigureTriangle(figure_vertices, 239/225, 220/255, 26/225);

    figure_vertices = new Float32Array([ 0.885,0.705, 0.0, //bottom left
        0.855,0.65 , 0.0, // b: bottom right
        0.91, 0.65,0.0 // c: top point
    ]);
    DrawFigureTriangle(figure_vertices, 239/225, 220/255, 26/225);
   figure_vertices = new Float32Array([ 0.854,0.68, 0.0, //bottom left
    0.91,0.68, 0.0, // b: bottom right
    0.885, 0.63,0.0// c: top point
   ]);
   DrawFigureTriangle(figure_vertices, 239/225, 220/255, 26/225);

   figure_vertices = new Float32Array([ 0.41,0.43, 0.0, //bottom left
        0.36,0.33 , 0.0, // b: bottom right
        0.46, 0.33,0.0 // c: top point
    ]);
    DrawFigureTriangle(figure_vertices, 239/225, 220/255, 26/225);
   figure_vertices = new Float32Array([ 0.355,0.385, 0.0, //bottom left
    0.455,0.39, 0.0, // b: bottom right
    0.41, 0.3,0.0// c: top point
   ]);
   DrawFigureTriangle(figure_vertices, 239/225, 220/255, 26/225);

   //The Ocean
   figure_vertices = new Float32Array([ -1.0, -0.3, 0.0, //bottom left
    -1.0,-1.0, 0.0, // b: bottom right
    1.0, -1.0,0.0// c: top point
   ]);
   DrawFigureTriangle(figure_vertices, 46/225, 154/255, 211/225);
   figure_vertices = new Float32Array([ -1.0, -0.3, 0.0, //bottom left
   1.0,-0.3, 0.0, // b: bottom right
   1.0, -1.0,0.0// c: top point
  ]);
  DrawFigureTriangle(figure_vertices, 46/225, 154/255, 211/225);

  //Reflection
  figure_vertices = new Float32Array([ -0.44, -0.3, 0.0, //bottom left
  -0.3,-1.0, 0.0, // b: bottom right
  0.14, -1.0,0.0// c: top point
 ]);
 DrawFigureTriangle(figure_vertices, 246/225, 250/255, 171/225);

 figure_vertices = new Float32Array([ -0.44, -0.3, 0.0, //bottom left
 -0.25,-0.3, 0.0, // b: bottom right
 0.14, -1.0,0.0// c: top point
]);
DrawFigureTriangle(figure_vertices, 246/225, 250/255, 171/225);


//The mountains
figure_vertices = new Float32Array([ -1.0, -0.3, 0.0, //bottom left
-0.6,-0.035, 0.0, // b: bottom right
0.1, -0.3,0.0// c: top point
]);
DrawFigureTriangle(figure_vertices, 126/225, 56/255, 20/225);

figure_vertices = new Float32Array([ 1.0, -0.3, 0.0, //bottom left
0.6, -0.035, 0.0, // b: bottom right
0.1, -0.3,0.0// c: top point
]);
DrawFigureTriangle(figure_vertices, 126/225, 56/255, 20/225);

}


