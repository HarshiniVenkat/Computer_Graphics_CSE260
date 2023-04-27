class Camera{
    constructor(){
        this.g_eye = new Vector3([5,0.5,-3]);
        this.g_at  = new Vector3([0,0,100]);
        this.g_up  = new Vector3([0,1,0]);
    }

    forward(){
        var atCopy  = new Vector3(this.g_at.elements);
        var eyeCopy = new Vector3(this.g_eye.elements);
        var f = atCopy.sub(eyeCopy);
        f = f.normalize();
         this.g_eye = this.g_eye.add(f);
         this.g_at  = this.g_at.add(f);
    }

    backward(){
        var atCopy  = new Vector3(this.g_at.elements);
        var eyeCopy = new Vector3(this.g_eye.elements);        
        var f = atCopy.sub(eyeCopy);
        f = f.normalize();
        this.g_at  = this.g_at.sub(f);
        this.g_eye = this.g_eye.sub(f);
    }

    left(){
        var atCopy  = new Vector3(this.g_at.elements);
        var eyeCopy = new Vector3(this.g_eye.elements);
        var f = atCopy.sub(eyeCopy);

        f = f.normalize();
        f = f.mul(-1);
        var s = Vector3.cross(f, this.g_up);
        s = s.normalize();

        for(var i=0; i<3; i++){
            this.g_at.elements[i]  += s[i];
            this.g_eye.elements[i] += s[i];
            }
    }

    right(){
        var atCopy  = new Vector3(this.g_at.elements);
        var eyeCopy = new Vector3(this.g_eye.elements);
        var upCopy  = new Vector3(this.g_up.elements);
        var f = atCopy.sub(eyeCopy);

        f = f.normalize();
        var s = Vector3.cross(f, upCopy);
        s = s.normalize();
        for(var i=0; i<3; i++){
        this.g_at.elements[i]  += s[i];
        this.g_eye.elements[i] += s[i];
        }
    
    }

    rotRight(){
        var atCopy  = new Vector3(this.g_at.elements);
        var eyeCopy = new Vector3(this.g_eye.elements);
        var f = atCopy.sub(eyeCopy);

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-5, this.g_up.elements[0], this.g_up.elements[1], this.g_up.elements[2]);

        var f_prime = rotationMatrix.multiplyVector3(f);

        this.g_at = f_prime.add(this.g_eye);
    }

    rotLeft(){
        var atCopy  = new Vector3(this.g_at.elements);
        var eyeCopy = new Vector3(this.g_eye.elements);
        var f = atCopy.sub(eyeCopy);

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(5, this.g_up.elements[0], this.g_up.elements[1], this.g_up.elements[2]);

        var f_prime = rotationMatrix.multiplyVector3(f);

        this.g_at = f_prime.add(this.g_eye);
    }

    rotLeft_mouse(){
        var atCopy  = new Vector3(this.g_at.elements);
        var eyeCopy = new Vector3(this.g_eye.elements);
        var f = atCopy.sub(eyeCopy);

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(0.5, this.g_up.elements[0], this.g_up.elements[1], this.g_up.elements[2]);

        var f_prime = rotationMatrix.multiplyVector3(f);

        this.g_at = f_prime.add(this.g_eye);

    }

    rotRight_mouse(){
        var atCopy  = new Vector3(this.g_at.elements);
        var eyeCopy = new Vector3(this.g_eye.elements);
        var f = atCopy.sub(eyeCopy);

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-0.5, this.g_up.elements[0], this.g_up.elements[1], this.g_up.elements[2]);

        var f_prime = rotationMatrix.multiplyVector3(f);

        this.g_at = f_prime.add(this.g_eye);

    }

    upward(){
        this.g_eye.elements[1] += 1;
        this.g_at.elements[1]  += 1;
    }

    downward(){
        this.g_eye.elements[1] -= 1;
        this.g_at.elements[1]  -= 1;
    }

}