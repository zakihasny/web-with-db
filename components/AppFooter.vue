<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <section class="footer-brand" aria-labelledby="footer-company">
        <div class="footer-logo-space">
          <img src="/brand/Wordmark32.svg" alt="Biznet Gio Nusantara" height="32">
        </div>
        <h2 id="footer-company">PT Biznet Gio Nusantara</h2>
        <address>
          Midplaza 1, 7th Floor<br>
          Jalan Jenderal Sudirman Kav. 10–11<br>
          Karet Tengsin, DKI Jakarta 10220
        </address>
        <div class="social-links" aria-label="Biznet Gio social media">
          <a href="https://www.linkedin.com/company/biznet-gio-cloud/mycompany/" target="_blank" rel="noreferrer" aria-label="Biznet Gio on LinkedIn">
            LinkedIn
          </a>
          <a href="https://www.instagram.com/biznetgiocloud/" target="_blank" rel="noreferrer" aria-label="Biznet Gio on Instagram">
            Instagram
          </a>
          <a href="https://www.youtube.com/channel/UCnT5DraeYqphxlpBhGTZeSA" target="_blank" rel="noreferrer" aria-label="Biznet Gio on YouTube">
            YouTube
          </a>
        </div>
      </section>

      <section class="footer-column" aria-labelledby="footer-support">
        <h2 id="footer-support">Support</h2>
        <NuxtLink to="/query#query-policy">Query policy</NuxtLink>
        <NuxtLink to="/input">Data entry help</NuxtLink>
      </section>

      <section class="footer-column" aria-labelledby="footer-services">
        <h2 id="footer-services">Products &amp; Services</h2>
        <NuxtLink to="/query">SQL Query Console</NuxtLink>
        <NuxtLink to="/input">Employee Data Form</NuxtLink>
      </section>

      <section class="footer-column" aria-labelledby="footer-insights">
        <h2 id="footer-insights">Insights</h2>
        <NuxtLink to="/#schema">Schema overview</NuxtLink>
        <NuxtLink to="/query">SQL examples</NuxtLink>
      </section>

      <section class="footer-column" aria-labelledby="footer-legal">
        <h2 id="footer-legal">Legal</h2>
        <span>Testing environment</span>
        <span>No production data</span>
      </section>
    </div>
    <div class="container footer-meta">
      <span>Employee Database Lab</span>
      <a href="https://www.biznetgio.com/" target="_blank" rel="noreferrer">biznetgio.com</a>
    </div>
  </footer>
</template>
