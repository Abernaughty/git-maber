# System Patterns: Fluid Simulation Cursor Effect

## Architecture Overview
The fluid simulation is implemented using a WebGL-based approach with multiple shader programs handling different aspects of the simulation. The system follows a framebuffer-based architecture where the simulation state is stored in textures and processed through various shader passes.

## Core Components

### 1. WebGL Rendering Pipeline
- Canvas element with WebGL context
- Vertex and fragment shaders for different simulation steps
- Framebuffer management for simulation state

### 2. Fluid Simulation Algorithm
- Advection: Moving quantities through the velocity field
- Divergence: Calculating the divergence of the velocity field
- Pressure: Solving the pressure equation
- Gradient Subtraction: Making the velocity field divergence-free
- Vorticity Confinement: Adding additional detail to the fluid

### 3. Event Handling System
- Mouse/touch event listeners
- Position tracking and delta calculation
- Splat creation based on cursor movement

### 4. Rendering Loop
- requestAnimationFrame-based rendering
- Multi-pass rendering approach
- Shader program selection and parameter updates

## Data Flow
1. User input (mouse/touch) → Event handlers
2. Event handlers → Splat creation
3. Splat creation → Velocity and dye updates
4. Simulation steps (advection, pressure, etc.)
5. Final rendering to screen

## Key Technical Patterns
- Double-buffering for simulation state
- Texture swapping for efficient updates
- Fragment shader-based computation
- Framebuffer objects (FBOs) for off-screen rendering
