# Technical Context: Fluid Simulation Cursor Effect

## Technologies Used
- HTML5 Canvas for rendering
- WebGL for GPU-accelerated graphics
- GLSL (OpenGL Shading Language) for shader programs
- JavaScript for application logic and WebGL interaction

## Development Environment
- Standard web development tools
- No special frameworks required beyond vanilla JavaScript
- WebGL debugging tools helpful but not required

## Technical Constraints
- WebGL support varies across browsers and devices
- Performance considerations for mobile devices
- Texture size limitations on some hardware

## Dependencies
- No external libraries required
- Self-contained implementation using native WebGL API

## WebGL Features Used
- Framebuffer objects (FBOs)
- Floating-point textures
- Custom shader programs
- Vertex and fragment shaders
- Texture manipulation

## Shader Programs
1. Base vertex shader: Handles vertex positioning and texture coordinates
2. Advection shader: Moves quantities through the velocity field
3. Divergence shader: Calculates the divergence of the velocity field
4. Curl shader: Calculates the curl (vorticity) of the velocity field
5. Vorticity shader: Applies vorticity confinement
6. Pressure shader: Solves for pressure
7. Gradient shader: Subtracts pressure gradient from velocity
8. Splat shader: Adds force and dye to the simulation
9. Display shader: Renders the final result to the screen

## Configuration Parameters
The fluid simulation behavior is controlled by several key parameters:

1. **SIM_RESOLUTION**: Controls the resolution of the fluid simulation grid
   - Higher values increase detail but reduce performance
   - Lower values improve performance but reduce detail
   - Optimal value: 128 (balances detail and performance)

2. **DYE_RESOLUTION**: Controls the resolution of the fluid color rendering
   - Higher values create smoother color transitions
   - Lower values create a more pixelated effect
   - Optimal value: 1440 (high quality on modern devices)

3. **DENSITY_DISSIPATION**: Controls how quickly the fluid color fades away
   - Values above 1 make the fluid fade faster
   - Values below 1 make the fluid persist longer
   - Optimal value: 3.5 (fluid fades quickly but remains visible)

4. **VELOCITY_DISSIPATION**: Controls how quickly the fluid motion slows down
   - Values above 1 make the fluid stop moving faster
   - Values below 1 make the fluid continue moving longer
   - Optimal value: 2 (fluid motion dissipates at a moderate rate)

5. **PRESSURE**: Controls the pressure solver strength
   - Higher values create stronger pressure effects
   - Lower values create weaker pressure effects
   - Optimal value: 1 (balanced pressure effects)

6. **PRESSURE_ITERATIONS**: Controls the accuracy of pressure calculations
   - Higher values create more accurate fluid behavior but reduce performance
   - Lower values improve performance but reduce accuracy
   - Optimal value: 20 (good balance of accuracy and performance)

7. **CURL**: Controls the amount of swirling/vorticity in the fluid
   - Higher values create more swirling and complex patterns
   - Lower values create smoother, less turbulent flow
   - Optimal value: 3 (subtle swirling effect)

8. **SPLAT_RADIUS**: Controls the size of each fluid "splat" created when the cursor moves
   - Higher values create larger, more dramatic splats
   - Lower values create smaller, more subtle splats
   - Optimal value: 0.2 (small but visible splats)

9. **SPLAT_FORCE**: Controls how much force/velocity is applied to each splat
   - Higher values create more energetic, fast-moving fluid
   - Lower values create gentler, slower-moving fluid
   - Optimal value: 6000 (moderate force for visible movement)

10. **COLOR_UPDATE_SPEED**: Controls how quickly the fluid colors change
    - Higher values make colors change more rapidly
    - Lower values make colors change more slowly
    - Optimal value: 10 (moderate color change rate)

## Browser Compatibility
- Modern browsers with WebGL support (Chrome, Firefox, Safari, Edge)
- Fallback options for browsers with limited WebGL support
- Mobile browser considerations for touch events
