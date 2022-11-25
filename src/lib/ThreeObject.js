import * as THREE from 'three';

// Establish a new scene
const SCENE = new THREE.Scene();

// Establish a new PLANE then add it to the scene
const PLANE = new THREE.Mesh(
	new THREE.PlaneGeometry(5, 3, 50, 30), 
	new THREE.ShaderMaterial({
		uniforms: {
			  color1: {value: new THREE.Color("#FF0022")},
			  color2: {value: new THREE.Color("#A200FF")}
		},
		vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
		fragmentShader: `uniform vec3 color1, color2; varying vec2 vUv; void main() { gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0); }`
	})
);
SCENE.add(PLANE);
PLANE.position.set(0, 0, 0);
PLANE.rotation.set(0, 0, 0.3)

// Establish a new perspective camera and set it's position
const CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 5);
CAMERA.position.z = 1;

// Establish an empty Renderer for later use
let Renderer;


const clock = new THREE.Clock();


// The animate() function is used to manipulate the PLANE,
// adding noise to it's vertices which in return gives it
// that wavy kind of look.
const animate = async () => {
	const t = clock.getElapsedTime();

	PLANE.geometry.vertices.map(v => {
		const WaveX1 = 0.3 * Math.sin(v.x * 4 + t);
		const WaveY1 = 0.3 * Math.sin(v.y * 4 + t);

		v.z = WaveX1 + WaveY1;
	})

	// three.js animation function
	requestAnimationFrame(animate);

	
	// Update the vertices and render the new PLANE
	PLANE.geometry.verticesNeedUpdate = true;

	// Render scene and camera
	Renderer.render(SCENE, CAMERA);
};

// The resize() function is used to resize the scene.
// This is required for if the user resizes the site,
// which is caught using the Window Resize Listener
export const resize = async () => {
	// Set the pixel ratio
	Renderer.setPixelRatio(window.devicePixelRatio);
	// Set the screen size
	Renderer.setSize(window.innerWidth, window.innerHeight);
	// Set the camera aspect ratio (most likely 16:9)
	CAMERA.aspect = window.innerWidth / window.innerHeight;
	// Update projection matrix
	CAMERA.updateProjectionMatrix();
};
// Window Resize Listener
window.addEventListener('resize', resize);

// The setScene() function is the primary function
// for updating the PLANE's scene data.
export const setScene = async (canvas) => {
	// Render the new scene
	Renderer = new THREE.WebGLRenderer({ canvas: canvas });
	// Change the Scene background-color to gray
	Renderer.setClearColor(0x101010);
	// Size the scene
	await resize();
	// Animate the PLANE
	await animate();
};
