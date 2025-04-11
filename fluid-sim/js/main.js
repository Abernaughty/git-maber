/**
 * Main JavaScript file for the Fluid Simulation Cursor Effect
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    try {
        // Get the canvas element
        const canvas = document.getElementById('fluid-canvas');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }
        console.log('Canvas element found');
        
        // Check WebGL support
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }
        console.log('WebGL supported');
        
        // Set initial canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log(`Canvas size set to ${canvas.width}x${canvas.height}`);
        
        // Configure fluid simulation with optimal settings
        const config = {
            SIM_RESOLUTION: 128,
            DYE_RESOLUTION: 1440,
            DENSITY_DISSIPATION: 3.5,  // Higher values make the fluid fade faster
            VELOCITY_DISSIPATION: 2,   // Higher values reduce motion persistence
            PRESSURE: 1,
            PRESSURE_ITERATIONS: 20,
            CURL: 3,                   // Lower values create less swirling
            SPLAT_RADIUS: 0.2,         // Controls the size of fluid splats
            SPLAT_FORCE: 6e3,          // Controls the energy of fluid movement
            SHADING: !0,               // true
            COLOR_UPDATE_SPEED: 10,
            BACK_COLOR: { r: 0.5, g: 0, b: 0 }, // Dark red background
            TRANSPARENT: !0            // true
        };
        
        // Initialize the fluid simulation
        console.log('Initializing fluid simulation');
        const fluidSim = new FluidSimulation(canvas, config);
        console.log('Fluid simulation initialized');
        
        // Create a test splat
        console.log('Creating test splat');
        setTimeout(() => {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const pointer = fluidSim.pointers[0];
            fluidSim.updatePointerDownData(pointer, -1, centerX, centerY);
            fluidSim.updatePointerMoveData(pointer, centerX + 50, centerY + 50);
        }, 1000);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
        console.log('Setup complete');
    } catch (error) {
        console.error('Error in main.js:', error);
    }
});
