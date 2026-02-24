# Fluid Simulation

A real-time fluid dynamics simulation running in the browser using WebGL and GLSL shaders.

## Features

- Real-time fluid simulation using WebGL
- Custom GLSL shaders for rendering
- Interactive — move your mouse/pointer to disturb the fluid
- Deployed as an Azure Static Web App

## Tech Stack

- **WebGL** — GPU-accelerated rendering
- **GLSL** — Custom vertex and fragment shaders
- **Vanilla JavaScript** — Simulation logic and input handling

## Running Locally

No build step required — open `index.html` directly in a browser, or serve it with any static file server:

```bash
npx serve .
```

## Project Structure

```
fluid-sim/
├── index.html          # Entry point
├── style.css           # Styles
├── js/                 # Simulation and rendering logic
├── shaders/            # GLSL vertex and fragment shaders
└── images/             # Assets
```
