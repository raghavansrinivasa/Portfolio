(() => {
  "use strict";

  /*
   * RAGHAVAN KS — PORTFOLIO SCRIPT
   *
   * Core:
   * 01. Theme / colour system
   * 02. Year
   * 03. Scroll reveals
   * 04. Cursor glow
   * 05. Magnetic interactions
   * 06. Active navigation
   * 07. Hero parallax
   * 08. Retro technical mascot
   *
   * Mascot:
   * Telephone / Computer / Pager / Keyboard / Mouse
   *
   * No frameworks.
   * No animation libraries.
   * No external SVG dependencies.
   */

  const root = document.documentElement;

  const reduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* ==========================================================
     01 / COLOUR SYSTEM
     ========================================================== */

  const themeToggle =
    document.getElementById("themeToggle");

  const themePanel =
    document.getElementById("themePanel");

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
    "ember",
    "poster"
  ];


  function applyTheme(theme) {

    if (!themes.includes(theme)) {
      theme = "signal";
    }

    root.setAttribute(
      "data-theme",
      theme
    );

    try {
      localStorage.setItem(
        themeStorageKey,
        theme
      );
    } catch {}

    themeOptions.forEach(option => {

      const selected =
        option.dataset.themeOption === theme;

      option.classList.toggle(
        "is-selected",
        selected
      );

      option.setAttribute(
        "aria-checked",
        selected ? "true" : "false"
      );

    });

  }


  let savedTheme = null;

  try {
    savedTheme =
      localStorage.getItem(
        themeStorageKey
      );
  } catch {}

  applyTheme(
    themes.includes(savedTheme)
      ? savedTheme
      : "signal"
  );


  function openThemePanel() {

    closeMascotPanel();

    if (!themePanel) return;

    themePanel.hidden = false;

    themeToggle?.setAttribute(
      "aria-expanded",
      "true"
    );

  }


  function closeThemePanel() {

    if (!themePanel) return;

    themePanel.hidden = true;

    themeToggle?.setAttribute(
      "aria-expanded",
      "false"
    );

  }


  themeToggle?.addEventListener(
    "click",
    event => {

      event.preventDefault();
      event.stopPropagation();

      themePanel.hidden
        ? openThemePanel()
        : closeThemePanel();

    }
  );


  themeOptions.forEach(option => {

    option.addEventListener(
      "click",
      event => {

        event.preventDefault();
        event.stopPropagation();

        applyTheme(
          option.dataset.themeOption
        );

        closeThemePanel();

      }
    );

  });


  document.addEventListener(
    "click",
    event => {

      if (
        themePanel &&
        !themePanel.hidden &&
        !event.target.closest(".theme-control")
      ) {
        closeThemePanel();
      }

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {
        closeThemePanel();
      }

    }
  );


  themeOptions.forEach(
    (option, index) => {

      option.addEventListener(
        "keydown",
        event => {

          let nextIndex = index;

          if (
            event.key === "ArrowRight" ||
            event.key === "ArrowDown"
          ) {
            nextIndex =
              (index + 1) %
              themeOptions.length;
          }

          if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowUp"
          ) {
            nextIndex =
              (
                index -
                1 +
                themeOptions.length
              ) %
              themeOptions.length;
          }

          if (nextIndex === index) {
            return;
          }

          event.preventDefault();

          const next =
            themeOptions[nextIndex];

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
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }


  /* ==========================================================
     03 / SCROLL REVEALS
     ========================================================== */

  const revealItems =
    document.querySelectorAll(".reveal");


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

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "is-visible"
            );

            revealObserver.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: .12,
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

        if (glowFrame) return;

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
        passive: true
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

    document
      .querySelectorAll(".magnetic")
      .forEach(element => {

        element.addEventListener(
          "pointermove",
          event => {

            const rect =
              element.getBoundingClientRect();

            const x =
              (
                event.clientX -
                (
                  rect.left +
                  rect.width / 2
                )
              ) * .08;

            const y =
              (
                event.clientY -
                (
                  rect.top +
                  rect.height / 2
                )
              ) * .08;

            element.style.transform =
              `translate(${x}px, ${y}px)`;

          }
        );


        element.addEventListener(
          "pointerleave",
          () => {

            element.style.transform = "";

          }
        );

      });

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

  const navMap = new Map();


  navLinks.forEach(link => {

    const href =
      link.getAttribute("href");

    if (
      href &&
      href.startsWith("#")
    ) {

      navMap.set(
        href.slice(1),
        link
      );

    }

  });


  if (
    "IntersectionObserver" in window
  ) {

    const sectionObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            const link =
              navMap.get(
                entry.target.id
              );

            if (!link) return;

            link.classList.toggle(
              "active",
              entry.isIntersecting
            );

          });

        },
        {
          rootMargin:
            "-35% 0px -55% 0px",
          threshold: 0
        }
      );


    sections.forEach(section => {

      sectionObserver.observe(
        section
      );

    });

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

        if (parallaxFrame) return;


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
        passive: true
      }
    );

  }


  /* ==========================================================
     08 / RETRO TECH MASCOT
     ========================================================== */
  const mascotSystem =
    document.getElementById("mascotSystem");

  const mascot =
    document.getElementById("mascot");

  const mascotPanel =
    document.getElementById("mascotPanel");

  const mascotCable =
    document.getElementById("mascotCable");
  const mascotDevice =
  document.getElementById("mascotDevice");

  const mascotDeviceSvg =
    document.getElementById("mascotDeviceSvg");

  const mascotDeviceName =
    document.getElementById("mascotDeviceName") ||
    document.getElementById("mascotDeviceState");

  const mascotReset =
    document.getElementById("mascotReset");

  const mascotElasticity =
    document.getElementById("mascotElasticity");

  const mascotScale =
    document.getElementById("mascotScale");

  const mascotElasticityValue =
    document.getElementById(
      "mascotElasticityValue"
    );

  const mascotScaleValue =
    document.getElementById(
      "mascotScaleValue"
    );

  const mascotStorageKey =
    "portfolio-mascot";


  /* ==========================================================
     MASCOT DEVICES
     ========================================================== */

  const mascotDevices = {

    telephone: {
      label: "TELEPHONE",

      svg: `
        <g
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >

          <path d="
            M52 42
            C48 30 51 20 63 15
            L82 26
            L73 43
            C83 61 99 77 118 87
            L136 78
            L148 98
            C141 111 128 115 116 110
            C82 97 56 70 52 42
          "/>

          <path d="M63 20 L82 31"/>
          <path d="M136 84 L119 94"/>

          <circle
            cx="102"
            cy="111"
            r="15"
          />

          <circle
            cx="102"
            cy="111"
            r="4"
          />

          <path d="
            M102 96 V102
            M87 111 H93
            M111 111 H117
            M102 120 V126
          "/>

        </g>
      `
    },


    computer: {
      label: "COMPUTER",

      svg: `
        <g
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >

          <rect
            x="24"
            y="18"
            width="128"
            height="80"
            rx="7"
          />

          <rect
            x="39"
            y="32"
            width="98"
            height="48"
            rx="2"
          />

          <path d="M50 46 H66"/>
          <path d="M50 57 H82"/>
          <path d="M50 68 H61"/>

          <path d="M68 112 H108"/>
          <path d="M78 98 V112"/>
          <path d="M98 98 V112"/>

          <rect
            x="166"
            y="45"
            width="32"
            height="67"
            rx="3"
          />

          <path d="M174 59 H190"/>
          <path d="M174 70 H190"/>
          <path d="M174 81 H185"/>

          <circle
            cx="182"
            cy="98"
            r="3"
          />

        </g>
      `
    },


    pager: {
      label: "PAGER",

      svg: `
        <g
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >

          <rect
            x="72"
            y="10"
            width="76"
            height="130"
            rx="10"
          />

          <rect
            x="84"
            y="30"
            width="52"
            height="30"
            rx="2"
          />

          <path d="M90 42 H116"/>
          <path d="M90 51 H109"/>

          <circle
            cx="96"
            cy="82"
            r="6"
          />

          <path d="M112 76 H135"/>
          <path d="M112 88 H130"/>
          <path d="M86 110 H134"/>
          <path d="M148 36 H162"/>

        </g>
      `
    },


    keyboard: {
      label: "KEYBOARD",

      svg: `
        <g
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >

          <path d="
            M18 43
            L42 21
            H178
            L202 43
            L187 111
            H33
            Z
          "/>

          <path d="M43 47 H177"/>

          <path d="M47 59 V68"/>
          <path d="M63 59 V68"/>
          <path d="M79 59 V68"/>
          <path d="M95 59 V68"/>
          <path d="M111 59 V68"/>
          <path d="M127 59 V68"/>
          <path d="M143 59 V68"/>
          <path d="M159 59 V68"/>

          <path d="M47 80 V89"/>
          <path d="M64 80 V89"/>
          <path d="M81 80 V89"/>
          <path d="M98 80 V89"/>
          <path d="M115 80 V89"/>
          <path d="M132 80 V89"/>
          <path d="M149 80 V89"/>
          <path d="M166 80 V89"/>

          <path d="M68 101 H152"/>

        </g>
      `
    },


    mouse: {
      label: "MOUSE",

      svg: `
        <g
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >

          <path d="
            M74 27
            C74 14 84 5 96 5
            H124
            C136 5 146 14 146 27
            V92
            C146 113 131 128 110 128
            C89 128 74 113 74 92
            Z
          "/>

          <path d="M110 6 V42"/>
          <path d="M96 42 H124"/>
          <path d="M110 48 V62"/>
          <path d="M110 128 V143"/>

        </g>
      `
    }

  };


  /* ==========================================================
     MASCOT OPTIONS
     ========================================================== */

  const mascotChoices = {

    body: [
      "telephone",
      "computer",
      "pager",
      "keyboard",
      "mouse"
    ],

    sensor: [
      "dot",
      "radar",
      "scan"
    ],

    mood: [
      "neutral",
      "curious",
      "alert"
    ],

    accessory: [
      "antenna",
      "module",
      "none"
    ]

  };


  const mascotDefaults = {

    body: "telephone",

    sensor: "dot",

    mood: "neutral",

    accessory: "antenna",

    elasticity: 2,

    scale: 2

  };


  /* ==========================================================
     MASCOT OPTION HELPERS
     ========================================================== */

  function mascotValueIsValid(
    type,
    value
  ) {

    return Boolean(
      mascotChoices[type] &&
      mascotChoices[type].includes(value)
    );

  }


  function getMascotOptionType(
    option
  ) {

    if (option.dataset.mascotBody) {
      return "body";
    }

    if (option.dataset.mascotSensor) {
      return "sensor";
    }

    if (option.dataset.mascotMood) {
      return "mood";
    }

    if (option.dataset.mascotAccessory) {
      return "accessory";
    }

    return null;

  }


  function getMascotOptionValue(
    option,
    type
  ) {

    if (!type) {
      return null;
    }

    const key =
      `mascot${
        type.charAt(0).toUpperCase()
      }${
        type.slice(1)
      }`;

    return option.dataset[key] || null;

  }


  function updateMascotOptionStates() {

    if (!mascotPanel || !mascotSystem) {
      return;
    }

    mascotPanel
      .querySelectorAll(
        "[data-mascot-body]," +
        "[data-mascot-sensor]," +
        "[data-mascot-mood]," +
        "[data-mascot-accessory]"
      )
      .forEach(option => {

        const type =
          getMascotOptionType(option);

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
          selected ? "true" : "false"
        );

      });

  }


  /* ==========================================================
     MASCOT SVG DECORATIONS
     ========================================================== */

  function createSvgElement(
    name,
    attributes = {}
  ) {

    const element =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        name
      );

    Object.entries(attributes)
      .forEach(
        ([key, value]) => {

          element.setAttribute(
            key,
            value
          );

        }
      );

    return element;

  }


  function renderMascotDecorations() {

    if (
      !mascotDeviceSvg ||
      !mascotSystem
    ) {
      return;
    }

    mascotDeviceSvg
      .querySelector(
        ".mascot-decorations"
      )
      ?.remove();

    const group =
      createSvgElement(
        "g",
        {
          class:
            "mascot-decorations",

          fill:
            "none",

          stroke:
            "currentColor",

          "stroke-width":
            "3",

          "stroke-linecap":
            "round",

          "stroke-linejoin":
            "round"
        }
      );


    const sensor =
      mascotSystem.dataset.sensor;

    const mood =
      mascotSystem.dataset.mood;

    const accessory =
      mascotSystem.dataset.accessory;


    /* Sensor */

    if (sensor === "dot") {

      group.appendChild(
        createSvgElement(
          "circle",
          {
            cx: "188",
            cy: "22",
            r: "4",
            fill: "currentColor",
            stroke: "none"
          }
        )
      );

    }


    if (sensor === "radar") {

      group.appendChild(
        createSvgElement(
          "path",
          {
            d:
              "M176 34 Q190 20 204 34"
          }
        )
      );

      group.appendChild(
        createSvgElement(
          "circle",
          {
            cx: "190",
            cy: "38",
            r: "3"
          }
        )
      );

    }


    if (sensor === "scan") {

      group.appendChild(
        createSvgElement(
          "path",
          {
            d:
              "M174 26 H204 " +
              "M178 32 H198 " +
              "M182 38 H194"
          }
        )
      );

    }


    /* Accessory */

    if (accessory === "antenna") {

      group.appendChild(
        createSvgElement(
          "path",
          {
            d:
              "M182 14 V3"
          }
        )
      );

      group.appendChild(
        createSvgElement(
          "circle",
          {
            cx: "182",
            cy: "3",
            r: "3",
            fill: "currentColor",
            stroke: "none"
          }
        )
      );

    }


    if (accessory === "module") {

      group.appendChild(
        createSvgElement(
          "rect",
          {
            x: "174",
            y: "8",
            width: "20",
            height: "13",
            rx: "2"
          }
        )
      );

    }


    /* Mood */

    if (mood === "curious") {

      group.appendChild(
        createSvgElement(
          "path",
          {
            d:
              "M196 104 Q202 98 208 104"
          }
        )
      );

    }


    if (mood === "alert") {

      group.appendChild(
        createSvgElement(
          "path",
          {
            d:
              "M194 94 V104 " +
              "M202 94 V104"
          }
        )
      );

    }


    mascotDeviceSvg.appendChild(
      group
    );

  }


  /* ==========================================================
     RENDER MASCOT DEVICE
     ========================================================== */

  function updateMascotDevice() {

    if (
      !mascotDeviceSvg ||
      !mascotSystem
    ) {
      return;
    }

    let body =
      mascotSystem.dataset.body;

    if (
      !mascotValueIsValid(
        "body",
        body
      )
    ) {
      body =
        mascotDefaults.body;
    }

    let sensor =
      mascotSystem.dataset.sensor;

    if (
      !mascotValueIsValid(
        "sensor",
        sensor
      )
    ) {
      sensor =
        mascotDefaults.sensor;
    }

    let mood =
      mascotSystem.dataset.mood;

    if (
      !mascotValueIsValid(
        "mood",
        mood
      )
    ) {
      mood =
        mascotDefaults.mood;
    }

    let accessory =
      mascotSystem.dataset.accessory;

    if (
      !mascotValueIsValid(
        "accessory",
        accessory
      )
    ) {
      accessory =
        mascotDefaults.accessory;
    }


    mascotSystem.dataset.body =
      body;

    mascotSystem.dataset.sensor =
      sensor;

    mascotSystem.dataset.mood =
      mood;

    mascotSystem.dataset.accessory =
      accessory;


    mascotDeviceSvg.innerHTML =
      mascotDevices[body].svg;


    mascotDeviceSvg.style.color =
      "var(--accent)";


    if (mascotDeviceName) {

      mascotDeviceName.textContent =
        mascotDevices[body].label;

    }


    renderMascotDecorations();

  }


  /* ==========================================================
     MASCOT LABELS
     ========================================================== */

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
        mascotElasticity?.value || 2
      );

    const scale =
      Number(
        mascotScale?.value || 2
      );


    if (mascotElasticityValue) {

      mascotElasticityValue.textContent =
        elasticityLabels[
          elasticity - 1
        ] || "DEFAULT";

    }


    if (mascotScaleValue) {

      mascotScaleValue.textContent =
        scaleLabels[
          scale - 1
        ] || "DEFAULT";

    }


    if (mascotSystem) {

      const scales = [
        .82,
        1,
        1.18
      ];

      mascotSystem.style.setProperty(
        "--mascot-scale",
        scales[scale - 1] || 1
      );

    }

  }
  function updateMascotInstruments() {
    [mascotElasticity, mascotScale].forEach(slider => {
      if (!slider) return;

      const value = Number(slider.value || 2);
      const min = Number(slider.min || 1);
      const max = Number(slider.max || 3);
      const pct = ((value - min) / (max - min)) * 100;

      slider.style.setProperty("--slider-progress", `${pct}%`);
    });
  }

  /* ==========================================================
     MASCOT STORAGE
     ========================================================== */

  function saveMascotConfig() {

    if (!mascotSystem) {
      return;
    }

    const config = {

      body:
        mascotSystem.dataset.body ||
        mascotDefaults.body,

      sensor:
        mascotSystem.dataset.sensor ||
        mascotDefaults.sensor,

      mood:
        mascotSystem.dataset.mood ||
        mascotDefaults.mood,

      accessory:
        mascotSystem.dataset.accessory ||
        mascotDefaults.accessory,

      elasticity:
        Number(
          mascotElasticity?.value ||
          mascotDefaults.elasticity
        ),

      scale:
        Number(
          mascotScale?.value ||
          mascotDefaults.scale
        )

    };


    try {

      localStorage.setItem(
        mascotStorageKey,
        JSON.stringify(config)
      );

    } catch {}

  }


  function loadMascotConfig() {

    try {

      const stored =
        localStorage.getItem(
          mascotStorageKey
        );

      if (!stored) {
        return {
          ...mascotDefaults
        };
      }

      const parsed =
        JSON.parse(stored);

      if (
        !parsed ||
        typeof parsed !== "object"
      ) {
        return {
          ...mascotDefaults
        };
      }


      /*
       * Migrate values from the older
       * mascot prototype.
       */

      const oldBodies = [
        "capsule",
        "orb",
        "block"
      ];


      if (
        oldBodies.includes(
          parsed.body
        )
      ) {
        parsed.body =
          mascotDefaults.body;
      }


      return {
        ...mascotDefaults,
        ...parsed
      };

    } catch {

      return {
        ...mascotDefaults
      };

    }

  }


  function applyMascotConfig(
    config
  ) {

    if (!mascotSystem) {
      return;
    }


    const body =
      mascotValueIsValid(
        "body",
        config.body
      )
        ? config.body
        : mascotDefaults.body;


    const sensor =
      mascotValueIsValid(
        "sensor",
        config.sensor
      )
        ? config.sensor
        : mascotDefaults.sensor;


    const mood =
      mascotValueIsValid(
        "mood",
        config.mood
      )
        ? config.mood
        : mascotDefaults.mood;


    const accessory =
      mascotValueIsValid(
        "accessory",
        config.accessory
      )
        ? config.accessory
        : mascotDefaults.accessory;


    const elasticity =
      [1, 2, 3].includes(
        Number(config.elasticity)
      )
        ? Number(config.elasticity)
        : mascotDefaults.elasticity;


    const scale =
      [1, 2, 3].includes(
        Number(config.scale)
      )
        ? Number(config.scale)
        : mascotDefaults.scale;


    mascotSystem.dataset.body =
      body;

    mascotSystem.dataset.sensor =
      sensor;

    mascotSystem.dataset.mood =
      mood;

    mascotSystem.dataset.accessory =
      accessory;


    if (mascotElasticity) {

      mascotElasticity.value =
        elasticity;

    }


    if (mascotScale) {

      mascotScale.value =
        scale;

    }


    updateMascotDevice();
    updateMascotOptionStates();
    updateMascotLabels();

  }


  /* ==========================================================
     MASCOT PANEL
     ========================================================== */

  function openMascotPanel() {

    closeThemePanel();

    if (
      !mascotPanel ||
      !mascot
    ) {
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

    if (
      !mascotPanel ||
      !mascot
    ) {
      return;
    }

    mascotPanel.hidden =
      true;

    mascot.setAttribute(
      "aria-expanded",
      "false"
    );

  }


  /* ==========================================================
     MASCOT CLICK
     ========================================================== */

  let mascotWasDragged =
    false;


  mascot?.addEventListener(
    "click",
    event => {

      event.preventDefault();
      event.stopPropagation();

      if (mascotWasDragged) {

        mascotWasDragged =
          false;

        return;

      }

      if (!mascotPanel) {
        return;
      }

      mascotPanel.hidden
        ? openMascotPanel()
        : closeMascotPanel();

    }
  );


  /* ==========================================================
     CLOSE OUTSIDE / ESCAPE
     ========================================================== */

  document.addEventListener(
    "click",
    event => {

      if (
        mascotPanel &&
        !mascotPanel.hidden &&
        !event.target.closest(
          "#mascotSystem"
        )
      ) {

        closeMascotPanel();

      }

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {
        closeMascotPanel();
      }

    }
  );


  /* ==========================================================
     MASCOT OPTIONS
     ========================================================== */

  mascotPanel?.addEventListener(
    "click",
    event => {

      const option =
        event.target.closest(
          "[data-mascot-body]," +
          "[data-mascot-sensor]," +
          "[data-mascot-mood]," +
          "[data-mascot-accessory]"
        );

      if (!option) {
        return;
      }

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
        !mascotValueIsValid(
          type,
          value
        )
      ) {
        return;
      }


      mascotSystem.dataset[type] =
        value;


      /*
       * This is the important path:
       *
       * option
       *   ↓
       * dataset
       *   ↓
       * SVG
       */

      updateMascotDevice();
      updateMascotOptionStates();
      saveMascotConfig();

    }
  );


  /* ==========================================================
     SLIDERS
     ========================================================== */

mascotElasticity?.addEventListener(
  "input",
  () => {

    updateMascotLabels();
    updateMascotInstruments();
    saveMascotConfig();

    /*
     * If the mascot is currently at rest, there is no animation
     * frame running. Restart it so changing elasticity immediately
     * affects the next spring movement.
     */
    if (typeof startSpring === "function") {
      startSpring();
    }

  }
);


mascotScale?.addEventListener(
  "input",
  () => {

    updateMascotLabels();

    updateMascotInstruments();

    saveMascotConfig();

  }
);


  mascotScale?.addEventListener(
    "input",
    () => {

      updateMascotLabels();
      saveMascotConfig();

    }
  );


  /* ==========================================================
     RESET
     ========================================================== */

  mascotReset?.addEventListener(
    "click",
    event => {

      event.preventDefault();
      event.stopPropagation();

      applyMascotConfig(
        mascotDefaults
      );

      saveMascotConfig();

    }
  );


  /* ==========================================================
     INITIALIZE
     ========================================================== */

  if (mascotSystem) {

    applyMascotConfig(
      loadMascotConfig()
    );
    updateMascotInstruments();
    saveMascotConfig();

  }
  /* ==========================================================
     MASCOT SPRING PHYSICS
     ========================================================== */


  if (
    mascot &&
    mascotDevice &&
    mascotSystem &&
    mascotCable &&
    !reduced
  ) {

    let dragging = false;
    let pointerId = null;

    let targetX = 0;
    let targetY = 0;

    let x = 0;
    let y = 0;

    let velocityX = 0;
    let velocityY = 0;

    let frame = 0;

    const anchorToDevice = 87;
    const maxPull = 145;


    function startSpring() {

      if (!frame) {
        frame =
          requestAnimationFrame(
            animateSpring
          );
      }

    }


    function limitPull(
      xValue,
      yValue
    ) {

      const distance =
        Math.hypot(
          xValue,
          yValue
        );

      if (
        distance <= maxPull
      ) {
        return {
          x: xValue,
          y: yValue
        };
      }

      const factor =
        maxPull / distance;

      return {
        x: xValue * factor,
        y: yValue * factor
      };

    }


    function updateSpringVisual() {
      const deviceTransform =
        `translate(calc(-50% + ${x}px), ${y}px) ` +
        `scale(var(--mascot-scale,1))`;

      mascotDevice.style.transform = deviceTransform;
      mascot.style.transform = "translateX(-50%)";

      const vertical = anchorToDevice + y;
      const length = Math.max(20, Math.hypot(x, vertical));

      const angle =
        Math.atan2(x, vertical) * 180 / Math.PI;

      mascotCable.style.height = `${length}px`;
      mascotCable.style.transform =
        `translateX(-50%) rotate(${angle}deg)`;
    }

    function animateSpring() {

      const elasticity =
        Number(
          mascotElasticity?.value || 2
        );


      let spring = .08;
      let damping = .74;

      if (elasticity === 1) {
        spring = .045;
        damping = .64;
      }

      if (elasticity === 3) {
        spring = .14;
        damping = .84;
      }


      if (dragging) {

        velocityX +=
          (targetX - x) * .28;

        velocityY +=
          (targetY - y) * .28;

      } else {

        velocityX +=
          -x * spring;

        velocityY +=
          -y * spring;

      }


      velocityX *= damping;
      velocityY *= damping;

      x += velocityX;
      y += velocityY;


      updateSpringVisual();


      if (
        !dragging &&
        Math.abs(x) < .05 &&
        Math.abs(y) < .05 &&
        Math.abs(velocityX) < .05 &&
        Math.abs(velocityY) < .05
      ) {

        x = 0;
        y = 0;

        velocityX = 0;
        velocityY = 0;

        frame = 0;

        updateSpringVisual();

        return;

      }


      frame =
        requestAnimationFrame(
          animateSpring
        );

    }


    function getPointerOffset(
      event
    ) {

      const rect =
        mascotSystem.getBoundingClientRect();


      return limitPull(

        event.clientX -
          (
            rect.left +
            rect.width / 2
          ),

        event.clientY -
          (
            rect.top +
            91
          )

      );

    }


    mascot.addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();
        event.stopPropagation();

        dragging = true;

        mascotWasDragged = false;

        pointerId =
          event.pointerId;


        mascotSystem.classList.add(
          "is-dragging"
        );


        try {

          mascot.setPointerCapture(
            pointerId
          );

        } catch {}


        const offset =
          getPointerOffset(event);


        targetX = offset.x;
        targetY = offset.y;

        velocityX = 0;
        velocityY = 0;

        startSpring();

      }
    );


    mascot.addEventListener(
      "pointermove",
      event => {

        if (
          !dragging ||
          event.pointerId !== pointerId
        ) {
          return;
        }


        const offset =
          getPointerOffset(event);


        targetX = offset.x;
        targetY = offset.y;


        if (
          Math.abs(targetX) > 4 ||
          Math.abs(targetY) > 4
        ) {

          mascotWasDragged = true;

        }


        startSpring();

      }
    );


    function releaseMascot(
      event
    ) {

      if (!dragging) {
        return;
      }


      if (
        event &&
        event.pointerId !== pointerId
      ) {
        return;
      }


      dragging = false;

      mascotSystem.classList.remove(
        "is-dragging"
      );


      startSpring();

    }


    mascot.addEventListener(
      "pointerup",
      releaseMascot
    );

    mascot.addEventListener(
      "pointercancel",
      releaseMascot
    );

    mascot.addEventListener(
      "lostpointercapture",
      () => {

        if (!dragging) {
          return;
        }

        dragging = false;

        mascotSystem.classList.remove(
          "is-dragging"
        );

        startSpring();

      }
    );


    updateSpringVisual();

  }


  /* ==========================================================
     REDUCED MOTION
     ========================================================== */

  if (
    reduced &&
    mascotDevice
  ) {

    mascotDevice.style.transform =
      "translateX(-50%) " +
      "scale(var(--mascot-scale,1))";

  }


  /* ==========================================================
     MASCOT KEYBOARD ACCESSIBILITY
     ========================================================== */

  mascot?.addEventListener(
    "keydown",
    event => {

      if (
        event.key !== "Enter" &&
        event.key !== " "
      ) {
        return;
      }

      event.preventDefault();

      mascotPanel?.hidden
        ? openMascotPanel()
        : closeMascotPanel();

    }
  );


})();
