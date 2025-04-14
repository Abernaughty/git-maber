# Active Context: Fluid Simulation Cursor Effect

## Current Focus
Finalizing and deploying a WebGL-based fluid simulation that creates a colorful smoke trail following cursor movements. We have found optimal configuration values that provide the desired visual effect and have fixed UI issues like the initial center flash. We've also added the maber.io logo to the center of the background, behind the fluid effect.

## Project Directory
C:/Users/maber/Documents/GitHub/git-maber/fluid-sim/

## Implementation Approach
We've created a standalone implementation based on the SplashCursor component from a reference site. The implementation uses WebGL to create a fluid simulation that reacts to cursor movements, with a modular structure that separates the core simulation logic from the UI controls.

## Key Decisions
1. Using a framebuffer-based approach for the fluid simulation
2. Implementing multiple shader passes for different aspects of the simulation
3. Supporting both mouse and touch interactions
4. Using a configurable parameter system with UI controls for easy adjustments
5. Structuring the code in a modular way with separate files for different components

## Optimal Configuration Values
```javascript
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
    SHADING: true,
    COLOR_UPDATE_SPEED: 10,
    BACK_COLOR: { r: 0, g: 0, b: 0 }, // Deep black background
    TRANSPARENT: true
};
```

## Configuration Insights
1. **DENSITY_DISSIPATION**: Values above 1 make the fluid fade away faster, contrary to initial expectations
2. **VELOCITY_DISSIPATION**: Higher values reduce the persistence of motion
3. **CURL**: Lower values create less swirling, making the effect more subtle
4. **SPLAT_RADIUS**: Balancing between too small (invisible) and too large (overwhelming)
5. **SPLAT_FORCE**: Higher values create more energetic fluid movement
6. **DYE_RESOLUTION**: Higher resolution improves visual quality but may impact performance

## Current Challenges
1. Ensuring efficient WebGL implementation for smooth performance
2. Handling browser compatibility issues with WebGL
3. Optimizing for mobile devices
4. Balancing visual quality with performance

## Recent Learnings
1. The fluid simulation uses a semi-Lagrangian advection scheme for stable fluid movement
2. Pressure solving is done using a Jacobi iteration approach for accurate pressure calculations
3. Vorticity confinement adds additional detail and realism to the fluid
4. Color generation creates the vibrant, changing colors of the trail
5. WebGL context and extension handling is crucial for cross-browser compatibility
6. Dissipation parameters behave counter-intuitively - values above 1 increase dissipation rate
7. Removed the test splat that was creating a flash in the center of the screen on page load
8. Added the maber.io logo to the center of the background, behind the fluid effect
9. Created a separate Git branch (reflective-logo) for future work on implementing a reflective effect between the logo and fluid
10. Fixed deployment issue by adding the images directory to git tracking, ensuring logo files are included in the Azure deployment
11. Optimized maber-logo.png file, reducing its size from 2.5MB to 947KB for better performance
12. Added favicon.ico to provide a browser tab icon for the site
13. Removed an earlier Canvas 2D prototype (landing-page directory) that was superseded by the current WebGL implementation
14. Successfully merged remote changes and pushed local updates to the GitHub repository

## Next Steps
1. Test the implementation across different browsers and devices
2. Optimize performance for mobile devices
3. Consider adding additional visual effects or features
4. Create documentation for users
5. Explore potential enhancements like custom color schemes or interaction modes
6. Monitor Azure Static Web App deployment for any issues
7. Implement reflective effect between the logo and fluid (in the reflective-logo branch)

## Deployment Information
The project has been successfully deployed to Azure Static Web App with the following setup:

1. **Configuration File**: `staticwebapp.config.json` in the project root contains:
   - Route configuration for proper URL handling
   - MIME type settings for shader files (.vert and .frag)
   - Security headers for better protection

2. **Azure Static Web App Setup**:
   - Build preset: "Custom"
   - App location: `/fluid-sim` (the folder containing the project)
   - API location: Empty (no backend API)
   - Output location: Empty (no build step needed)

3. **Deployment Process**:
   - GitHub Actions workflow automatically deploys changes when pushed to main branch
   - Workflow file: `.github/workflows/azure-static-web-apps-yellow-rock-0a0307d10.yml`
   - Deployment triggers on every push to the main branch
