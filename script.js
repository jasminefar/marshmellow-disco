// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3d-container').appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
scene.add(ambientLight);

// Add a rotating disco ball
const discoBallGeometry = new THREE.SphereGeometry(2, 32, 32);
const discoBallMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.9,
    roughness: 0.1
});
const discoBall = new THREE.Mesh(discoBallGeometry, discoBallMaterial);
discoBall.position.y = 10;
scene.add(discoBall);

// Function to create a marshmallow
function createMarshmallow() {
    const geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const marshmallow = new THREE.Mesh(geometry, material);
    marshmallow.castShadow = true;
    return marshmallow;
}

// Create multiple marshmallows and add them to the scene
const marshmallows = [];
for (let i = 0; i < 10; i++) {
    const marshmallow = createMarshmallow();
    marshmallow.position.x = Math.random() * 20 - 10;
    marshmallow.position.z = Math.random() * 20 - 10;
    marshmallow.position.y = 1;
    marshmallows.push(marshmallow);
    scene.add(marshmallow);
}

// Create multiple disco lights
const discoLights = [];
const discoLightColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

for (let i = 0; i < 6; i++) {
    const discoLight = new THREE.SpotLight(discoLightColors[i], 2);
    discoLight.position.set(Math.random() * 40 - 20, 20, Math.random() * 40 - 20);
    discoLight.angle = Math.PI / 6;
    discoLight.penumbra = 0.5;
    discoLight.intensity = 2;
    discoLight.castShadow = true;
    discoLight.target.position.set(0, 0, 0);
    scene.add(discoLight);
    scene.add(discoLight.target);
    discoLights.push(discoLight);
}

// Set up the camera position
camera.position.z = 30;

// Function to interpolate between two colors
function interpolateColor(color1, color2, factor) {
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
    }
    return result;
}

// Function to convert hex color to RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

// Function to convert RGB color to hex
function rgbToHex(rgb) {
    const [r, g, b] = rgb;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Set initial colors for the gradient background
let startColor = hexToRgb('#ff0000');
let endColor = hexToRgb('#0000ff');
let currentColor = startColor;
let factor = 0;

// Animation function to make the marshmallows dance and lights move
function animate() {
    requestAnimationFrame(animate);

    discoBall.rotation.y += 0.01; // Rotate the disco ball

    // Make each marshmallow dance
    marshmallows.forEach((marshmallow, index) => {
        marshmallow.position.y = 1 + Math.sin(Date.now() * 0.002 + index) * 2;
        marshmallow.position.x += Math.sin(Date.now() * 0.001 + index) * 0.05;
        marshmallow.position.z += Math.cos(Date.now() * 0.001 + index) * 0.05;
        marshmallow.rotation.y += 0.05;
        marshmallow.rotation.x += 0.02;
    });

    // Move disco lights
    discoLights.forEach((light, index) => {
        light.position.x = Math.sin(Date.now() * 0.001 + index) * 20;
        light.position.z = Math.cos(Date.now() * 0.001 + index) * 20;
    });

    // Interpolate the background color
    factor += 0.01;
    if (factor > 1) {
        factor = 0;
        startColor = endColor;
        endColor = hexToRgb(`#${Math.floor(Math.random()*16777215).toString(16)}`);
    }
    currentColor = interpolateColor(startColor, endColor, factor);
    renderer.setClearColor(rgbToHex(currentColor), 1);

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
