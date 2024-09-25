const myCanvas=document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");
let drawing=false;
let rotationAngle=0;
let rotationSpeed=0;
let eventInfo=null;

//logic 
//considering 0,0 at center of canvas and use relative to that
//polar coversion from normal coordinate system

myCanvas.addEventListener("pointerdown" , (e) => {
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    drawing=true;
});

myCanvas.addEventListener("pointermove" , (e) => {
    eventInfo = e;
});

myCanvas.addEventListener("pointerleave" , () => {
    drawing=false;
});

myCanvas.addEventListener("pointerup" , () => {
    drawing=false;
});

animate();

function animate(){
    rotationAngle += rotationSpeed;
    myCanvas.style.transform = 
        "translate(-50%, -50%) rotate(" + rotationAngle + "deg)";

    if(drawing==true && eventInfo){
        const xyRelToCenterPage = {
            x: eventInfo.pageX - window.innerWidth/2,
            y: eventInfo.pageY - window.innerHeight/2
        };
        const pol = toPolar(xyRelToCenterPage); //polar conversion
        pol.dir -= rotationAngle * (Math.PI / 180);
        const xyWithRotation = toXY(pol);
        xyWithRotation.x += myCanvas.width/2;
        xyWithRotation.y += myCanvas.height/2;
        ctx.lineTo(xyWithRotation.x,xyWithRotation.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(xyWithRotation.x,xyWithRotation.y);
    }

    requestAnimationFrame(animate);
}

function updateRotationSpeed(){
    rotationSpeed = parseFloat(
        document.getElementById("speedSlider").value
    );
}

function toPolar({x,y}){
    return{
        dir : Math.atan2(y,x),
        mag : Math.hypot(x,y)
    };
}

function toXY({mag,dir}){
    return{
        x : Math.cos(dir) * mag,
        y : Math.sin(dir) * mag
    };
}