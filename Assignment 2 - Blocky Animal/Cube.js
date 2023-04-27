class Cube{
    constructor(color){
        this.type = 'cube';
        this.color = color;
        this.matrix = new Matrix4();

    }

    render(){
        var rgba = this.color;
        setupColor(rgba[0], rgba[1], rgba[2], 1.0);
        updateMatrix(this.matrix.elements);


        var vertices = new Float32Array([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        DrawFigureTriangle(vertices);
        var vertices = new Float32Array([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);
        DrawFigureTriangle(vertices);
        var vertices = new Float32Array([0.0,1.0,1.0, 0.0,0.0,1.0, 1.0,0.0,1.0]);
        DrawFigureTriangle(vertices);
        var vertices = new Float32Array([0.0,1.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0]);
        DrawFigureTriangle(vertices);
        

        u_Color = gl.getUniformLocation(gl.program, "u_Color");
        gl.uniform4f(u_Color, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, 1.0);

        var vertices = new Float32Array([1.0, 1.0,0.0, 1.0,0.0,1.0, 1.0,1.0,1.0]);
        DrawFigureTriangle(vertices);
        var vertices = new Float32Array([1.0,1.0,0.0, 1.0,0.0,1.0, 1.0,0.0,1.0]);
        DrawFigureTriangle(vertices);
        var vertices = new Float32Array([0.0,1.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0]);
        DrawFigureTriangle(vertices);
        var vertices = new Float32Array([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
        DrawFigureTriangle(vertices);
        var vertices = new Float32Array([0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,1.0]);
        DrawFigureTriangle(vertices);
        var vertices = new Float32Array([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0]);
        DrawFigureTriangle(vertices);
        var vertices = new Float32Array([0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0]);
        DrawFigureTriangle(vertices);
        var vertices = new Float32Array([0.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,1.0]);
        DrawFigureTriangle(vertices);


    }
}