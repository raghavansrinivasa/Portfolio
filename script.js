(() => {
  const root = document.documentElement;
  const body = document.body;
  const toggle = document.getElementById("themeToggle");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const stored = localStorage.getItem("theme");
  if (stored === "light") body.classList.add("light");

  toggle?.addEventListener("click", () => {
    body.classList.toggle("light");
    localStorage.setItem(
      "theme",
      body.classList.contains("light") ? "light" : "dark"
    );
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll(".reveal");

  if (reduced) {
    revealItems.forEach(el => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealItems.forEach(el => observer.observe(el));
  }

  if (
    !reduced &&
    window.matchMedia("(pointer:fine)").matches
  ) {
    const glow = document.querySelector(".cursor-glow");

    let raf = 0;
    let x = 0;
    let y = 0;

    window.addEventListener(
      "pointermove",
      e => {
        x = e.clientX;
        y = e.clientY;

        if (raf) return;

        raf = requestAnimationFrame(() => {
          if (glow) {
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
            glow.style.opacity = "1";
          }

          raf = 0;
        });
      },
      { passive: true }
    );

    document.querySelectorAll(".magnetic").forEach(el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();

        const dx =
          (e.clientX - (r.left + r.width / 2)) * 0.08;

        const dy =
          (e.clientY - (r.top + r.height / 2)) * 0.08;

        el.style.transform =
          `translate(${dx}px, ${dy}px)`;
      });

      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  // Lightweight active-section state for the header.
  const sections = [
    ...document.querySelectorAll("[data-section]")
  ];

  const links = [
    ...document.querySelectorAll(".desktop-nav a")
  ];

  const linkMap = new Map(
    links.map(a => [
      a.getAttribute("href").slice(1),
      a
    ])
  );

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const link = linkMap.get(entry.target.id);

        if (!link) return;

        link.classList.toggle(
          "active",
          entry.isIntersecting
        );
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    }
  );

  sections.forEach(s =>
    sectionObserver.observe(s)
  );

  // Slight environmental parallax;
  // content stays stable.
  if (!reduced) {
    const grid = document.querySelector(".hero-grid");

    window.addEventListener(
      "scroll",
      () => {
        if (!grid) return;

        grid.style.transform =
          `perspective(700px) rotateX(55deg) ` +
          `translateY(calc(22% + ${window.scrollY * 0.025}px))`;
      },
      { passive: true }
    );
  }
})();
