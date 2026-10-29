/**
 * PORTFOLIO CLIENT APPLICATION
 * Kshitij Hurle — Creative Developer & AI Systems Engineer
 * Pure JavaScript with GSAP, ScrollTrigger & Lenis
 * Exact 1:1 Parity with Reference Design & Animation Choreography
 */

(function () {
  'use strict';

  // 0. Disable automatic browser scroll restoration so reloads start at top
  if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname);
  }

  // 1. Initialize Ultra-Smooth Momentum Scrolling (Lenis + GSAP RAF)
  let lenis = null;
  let isLoaderComplete = false;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false
    });

    window.lenis = lenis;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      // 500ms lag threshold prevents sudden frame jumping and skipping
      gsap.ticker.lagSmoothing(500, 33);
    }
  }

  // 2. Text Splitting Utilities (from scrollAnimations.ts)
  function splitTextIntoChars(element) {
    const text = element.innerText;
    element.innerHTML = '';
    element.style.overflow = 'hidden';

    const chars = [];
    const words = text.split(' ');

    words.forEach((word, wIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'inline-block whitespace-nowrap overflow-hidden';
      wordSpan.style.perspective = '600px';

      for (let i = 0; i < word.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.className = 'inline-block will-change-transform';
        charSpan.style.color = 'inherit';
        charSpan.textContent = word[i];
        wordSpan.appendChild(charSpan);
        chars.push(charSpan);
      }

      element.appendChild(wordSpan);

      if (wIdx < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'inline-block';
        spaceSpan.innerHTML = '&nbsp;';
        element.appendChild(spaceSpan);
      }
    });

    return chars;
  }

  function splitTextIntoLines(element) {
    const childNodes = Array.from(element.children);
    if (childNodes.length > 0) {
      const lineSpans = [];
      childNodes.forEach((child) => {
        const lineWrapper = document.createElement('div');
        lineWrapper.className = 'overflow-hidden my-0.5';

        const lineInner = document.createElement('div');
        lineInner.className = `will-change-transform ${child.className}`;
        lineInner.innerHTML = child.innerHTML;

        lineWrapper.appendChild(lineInner);
        child.replaceWith(lineWrapper);
        lineSpans.push(lineInner);
      });
      return lineSpans;
    }

    const originalText = element.innerText;
    const sentences = originalText.split('\n').filter((s) => s.trim().length > 0);
    element.innerHTML = '';

    const lineSpans = [];

    sentences.forEach((sentence) => {
      const lineWrapper = document.createElement('div');
      lineWrapper.className = 'overflow-hidden my-0.5';

      const lineInner = document.createElement('div');
      lineInner.className = 'will-change-transform';
      lineInner.textContent = sentence.trim();

      lineWrapper.appendChild(lineInner);
      element.appendChild(lineWrapper);
      lineSpans.push(lineInner);
    });

    return lineSpans;
  }

  function initAlejandrohaScrollAnimations() {
    // 1. [data-split-rolling] — 3D Character Rolling on Scroll Trigger (Exact Reference)
    const rollingElements = document.querySelectorAll('[data-split-rolling]');
    rollingElements.forEach((el) => {
      if (el.getAttribute('data-split-rolling-initialized')) return;
      el.setAttribute('data-split-rolling-initialized', 'true');

      const chars = splitTextIntoChars(el);
      const fontSize = parseFloat(window.getComputedStyle(el).fontSize) || 28;
      const depth = fontSize * 0.6;

      gsap.set(chars, {
        rotationX: -110,
        z: -depth,
        y: depth,
        opacity: 0,
        transformOrigin: `50% 50% -${depth}px`
      });

      const aboutEl = el.closest('#about');
      const skillsEl = el.closest('#skills');
      const pinnedParent =
        aboutEl && ScrollTrigger.getById('aboutTransitionPin')
          ? aboutEl
          : skillsEl && ScrollTrigger.getById('skillsPortfolioPin')
          ? skillsEl
          : undefined;

      gsap.to(chars, {
        rotationX: 0,
        z: 0,
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power4.out',
        stagger: 0.025,
        scrollTrigger: {
          trigger: el,
          start: pinnedParent ? 'top 90%' : 'top 85%',
          pinnedContainer: pinnedParent,
          toggleActions: 'play none none none'
        }
      });
    });

    // 2. [data-split-lines] — Masked Lines Reveal on Scroll
    const lineElements = document.querySelectorAll('[data-split-lines]');
    lineElements.forEach((el) => {
      if (el.getAttribute('data-split-lines-initialized')) return;
      el.setAttribute('data-split-lines-initialized', 'true');

      const lines = splitTextIntoLines(el);
      gsap.set(lines, { yPercent: 110, opacity: 0 });

      const aboutEl = el.closest('#about');
      const skillsEl = el.closest('#skills');
      const pinnedParent =
        aboutEl && ScrollTrigger.getById('aboutTransitionPin')
          ? aboutEl
          : skillsEl && ScrollTrigger.getById('skillsPortfolioPin')
          ? skillsEl
          : undefined;

      gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: el,
          start: pinnedParent ? 'top 90%' : 'top 85%',
          pinnedContainer: pinnedParent,
          toggleActions: 'play none none none'
        }
      });
    });

    // 3. [data-bracket-heading] — Architectural Bracket Sliding
    const bracketHeadings = document.querySelectorAll('[data-bracket-heading]');
    bracketHeadings.forEach((heading) => {
      const leftBracket = heading.querySelector('[data-bracket-left]');
      const rightBracket = heading.querySelector('[data-bracket-right]');
      if (leftBracket && rightBracket) {
        const anim = gsap.timeline({
          scrollTrigger: {
            trigger: heading,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        });
        anim.fromTo(leftBracket, { xPercent: -160, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0);
        anim.fromTo(rightBracket, { xPercent: 160, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0);
      }
    });
  }

  // =========================================================================
  // SIGNATURE LAUNCH SCREEN & WORD DOCKING TIMELINE
  // Smooth slow text reveal, synchronized translation/resizing,
  // and simple, elegant slide-up curtain & fade disappearing animation
  // =========================================================================
  const initPageLoader = () => {
    const pageLoader = document.getElementById('page-loader');
    const curtain = document.getElementById('loader-curtain');
    const stage = document.getElementById('loader-stage');
    const word = document.getElementById('loader-word');
    const progressContainer = document.getElementById('loader-loading-container');
    const bar = document.getElementById('loader-progress-bar');
    const counter = document.getElementById('loader-counter');

    if (!word) return;

    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';

    // Elements in Redesigned Hero Section
    const heroWord = document.getElementById('hero-title-word');
    const heroLast = document.getElementById('hero-title-last');
    const heroPortrait = document.getElementById('hero-portrait');
    const heroHeadlineLines = document.querySelectorAll('.hero-headline-line');
    const heroProfile = document.getElementById('hero-profile-details');
    const heroMarkers = document.querySelectorAll('.hero-marker');
    const heroBottomLeft = document.querySelector('.hero-bottom-left');
    const heroBottomRight = document.querySelector('.hero-bottom-right');
    const siteHeader = document.querySelector('.site-header');

    // Initial styles for Hero elements: hidden until launch screen exits
    if (heroWord) gsap.set(heroWord, { opacity: 0, visibility: 'hidden' });
    if (heroLast) gsap.set(heroLast, { opacity: 0, y: 35 });
    if (heroPortrait) gsap.set(heroPortrait, { opacity: 0, y: 40, scale: 0.96 });
    if (heroHeadlineLines.length) gsap.set(heroHeadlineLines, { opacity: 0, y: 25 });
    if (heroProfile) gsap.set(heroProfile, { opacity: 0, x: -15 });
    if (heroMarkers.length) gsap.set(heroMarkers, { opacity: 0, y: 20 });
    if (heroBottomLeft) gsap.set(heroBottomLeft, { opacity: 0, y: 20 });
    if (heroBottomRight) gsap.set(heroBottomRight, { opacity: 0, y: 20 });

    // Ensure Navbar is invisible and unclickable during the loader screen
    if (siteHeader) gsap.set(siteHeader, { opacity: 0, pointerEvents: 'none' });
    gsap.set('.header-logo', { opacity: 0, scale: 0.6, y: -20 });
    gsap.set('.nav-link', { opacity: 0, scale: 0.6, y: -20 });
    gsap.set('#nav-resume-btn', { opacity: 0, scale: 0.6, y: -20 });

    // Initial styles for launch word "KSHITIJ" - Direct, unclipped, NO container mask
    gsap.set(word, {
      opacity: 0,
      y: 35,
      scale: 1,
      x: 0,
      color: '#ffffff',
      transformOrigin: '0 0'
    });

    if (progressContainer) {
      gsap.set(progressContainer, { opacity: 0, y: 20 });
    }
    if (bar) {
      gsap.set(bar, { width: '0%' });
    }
    if (counter) {
      counter.innerText = '0%';
    }

    // Dynamic docking coordinates calculated before translation begins
    let docking = { deltaX: 0, deltaY: 0, scale: 0.4 };

    // Function to calculate exact docking coordinates to new hero layout
    const calculateDocking = () => {
      if (!heroWord || !word) return;

      const targetRect = heroWord.getBoundingClientRect();
      const currentRect = word.getBoundingClientRect();

      docking = {
        deltaX: targetRect.left - (currentRect.left - (gsap.getProperty(word, 'x') || 0)),
        deltaY: targetRect.top - (currentRect.top - (gsap.getProperty(word, 'y') || 0)),
        scale: 1
      };
    };

    // Master Launch Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        isLoaderComplete = true;
        if (stage) stage.style.display = 'none';
        if (pageLoader) pageLoader.style.display = 'none';
        document.body.style.overflow = '';
        if (lenis) lenis.start();
        initAlejandrohaScrollAnimations();
      }
    });

    // -------------------------------------------------------------------------
    // STEP 1: Loading bar appears & progress begins (0% -> 100%)
    // Word "KSHITIJ" reveals smoothly with upward glide and full unclipped view
    // -------------------------------------------------------------------------
    if (progressContainer) {
      tl.to(
        progressContainer,
        {
          opacity: 1,
          y: 0,
          duration: 0.60,
          ease: 'power2.out'
        },
        0.20
      );
    }

    const progressObj = { value: 0 };
    const updateProgress = () => {
      const pct = Math.min(100, Math.round(progressObj.value));
      if (counter) counter.innerText = `${pct}%`;
      if (bar) bar.style.width = `${pct}%`;
    };

    // Full Progress: 0% to 100% over 2.10s
    tl.to(
      progressObj,
      {
        value: 100,
        duration: 2.10,
        ease: 'power1.inOut',
        onUpdate: updateProgress
      },
      0.30
    );

    // Text "KSHITIJ" reveals smoothly with upward glide and NO container masking
    tl.to(
      word,
      {
        opacity: 1,
        y: 0,
        duration: 1.50,
        ease: 'power2.out'
      },
      0.35
    );

    // -------------------------------------------------------------------------
    // STEP 2: At 100% (2.40s): Progress completes full charge.
    // Progress bar fades out at 2.50s.
    // -------------------------------------------------------------------------
    if (progressContainer) {
      tl.to(
        progressContainer,
        {
          opacity: 0,
          y: -12,
          duration: 0.25,
          ease: 'power2.in'
        },
        2.50
      );
    }

    // Calculate exact target docking coordinates after 100% is reached
    tl.add(() => {
      calculateDocking();
    }, 2.70);

    // -------------------------------------------------------------------------
    // STEP 3: SEAMLESS TRANSITION
    // Dark curtain slides UP ultra smoothly with zero opacity fade.
    // Text "KSHITIJ" translates & scales seamlessly to hero position.
    // Portrait reveals on center-right sitting ABOVE typography.
    // Staggered reveals for headline, profile, markers, and bottom telemetry.
    // -------------------------------------------------------------------------
    const exitStart = 2.75;

    // Solid dark curtain slides UP ultra smoothly with zero residual shadow at top
    if (curtain) {
      tl.to(
        curtain,
        {
          yPercent: -100,
          duration: 1.15,
          ease: 'power3.inOut'
        },
        exitStart
      );
      // Fade out curtain towards the top edge to guarantee zero shadow line or dark artifact
      tl.to(
        curtain,
        {
          opacity: 0,
          duration: 0.30,
          ease: 'power2.out'
        },
        exitStart + 0.85
      );
    }
    // Dynamic docking: Calculate coordinates and animate word "KSHITIJ" smoothly to hero position
    tl.add(() => {
      calculateDocking();
      gsap.to(word, {
        x: docking.deltaX,
        y: docking.deltaY,
        duration: 1.15,
        ease: 'power3.inOut'
      });
      gsap.to(word, {
        color: '#000000',
        duration: 1.05,
        ease: 'power2.inOut'
      });
    }, exitStart);

    // Instant atomic handoff at destination arrival - ZERO duplicate text, ZERO flash/flicker
    tl.add(() => {
      if (heroWord) {
        heroWord.style.visibility = 'visible';
        heroWord.style.opacity = '1';
      }
      if (word) {
        word.style.opacity = '0';
        word.style.display = 'none';
      }
      if (pageLoader) {
        pageLoader.style.display = 'none';
      }
    }, exitStart + 1.15);


    // Portrait cutout reveals with smooth photographic entrance (Layered ABOVE typography)
    if (heroPortrait) {
      tl.fromTo(
        heroPortrait,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.15, ease: 'power3.out' },
        exitStart + 0.15
      );
    }

    // Surname "HURLE" in vivid neon-lime green reveals directly below "KSHITIJ"
    if (heroLast) {
      tl.fromTo(
        heroLast,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.95, ease: 'power3.out' },
        exitStart + 0.20
      );
    }

    // Upper-Right Headline lines reveal with staggered upward slide
    if (heroHeadlineLines.length) {
      tl.fromTo(
        heroHeadlineLines,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, stagger: 0.07, duration: 0.85, ease: 'power3.out' },
        exitStart + 0.25
      );
    }

    // Profile details underneath headline reveal
    if (heroProfile) {
      tl.fromTo(
        heroProfile,
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.80, ease: 'power3.out' },
        exitStart + 0.48
      );
    }

    // Site Header / Navbar becomes visible
    if (siteHeader) {
      tl.add(() => {
        siteHeader.classList.add('is-visible');
        siteHeader.style.opacity = '1';
        siteHeader.style.pointerEvents = 'auto';
      }, exitStart + 0.25);

      // Brand Logo pops in
      tl.to(
        '.header-logo',
        { opacity: 1, scale: 1, y: 0, duration: 0.80, ease: 'back.out(2)' },
        exitStart + 0.25
      );

      // Nav links pop in
      tl.to(
        '.nav-link',
        { opacity: 1, scale: 1, y: 0, duration: 0.75, stagger: 0.06, ease: 'back.out(2)' },
        exitStart + 0.35
      );

      // Resume Button pops in
      tl.to(
        '#nav-resume-btn',
        { opacity: 1, scale: 1, y: 0, duration: 0.80, ease: 'back.out(2.5)' },
        exitStart + 0.50
      );
    }

    // Numbered Editorial Markers (01, 02, 03) reveal with staggered entrance
    if (heroMarkers.length) {
      tl.fromTo(
        heroMarkers,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.75, ease: 'power3.out' },
        exitStart + 0.40
      );
    }

    // Bottom-left location & statement
    if (heroBottomLeft) {
      tl.fromTo(
        heroBottomLeft,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
        exitStart + 0.55
      );
    }

    // Bottom-right scroll prompt
    if (heroBottomRight) {
      tl.fromTo(
        heroBottomRight,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
        exitStart + 0.60
      );
    }

    // Clean handoff: remove loader overlay when curtain has fully exited
    tl.add(() => {
      if (heroWord) gsap.set(heroWord, { opacity: 1 });
      if (heroPortrait) {
        heroPortrait.style.transform = 'none';
        heroPortrait.style.willChange = 'auto';
      }
      if (siteHeader) {
        siteHeader.style.opacity = '1';
        siteHeader.style.pointerEvents = 'auto';
        gsap.set(['.header-logo', '.nav-link', '#nav-resume-btn'], { opacity: 1, scale: 1, y: 0 });
      }
      if (pageLoader) pageLoader.style.display = 'none';
      if (curtain) curtain.style.display = 'none';
      if (stage) stage.style.display = 'none';
      if (word) word.style.display = 'none';
    }, exitStart + 1.25);
  };
  initPageLoader();

  // 4. Hero Parallax on Portrait Cutout
  const initHeroParallax = () => {
    const heroPortrait = document.getElementById('hero-portrait');
    const hero = document.getElementById('hero');
    if (!heroPortrait || !hero) return;

    // Parallax transform removed per user requirement: portrait maintains exact stationary layout on scroll
    heroPortrait.style.transform = 'none';
    heroPortrait.style.willChange = 'auto';
  };
  initHeroParallax();

  // 5. Header Dynamic Background Detection & Option Colors
  const initHeaderTheme = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let currentAppliedTheme = null;
    const checkTheme = () => {
      const headerY = 50;
      const sections = document.querySelectorAll('[data-theme-section]');
      let foundTheme = 'light';

      for (const section of Array.from(sections)) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= headerY && rect.bottom > headerY) {
          const t = section.getAttribute('data-theme-section');
          if (t === 'dark' || t === 'light') {
            foundTheme = t;
            break;
          }
        }
      }

      // Check pinned dark skills background
      const skillsDarkBg = document.getElementById('skills-dark-bg');
      if (skillsDarkBg) {
        const rect = skillsDarkBg.getBoundingClientRect();
        if (rect.top <= headerY && rect.bottom > headerY) {
          const op = parseFloat(window.getComputedStyle(skillsDarkBg).opacity || skillsDarkBg.style.opacity || '1');
          if (op > 0.3) {
            foundTheme = 'dark';
          } else {
            foundTheme = 'light';
          }
        }
      }

      if (foundTheme === currentAppliedTheme) return;
      currentAppliedTheme = foundTheme;

      if (foundTheme === 'dark') {
        header.classList.add('site-header--dark');
        header.classList.remove('site-header--light');
      } else {
        header.classList.add('site-header--light');
        header.classList.remove('site-header--dark');
      }
    };

    window.addEventListener('scroll', checkTheme, { passive: true });
    window.addEventListener('resize', checkTheme, { passive: true });
    checkTheme();
  };
  initHeaderTheme();

  // 6. Section 2 & About Me: Pinned ScrollDraw Transition (Alejandro HA 1:1 Parity)
  // Section 2 stays pinned at top: 0, static (does NOT scroll up).
  // The doodle brush stroke draws across and expands to flood background to dark #050609.
  // Then reveals About Me section seamlessly.
  const initAboutTransition = () => {
    const container = document.getElementById('about');
    const path = document.getElementById('doodle-brush-path');
    const truthWrap = document.getElementById('truth-wrap');
    const truthCharacter = document.getElementById('truth-character');
    const aboutWrap = document.getElementById('about-wrap');
    const aboutPortraitImg = document.getElementById('about-portrait-img');
    const aboutPortraitBackdrop = document.getElementById('about-portrait-backdrop') || document.getElementById('about-portrait-circle');
    const aboutHandwrittenNote = document.getElementById('about-handwritten-note');
    const aboutLeftCol = document.getElementById('about-left-col');
    const aboutRightCol = document.getElementById('about-right-col');
    const aboutTopBar = document.getElementById('about-top-bar');
    const header = document.getElementById('site-header');

    if (!container || !path) return;

    // Ensure Section 2 character remains completely still with zero hover effects
    if (truthCharacter) {
      truthCharacter.style.pointerEvents = 'none';
      truthCharacter.style.cursor = 'default';
      gsap.set(truthCharacter, { y: 0, clearProps: 'transform' });
    }

    const measuredLength = (path.getTotalLength && path.getTotalLength() > 100) ? Math.ceil(path.getTotalLength()) : 25000;
    const totalLength = Math.max(measuredLength, 22000);

    // Initial SVG brush setup
    gsap.set(path, {
      strokeDasharray: totalLength + 300,
      strokeDashoffset: totalLength + 300,
      strokeWidth: 26
    });

    if (truthWrap) {
      gsap.set(truthWrap, { opacity: 1, scale: 1, pointerEvents: 'auto' });
    }

    if (aboutWrap) {
      gsap.set(aboutWrap, { opacity: 0, pointerEvents: 'none' });
    }
    if (aboutPortraitImg) {
      gsap.set(aboutPortraitImg, { scale: 1.45, y: -70, opacity: 0, transformOrigin: 'center bottom' });
    }
    if (aboutPortraitBackdrop) {
      gsap.set(aboutPortraitBackdrop, { scale: 0.35, opacity: 0, transformOrigin: 'center center' });
    }
    if (aboutHandwrittenNote) {
      gsap.set(aboutHandwrittenNote, { opacity: 0, scale: 0.7, y: -12 });
    }
    if (aboutLeftCol) {
      gsap.set(aboutLeftCol, { opacity: 0, x: -45 });
    }
    if (aboutRightCol) {
      gsap.set(aboutRightCol, { opacity: 0, x: 45 });
    }
    if (aboutTopBar) {
      gsap.set(aboutTopBar, { opacity: 0, y: -20 });
    }

    // Master Pinned Sequence Timeline (2.8x viewport scrub matching Alejandro HA)
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'aboutTransitionPin',
        trigger: container,
        start: 'top top',
        end: () => '+=' + (window.innerHeight * 2.8),
        scrub: 1.0,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (!header) return;
          if (self.progress > 0.38) {
            header.classList.add('site-header--dark');
            header.classList.remove('site-header--light');
          } else {
            header.classList.add('site-header--light');
            header.classList.remove('site-header--dark');
          }
        }
      }
    });

    // =========================================================
    // SECTION 2 REMAINS STILL & DOODLE BRUSH FLOODS BACKGROUND
    // 1:1 with https://alejandroha.com/ "Small Details Great Impact"
    // Section 2 stays pinned at top: 0, static (does NOT scroll up).
    // Doodle path draws across and expands to flood screen to dark #050609.
    // =========================================================
    tl.to(
      path,
      {
        strokeDashoffset: 0,
        duration: 0.36,
        ease: 'none'
      },
      0.04
    );

    tl.to(
      path,
      {
        strokeWidth: 6500,
        duration: 0.32,
        ease: 'power2.inOut'
      },
      0.12
    );

    if (truthWrap) {
      tl.to(
        truthWrap,
        {
          opacity: 0,
          pointerEvents: 'none',
          duration: 0.08
        },
        0.44
      );
    }

    // Reveal About Me Section once the background has flooded to dark #050609
    if (aboutWrap) {
      tl.to(
        aboutWrap,
        {
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.08
        },
        0.42
      );
    }

    if (aboutPortraitImg) {
      // 1. Appears first in bigger size (scale: 1.45)
      tl.to(
        aboutPortraitImg,
        {
          opacity: 1,
          scale: 1.45,
          y: -70,
          duration: 0.10,
          ease: 'power2.out'
        },
        0.42
      );

      // 2. Just when the rest of content appears at 0.52, translate the image with the SAME bigger size (scale: 1.45) down to y: 0 so its bottom matches the about section!
      tl.to(
        aboutPortraitImg,
        {
          y: 0,
          scale: 1.45,
          duration: 0.24,
          ease: 'power2.out'
        },
        0.52
      );
    }

    // Reveal green circle backdrop, sketch rays, and columns while portrait resizes
    if (aboutPortraitBackdrop) {
      tl.to(
        aboutPortraitBackdrop,
        {
          opacity: 1,
          scale: 1.0,
          duration: 0.18,
          ease: 'back.out(1.5)'
        },
        0.54
      );
    }

    if (aboutTopBar) {
      tl.to(
        aboutTopBar,
        {
          opacity: 1,
          y: 0,
          duration: 0.14,
          ease: 'power2.out'
        },
        0.50
      );
    }

    if (aboutLeftCol) {
      tl.to(
        aboutLeftCol,
        {
          opacity: 1,
          x: 0,
          duration: 0.18,
          ease: 'power3.out'
        },
        0.52
      );
    }

    if (aboutRightCol) {
      tl.to(
        aboutRightCol,
        {
          opacity: 1,
          x: 0,
          duration: 0.18,
          ease: 'power3.out'
        },
        0.54
      );
    }

    if (aboutHandwrittenNote) {
      tl.to(
        aboutHandwrittenNote,
        {
          opacity: 1,
          scale: 1.0,
          y: 0,
          duration: 0.16,
          ease: 'back.out(2)'
        },
        0.56
      );
    }

    // Comfortable resting hold on About Me through 1.00 before unpinning cleanly into Skills!
  };
  initAboutTransition();

  // =========================================================================
  // PAUL KALKBRENNER 1:1 PIXELATED SCROLL TRANSITION
  // Exact reverse-engineered algorithm from https://www.paulkalkbrenner.net/
  // Modular & reversible: window.portfolioPixelTransition.destroy()
  // =========================================================================
  function initPixelatedScrollTransition() {
    const el = document.getElementById('portfolio-pixel-transition');
    if (!el || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    if (window.portfolioPixelTransition && typeof window.portfolioPixelTransition.destroy === 'function') {
      window.portfolioPixelTransition.destroy();
    }

    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    const mediaQueries = {
      mobile: '(max-width: 478px)',
      landscape: '(max-width: 767px)',
      tablet: '(max-width: 991px)'
    };

    function getColumns() {
      const base = parseInt(el.dataset.columns, 10) || 38;
      if (window.matchMedia(mediaQueries.mobile).matches) {
        return parseInt(el.dataset.columnsMobile, 10) || 14;
      }
      if (window.matchMedia(mediaQueries.landscape).matches) {
        return Math.max(18, Math.round(base * 0.60));
      }
      if (window.matchMedia(mediaQueries.tablet).matches) {
        return Math.max(24, Math.round(base * 0.75));
      }
      return base;
    }

    function getRows() {
      return parseInt(el.dataset.rows, 10) || 4;
    }

    let currentTimeline = null;
    let matchMediaInstance = null;

    function buildGrid() {
      const existingPanel = el.querySelector('.pixelated-scroll-transition__panel');
      if (existingPanel) existingPanel.remove();
      if (currentTimeline) {
        if (currentTimeline.scrollTrigger) currentTimeline.scrollTrigger.kill();
        currentTimeline.kill();
        currentTimeline = null;
      }

      const colsCount = getColumns();
      const rowsCount = getRows();

      const panel = document.createElement('div');
      panel.className = 'pixelated-scroll-transition__panel';
      panel.setAttribute('data-pixelated-scroll-panel', '');

      const fragment = document.createDocumentFragment();
      for (let c = 0; c < colsCount; c++) {
        const col = document.createElement('div');
        col.className = 'pixelated-scroll-transition__col';
        col.setAttribute('data-pixelated-scroll-column', '');
        for (let r = 0; r < rowsCount; r++) {
          const pixel = document.createElement('div');
          pixel.className = 'pixelated-scroll-transition__pixel';
          pixel.setAttribute('data-pixelated-scroll-pixel', '');
          col.appendChild(pixel);
        }
        fragment.appendChild(col);
      }
      panel.appendChild(fragment);
      el.appendChild(panel);

      const colElements = panel.querySelectorAll('[data-pixelated-scroll-column]');
      const pixelItems = [];

      for (let r = 0; r < rowsCount; r++) {
        colElements.forEach((colEl, cIdx) => {
          const pixelEl = colEl.children[r];
          if (!pixelEl) return;
          // Paul Kalkbrenner priority formula:
          // lower rows near seam pop first, with random + sine wave dispersion
          const priority = (rowsCount - 1 - r) * 50 + Math.random() * 300 + Math.sin(cIdx * 0.3) * 30;
          pixelItems.push({ element: pixelEl, priority: priority });
        });
      }

      pixelItems.sort((a, b) => a.priority - b.priority);
      const sortedPixels = pixelItems.map((item) => item.element);

      // Initially dark matching skills background and offset slightly upwards
      gsap.set(sortedPixels, {
        autoAlpha: 0,
        backgroundColor: '#050609',
        y: -10
      });

      // Create Scrubbed ScrollTrigger Timeline:
      // Pixels emerge dynamically at the bottom of skills, shift color to #F2F2F2,
      // and translate y: -10px -> 0px, merging directly into the portfolio top edge!
      currentTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: projectsSection,
          start: 'top bottom',
          end: 'top 20%',
          scrub: 0.35,
          invalidateOnRefresh: true
        }
      });

      currentTimeline.to(sortedPixels, {
        autoAlpha: 1,
        backgroundColor: '#FFFFFF',
        y: 0,
        duration: 0.04,
        stagger: {
          amount: 1.2,
          from: 'start'
        },
        ease: 'power1.out'
      });
    }

    buildGrid();

    matchMediaInstance = gsap.matchMedia();
    matchMediaInstance.add(
      {
        isDesktop: '(min-width: 992px)',
        isTablet: '(min-width: 768px) and (max-width: 991px)',
        isLandscape: '(min-width: 479px) and (max-width: 767px)',
        isMobile: '(max-width: 478px)',
        reduceMotion: '(prefers-reduced-motion: reduce)'
      },
      (context) => {
        if (!context.conditions.reduceMotion) {
          buildGrid();
        }
      }
    );

    window.portfolioPixelTransition = {
      destroy: function () {
        if (currentTimeline) {
          if (currentTimeline.scrollTrigger) currentTimeline.scrollTrigger.kill();
          currentTimeline.kill();
          currentTimeline = null;
        }
        if (matchMediaInstance) {
          matchMediaInstance.revert();
          matchMediaInstance = null;
        }
        const panel = el.querySelector('.pixelated-scroll-transition__panel');
        if (panel) panel.remove();
      },
      rebuild: buildGrid
    };
  }

  // 7. SEQUENCE 3 & 4: UNIFIED SKILLS & PROJECTS PINNED EXPERIENCE
  // Skills section remains still at top: 0 (does NOT go up).
  // Portfolio section rises from bottom, overlapping Skills on scroll with pixelated transition seam!
  const initSkillsAndProjects = () => {
    const section = document.getElementById('skills');
    const skillsStage = document.getElementById('skills-stage');
    const projectsSection = document.getElementById('projects');
    const portfolioTitleStage = document.getElementById('portfolio-title-stage');
    const portfolioBigTitle = document.getElementById('portfolio-big-title');
    const cards = document.querySelectorAll('.project-showcase-card');

    if (!section) return;

    // Ensure initial states
    if (skillsStage) gsap.set(skillsStage, { opacity: 1, pointerEvents: 'auto' });
    if (cards.length) gsap.set(cards, { autoAlpha: 0, y: 70, scale: 0.96 });

    // Skills Header and Elements
    const skillHeader = document.querySelector('.skill-header-reveal');
    const skillCards = document.querySelectorAll('#skills-grid .skill-card-redesign');
    const statCards = document.querySelectorAll('#skills-stats-bar .stat-card');
    const statNumbers = document.querySelectorAll('#skills-stats-bar .stat-number');
    const techTiles = document.querySelectorAll('#skills-grid .tech-icon-tile');
    const techLabels = document.querySelectorAll('#skills-grid .tech-tile-label');

    if (skillHeader) gsap.set(skillHeader, { opacity: 0, y: 25, scale: 0.96 });
    if (skillCards.length) gsap.set(skillCards, { opacity: 0, y: 35, scale: 0.94 });
    if (techTiles.length) gsap.set(techTiles, { opacity: 0, scale: 0.75 });
    if (techLabels.length) gsap.set(techLabels, { opacity: 0, y: 5 });
    if (statCards.length) gsap.set(statCards, { opacity: 0, y: 20, scale: 0.95 });

    let skillsRevealed = false;

    const animateSkillCounters = () => {
      statNumbers.forEach((counter) => {
        if (counter.getAttribute('data-is-text') === 'true') return;
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        if (isNaN(target)) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = Math.round(obj.val) + suffix;
          }
        });
      });
    };

    const revealSkills = () => {
      if (skillsRevealed) return;
      skillsRevealed = true;

      const stl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (skillHeader) {
        stl.to(skillHeader, { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power3.out', clearProps: 'transform' }, 0);
      }
      if (skillCards.length) {
        stl.to(skillCards, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.06, ease: 'power3.out', clearProps: 'transform' }, 0.10);
      }
      if (techTiles.length) {
        stl.to(techTiles, { opacity: 1, scale: 1, duration: 0.55, stagger: 0.015, ease: 'back.out(2)', clearProps: 'transform' }, 0.20);
      }
      if (techLabels.length) {
        stl.to(techLabels, { opacity: 1, y: 0, duration: 0.45, stagger: 0.015, ease: 'power2.out', clearProps: 'transform' }, 0.26);
      }
      if (statCards.length) {
        stl.to(statCards, { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.05, ease: 'power3.out', clearProps: 'transform' }, 0.35);
      }

      animateSkillCounters();
    };

    // ScrollTrigger to reveal skills when entering
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => revealSkills(),
      onEnterBack: () => revealSkills()
    });

    const checkSkillsVisibility = () => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
        revealSkills();
      }
    };
    checkSkillsVisibility();
    setTimeout(checkSkillsVisibility, 150);

    // =========================================================================
    // SKILLS PIN & PORTFOLIO CURTAIN SLIDE-OVER (STATIC SECTION EFFECT)
    // 1. Skills section is pinned at top: 0 (does NOT go up when scrolling).
    // 2. Portfolio section (#projects) rises from the bottom and overlaps Skills on scroll.
    // 3. Pixelated boxes animation dissolves along the leading seam as Portfolio covers Skills!
    // =========================================================================
    ScrollTrigger.create({
      id: 'skillsPortfolioPin',
      trigger: section,
      start: 'top top',
      end: () => '+=' + window.innerHeight * 1.0,
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: () => revealSkills(),
      onEnterBack: () => revealSkills()
    });

    // Framer VERTICAL-style title reveal as Portfolio enters from the bottom
    if (portfolioBigTitle && portfolioTitleStage) {
      gsap.fromTo(
        portfolioBigTitle,
        { scale: 0.90, y: 70 },
        {
          scale: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: portfolioTitleStage,
            start: 'top 95%',
            end: 'top 30%',
            scrub: 0.4
          }
        }
      );
    }

    // 3 Editorial Manifest Columns staggered entrance
    const editorialCols = document.querySelectorAll('#portfolio-editorial-grid .editorial-col');
    if (editorialCols.length) {
      gsap.fromTo(
        editorialCols,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#portfolio-editorial-grid',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Initialize Alejandro HA (https://alejandroha.com/) 1:1 Pinned Projects Showcase
    initAlejandroProjectsScroll();

    // Initialize 1:1 Paul Kalkbrenner Pixelated Transition at Skills -> Projects Boundary
    initPixelatedScrollTransition();

    // Initialize 1:1 Curtis Nguyen (https://curtisdesignr.me/) Pixel Box Sweep Reveal
    // initCurtisWorkPixelEffect(); // Disabled: clean static preview images
  };

  // =========================================================================
  // ALEJANDRO HA (https://alejandroha.com/) 1:1 PINNED SERVICES/PROJECTS SCROLL
  // Dynamically stacks project rows, collapses previous visual height & width,
  // and expands next project image while keeping header rows docked at the top.
  // =========================================================================
  function initAlejandroProjectsScroll() {
    const container = document.getElementById('portfolio-projects-showcase');
    if (!container) return;

    const list = container.querySelector('.projects-list');
    const items = gsap.utils.toArray(container.querySelectorAll('.project-item'));
    if (!list || !items.length) return;

    const data = items.map(item => ({
      item: item,
      row: item.querySelector('.project-row'),
      visual: item.querySelector('.project-visual'),
      desc: item.querySelector('.project-description-col'),
      imageWrap: item.querySelector('.project-image-wrap'),
      curtisContainer: item.querySelector('.curtis-work-canvas-container')
    }));

    if (data.some(d => !d.row || !d.visual || !d.imageWrap)) return;

    const allEls = [
      container,
      list,
      ...data.map(d => d.item),
      ...data.map(d => d.visual),
      ...data.map(d => d.imageWrap),
      ...data.map(d => d.desc)
    ];

    const clearAll = () => {
      gsap.set(allEls, {
        clearProps: 'transform,height,width,left,top,zIndex,overflow,clipPath,webkitClipPath,opacity,visibility'
      });
    };

    const mm = gsap.matchMedia();

    mm.add('(min-width: 992px)', () => {
      const calcHeights = () => {
        data.forEach(({ row, visual }, i) => {
          const prevRowH = i > 0 ? data[i - 1].row.offsetHeight : 0;
          const targetH = window.innerHeight - row.offsetHeight - prevRowH;
          gsap.set(visual, { height: Math.max(targetH, 0) });
        });
      };
      calcHeights();

      const ctx = gsap.context(() => {
        gsap.set(list, { y: 0 });
        data.forEach(({ visual, imageWrap }, i) => {
          gsap.set(visual, { overflow: 'hidden' });
          gsap.set(imageWrap, { left: '30%', width: i === 0 ? '70%' : '0%' });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => '+=' + (window.innerHeight * (data.length - 0.2)),
            scrub: 1.0,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: calcHeights
          }
        });

        data.slice(0, -1).forEach((curr, idx) => {
          const nextIdx = idx + 1;
          const next = data[nextIdx];

          // 1. Current visual collapses its height
          tl.to(curr.visual, { height: 0, duration: 1, ease: 'power1.inOut' }, idx);
          // 2. Current image slides / shrinks away
          tl.to(curr.imageWrap, { left: '100%', width: '0%', duration: 1, ease: 'power1.inOut' }, idx);
          // 3. Next image expands into view
          tl.to(next.imageWrap, {
            left: '30%',
            width: '70%',
            duration: 1,
            ease: 'power1.inOut',
            onStart: () => {
              if (next.curtisContainer && next.curtisContainer.__triggerPixelSweep) {
                next.curtisContainer.__triggerPixelSweep();
              }
            }
          }, idx);
          // 4. Translate list up so header rows dock neatly at the top
          tl.to(list, {
            y: () => {
              if (nextIdx < 2) return 0;
              let accumulatedH = 0;
              for (let k = 0; k <= nextIdx - 2; k++) {
                accumulatedH += data[k].row.offsetHeight;
              }
              return -accumulatedH;
            },
            duration: 1,
            ease: 'power1.inOut'
          }, idx);
        });
      }, container);

      return () => {
        ctx.revert();
        clearAll();
      };
    });

    mm.add('(max-width: 991px)', () => {
      clearAll();
    });
  }

    // =========================================================================
  // CURTIS NGUYEN (https://curtisdesignr.me/) 1:1 SELECTED WORK PIXEL EFFECT
  // WebGL Shader: Jittered pixel grid sweep, neon band (#81FF28), progressive image sharpening
  // =========================================================================
  function initCurtisWorkPixelEffect() {
    const containers = document.querySelectorAll('.curtis-work-canvas-container');
    if (!containers.length) return;

    const vsSource = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main() {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform sampler2D uTex;
      uniform float uProgress;
      uniform float uReverse;
      uniform float uImgAspect;
      uniform vec2 uSize;
      uniform vec3 uCover;
      uniform float uZoom;
      uniform vec3 uBandColor;
      varying vec2 vUv;

      #define MAX_BLOCK 26.0
      #define SHARPEN_EASE 0.700
      #define MASK_BLOCK 26.0
      #define SWEEP_JITTER 0.40
      #define LAYER_OFFSET 0.180
      #define BAND_WIDTH 0.250
      #define BAND_CORE 0.050
      #define BAND_ALPHA 1.000
      #define HALF_ALPHA 0.500

      float rnd(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      vec3 toSrgb(vec3 c) {
        return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
      }

      vec3 toLinear(vec3 c) {
        return mix(c / 12.92, pow((max(c, vec3(0.0)) + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), c));
      }

      void main() {
        float p = clamp(uProgress, 0.0, 1.0);
        float planeAspect = uSize.x / max(uSize.y, 1.0);

        vec2 fit = planeAspect > uImgAspect
          ? vec2(1.0, uImgAspect / planeAspect)
          : vec2(planeAspect / uImgAspect, 1.0);
        vec2 uv = (vUv - 0.5) * fit / max(uZoom, 0.0001) + 0.5;

        float blockPx = mix(MAX_BLOCK, 1.0, pow(p, SHARPEN_EASE));
        vec2 grid = max(uSize / blockPx, vec2(1.0));
        vec2 quv = (floor(uv * grid) + 0.5) / grid;
        vec3 base = toSrgb(texture2D(uTex, clamp(quv, 0.0, 1.0)).rgb);

        vec3 cover = toSrgb(uCover);
        float ga = 1.0 - vUv.y;
        vec3 hl = mix(2.0 * base * cover, 1.0 - 2.0 * (1.0 - base) * (1.0 - cover), step(vec3(0.5), cover));
        vec3 col = toLinear(mix(base, hl, ga * 0.3));

        vec2 maskGrid = max(uSize / MASK_BLOCK, vec2(1.0));
        vec2 block = floor(vUv * maskGrid);
        float column = block.x / max(maskGrid.x - 1.0, 1.0);
        float sweep = mix(column, 1.0 - column, uReverse);
        float threshold = mix(sweep, rnd(block), SWEEP_JITTER);

        float front = p * (1.0 + LAYER_OFFSET + 2.0 * BAND_WIDTH) - BAND_WIDTH;

        float openHalf = step(threshold, front);
        float openFull = step(threshold + LAYER_OFFSET, front);
        float imgAlpha = openHalf * mix(HALF_ALPHA, 1.0, openFull);

        float bandT = clamp(abs(front - sweep) / BAND_WIDTH, 0.0, 1.0);
        float bandFade = smoothstep(BAND_CORE, 1.0, bandT);
        float band = step(bandFade, rnd(block + 31.7)) * BAND_ALPHA;

        float outA = max(imgAlpha, band);
        if (outA <= 0.002) discard;

        vec3 outCol = mix(col, uBandColor, clamp(band / max(outA, 0.001), 0.0, 1.0));
        gl_FragColor = vec4(outCol, outA);
      }
    `;

    containers.forEach((container) => {
      const img = container.querySelector('img');
      if (!img) return;

      const canvas = document.createElement('canvas');
      canvas.className = 'curtis-work-canvas';
      container.appendChild(canvas);

      const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
      if (!gl) return;

      function compile(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      }

      const program = gl.createProgram();
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vsSource));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fsSource));
      gl.linkProgram(program);

      const quadBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

      const aPos = gl.getAttribLocation(program, 'aPosition');
      const uTex = gl.getUniformLocation(program, 'uTex');
      const uProg = gl.getUniformLocation(program, 'uProgress');
      const uRev = gl.getUniformLocation(program, 'uReverse');
      const uAspect = gl.getUniformLocation(program, 'uImgAspect');
      const uSize = gl.getUniformLocation(program, 'uSize');
      const uCover = gl.getUniformLocation(program, 'uCover');
      const uZoom = gl.getUniformLocation(program, 'uZoom');
      const uBand = gl.getUniformLocation(program, 'uBandColor');

      const texture = gl.createTexture();
      let textureLoaded = false;

      const state = {
        progress: 0.0,
        reverse: 0.0,
        zoom: 1.0
      };

      function setupTexture() {
        if (textureLoaded || !img.naturalWidth) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        textureLoaded = true;
        img.style.opacity = '0';
        render();
      }

      if (img.complete && img.naturalWidth) {
        setupTexture();
      } else {
        img.addEventListener('load', setupTexture);
      }

      function render() {
        if (!textureLoaded) return;
        const rect = container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(rect.width * dpr));
        const h = Math.max(1, Math.round(rect.height * dpr));

        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
          gl.viewport(0, 0, w, h);
        }

        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(uTex, 0);

        gl.uniform1f(uProg, state.progress);
        gl.uniform1f(uRev, state.reverse);
        gl.uniform1f(uAspect, img.naturalWidth / Math.max(img.naturalHeight, 1));
        gl.uniform2f(uSize, rect.width, rect.height);
        gl.uniform3f(uCover, 0.06, 0.07, 0.09);
        gl.uniform1f(uZoom, state.zoom);
        gl.uniform3f(uBand, 129.0 / 255.0, 255.0 / 255.0, 40.0 / 255.0);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      // ScrollTrigger entrance: Curtis pixel sweep on each project card
            const card = container.closest('.project-item') || container.closest('.project-showcase-card');
      container.__triggerPixelSweep = () => {
        gsap.fromTo(state, { progress: 0.0 }, {
          progress: 1.0,
          duration: 1.15,
          ease: 'power2.out',
          onUpdate: render
        });
      };
      if (card && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 82%',
          onEnter: (self) => {
            state.reverse = self.direction < 0 ? 1.0 : 0.0;
            gsap.fromTo(state, { progress: 0.0 }, {
              progress: 1.0,
              duration: 1.15,
              ease: 'power2.out',
              onUpdate: render
            });
          },
          onEnterBack: () => {
            state.reverse = 1.0;
            gsap.fromTo(state, { progress: 0.0 }, {
              progress: 1.0,
              duration: 1.15,
              ease: 'power2.out',
              onUpdate: render
            });
          }
        });
      }

      // Hover magnification zoom (1.0 -> 1.04) matching Curtis
      const frame = container.closest('.project-preview-frame');
      if (frame) {
        frame.addEventListener('pointerenter', () => {
          gsap.to(state, { zoom: 1.04, duration: 0.6, ease: 'power4.out', onUpdate: render });
        });
        frame.addEventListener('pointerleave', () => {
          gsap.to(state, { zoom: 1.0, duration: 0.6, ease: 'power4.out', onUpdate: render });
        });
      }

      window.addEventListener('resize', () => {
        render();
      });
    });
  }

  initSkillsAndProjects();

  // 8. Section 4: Contact Section & Background Reveal with Doodle Brush Animation
  const initContactSection = () => {
    const contact = document.getElementById('contact');
    const container = document.getElementById('contact-container');
    const cardSurface = document.getElementById('contact-card-surface');
    const shadowShell = document.getElementById('contact-shadow-shell');
    const silhouetteBorder = document.getElementById('contact-silhouette-border');
    const path = document.getElementById('contact-brush-path');
    const darkFill = document.getElementById('contact-dark-fill');
    const contour = document.getElementById('contact-contour');
    const innerBorder = document.getElementById('contact-inner-border');
    const character = document.getElementById('contact-character');
    const headLeft = document.getElementById('contact-headline-left');
    const headRight = document.getElementById('contact-headline-right');
    const nav = document.getElementById('contact-nav');
    const support = document.getElementById('contact-support');
    const buttonsHeader = document.querySelector('#contact-buttons > span');
    const pillBtns = document.querySelectorAll('.contact-pill-btn');
    const marquee = document.getElementById('contact-marquee');
    const backToTop = document.getElementById('back-to-top-btn');
    const mobileContent = document.getElementById('contact-mobile-content');

    if (!contact) return;

    const measuredLength = (path && path.getTotalLength && path.getTotalLength() > 100)
      ? Math.ceil(path.getTotalLength())
      : 25000;
    const totalLength = Math.max(measuredLength, 25000);

    // 1. Initial State: Card surface starts white silhouette with light border, brush ready
    if (path) {
      gsap.set(path, {
        strokeDasharray: totalLength + 500,
        strokeDashoffset: totalLength + 500,
        strokeWidth: 28,
        opacity: 1
      });
    }

    if (darkFill) gsap.set(darkFill, { opacity: 0 });
    if (contour) gsap.set(contour, { opacity: 0 });
    if (innerBorder) gsap.set(innerBorder, { opacity: 0 });
    if (silhouetteBorder) gsap.set(silhouetteBorder, { opacity: 1 });
    if (cardSurface) gsap.set(cardSurface, { backgroundColor: '#ffffff' });

    // 2. Initial State: All content elements hidden with custom starting transforms
    if (character) gsap.set(character, { autoAlpha: 0, y: 110, scale: 0.84, filter: 'blur(14px)' });
    if (headLeft) {
      gsap.set(headLeft, { autoAlpha: 0, y: -35, x: -30, filter: 'blur(14px)' });
      const badge = headLeft.querySelector('span[style*="Caveat"]');
      if (badge) gsap.set(badge, { autoAlpha: 0, scale: 0.25, rotation: -28 });
    }
    if (headRight) gsap.set(headRight, { autoAlpha: 0, y: -35, x: 30, filter: 'blur(14px)' });
    if (nav) {
      const navLabel = nav.querySelector('span');
      if (navLabel) gsap.set(navLabel, { autoAlpha: 0, letterSpacing: '0.45em', x: -20 });
      gsap.set(nav.querySelectorAll('a'), { autoAlpha: 0, x: -45, filter: 'blur(8px)' });
    }
    if (support) gsap.set(support, { autoAlpha: 0, y: 35, filter: 'blur(10px)' });
    if (buttonsHeader) gsap.set(buttonsHeader, { autoAlpha: 0, letterSpacing: '0.45em', x: 20 });
    if (pillBtns && pillBtns.length > 0) {
      gsap.set(pillBtns, { autoAlpha: 0, x: 70, rotateY: 22, rotateZ: 2, scale: 0.88 });
    }
    if (marquee) gsap.set(marquee, { autoAlpha: 0, scaleX: 0, transformOrigin: 'center center' });
    if (backToTop) gsap.set(backToTop, { autoAlpha: 0, scale: 0.2, y: 35 });
    if (mobileContent) gsap.set(mobileContent, { autoAlpha: 0, y: 35 });

    // 3. Master Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container || contact,
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });
    window._contactTL = tl;

    // =========================================================
    // STEP 1: DOODLE BRUSH DRAWS AND FLOODS THE CARD SILHOUETTE
    // (Card is displayed first, exactly matching Section 2 behavior)
    // =========================================================
    if (path) {
      // Brush stroke sweeps dynamically across the sculpted card shape
      tl.to(
        path,
        {
          strokeDashoffset: 0,
          duration: 0.65,
          ease: 'power2.inOut'
        },
        0.0
      );

      // Brush stroke swells massively to flood every corner with dark #16181b
      tl.to(
        path,
        {
          strokeWidth: 6800,
          duration: 0.58,
          ease: 'power3.inOut'
        },
        0.24
      );
    }

    // As the brush stroke expands, darkFill locks in solid #16181b
    if (darkFill) {
      tl.to(
        darkFill,
        {
          opacity: 1,
          duration: 0.24,
          ease: 'power2.out',
          onComplete: () => {
            if (cardSurface) gsap.set(cardSurface, { backgroundColor: '#16181b' });
          }
        },
        0.65
      );
    }

    if (silhouetteBorder) {
      tl.to(silhouetteBorder, { opacity: 0, duration: 0.35 }, 0.60);
    }

    // Inner border, contour lines, and card shadow bloom
    if (shadowShell) {
      tl.to(
        shadowShell,
        {
          filter: 'drop-shadow(0 14px 34px rgba(0, 0, 0, 0.22))',
          duration: 0.45,
          ease: 'power2.out'
        },
        0.68
      );
    }

    if (contour) {
      tl.to(contour, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.72);
    }
    if (innerBorder) {
      tl.to(innerBorder, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.72);
    }

    // =========================================================
    // STEP 2: DISPLAY CONTENT WITH UNIQUE, MODERN ANIMATIONS
    // (Begins at cardReady = 0.82s once the card is fully displayed)
    // =========================================================
    const cardReady = 0.82;

    // 1. Central Character: 3D Grounding & Rise into position
    if (character) {
      tl.to(
        character,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          clearProps: 'filter',
          duration: 0.95,
          ease: 'power3.out'
        },
        cardReady
      );
    }

    // 2. Headlines: Kinetic Split Typography & Blur Focus
    if (headLeft) {
      const badge = headLeft.querySelector('span[style*="Caveat"]');
      if (badge) {
        tl.to(
          badge,
          {
            autoAlpha: 1,
            scale: 1,
            rotation: -9,
            duration: 0.65,
            ease: 'back.out(2.2)'
          },
          cardReady + 0.08
        );
      }

      tl.to(
        headLeft,
        {
          autoAlpha: 1,
          y: 0,
          x: 0,
          filter: 'blur(0px)',
          clearProps: 'filter',
          duration: 0.85,
          ease: 'power4.out'
        },
        cardReady + 0.12
      );
    }

    if (headRight) {
      tl.to(
        headRight,
        {
          autoAlpha: 1,
          y: 0,
          x: 0,
          filter: 'blur(0px)',
          clearProps: 'filter',
          duration: 0.85,
          ease: 'power4.out'
        },
        cardReady + 0.16
      );
    }

    // 3. Navigation: PAGES tag expansion + staggered magnetic reveal
    if (nav) {
      const navLabel = nav.querySelector('span');
      if (navLabel) {
        tl.to(
          navLabel,
          {
            autoAlpha: 1,
            letterSpacing: '0.25em',
            x: 0,
            duration: 0.55,
            ease: 'power2.out'
          },
          cardReady + 0.22
        );
      }

      tl.to(
        nav.querySelectorAll('a'),
        {
          autoAlpha: 1,
          x: 0,
          filter: 'blur(0px)',
          clearProps: 'filter',
          stagger: 0.07,
          duration: 0.65,
          ease: 'power3.out'
        },
        cardReady + 0.28
      );
    }

    // 4. Supporting Text: Fluid vertical slide-up
    if (support) {
      tl.to(
        support,
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          clearProps: 'filter',
          duration: 0.75,
          ease: 'power2.out'
        },
        cardReady + 0.35
      );
    }

    // 5. Contact Pill Buttons: 3D Perspective Stagger & Spring Snap
    if (buttonsHeader) {
      tl.to(
        buttonsHeader,
        {
          autoAlpha: 1,
          letterSpacing: '0.25em',
          x: 0,
          duration: 0.55,
          ease: 'power2.out'
        },
        cardReady + 0.24
      );
    }

    if (pillBtns && pillBtns.length > 0) {
      tl.to(
        pillBtns,
        {
          autoAlpha: 1,
          x: 0,
          rotateY: 0,
          rotateZ: 0,
          scale: 1,
          clearProps: 'transform',
          stagger: 0.07,
          duration: 0.60,
          ease: 'back.out(1.8)'
        },
        cardReady + 0.22
      );
    }

    // 6. Marquee Ticker: Aperture Horizon Unroll
    if (marquee) {
      tl.to(
        marquee,
        {
          autoAlpha: 1,
          scaleX: 1,
          duration: 0.72,
          ease: 'power3.inOut'
        },
        cardReady + 0.42
      );
    }

    // 7. Back to Top Button: Elastic Spring Pop into Notch
    if (backToTop) {
      tl.to(
        backToTop,
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.65,
          ease: 'back.out(2.4)'
        },
        cardReady + 0.52
      );
    }

    // 8. Mobile Content Layer
    if (mobileContent) {
      tl.to(
        mobileContent,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: 'power2.out'
        },
        cardReady + 0.20
      );
    }

    // 9. Post-entrance: Ambient Floating Levitation on Character
    tl.call(() => {
      if (character) {
        gsap.to(character, {
          y: -9,
          duration: 2.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
      }
    }, null, cardReady + 1.0);

    // Floating Words Mouse Parallax with Silky GSAP Inertia
    const floatingWordsContainer = document.getElementById('floating-words-container');
    if (floatingWordsContainer) {
      const words = floatingWordsContainer.querySelectorAll('.contact-word');
      let rect = floatingWordsContainer.getBoundingClientRect();
      window.addEventListener(
        'resize',
        () => {
          rect = floatingWordsContainer.getBoundingClientRect();
        },
        { passive: true }
      );

      window.addEventListener(
        'mousemove',
        (e) => {
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          words.forEach((w, idx) => {
            const factor = ((idx % 3) + 1) * 22;
            gsap.to(w, {
              x: relX * factor,
              y: relY * factor,
              duration: 0.9,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          });
        },
        { passive: true }
      );
    }
  };
  initContactSection();

  // 9. Smooth Anchor Link Scrolling
  const handleAnchorClick = (e) => {
    const target = e.target.closest('a');
    if (!target) return;
    const href = target.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();

      const scrollOptions = {
        duration: 1.4,
        easing: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2)
      };

      if (href === '#hero' || href === '#') {
        if (lenis) lenis.scrollTo(0, scrollOptions);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (href === '#about') {
        const aboutPinTrigger = ScrollTrigger.getById('aboutTransitionPin');
        if (aboutPinTrigger && lenis) {
          const targetPos = aboutPinTrigger.start + (aboutPinTrigger.end - aboutPinTrigger.start) * 0.75;
          lenis.scrollTo(targetPos, scrollOptions);
        } else {
          const el = document.querySelector('#about-wrap') || document.querySelector('#about');
          if (el) {
            if (lenis) lenis.scrollTo(el, { offset: 0, ...scrollOptions });
            else el.scrollIntoView({ behavior: 'smooth' });
          }
        }
        return;
      }

      if (href === '#skills') {
        const el = document.querySelector('#skills');
        if (el) {
          if (lenis) lenis.scrollTo(el, { offset: 0, ...scrollOptions });
          else el.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      if (href === '#projects' || href === '#portfolio') {
        const el = document.querySelector('#projects');
        if (el) {
          if (lenis) lenis.scrollTo(el, { offset: 0, ...scrollOptions });
          else el.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      if (href === '#contact') {
        const el = document.querySelector('#contact');
        if (el) {
          if (lenis) lenis.scrollTo(el, { offset: -20, ...scrollOptions });
          else el.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      const el = document.querySelector(href);
      if (el) {
        if (lenis) lenis.scrollTo(el, { offset: -20, ...scrollOptions });
        else el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  document.addEventListener('click', handleAnchorClick);

  // 10. Back to Top Button Listener
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
})();
