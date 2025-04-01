<script>
  import { onMount } from 'svelte';
  
  // Initialize variables
  let basePath = '';
  
  onMount(() => {
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
  });
</script>

<svelte:head>
  <title>Mike Abernathy | maber.io</title>
  <meta name="description" content="Personal portfolio website showcasing my projects and skills">
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
          Hello! I'm an aspiring developer passionate about creating web applications and solving problems through code.
          This portfolio showcases some of my projects and skills as I continue to learn and grow in this field.
        </p>
        <p>
          I'm constantly learning new technologies and techniques to improve my development skills.
          Feel free to explore my projects and get in touch if you'd like to collaborate or have any questions.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Projects Section -->
<section id="projects" class="section">
  <div class="container">
    <h2>My Projects</h2>
    <div class="grid">
      <!-- Project Card 1 -->
      <div class="card project-card">
        <h3>Project One</h3>
        <p>A brief description of your first project. What does it do? What technologies did you use?</p>
        <div class="tech-stack">
          <span class="tech-tag">HTML</span>
          <span class="tech-tag">CSS</span>
          <span class="tech-tag">JavaScript</span>
        </div>
        <div class="project-links">
          <a href="#" class="project-link">View Project</a>
          <a href="#" class="project-link">Source Code</a>
        </div>
      </div>

      <!-- Project Card 2 -->
      <div class="card project-card">
        <h3>Project Two</h3>
        <p>A brief description of your second project. Highlight the main features and your contributions.</p>
        <div class="tech-stack">
          <span class="tech-tag">Svelte</span>
          <span class="tech-tag">Node.js</span>
          <span class="tech-tag">MongoDB</span>
        </div>
        <div class="project-links">
          <a href="#" class="project-link">View Project</a>
          <a href="#" class="project-link">Source Code</a>
        </div>
      </div>

      <!-- Add more project cards as needed -->
    </div>
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
        </ul>
      </div>
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
          <a href="https://github.com/Abernaughty/git-maber" target="_blank">github.com/Abernaughty/git-maber</a>
        </div>
        <div class="contact-method">
          <h3>LinkedIn</h3>
          <a href="https://www.linkedin.com/in/michael-abernathy-674a96217/" target="_blank">linkedin.com/in/michael-abernathy</a>
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
    background-image: url('../images/bear-coding.png');
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

  .project-card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin: var(--space-md) 0;
  }

  .tech-tag {
    background-color: var(--background);
    color: var(--primary);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--border-radius);
    font-size: var(--fs-small);
  }

  .project-links {
    display: flex;
    gap: var(--space-md);
    margin-top: auto;
    padding-top: var(--space-md);
  }

  .project-link {
    font-size: var(--fs-small);
    text-decoration: underline;
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