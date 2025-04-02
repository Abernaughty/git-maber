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
      bgElement.style.backgroundImage = `url('images/bear-coding.png')`;
    }
  });
  // JavaScript to add at the end of your +page.svelte script section

  // Modal handling
  onMount(() => {
    // Get all elements with class 'open-modal'
    const openModalButtons = document.querySelectorAll('.open-modal');
    
    // Add click event listeners to all open modal buttons
    openModalButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.style.display = 'block';
        }
      });
    });
    
    // Get all elements with class 'close-modal'
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Add click event listeners to all close modal buttons
    closeModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    });
    
    // Close modal when clicking outside of modal content
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
      }
    });
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
      <!-- PokeData Project Card - Add this to the projects section in your +page.svelte file -->
      <div class="card project-card">
        <h3>Pokémon Card Price Checker</h3>
        <p>A responsive web application for looking up Pokémon card pricing data from various market sources. Features include searchable set and card selection, offline caching for improved performance, and detailed pricing information.</p>
        <div class="tech-stack">
          <span class="tech-tag">Svelte</span>
          <span class="tech-tag">IndexedDB</span>
          <span class="tech-tag">REST API</span>
          <span class="tech-tag">CSS</span>
        </div>
        <div class="project-links">
          <a href="https://pokedata.maber.io" class="project-link" target="_blank" rel="noopener noreferrer">Live Demo</a>
          <a href="https://github.com/Abernaughty/git-maber/tree/main/PokeData" class="project-link" target="_blank" rel="noopener noreferrer">Source Code</a>
          <a href="#" class="project-link open-modal" data-modal="pokedata-modal">View Details</a>
        </div>
      </div>

      <!-- Modal with more detailed project information - Add this at the end of your +page.svelte file -->
      <div id="pokedata-modal" class="modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h2>Pokémon Card Price Checker</h2>
          
          <div class="modal-section">
            <h3>Project Overview</h3>
            <p>The Pokémon Card Price Checker is a responsive web application that allows users to quickly and efficiently look up current market prices for Pokémon trading cards. Built with modern web technologies, this tool helps collectors and traders make informed decisions by providing real-time pricing data from various sources.</p>
          </div>
          
          <div class="modal-section">
            <h3>Key Features</h3>
            <ul>
              <li><strong>Comprehensive Card Search:</strong> Searchable dropdowns for set and card selection</li>
              <li><strong>Enhanced Data Handling:</strong> Offline-first approach with persistent local storage</li>
              <li><strong>Real-time Pricing:</strong> Up-to-date pricing from multiple market sources</li>
              <li><strong>Responsive Design:</strong> Optimized for both desktop and mobile devices</li>
            </ul>
          </div>
          
          <div class="modal-section">
            <h3>Technical Details</h3>
            <ul>
              <li><strong>Frontend Framework:</strong> Svelte.js</li>
              <li><strong>Data Storage:</strong> IndexedDB for offline caching</li>
              <li><strong>API Integration:</strong> Custom REST API endpoints with authentication</li>
              <li><strong>Build Tools:</strong> Rollup.js for module bundling</li>
            </ul>
          </div>
          
          <div class="modal-section">
            <h3>Implementation Highlights</h3>
            <p>The application implements a clean data flow architecture where UI components interact with data services, which handle all API communication and caching. The IndexedDB-based caching system stores set lists, card data, and pricing information locally, reducing unnecessary network requests and providing offline functionality.</p>
          </div>
          
          <div class="project-links modal-links">
            <a href="https://github.com/Abernaughty/git-maber/tree/main/PokeData" class="btn" target="_blank" rel="noopener noreferrer">View Source Code</a>
            <a href="https://pokedata.maber.io" class="btn btn-outline" target="_blank" rel="noopener noreferrer">Live Demo</a>
          </div>
        </div>
      </div>

      <!-- CSS styles to add to your <style> section -->

      <!-- Project Card 2 -->
      <div class="card project-card">
        <h3>Blackjack Web Application</h3>
        <p>A fully functional web-based Blackjack game with comprehensive gameplay features, persistent state management, and responsive design. Converted from a Python/Tkinter application to a modern web experience.</p>
        <div class="tech-stack">
          <span class="tech-tag">HTML5</span>
          <span class="tech-tag">CSS3</span>
          <span class="tech-tag">JavaScript</span>
          <span class="tech-tag">Local Storage</span>
        </div>
        <div class="project-links">
          <a href="https://blackjack.maber.io" class="project-link" target="_blank" rel="noopener noreferrer">Live Demo</a>
          <a href="https://github.com/Abernaughty/git-maber/tree/main/blackjack-web" class="project-link" target="_blank" rel="noopener noreferrer">Source Code</a>
          <a href="#" class="project-link open-modal" data-modal="blackjack-modal">View Details</a>
        </div>
      </div>
      
      <!-- Blackjack Project Modal -->
      <div id="blackjack-modal" class="modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h2>Blackjack Web Application</h2>
          
          <div class="modal-section">
            <h3>Project Overview</h3>
            <p>A fully functional web-based Blackjack game that brings the classic casino experience to the browser. Originally developed as a Python/Tkinter application, this project showcases a complete reimagining of the game using modern web technologies.</p>
          </div>
          
          <div class="modal-section">
            <h3>Key Features</h3>
            <ul>
              <li><strong>Full Blackjack Gameplay:</strong> Comprehensive rule set with Hit, Stand, Double, Split, and Surrender options</li>
              <li><strong>Responsive Design:</strong> Seamless play across desktop and mobile devices</li>
              <li><strong>Persistent Game State:</strong> Local Storage for maintaining game progress</li>
              <li><strong>Realistic Card Visuals:</strong> Intuitive and engaging user interface</li>
              <li><strong>Loan System:</strong> Keeps the game engaging when balance runs low</li>
            </ul>
          </div>
          
          <div class="modal-section">
            <h3>Technical Details</h3>
            <ul>
              <li><strong>Frontend Technologies:</strong> HTML5, CSS3, JavaScript (ES6+)</li>
              <li><strong>State Management:</strong> Local Storage API for game persistence</li>
              <li><strong>Deployment:</strong> Azure Static Web Apps</li>
              <li><strong>Responsive Approach:</strong> Mobile-first design with cross-browser compatibility</li>
            </ul>
          </div>
          
          <div class="modal-section">
            <h3>Implementation Highlights</h3>
            <p>The application demonstrates a sophisticated approach to game logic, state management, and user interaction. By leveraging modern web technologies, the project successfully transforms a desktop application into a dynamic web experience.</p>
          </div>
          
          <div class="project-links modal-links">
            <a href="https://github.com/Abernaughty/git-maber/tree/main/blackjack-web" class="btn" target="_blank" rel="noopener noreferrer">View Source Code</a>
            <a href="https://blackjack.maber.io" class="btn btn-outline" target="_blank" rel="noopener noreferrer">Live Demo</a>
          </div>
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
          <li>JavaScript (ES6+), HTML5, CSS3</li>
          <li>Svelte / SvelteKit</li>
          <li>Progressive Web App (PWA) concepts</li>
          <li>Responsive design</li>
          <li>CSS theming and styling</li>
        </ul>
      </div>

      <div class="skill-category">
        <h3>Backend</h3>
        <ul class="skill-list">
          <li>Node.js</li>
          <li>RESTful API consumption</li>
          <li>Serverless architecture</li>
        </ul>
      </div>

      <div class="skill-category">
        <h3>Tools & Others</h3>
        <ul class="skill-list">
          <li>Git & GitHub</li>
          <li>CI/CD pipelines</li>
          <li>Azure Static Web Apps</li>
          <li>Python (logic development, Tkinter GUI)</li>
          <li>Algorithmic thinking & logic implementation</li>
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
    background-image: url('images/bear-coding.png');
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
  /* Add these styles to your page's <style> section */

/* Modal styles */
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}

.modal-content {
  background-color: var(--surface);
  margin: 5% auto;
  padding: var(--space-lg);
  border-radius: var(--border-radius);
  max-width: 800px;
  width: 90%;
  animation: modalFadeIn 0.3s;
  max-height: 90vh;
  overflow-y: auto;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-modal {
  color: var(--text);
  float: right;
  font-size: var(--fs-xl);
  font-weight: bold;
  cursor: pointer;
}

.close-modal:hover {
  color: var(--primary);
}

.modal-section {
  margin-bottom: var(--space-lg);
}

.modal-section h3 {
  color: var(--primary);
  margin-bottom: var(--space-sm);
}

.modal-section ul {
  list-style-position: inside;
  margin-bottom: var(--space-md);
}

.modal-section ul li {
  margin-bottom: var(--space-sm);
}

.modal-links {
  display: flex;
  justify-content: center;
  margin-top: var(--space-xl);
}

/* Ensure the project card is properly formatted */
.project-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.project-card h3 {
  color: var(--primary);
}

.project-card .project-links {
  margin-top: auto;
  padding-top: var(--space-md);
}

/* Button to open modal */
.open-modal {
  cursor: pointer;
}

.open-modal:hover {
  text-decoration: underline;
}
</style>