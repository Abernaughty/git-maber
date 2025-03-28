# Portfolio Site - Getting Started Guide

This is a minimalist dark-themed portfolio website built with Svelte. Follow the instructions below to set up, customize, and deploy your site.

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- npm (comes with Node.js) or [pnpm](https://pnpm.io/)

## Setup Instructions

1. **Install dependencies:**

```bash
cd Portfolio
npm install
```

2. **Run the development server:**

```bash
npm run dev
```

Your site should now be running at http://localhost:5173

## Customizing Your Portfolio

### Personal Information

- Update your name, job title, and contact information in `src/routes/+page.svelte`
- Modify the "About Me" section to reflect your background and interests

### Project Showcase

Option 1: Edit the existing project cards directly in `src/routes/+page.svelte`

Option 2: Use the reusable `ProjectCard.svelte` component:

1. Add the component to your page:

```svelte
<script>
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  
  // Define your projects
  const projects = [
    {
      title: "Project Name",
      description: "Description of your project",
      techStack: ["HTML", "CSS", "JavaScript"],
      liveUrl: "https://your-project-url.com",
      sourceUrl: "https://github.com/yourusername/project-repo",
      imageUrl: "/images/project-image.jpg" // Optional
    },
    // Add more projects...
  ];
</script>

<!-- In your markup -->
<div class="grid">
  {#each projects as project}
    <ProjectCard {...project} />
  {/each}
</div>
```

### Skills Section

Update the skills listed in the Skills section to match your skill set.

### Styling

The site uses CSS variables for consistent theming. Modify the variables in `src/app.css` to change colors, spacing, and other visual elements.

## Adding Pages

To add more pages to your portfolio:

1. Create a new file in the `src/routes` directory, e.g., `src/routes/blog/+page.svelte`
2. Update the navigation in `src/routes/+layout.svelte` to include a link to your new page

## Deployment

To build your site for production:

```bash
npm run build
```

This creates a production-ready version in the `build` directory which you can deploy to:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)
- Any other static site hosting service

## Further Enhancements

As you grow your portfolio, consider adding:

- Blog section
- Dark/light mode toggle
- Contact form
- Project filtering by technology
- Animations and transitions
- Portfolio case studies with detailed project descriptions

## Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [GitHub Profile README Generator](https://github.com/rahuldkjain/github-profile-readme-generator)