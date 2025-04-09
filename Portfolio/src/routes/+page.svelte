<script>
  import { onMount } from 'svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import TailwindButton from '$lib/components/TailwindButton.svelte';
  import { Button } from '$lib/components/common/Button';
  import { Card } from '$lib/components/common/Card';
  import { projectsStore, featuredProjects } from '$lib/stores';

  // Initialize variables
  let basePath = '';
  let loading = false;
  let error = null;

  onMount(async () => {
    // Determine basePath based on current URL
    if (window.location.pathname.includes('/git-maber/')) {
      basePath = '/git-maber';
    } else {
      basePath = '';
    }

    // Set the background image with the correct path
    const bgElement = document.querySelector('.hero-background-image');
    if (bgElement) {
      const imagePath = `${basePath}/images/bear-coding.png`;
      bgElement.style.backgroundImage = `url(${imagePath})`;
    }

    // Fetch projects
    try {
      loading = true;
      await projectsStore.fetchProjects();
      loading = false;
    } catch (err) {
      loading = false;
      error = err instanceof Error ? err.message : 'Failed to load projects';
      console.error('Error loading projects:', err);
    }
  });
</script>

<svelte:head>
  <title>Mike Abernathy | maber.io</title>
  <meta name="description" content="Personal portfolio website showcasing my projects and skills" />
</svelte:head>

<!-- Hero Section -->
<section class="hero">
  <!-- Single div with CSS class for background image -->
  <div class="hero-background-image"></div>

  <div class="container">
    <h1>Hello, I'm <span class="highlight">Mike Abernathy</span></h1>
    <p class="tagline">Aspiring Developer | Building Creative Solutions</p>
    <div class="cta-buttons">
      <a href="#projects" class="btn">View My Work</a>
      <a href="#contact" class="btn btn-outline">Get In Touch</a>
    </div>
  </div>
</section>

<!-- About Section -->
<section id="about" class="section">
  <div class="container">
    <h2>About Me</h2>
    <div class="about-content">
      <div class="about-text">
        <p>
          Hello! I'm an aspiring developer passionate about creating web applications and solving
          problems through code. This portfolio showcases some of my projects and skills as I
          continue to learn and grow in this field.
        </p>
        <p>
          I'm constantly learning new technologies and techniques to improve my development skills.
          Feel free to explore my projects and get in touch if you'd like to collaborate or have any
          questions.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Projects Section -->
<section id="projects" class="section">
  <div class="container">
    <h2>My Projects</h2>

    {#if $projectsStore.loading}
      <div class="loading-container">
        <p>Loading projects...</p>
      </div>
    {:else if $projectsStore.error}
      <div class="error-container">
        <p>Error loading projects: {$projectsStore.error}</p>
        <button class="btn" on:click={() => projectsStore.fetchProjects()}>Retry</button>
      </div>
    {:else if $projectsStore.projects.length === 0}
      <div class="empty-container">
        <p>No projects found.</p>
      </div>
    {:else}
      <div class="card-grid">
        {#each $projectsStore.projects as project (project.id)}
          <ProjectCard
            title={project.title}
            description={project.description}
            techStack={project.techStack}
            imageUrl={project.imageUrl}
            liveUrl={project.liveUrl}
            sourceUrl={project.sourceUrl}
          />
        {/each}
      </div>
    {/if}
  </div>
</section>

<!-- Skills Section -->
<section id="skills" class="section">
  <div class="container">
    <h2>Skills</h2>
    <div class="skills-container">
      <div class="skill-category">
        <h3>Frontend</h3>
        <ul class="skill-list">
          <li>HTML5</li>
          <li>CSS3</li>
          <li>JavaScript</li>
          <li>Svelte</li>
        </ul>
      </div>

      <div class="skill-category">
        <h3>Backend</h3>
        <ul class="skill-list">
          <li>Node.js</li>
          <li>Express</li>
          <li>RESTful APIs</li>
        </ul>
      </div>

      <div class="skill-category">
        <h3>Tools & Others</h3>
        <ul class="skill-list">
          <li>Git</li>
          <li>VS Code</li>
          <li>Responsive Design</li>
          <li>Azure API Management</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- Component Demo Section -->
<section id="component-demo" class="section">
  <div class="container">
    <h2>Component Library</h2>
    
    <!-- Button Component Demo -->
    <Card className="mb-8">
      <h3 class="mb-4">Button Component</h3>
      
      <div class="mb-6">
        <h4 class="text-lg mb-2">Button Variants</h4>
        <div class="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
      
      <div class="mb-6">
        <h4 class="text-lg mb-2">Button Sizes</h4>
        <div class="flex flex-wrap gap-4 items-center">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </div>
      
      <div class="mb-6">
        <h4 class="text-lg mb-2">Button States</h4>
        <div class="flex flex-wrap gap-4 items-center">
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button fullWidth>Full Width</Button>
        </div>
      </div>
    </Card>
    
    <!-- Card Component Demo -->
    <h3 class="mb-4">Card Component</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card variant="default">
        <h4 class="text-lg mb-2">Default Card</h4>
        <p>This is a default card with shadow and border.</p>
      </Card>
      
      <Card variant="outline">
        <h4 class="text-lg mb-2">Outline Card</h4>
        <p>This card has a border but no shadow.</p>
      </Card>
      
      <Card variant="flat">
        <h4 class="text-lg mb-2">Flat Card</h4>
        <p>This card has no border or shadow.</p>
      </Card>
      
      <Card variant="elevated" shadow={true}>
        <h4 class="text-lg mb-2">Elevated Card</h4>
        <p>This card has a more pronounced shadow.</p>
      </Card>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card hover={true} interactive={true}>
        <h4 class="text-lg mb-2">Interactive Card</h4>
        <p>This card has hover effects and is interactive. Try clicking it!</p>
      </Card>
      
      <Card padding={false}>
        <div class="bg-primary-600 text-white p-4 rounded-t-lg">
          <h4 class="text-lg">Card Header</h4>
        </div>
        <div class="p-4">
          <p>This card has custom padding and a header section.</p>
        </div>
      </Card>
    </div>
    
    <!-- Legacy Tailwind Demo -->
    <div class="mt-12">
      <h3 class="mb-4">Legacy Tailwind Components</h3>
      <Card>
        <h4 class="text-lg mb-2">Button Styles with Tailwind CSS</h4>
        <div class="flex flex-wrap gap-4 items-center justify-center">
          <TailwindButton text="Primary Button" type="primary" />
          <TailwindButton text="Secondary Button" type="secondary" />
          <TailwindButton text="Outline Button" type="outline" />
        </div>
        <div class="mt-4">
          <p class="text-center text-sm opacity-70">
            These buttons are styled using the legacy TailwindButton component
          </p>
        </div>
      </Card>
    </div>
  </div>
</section>

<!-- Contact Section -->
<section id="contact" class="section">
  <div class="container">
    <h2>Get In Touch</h2>
    <div class="contact-content">
      <p>I'm currently looking for new opportunities and would love to hear from you!</p>
      <div class="contact-methods">
        <div class="contact-method">
          <h3>Email</h3>
          <a href="mailto:mike@maber.io">mike@maber.io</a>
        </div>
        <div class="contact-method">
          <h3>GitHub</h3>
          <a href="https://github.com/git-maber" target="_blank" rel="noopener noreferrer"
            >github.com/git-maber</a
          >
        </div>
        <div class="contact-method">
          <h3>LinkedIn</h3>
          <a href="https://linkedin.com/in/mikeabernathy" target="_blank" rel="noopener noreferrer"
            >linkedin.com/in/mikeabernathy</a
          >
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    padding: var(--space-xl) 0;
    position: relative;
    text-align: center;
    background-color: transparent;
    color: white;
    overflow: hidden;
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero .container {
    position: relative;
    z-index: 2;
    background-color: rgba(18, 18, 18, 0.7);
    padding: 2rem;
    border-radius: var(--border-radius);
    backdrop-filter: blur(3px);
    max-width: 800px;
  }

  .hero-background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background-image: url('/images/bear-coding.png');
    background-size: cover;
    background-position: center;
    filter: brightness(0.7);
  }

  .highlight {
    color: var(--primary);
  }

  .tagline {
    font-size: var(--fs-medium);
    margin-bottom: var(--space-lg);
  }

  .cta-buttons {
    display: flex;
    gap: var(--space-md);
    justify-content: center;
  }

  .btn-outline {
    background-color: transparent;
    border: 1px solid var(--primary);
    color: var(--primary);
  }

  .btn-outline:hover {
    background-color: var(--primary);
    color: var(--background);
  }

  .about-content {
    display: flex;
    gap: var(--space-lg);
    align-items: center;
  }

  .about-text {
    flex: 2;
  }

  .skills-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-lg);
  }

  .skill-list {
    list-style-position: inside;
    margin-top: var(--space-sm);
  }

  .skill-list li {
    margin-bottom: var(--space-sm);
  }

  .contact-content {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }

  .contact-methods {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-lg);
    margin-top: var(--space-lg);
  }

  .contact-method {
    padding: var(--space-md);
    background-color: var(--surface);
    border-radius: var(--border-radius);
    text-align: center;
  }

  .contact-method h3 {
    margin-bottom: var(--space-sm);
  }

  /* Loading, error, and empty states */
  .loading-container,
  .error-container,
  .empty-container {
    padding: var(--space-lg);
    text-align: center;
    background-color: var(--surface);
    border-radius: var(--border-radius);
    margin: var(--space-lg) 0;
  }

  .error-container {
    color: var(--accent);
    border: 1px solid var(--accent);
  }

  .error-container button {
    margin-top: var(--space-md);
  }

  @media (max-width: 768px) {
    .cta-buttons {
      flex-direction: column;
      align-items: center;
      gap: var(--space-sm);
    }

    .about-content {
      flex-direction: column;
    }

    .contact-methods {
      grid-template-columns: 1fr;
    }
  }
</style>
