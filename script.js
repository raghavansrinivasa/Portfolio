(() => {
  "use strict";

  /*
   * ============================================================
   * RAGHAVAN KS — PORTFOLIO SCRIPT
   * ============================================================
   *
   * Systems:
   *
   * 01. Colour system
   * 02. Scroll reveals
   * 03. Cursor glow
   * 04. Magnetic buttons
   * 05. Active section navigation
   * 06. Hero environmental parallax
   * 07. Interactive mascot
   *
   * No external animation libraries.
   * ============================================================
   */


  /* ==========================================================
     GLOBAL
     ========================================================== */

  const root =
    document.documentElement;

  const reduced =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  /* ==========================================================
     01 / COLOUR SYSTEM
     ========================================================== */

  const themeToggle =
    document.getElementById(
      "themeToggle"
    );

  const themePanel =
    document.getElementById(
      "themePanel"
    );

  const themeOptions =
    document.querySelectorAll(
      "[data-theme-option]"
    );

  const themeStorageKey =
    "portfolio-theme";


  const themes = [
    "signal",
    "amber",
    "violet",
    "ice",
    "ember"
  ];


  /*
   * Apply a colour system.
   *
   * The CSS listens for:
   *
   * html[data-theme="signal"]
   * html[data-theme="amber"]
   * html[data-theme="violet"]
   * html[data-theme="ice"]
   * html[data-theme="ember"]
   */
  function applyTheme(theme) {

    if (
      !themes.includes(theme)
    ) {
      theme = "signal";
    }


    root.setAttribute(
      "data-theme",
      theme
    );


    localStorage.setItem(
      themeStorageKey,
      theme
    );


    themeOptions.forEach(
      option => {

        const selected =
          option.dataset.themeOption ===
          theme;

        option.classList.toggle(
          "is-selected",
          selected
        );

        option.setAttribute(
          "aria-checked",
          selected
            ? "true"
            : "false"
        );

      }
    );

  }


  /*
   * Restore visitor's previous
   * colour preference.
   */
  let savedTheme =
    localStorage.getItem(
      themeStorageKey
    );


  if (
    !themes.includes(savedTheme)
  ) {
    savedTheme = "signal";
  }


  applyTheme(savedTheme);


  /*
   * Open colour panel.
   */
  function openThemePanel() {

    if (!themePanel) {
      return;
    }

    themePanel.hidden = false;

    themeToggle?.setAttribute(
      "aria-expanded",
      "true"
    );

  }


  /*
   * Close colour panel.
   */
  function closeThemePanel() {

    if (!themePanel) {
      return;
    }

    themePanel.hidden = true;

    themeToggle?.setAttribute(
      "aria-expanded",
      "false"
    );

  }


  /*
   * Theme button.
   */
  themeToggle?.addEventListener(
    "click",
    event => {

      event.preventDefault();
      event.stopPropagation();

      if (themePanel.hidden) {
        openThemePanel();
      } else {
        closeThemePanel();
      }

    }
  );


  /*
   * Theme choices.
   */
  themeOptions.forEach(
    option => {

      option.addEventListener(
        "click",
        event => {

          event.preventDefault();
          event.stopPropagation();

          const theme =
            option.dataset.themeOption;

          applyTheme(theme);

          closeThemePanel();

        }
      );

    }
  );


  /*
   * Close colour panel when
   * clicking elsewhere.
   */
  document.addEventListener(
    "click",
    event => {

      if (
        !themePanel ||
        themePanel.hidden
      ) {
        return;
      }

      if (
        !event.target.closest(
          ".theme-control"
        )
      ) {
        closeThemePanel();
      }

    }
  );


  /*
   * Escape closes colour panel.
   */
  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {
        closeThemePanel();
      }

    }
  );


  /*
   * Keyboard navigation through
   * colour palettes.
   */
  themeOptions.forEach(
    (option, index) => {

      option.addEventListener(
        "keydown",
        event => {

          let nextIndex =
            index;


          if (
            event.key ===
              "ArrowRight" ||
            event.key ===
              "ArrowDown"
          ) {

            nextIndex =
              (
                index + 1
              ) %
              themeOptions.length;

          }


          if (
            event.key ===
              "ArrowLeft" ||
            event.key ===
              "ArrowUp"
          ) {

            nextIndex =
              (
                index -
                1 +
                themeOptions.length
              ) %
              themeOptions.length;

          }


          if (
            nextIndex === index
          ) {
            return;
          }


          event.preventDefault();


          const next =
            themeOptions[
              nextIndex
            ];


          next.focus();


          applyTheme(
            next.dataset.themeOption
          );

        }
      );

    }
  );


  /* ==========================================================
     02 / YEAR
     ========================================================== */

  const year =
    document.getElementById(
      "year"
    );


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  /* ==========================================================
     03 / SCROLL REVEALS
     ========================================================== */

  const revealItems =
    document.querySelectorAll(
      ".reveal"
    );


  if (
    reduced ||
    !("IntersectionObserver" in window)
  ) {

    revealItems.forEach(
      element => {

        element.classList.add(
          "is-visible"
        );

      }
    );

  } else {

    const revealObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }


              entry.target.classList.add(
                "is-visible"
              );


              revealObserver.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold:.12,

          rootMargin:
            "0px 0px -8% 0px"
        }
      );


    revealItems.forEach(
      element => {

        revealObserver.observe(
          element
        );

      }
    );

  }


  /* ==========================================================
     04 / CURSOR GLOW
     ========================================================== */

  const cursorGlow =
    document.querySelector(
      ".cursor-glow"
    );


  if (
    cursorGlow &&
    !reduced &&
    window.matchMedia(
      "(pointer:fine)"
    ).matches
  ) {

    let cursorX = 0;
    let cursorY = 0;

    let glowFrame = 0;


    window.addEventListener(
      "pointermove",
      event => {

        cursorX =
          event.clientX;

        cursorY =
          event.clientY;


        if (glowFrame) {
          return;
        }


        glowFrame =
          requestAnimationFrame(
            () => {

              cursorGlow.style.left =
                `${cursorX}px`;

              cursorGlow.style.top =
                `${cursorY}px`;

              cursorGlow.style.opacity =
                "1";


              glowFrame = 0;

            }
          );

      },
      {
        passive:true
      }
    );

  }


  /* ==========================================================
     05 / MAGNETIC BUTTONS
     ========================================================== */

  if (
    !reduced &&
    window.matchMedia(
      "(pointer:fine)"
    ).matches
  ) {

    const magneticElements =
      document.querySelectorAll(
        ".magnetic"
      );


    magneticElements.forEach(
      element => {

        element.addEventListener(
          "pointermove",
          event => {

            const rect =
              element.getBoundingClientRect();


            const centerX =
              rect.left +
              rect.width / 2;


            const centerY =
              rect.top +
              rect.height / 2;


            const x =
              (
                event.clientX -
                centerX
              ) * .08;


            const y =
              (
                event.clientY -
                centerY
              ) * .08;


            element.style.transform =
              `translate(${x}px, ${y}px)`;

          }
        );


        element.addEventListener(
          "pointerleave",
          () => {

            element.style.transform =
              "";

          }
        );

      }
    );

  }


  /* ==========================================================
     06 / ACTIVE SECTION NAVIGATION
     ========================================================== */

  const sections =
    document.querySelectorAll(
      "[data-section]"
    );


  const navLinks =
    document.querySelectorAll(
      ".desktop-nav a"
    );


  const navMap =
    new Map();


  navLinks.forEach(
    link => {

      const href =
        link.getAttribute(
          "href"
        );


      if (
        href &&
        href.startsWith("#")
      ) {

        navMap.set(
          href.slice(1),
          link
        );

      }

    }
  );


  if (
    "IntersectionObserver" in window
  ) {

    const sectionObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              const link =
                navMap.get(
                  entry.target.id
                );


              if (!link) {
                return;
              }


              link.classList.toggle(
                "active",
                entry.isIntersecting
              );

            }
          );

        },
        {
          rootMargin:
            "-35% 0px -55% 0px",

          threshold:0
        }
      );


    sections.forEach(
      section => {

        sectionObserver.observe(
          section
        );

      }
    );

  }


  /* ==========================================================
     07 / HERO PARALLAX
     ========================================================== */

  const heroGrid =
    document.querySelector(
      ".hero-grid"
    );


  if (
    heroGrid &&
    !reduced
  ) {

    let parallaxFrame = 0;


    window.addEventListener(
      "scroll",
      () => {

        if (parallaxFrame) {
          return;
        }


        parallaxFrame =
          requestAnimationFrame(
            () => {

              heroGrid.style.transform =
                `perspective(700px) ` +
                `rotateX(55deg) ` +
                `translateY(calc(22% + ` +
                `${window.scrollY * .025}px))`;


              parallaxFrame = 0;

            }
          );

      },
      {
        passive:true
      }
    );

  }


  /* ==========================================================
     08 / INTERACTIVE MASCOT
     ========================================================== */

  const mascotSystem =
    document.getElementById(
      "mascotSystem"
    );


  const mascot =
    document.getElementById(
      "mascot"
    );


  const mascotPanel =
    document.getElementById(
      "mascotPanel"
    );


  const mascotCable =
    document.getElementById(
      "mascotCable"
    );


  const mascotReset =
    document.getElementById(
      "mascotReset"
    );


  const mascotElasticity =
    document.getElementById(
      "mascotElasticity"
    );


  const mascotScale =
    document.getElementById(
      "mascotScale"
    );


  const mascotElasticityValue =
    document.getElementById(
      "mascotElasticityValue"
    );


  const mascotScaleValue =
    document.getElementById(
      "mascotScaleValue"
    );


  const mascotOptions =
    document.querySelectorAll(
      "[data-mascot-body]," +
      "[data-mascot-sensor]," +
      "[data-mascot-mood]," +
      "[data-mascot-accessory]"
    );


  const mascotStorageKey =
    "portfolio-mascot";


  /*
   * Default mascot.
   */
  const mascotDefaults = {

    body:"capsule",

    sensor:"dot",

    mood:"neutral",

    accessory:"antenna",

    elasticity:2,

    scale:2

  };


  /*
   * Valid choices.
   */
  const mascotChoices = {

    body:[
      "capsule",
      "orb",
      "block"
    ],

    sensor:[
      "dot",
      "radar",
      "scan"
    ],

    mood:[
      "neutral",
      "curious",
      "alert"
    ],

    accessory:[
      "antenna",
      "module",
      "none"
    ]

  };


  /*
   * Validate a mascot value.
   */
  function validMascotValue(
    group,
    value
  ) {

    return (
      mascotChoices[group] &&
      mascotChoices[group].includes(
        value
      )
    );

  }


  /*
   * Get the data attribute
   * belonging to an option.
   */
  function getMascotOptionType(
    option
  ) {

    if (
      option.dataset.mascotBody
    ) {
      return "body";
    }


    if (
      option.dataset.mascotSensor
    ) {
      return "sensor";
    }


    if (
      option.dataset.mascotMood
    ) {
      return "mood";
    }


    if (
      option.dataset.mascotAccessory
    ) {
      return "accessory";
    }


    return null;

  }


  /*
   * Get option value.
   */
  function getMascotOptionValue(
    option,
    type
  ) {

    const key =
      `mascot${
        type.charAt(0).toUpperCase()
      }${
        type.slice(1)
      }`;


    return option.dataset[key];

  }


  /*
   * Update option states.
   */
  function updateMascotOptionStates() {

    mascotOptions.forEach(
      option => {

        const type =
          getMascotOptionType(
            option
          );


        if (!type) {
          return;
        }


        const value =
          getMascotOptionValue(
            option,
            type
          );


        const selected =
          value ===
          mascotSystem.dataset[type];


        option.classList.toggle(
          "is-selected",
          selected
        );


        option.setAttribute(
          "aria-checked",
          selected
            ? "true"
            : "false"
        );

      }
    );

  }


  /*
   * Update slider labels.
   */
  function updateMascotLabels() {

    const elasticityLabels = [
      "SOFT",
      "DEFAULT",
      "SPRING"
    ];


    const scaleLabels = [
      "TINY",
      "DEFAULT",
      "LARGE"
    ];


    const elasticity =
      Number(
        mascotElasticity.value
      );


    const scale =
      Number(
        mascotScale.value
      );


    mascotElasticityValue.textContent =
      elasticityLabels[
        elasticity - 1
      ];


    mascotScaleValue.textContent =
      scaleLabels[
        scale - 1
      ];


    const scaleValues = [
      .82,
      1,
      1.18
    ];


    mascotSystem.style.setProperty(
      "--mascot-scale",
      scaleValues[
        scale - 1
      ]
    );

  }


  /*
   * Save mascot state.
   */
  function saveMascotConfig() {

    if (!mascotSystem) {
      return;
    }


    const config = {

      body:
        mascotSystem.dataset.body,

      sensor:
        mascotSystem.dataset.sensor,

      mood:
        mascotSystem.dataset.mood,

      accessory:
        mascotSystem.dataset.accessory,

      elasticity:
        Number(
          mascotElasticity.value
        ),

      scale:
        Number(
          mascotScale.value
        )

    };


    try {

      localStorage.setItem(
        mascotStorageKey,
        JSON.stringify(config)
      );

    } catch {

      /*
       * localStorage may be blocked
       * in privacy-restricted contexts.
       */

    }

  }


  /*
   * Load mascot state.
   */
  function loadMascotConfig() {

    try {

      const stored =
        localStorage.getItem(
          mascotStorageKey
        );


      if (!stored) {
        return mascotDefaults;
      }


      const parsed =
        JSON.parse(stored);


      if (
        !parsed ||
        typeof parsed !== "object"
      ) {
        return mascotDefaults;
      }


      return {
        ...mascotDefaults,
        ...parsed
      };

    } catch {

      return mascotDefaults;

    }

  }


  /*
   * Apply mascot configuration.
   */
  function applyMascotConfig(
    config
  ) {

    if (
      !mascotSystem
    ) {
      return;
    }


    const body =
      validMascotValue(
        "body",
        config.body
      )
        ? config.body
        : mascotDefaults.body;


    const sensor =
      validMascotValue(
        "sensor",
        config.sensor
      )
        ? config.sensor
        : mascotDefaults.sensor;


    const mood =
      validMascotValue(
        "mood",
        config.mood
      )
        ? config.mood
        : mascotDefaults.mood;


    const accessory =
      validMascotValue(
        "accessory",
        config.accessory
      )
        ? config.accessory
        : mascotDefaults.accessory;


    const elasticity =
      [1,2,3].includes(
        Number(
          config.elasticity
        )
      )
        ? Number(
            config.elasticity
          )
        : mascotDefaults.elasticity;


    const scale =
      [1,2,3].includes(
        Number(
          config.scale
        )
      )
        ? Number(
            config.scale
          )
        : mascotDefaults.scale;


    mascotSystem.dataset.body =
      body;


    mascotSystem.dataset.sensor =
      sensor;


    mascotSystem.dataset.mood =
      mood;


    mascotSystem.dataset.accessory =
      accessory;


    mascotElasticity.value =
      elasticity;


    mascotScale.value =
      scale;


    updateMascotOptionStates();

    updateMascotLabels();

    saveMascotConfig();

  }


  /*
   * Initialize mascot.
   */
  if (
    mascotSystem &&
    mascot
  ) {

    applyMascotConfig(
      loadMascotConfig()
    );

  }


  /* ==========================================================
     09 / MASCOT PANEL
     ========================================================== */

  function openMascotPanel() {

    if (!mascotPanel) {
      return;
    }


    mascotPanel.hidden =
      false;


    mascot.setAttribute(
      "aria-expanded",
      "true"
    );

  }


  function closeMascotPanel() {

    if (!mascotPanel) {
      return;
    }


    mascotPanel.hidden =
      true;


    mascot.setAttribute(
      "aria-expanded",
      "false"
    );

  }


  /*
   * Mascot click opens customizer.
   *
   * A dragged mascot sets "was-dragged"
   * so releasing it doesn't accidentally
   * open the panel.
   */
let mascotWasDragged = false;

mascot?.addEventListener(
  "click",
  event => {

    event.preventDefault();
    event.stopPropagation();

    if (mascotWasDragged) {

      mascotWasDragged = false;

      return;

    }

    if (!mascotPanel) {
      return;
    }

    if (mascotPanel.hidden) {
      openMascotPanel();
    } else {
      closeMascotPanel();
    }

  }
);


  /*
   * Click outside closes mascot panel.
   */
  document.addEventListener(
    "click",
    event => {

      if (
        !mascotPanel ||
        mascotPanel.hidden
      ) {
        return;
      }


      if (
        !event.target.closest(
          "#mascotSystem"
        )
      ) {

        closeMascotPanel();

      }

    }
  );


  /*
   * Escape closes mascot panel.
   */
  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        closeMascotPanel();

      }

    }
  );


  /* ==========================================================
     10 / MASCOT CUSTOMIZATION
     ========================================================== */

  mascotOptions.forEach(
    option => {

      option.addEventListener(
        "click",
        event => {

          event.preventDefault();

          event.stopPropagation();


          const type =
            getMascotOptionType(
              option
            );


          const value =
            getMascotOptionValue(
              option,
              type
            );


          if (
            !type ||
            !validMascotValue(
              type,
              value
            )
          ) {
            return;
          }


          mascotSystem.dataset[type] =
            value;


          updateMascotOptionStates();

          saveMascotConfig();

        }
      );

    }
  );


  /*
   * Elasticity slider.
   */
  mascotElasticity?.addEventListener(
    "input",
    () => {

      updateMascotLabels();

      saveMascotConfig();

    }
  );


  /*
   * Size slider.
   */
  mascotScale?.addEventListener(
    "input",
    () => {

      updateMascotLabels();

      saveMascotConfig();

    }
  );


  /*
   * Reset.
   */
  mascotReset?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();


      applyMascotConfig(
        mascotDefaults
      );

    }
  );


  /* ==========================================================
     11 / MASCOT ELASTIC PHYSICS
     ========================================================== */

  if (
    mascot &&
    mascotSystem &&
    !reduced
  ) {

    let dragging = false;

    let pointerId = null;


    let targetX = 0;
    let targetY = 0;


    let currentX = 0;
    let currentY = 0;


    let velocityX = 0;
    let velocityY = 0;


    let physicsFrame = 0;


    /*
     * Maximum distance the mascot
     * can be pulled.
     */
    const maxPull = 145;


    /*
     * Physics profiles.
     */
    function getPhysics() {

      const setting =
        Number(
          mascotElasticity.value
        );


      if (
        setting === 1
      ) {

        return {
          spring:.055,
          damping:.72
        };

      }


      if (
        setting === 3
      ) {

        return {
          spring:.105,
          damping:.76
        };

      }


      return {
        spring:.08,
        damping:.74
      };

    }


    /*
     * Keep a vector within
     * the maximum pull distance.
     */
    function limitPull(
      x,
      y
    ) {

      const distance =
        Math.sqrt(
          x * x +
          y * y
        );


      if (
        distance <= maxPull
      ) {

        return {
          x,
          y
        };

      }


      const factor =
        maxPull /
        distance;


      return {
        x:x * factor,
        y:y * factor
      };

    }


    /*
     * Render mascot and cable.
     */
    function renderMascot() {

      if (
        !mascot ||
        !mascotCable
      ) {
        return;
      }


      const angle =
        Math.atan2(
          currentX,
          96 + currentY
        ) *
        180 /
        Math.PI;


      const cableLength =
        Math.max(
          20,

          Math.min(
            170,

            Math.sqrt(
              currentX *
                currentX +

              (
                96 +
                currentY
              ) *
              (
                96 +
                currentY
              )
            )
          )
        );


      mascot.style.transform =
        `translate(` +
        `calc(-50% + ${currentX}px),` +
        `${currentY}px)` +
        `scale(var(--mascot-scale, 1))` +
        `rotate(${angle * .18}deg)`;


      mascotCable.style.height =
        `${cableLength}px`;


      mascotCable.style.transform =
        `translateX(-50%) ` +
        `rotate(${angle}deg)`;

    }


    /*
     * Start physics loop.
     */
    function startMascotPhysics() {

      if (
        physicsFrame
      ) {
        return;
      }


      physicsFrame =
        requestAnimationFrame(
          mascotPhysics
        );

    }


    /*
     * Physics loop.
     */
    function mascotPhysics() {

      const physics =
        getPhysics();


      if (
        dragging
      ) {

        velocityX +=
          (
            targetX -
            currentX
          ) *
          .28;


        velocityY +=
          (
            targetY -
            currentY
          ) *
          .28;

      } else {

        velocityX +=
          (
            -currentX
          ) *
          physics.spring;


        velocityY +=
          (
            -currentY
          ) *
          physics.spring;

      }


      velocityX *=
        physics.damping;


      velocityY *=
        physics.damping;


      currentX +=
        velocityX;


      currentY +=
        velocityY;


      renderMascot();


      /*
       * Once released, stop when
       * the system has settled.
       */
      if (
        !dragging &&

        Math.abs(currentX) < .05 &&

        Math.abs(currentY) < .05 &&

        Math.abs(velocityX) < .05 &&

        Math.abs(velocityY) < .05
      ) {

        currentX = 0;
        currentY = 0;

        velocityX = 0;
        velocityY = 0;

        renderMascot();

        physicsFrame = 0;

        return;

      }


      physicsFrame =
        requestAnimationFrame(
          mascotPhysics
        );

    }


    /*
     * Pointer down.
     */
    mascot.addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();

        event.stopPropagation();


        dragging = true;

        pointerId =
          event.pointerId;


        mascotSystem.classList.add(
          "is-dragging"
        );


        /*
         * Capture pointer so dragging
         * continues even if the cursor
         * briefly leaves the mascot.
         */
        try {

          mascot.setPointerCapture(
            pointerId
          );

        } catch {
          /* Ignore unsupported capture. */
        }


        velocityX = 0;
        velocityY = 0;


        const rect =
          mascotSystem.getBoundingClientRect();


        const rawX =
          event.clientX -
          (
            rect.left +
            rect.width / 2
          );


        const rawY =
          event.clientY -
          (
            rect.top +
            96
          );


        const limited =
          limitPull(
            rawX,
            rawY
          );


        targetX =
          limited.x;


        targetY =
          limited.y;


        startMascotPhysics();

      }
    );


    /*
     * Pointer movement.
     */
    mascot.addEventListener(
      "pointermove",
      event => {

        if (
          !dragging ||
          event.pointerId !== pointerId
        ) {
          return;
        }


        const rect =
          mascotSystem.getBoundingClientRect();


        const rawX =
          event.clientX -
          (
            rect.left +
            rect.width / 2
          );


        const rawY =
          event.clientY -
          (
            rect.top +
            96
          );


        const limited =
          limitPull(
            rawX,
            rawY
          );


        targetX =
          limited.x;


        targetY =
          limited.y;


        startMascotPhysics();

      }
    );


    /*
     * Release mascot.
     */
    function releaseMascot(
      event
    ) {

      if (
        !dragging
      ) {
        return;
      }


      if (
        event &&
        event.pointerId !==
          pointerId
      ) {
        return;
      }


      dragging = false;


      mascotSystem.classList.remove(
        "is-dragging"
      );


      mascotSystem.classList.add(
        "was-dragged"
      );


      startMascotPhysics();

    }


    mascot.addEventListener(
      "pointerup",
      releaseMascot
    );


    mascot.addEventListener(
      "pointercancel",
      releaseMascot
    );

  }


  /* ==========================================================
     12 / REDUCED MOTION FALLBACK
     ========================================================== */

  if (
    reduced &&
    mascot
  ) {

    /*
     * Mascot remains completely usable
     * as a customization control, but
     * no physics animation is run.
     */
    mascot.addEventListener(
      "pointerdown",
      event => {

        event.stopPropagation();

      }
    );

  }


  /* ==========================================================
     END
     ========================================================== */

})();
