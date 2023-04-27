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
    shapeSize = 1.0;

    
    gl = getWebGLContext(canvas);

    if (!gl){
        console.log("Failed to get webGL");
        return -1;
    } 
    //var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    canvas.onmousedown = function(ev){click(ev);};
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    drawTriangle(gl);
    //drawSquare(gl);
    //drawCircle();

    document.getElementById("redS").addEventListener("mouseup", function(){shapeColor[0] = this.value/20; drawTriangle(gl,x,y);});
    document.getElementById("greenS").addEventListener("mouseup", function(){shapeColor[1] = this.value/20; drawTriangle(gl,x,y);});
    document.getElementById("blueS").addEventListener("mouseup", function(){shapeColor[2] = this.value/20; drawTriangle(gl,x,y);});

    document.getElementById('shapeSize').addEventListener("mouseup",function() { shapeSize = this.value/20; drawTriangle(gl,x,y) });
}

function convertCoordinatesEventToGL(ev){
    x= ev.clientX;
    y= ev.clientY;
    var rect = ev.target.getBoundingClientRect() ;

   // set coordinates based on origin
   x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
   y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

   // Print coordinate in console
   // console.log("("+x+","+y+")");

   return [x,y];

}
function click(ev) {
    var [x,y] = convertCoordinatesEventToGL(ev);
    console.log(x,y);
    gl.clear(gl.COLOR_BUFFER_BIT);
    drawTriangle(gl,x,y);
 }

function drawTriangle(gl,x,y){
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    console.log(gl);


    let triangle = new Float32Array([x-shapeSize/0.5,y-shapeSize/0.5,0.0,
                    x+shapeSize/0.5,y-shapeSize/0.5,0.0,
                    x+0.0,y+shapeSize/0.5,0.0]);
    

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
    gl.uniform3f(u_Color, shapeColor[0], shapeColor[1], shapeColor[2]);

    gl.drawArrays(gl.TRIANGLES,0, triangle.length/3);

}

function drawSquare(gl){
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    console.log(gl);

    let tri1 = new Float32Array([-0.5,-0.5,0.0,
                    0.5,-0.5,0.0,
                    -0.5,0.5,0]);
     let tri2 = new Float32Array([0.5,-0.5,0.0,
        0.5,0.5,0,
        -0.5,0.5,0]);
    

    console.log(tri1);
    console.log(tri2);
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
    gl.vertexAttribPointer(a_Position,3, gl.FLOAT, 0,0,0);
    gl.enableVertexAttribArray(a_Position);

    gl.bufferData(gl.ARRAY_BUFFER, tri1, gl.STATIC_DRAW);

    
    let u_Color = gl.getUniformLocation(gl.program, "u_Color");
    gl.uniform3f(u_Color, shapeColor[0], shapeColor[1], shapeColor[2]);

    gl.drawArrays(gl.TRIANGLES,0, tri1.length/3);


    gl.bufferData(gl.ARRAY_BUFFER, tri2, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES,0, tri2.length/3);
    

}

function drawCircle()
{
    xCenterOfCircle = 400;
    yCenterOfCircle = 400;
    centerOfCircle = vec2(400, 400);
    anglePerFan = (2*Math.PI) / noOfFans;
    verticesData = [centerOfCircle];

    for(var i = 0; i <= noOfFans; i++)
    {
        var index = ATTRIBUTES * i + 2;
        var angle = anglePerFan * (i+1);
        var xCoordinate = xCenterOfCircle + Math.cos(angle) * radiusOfCircle;
        var yCoordinate = yCenterOfCircle + Math.sin(angle) * radiusOfCircle;
        document.write(xCoordinate);
        document.write("\n");
        document.write(yCoordinate);
        var point = vec2(xCoordinate, yCoordinate);
        verticesData.push(point);
   }
   var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesData), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, verticesData.length/ATTRIBUTES );


}
