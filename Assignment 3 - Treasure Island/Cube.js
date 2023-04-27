class Cube{
    constructor(color){
        this.type = 'cube';
        this.color = color;
        this.matrix = new Matrix4();
        this.textureNum = -2;

        this.verts = [
            // Front of cube
            0,0,0, 1,1,0, 1,0,0,
            0,0,0, 0,1,0, 1,1,0,

            // Top of cube
            0,1,0, 0,1,1, 1,1,1,
            0,1,0, 1,1,1, 1,1,0,

            // Bottom of cube
            0,1,0, 0,1,1, 1,1,1,
            0,1,0, 1,1,1, 1,1,0,

            // Left side of cube
            1,0,0, 1,1,1, 1,1,0,
            1,0,0, 1,0,1, 1,1,1,

            // Right side of cube
            0,0,0, 0,1,1, 0,1,0,
            0,0,0, 0,0,1, 0,1,1,
            
            // Back of cube 
            0,0,1, 1,1,1, 0,1,1,
            0,0,1, 1,0,1, 1,1,1
        ];
        this.vert32bit = new Float32Array([
            0,0,0, 1,1,0, 1,0,0,
            0,0,0, 0,1,0, 1,1,0,
    
            0,1,0, 0,1,1, 1,1,1,
            0,1,0, 1,1,1, 1,1,0,
    
            0,1,0, 0,1,1, 1,1,1,
            0,1,0, 1,1,1, 1,1,0,
    
            0,0,0, 1,0,1, 0,0,1,
            0,0,0, 1,0,0, 1,0,1,
    
            1,0,0, 1,1,1, 1,1,0,
            1,0,0, 1,0,1, 1,1,1,
    
            0,0,1, 1,1,1, 0,1,1,
            0,0,1, 1,0,1, 1,1,1
        ]);
        this.uvVerts  = [
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1
        ];

    }

    render(){
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);
        setupColor(rgba[0], rgba[1], rgba[2], 1.0);
        updateMatrix(this.matrix.elements);


        //Front of Cube
        // var vertices = new Float32Array([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        // DrawFigureTriangle(vertices);
        // var vertices = new Float32Array([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);
        // DrawFigureTriangle(vertices);
        DrawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0, 0, 0, 1, 1, 1]);
        DrawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0, 0, 1, 1, 1, 0]);


        //Back of Cube
        // var vertices = new Float32Array([0.0,1.0,1.0, 0.0,0.0,1.0, 1.0,0.0,1.0]);
        // DrawFigureTriangle(vertices);
        // var vertices = new Float32Array([0.0,1.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0]);
        // DrawFigureTriangle(vertices);
        DrawTriangle3DUV([0,1,1, 0,0,1, 1,0,1], [0, 0, 0, 1, 1, 1]);
        DrawTriangle3DUV([0,1,1, 1,0,1, 1,1,1], [0, 0, 1, 1, 1, 0]);
        

        // u_Color = gl.getUniformLocation(gl.program, "u_Color");
        // gl.uniform4f(u_Color, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, 1.0);


        //Right of Cube
        // var vertices = new Float32Array([1.0, 1.0,0.0, 1.0,0.0,1.0, 1.0,1.0,1.0]);
        // DrawFigureTriangle(vertices);
        // var vertices = new Float32Array([1.0,1.0,0.0, 1.0,0.0,1.0, 1.0,0.0,0.0]);
        // DrawFigureTriangle(vertices);
        DrawTriangle3DUV([1,1,0, 1,0,1, 1,1,1], [0, 0, 0, 1, 1, 1]);
        DrawTriangle3DUV([1,1,0, 1,0,0, 1,0,1], [0, 0, 1, 1, 1, 0]);

        //Top of Cube
        // var vertices = new Float32Array([0.0,1.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0]);
        // DrawFigureTriangle(vertices);
        // var vertices = new Float32Array([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
        // DrawFigureTriangle(vertices);
        DrawTriangle3DUV([0,1,0, 0,1,1, 1,1,1], [0, 0, 0, 1, 1, 1]);
        DrawTriangle3DUV([0,1,0, 1,1,1, 1,1,0], [0, 0, 1, 1, 1, 0]);

        //Bottom of Cube
        // var vertices = new Float32Array([0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,1.0]);
        // DrawFigureTriangle(vertices);
        // var vertices = new Float32Array([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0]);
        // DrawFigureTriangle(vertices);
        DrawTriangle3DUV([0,0,0, 0,0,1, 1,0,1], [0, 0, 0, 1, 1, 1]);
        DrawTriangle3DUV([0,0,0, 1,0,1, 1,0,0], [0, 0, 1, 1, 1, 0]);

        //Left of Cube
        // var vertices = new Float32Array([0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0]);
        // DrawFigureTriangle(vertices);
        // var vertices = new Float32Array([0.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,1.0]);
        // DrawFigureTriangle(vertices);
        DrawTriangle3DUV([0,1,0, 0,0,0, 0,1,1], [0, 0, 0, 1, 1, 1]);
        DrawTriangle3DUV([0,0,0, 0,0,1, 0,1,1], [0, 0, 1, 1, 1, 0]);


    }

    renderFast(){
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);
        setupColor(rgba[0], rgba[1], rgba[2], 1.0);
        updateMatrix(this.matrix.elements);

        let all_vertices = [];
        //Front
        all_vertices=all_vertices.concat([0,0,0, 1,1,0, 1,0,0])
        all_vertices=all_vertices.concat([0,0,0, 0,1,0, 1,1,0])
        //Back 
        all_vertices=all_vertices.concat([0,1,1, 0,0,1, 1,0,1])
        all_vertices=all_vertices.concat([0,1,1, 1,0,1, 1,1,1])
        //Right
        all_vertices=all_vertices.concat([1,1,0, 1,0,1, 1,1,1])
        all_vertices=all_vertices.concat([1,1,0, 1,0,0, 1,0,1])
        //Top
        all_vertices=all_vertices.concat([0,1,0, 0,1,1, 1,1,1])
        all_vertices=all_vertices.concat([0,1,0, 1,1,1, 1,1,0])
        //Bottom
        all_vertices=all_vertices.concat([0,0,0, 0,0,1, 1,0,1])
        all_vertices=all_vertices.concat([0,0,0, 1,0,1, 1,0,0])
        //Left
        all_vertices=all_vertices.concat([0,1,0, 0,0,0, 0,1,1])
        all_vertices=all_vertices.concat([0,0,0, 0,0,1, 0,1,1])


        //console.log("All vertices Length:",all_vertices.length);
        DrawFigureTriangle_renderFast(all_vertices);

    }

    renderfaster(){
        var rgba = this.color;                                           // set rgba to the ith point's color field
        
        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);
        // Pass the color of point to u_FragColor
        setupColor(rgba[0], rgba[1], rgba[2], 1.0); 
        // Pass the matrix to u_ModelMatrix attribute 
        updateMatrix(this.matrix.elements);
        
        DrawTriangle3DUV(this.verts, this.uvVerts);
    }
}