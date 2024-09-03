const canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d')
const allTools = document.querySelectorAll(".tool");
const fillColor = document.getElementById('fill-color');
const nextPageButton = document.getElementById('nextPage');
const prevPageButton = document.getElementById('prevPage')

let preMouseX,preMouseY,snapShot;
let isDrawing = false;
brushWidth = 2;
selectTools = "brush"


let pages = [];          // Array to store canvas states
let currentPage = 0;     // Index of the current page
// let canvas = document.getElementById('canvas');
// let ctx = canvas.getContext('2d');

// Function to save the current canvas state
function saveCanvasState() {
    let canvasData = canvas.toDataURL();  // Get the current canvas as an image
    pages[currentPage] = canvasData;      // Save it in the array
}

// Function to load a canvas state
function loadCanvasState(pageIndex) {
    let img = new Image();
    img.src = pages[pageIndex];
    img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
        ctx.drawImage(img, 0, 0);                          // Draw the saved image
    }
}

// Function to go to the next page
function nextPage() {
    saveCanvasState();  // Save the current state
    currentPage++;
    
    // Check if we need to add a new page
    if (currentPage >= pages.length) {
        pages.push(null);  // Create a new empty page
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas for the new page
    } else {
        loadCanvasState(currentPage);  // Load the next page
    }
}

// Function to go to the previous page
function prevPage() {
    if (currentPage > 0) {
        saveCanvasState();  // Save the current state
        currentPage--;
        loadCanvasState(currentPage);  // Load the previous page
    }
}

// Attach these functions to buttons
nextPageButton.addEventListener('click', nextPage);
prevPageButton.addEventListener('click', prevPage);



window.addEventListener('load',()=>{
    canvas.width = canvas.offsetWidth;  // setting the width 
    canvas.height = canvas.offsetHeight; // setting the height 
})

const startDraw = (e) =>{
    isDrawing = true;
    preMouseX = e.offsetX;
    preMouseY = e.offsetY;
    ctx.beginPath()
    ctx.lineWidth = brushWidth
    snapShot = ctx.getImageData(0,0,canvas.width,canvas.height)
}

const DrawRect = (e) =>{
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX,e.offsetY,preMouseX-e.offsetX,preMouseY-e.offsetY);
    }
    return ctx.fillRect(e.offsetX,e.offsetY,preMouseX-e.offsetX,preMouseY-e.offsetY);
}

const DrawCircle = (e) => {
    console.log("ajhar circle");
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((preMouseX - e.offsetX), 2) + Math.pow((preMouseY - e.offsetY), 2));
    ctx.arc(preMouseX, preMouseY, radius, 0, 2 * Math.PI);
    ctx.stroke();  // Corrected typo
};

const DrawTriangle = (e) => {
    console.log("Drawing triangle");
    ctx.beginPath();

    // Starting point of the triangle (first vertex)
    ctx.moveTo(preMouseX, preMouseY);

    // Second vertex (using the current mouse position)
    ctx.lineTo(e.offsetX, e.offsetY);

    // Third vertex (you can calculate or define it based on your needs)
    // For simplicity, let's create an equilateral triangle where the third vertex
    // is symmetrical to the first vertex relative to the second vertex.
    let thirdX = 2 * preMouseX - e.offsetX;
    let thirdY = e.offsetY;

    // Draw the third vertex
    ctx.lineTo(thirdX, thirdY);

    // Close the path to form the triangle
    ctx.closePath();

    // Stroke the triangle
    ctx.stroke();
};
const DrawstraightLine = (e) =>{
    ctx.beginPath();
    ctx.moveTo(preMouseX,preMouseY);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.stroke();

};
    

const Drawing = (e)=>{
    if(!isDrawing) return;
    ctx.putImageData(snapShot,0,0)
    if(selectTools === "brush"){
        ctx.lineTo(e.offsetX,e.offsetY)
        ctx.stroke()
    }
    else if(selectTools === "rectangle"){
        DrawRect(e)
    }
    else if(selectTools === "circle"){
        DrawCircle(e)
    }
    else if(selectTools ==="triangle"){
        DrawTriangle(e)
    }
    else if(selectTools ==="straightline"){
        DrawstraightLine(e)
    }
    
}


canvas.addEventListener('mousedown',startDraw)
canvas.addEventListener('mousemove',Drawing)
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
})

allTools.forEach(btn =>{
    btn.addEventListener('click',()=>{
        document.querySelector(".options .active").classList.remove('active');
        btn.classList.add('active')
        selectTools = btn.id;
        console.log(selectTools)
    })
})