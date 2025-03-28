<script>
  import '../app.css';
</script>

<div class="app">
  <header>
    <nav class="container">
      <div class="logo">
        <a href="/">maber.io</a>
      </div>
      <ul class="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <slot />
  </main>

  <footer>
    <div class="container">
      <p>&copy; {new Date().getFullYear()} - Mike Abernathy. All rights reserved.</p>
    </div>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  header {
    background-color: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: var(--space-md) 0;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo a {
    font-size: var(--fs-large);
    font-weight: 700;
    color: var(--primary);
  }

  .nav-links {
    display: flex;
    list-style: none;
    gap: var(--space-lg);
  }

  .nav-links a {
    color: var(--text);
    transition: color var(--transition-speed) ease;
  }

  .nav-links a:hover {
    color: var(--primary);
  }

  main {
    flex: 1;
  }

  footer {
    background-color: var(--surface);
    border-top: 1px solid var(--border);
    padding: var(--space-lg) 0;
    text-align: center;
  }

  @media (max-width: 768px) {
    nav {
      flex-direction: column;
      gap: var(--space-md);
    }

    .nav-links {
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--space-md);
    }
  }
</style>