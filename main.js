const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');

// fullscreen the canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// basic configs
ctx.strokeStyle = '#000';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 32;
ctx.fillStyle = '#f9f9f9';
ctx.fillRect (0, 0, canvas.width, canvas.height);

// basic states
let isDrawing = false;
let lastX = 0;
let lastY = 0;


function draw(e){
	// stop if it is not allowed to draw
	if(!isDrawing) return;
	
	// get current x,y axes
	let offsetX = e.offsetX,
		 offsetY =  e.offsetY;

	// if it is touch not mouse
	if(!offsetX || !offsetY){
		[offsetX, offsetY] =  e.touches;
		offsetX=e.touches[0].pageX;
		offsetY=e.touches[0].pageY;
	}
	
	// draw
	ctx.beginPath();
	ctx.moveTo(lastX, lastY);
	ctx.lineTo(offsetX, offsetY);
	ctx.stroke();
	
	// save last x,y axes
	[lastX, lastY] = [offsetX, offsetY];
}

// allow mouse to draw
canvas.addEventListener('mousedown', (e) => {
	isDrawing = true;
	[lastX, lastY] = [e.offsetX, e.offsetY];
});

// start drawing for mouse
canvas.addEventListener('mousemove', draw);

// stop drawing for mouse
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

// allow touch to draw
canvas.addEventListener('touchstart', (e) => {
	isDrawing = true;
	[lastX, lastY] = [e.touches[0].pageX, e.touches[0].pageY];
});

// start drawing for touch
canvas.addEventListener('touchmove', draw);

// start drawing for touch
canvas.addEventListener('touchend', () => isDrawing = false);

// toolbar buttons
// hide toolbar after startup
setTimeout(() => {
	document.querySelector('.toolbar').classList.remove('show');
}, 2500)

// brush size button
const brushSizes = [
	'2',
	'6',
	'12',
	'16',
	'24',
	'32',
];
let currentBrushSize = '32';

const brushSizeButton = document.querySelector('.change-brush-size');
const brushSizeIndicator = document.querySelector('.brush-size-indicator');

// increase brush size
brushSizeButton.addEventListener('click', () => {
	const currentSizeIndex = brushSizes.findIndex(size => size === currentBrushSize);
	
	currentBrushSize = brushSizes[currentSizeIndex + 1];
	ctx.lineWidth = currentBrushSize;
	
	// set scale for brush size inicator
	let indicatorSize = currentBrushSize / brushSizes[brushSizes.length -1];
		brushSizeIndicator.style.transform = `scale(${indicatorSize})`;
	});

	// brush color picker
	const brushColorPicker = document.querySelector('.brush-color');

	brushColorPicker.addEventListener('change', (e) => {
	ctx.strokeStyle = e.target.value;
});

// show/hide brush and eraser button
const brushEraserToggle = document.querySelector('.brush-eraser-toggle');

brushEraserToggle.addEventListener('click', () => {
	const bgColor = document.querySelector('.bg-color').value;
	const brushColor = document.querySelector('.brush-color').value;
	
	if (brushEraserToggle.classList.contains('is-brush')) {
		// show eraser
		brushEraserToggle.classList.remove('is-brush');
		ctx.strokeStyle = bgColor;
	} else {
		// show brush
		brushEraserToggle.classList.add('is-brush')
		ctx.strokeStyle = brushColor;
	}
});

// reset button
const resetButton = document.querySelector('.reset-image');

resetButton.addEventListener('click', (e) => {
	const bgColor = document.querySelector('.bg-color').value;
	ctx.fillStyle = bgColor;
	ctx.fillRect (0, 0, canvas.width, canvas.height);
});

// save button
const saveButton = document.querySelector('.save-image');

saveButton.addEventListener('click', (e) => {
	// convert canvas to data url
	const img = canvas.toDataURL();

	// create an anchor, click to download then remove it.
	const link = document.createElement("a");
	link.download = '2D paint result';
	link.href = img;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	delete link;
});

// hide intro on click
document.addEventListener('click', () => {
	const introText = document.querySelector('.intro-text');
	if(introText) introText.remove();
});
