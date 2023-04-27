class Cube{
    constructor(color){
        this.type = 'cube';
        this.color = color;
        this.matrix = new Matrix4();
        this.normalMatrix   = new Matrix4();
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
        this.uvVerts  = [
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,  0,0, 0,1, 1,1
        ];

        this.NormalVerts = [
            0,0,-1, 0,0,-1, 0,0,-1,
            0,0,-1, 0,0,-1, 0,0,-1,
            0,1,0, 0,1,0, 0,1,0,
            0,1,0, 0,1,0, 0,1,0,
            0,-1,0, 0,-1,0, 0,-1,0,
            0,-1,0, 0,-1,0, 0,-1,0,
            1,0,0, 1,0,0, 1,0,0,
            1,0,0, 1,0,0, 1,0,0,
            -1,0,0, -1,0,0, -1,0,0,
            -1,0,0, -1,0,0, -1,0,0,
            0,0,1, 0,0,1, 0,0,1,
            0,0,1, 0,0,1, 0,0,1
        ]
    }



    render(){
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);
        setupColor(rgba[0], rgba[1], rgba[2], 1.0);
        updateMatrix(this.matrix.elements);

        // Pass the matrix to u_NormallMatrix attribute 
        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

        // Front of cube
        DrawTriangle3DUV_renderfaster([0,0,0,  1,1,0,  1,0,0], [0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1]);
        DrawTriangle3DUV_renderfaster([0,0,0,  0,1,0,  1,1,0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);

        // Top of cube
        DrawTriangle3DUV_renderfaster([0,1,0,  1,1,1,  1,1,0], [0,0, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0]);
        DrawTriangle3DUV_renderfaster([0,1,0,  0,1,1,  1,1,1], [0,0, 0,1, 1,1], [0,1,0, 0,1,0, 0,1,0]);

        // Bottom of cube
        DrawTriangle3DUV_renderfaster([0,0,0,  1,0,1,  0,0,1], [0,0, 1,1, 1,0], [0,-1,0, 0,-1,0, 0,-1,0]);
        DrawTriangle3DUV_renderfaster([0,0,0,  1,0,0,  1,0,1], [0,0, 0,1, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);

        // Left side of cube
        DrawTriangle3DUV_renderfaster([1,0,0,  1,1,1,  1,1,0], [0,0, 1,1, 1,0], [1,0,0, 1,0,0, 1,0,0]);
        DrawTriangle3DUV_renderfaster([1,0,0,  1,0,1,  1,1,1], [0,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0]);

        // Right side of cube
        DrawTriangle3DUV_renderfaster([0,0,0,  0,1,1,  0,1,0], [0,0, 1,1, 1,0], [-1,0,0, -1,0,0, -1,0,0]);
        DrawTriangle3DUV_renderfaster([0,0,0,  0,0,1,  0,1,1], [0,0, 0,1, 1,1], [-1,0,0, -1,0,0, -1,0,0]);

        // Back of cube
        DrawTriangle3DUV_renderfaster([0,0,1,  1,1,1,  0,1,1], [0,0, 1,1, 1,0], [0,0,1, 0,0,1, 0,0,1]);
        DrawTriangle3DUV_renderfaster([0,0,1,  1,0,1,  1,1,1], [0,0, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1]);

    }

    renderfaster(){
        var rgba = this.color;                                  
        
        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);
        // Pass the color of point to u_FragColor
        setupColor(rgba[0], rgba[1], rgba[2], 1.0); 
        // Pass the matrix to u_ModelMatrix attribute 
        updateMatrix(this.matrix.elements);
        
        DrawTriangle3DUV_renderfaster(this.verts, this.uvVerts, this.NormalVerts);
    }
}