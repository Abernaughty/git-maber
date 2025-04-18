<script>
  import { onMount } from 'svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import { projectsStore } from '$lib/stores';

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

  <div class="glass-card-dark hero-container hero-gradient-container">
    <h1>Hello, I'm <span class="purple-blue-gradient-text">Mike Abernathy</span></h1>
    <p class="tagline">Aspiring Developer | Building Creative Solutions</p>
    <div class="cta-buttons">
      <a href="#projects" class="hero-gradient-outline-button">
        View My Work
      </a>
      <a href="#contact" class="hero-gradient-outline-button">
        Get In Touch
      </a>
    </div>
  </div>
</section>

<!-- About Section -->
<section id="about" class="section">
  <div class="container glass-card-dark section-container">
    <h2 class="section-header-gradient">About Me</h2>
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
  <div class="container glass-card-dark section-container">
    <h2 class="section-header-gradient">My Projects</h2>

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
  <div class="container glass-card-dark section-container">
    <h2 class="section-header-gradient">Skills</h2>
    <div class="skills-container">
      <div class="skill-category">
        <h3>Frontend</h3>
        <ul class="skill-list">
          <li>HTML5</li>
          <li>CSS3</li>
          <li>JavaScript</li>
          <li>Svelte</li>
          <li>TailwindCSS</li>
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


<!-- Contact Section -->
<section id="contact" class="section">
  <div class="container glass-card-dark section-container">
    <h2 class="section-header-gradient">Get In Touch</h2>
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
  /* Section styling */
  .section {
    padding: calc(var(--space-xl) * 0.5) 0; /* Doubled from previous value, but still less than original */
    margin: calc(var(--space-xl) * 0.1) 0; /* Changed from negative to small positive margin */
  }
  
  /* Section container with frosted glass effect */
  .section-container {
    padding: calc(var(--space-lg) * 1.25); /* Slightly increased from previous value */
    border-radius: var(--radius-xl);
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Section header with solid blue color */
  .section-header-gradient {
    color: var(--blue-color);
    text-align: center;
    margin-bottom: var(--space-lg);
    font-size: var(--fs-xl);
    font-weight: var(--fw-bold);
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    padding: 0;
  }

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

  .hero-container {
    position: relative;
    z-index: 2;
    padding: 3rem;
    max-width: 800px;
    text-align: center;
    border-radius: var(--radius-xl);
  }
  
  .glass-card-dark {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
  
  /* Hero gradient container */
  .hero-gradient-container {
    --hero-gradient: var(--purple-blue-gradient); /* Use the shared purple-blue gradient */
    position: relative;
  }
  
  /* Add subtle text shadow to all hero text for relief */
  .hero-container h1,
  .hero-container p,
  .hero-container a {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  /* Hero gradient text */
  .hero-gradient-text {
    background-image: var(--hero-gradient);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    display: inline-block;
    background-size: 100% 100%; /* Ensure gradient covers exactly the text area */
    filter: brightness(1.2);
  }
  
  /* Hero gradient outline button */
  .hero-gradient-outline-button {
    display: inline-block;
    padding: 11px 24px;
    background: rgba(0, 0, 0, 0.25);
    color: white;
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 0.5px;
    border-radius: 8px;
    position: relative;
    transition: all 0.3s ease;
    z-index: 1;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  
  .hero-gradient-outline-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 8px;
    padding: 2px;
    background: var(--hero-gradient);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
  }
  
  .hero-gradient-outline-button:hover {
    background: rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.2);
    color: white;
  }
  
  .hero-gradient-outline-button:hover::before {
    filter: brightness(1.2);
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
    filter: brightness(0.85);
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
  
  .skill-category {
    background-color: var(--surface); /* Match to card class */
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md); /* Match to card shadow-md */
    padding: var(--space-lg);
    transition: all 0.3s ease;
  }
  
  .skill-category:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-blue-purple);
  }
  
  .skill-category h3 {
    color: var(--blue-color);
    margin-bottom: var(--space-md);
    text-align: center;
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
    display: flex;
    justify-content: center;
    flex-wrap: nowrap; /* Prevent wrapping */
    gap: var(--space-lg);
    margin-top: var(--space-lg);
  }

  .contact-method {
    padding: var(--space-md);
    background-color: var(--surface); /* Match to card class */
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md); /* Match to card shadow-md */
    text-align: center;
    transition: all 0.3s ease;
  }
  
  .contact-method:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-purple);
  }

  .contact-method h3 {
    margin-bottom: var(--space-sm);
  }
  
  .contact-method a {
    color: var(--blue-color);
    transition: all 0.3s ease;
    white-space: nowrap; /* Prevent line breaks */
    display: inline-block; /* Ensure the entire link stays together */
  }
  
  .contact-method a:hover {
    text-decoration: underline;
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
      flex-wrap: wrap; /* Allow wrapping on small screens */
    }
  }
</style>
