/* ==========================================================================
   INTERATIVIDADE E COMPORTAMENTOS DO PORTFÓLIO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. CONTROLE DE SCROLL DO HEADER
     ========================================================================== */
  const header = document.getElementById('main-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     2. MENU MOBILE HAMBÚRGUER
     ========================================================================== */
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu-list');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    // Transformação visual simples no botão hambúrguer
    const spans = menuToggle.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
    
    // Animação das linhas do hambúrguer
    if (navMenu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Fechar menu mobile ao clicar em um link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  });

  /* ==========================================================================
     3. CARROSSEL DE IMAGENS DE CADA CASE DE SUCESSO
     ========================================================================== */
  const caseBlocks = document.querySelectorAll('.case-block');

  caseBlocks.forEach(caseBlock => {
    const tabs = caseBlock.querySelectorAll('.case-tab-btn');
    const slides = caseBlock.querySelectorAll('.case-img-slide');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const slideIndex = parseInt(tab.getAttribute('data-slide'));

        // Desativar todas as abas e ativar apenas a atual
        tabs.forEach(btn => btn.classList.remove('active'));
        tab.classList.add('active');

        // Ocultar todos os slides e mostrar apenas o selecionado
        slides.forEach(slide => slide.classList.remove('active'));
        slides[slideIndex].classList.add('active');
      });
    });
  });

  /* ==========================================================================
     4. LIGHTBOX / VISUALIZADOR DE IMAGENS EM TELA CHEIA
     ========================================================================== */
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-display-img');
  const lightboxCaption = document.getElementById('lightbox-img-caption');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');

  // Mapeamento dinâmico de todas as imagens abríveis do portfólio (Pranchetas 2 a 15)
  // Coletamos na ordem correta do site:
  // Case 1 (Prancheta 2, 3, 4) -> Case 2 (Prancheta 5, 6, 7) -> Case 3 (Prancheta 8, 9, 10) -> Projetos Conceituais (Prancheta 11, 12, 13, 14, 15)
  let galleryItems = [];
  let currentActiveIndex = 0;

  // Função para rebuildar a lista de imagens para garantir consistência
  function updateGalleryItems() {
    galleryItems = [];

    // 1. Imagens dos Cases (Colégio Integração, Dra. Karoline, Designer Fácil)
    const cases = ['case-integracao', 'case-karoline', 'case-designerfacil'];
    cases.forEach(caseId => {
      const block = document.getElementById(caseId);
      if (block) {
        const slides = block.querySelectorAll('.case-img-slide img');
        slides.forEach(img => {
          const wrapper = img.parentElement;
          galleryItems.push({
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            caption: wrapper.getAttribute('data-caption') || img.getAttribute('alt'),
            element: img
          });
        });
      }
    });

    // 2. Imagens dos Projetos Conceituais (Cards de 11 a 15)
    const conceptCards = document.querySelectorAll('.concept-card');
    conceptCards.forEach(card => {
      const img = card.querySelector('img');
      galleryItems.push({
        src: card.getAttribute('data-image'),
        alt: img.getAttribute('alt'),
        caption: card.getAttribute('data-caption'),
        element: card
      });
    });
  }

  // Inicializa a lista de itens da galeria
  updateGalleryItems();

  // Abrir o Lightbox
  function openLightbox(index) {
    if (index < 0 || index >= galleryItems.length) return;
    
    currentActiveIndex = index;
    const item = galleryItems[index];

    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxCaption.textContent = item.caption;
    
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Impede o scroll de fundo
  }

  // Fechar o Lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restaura o scroll
    
    // Limpa a imagem para evitar flickers ao reabrir
    setTimeout(() => {
      lightboxImg.src = '';
    }, 400);
  }

  // Navegar para Imagem Anterior
  function prevImage() {
    let prevIndex = currentActiveIndex - 1;
    if (prevIndex < 0) {
      prevIndex = galleryItems.length - 1; // Loop para o final
    }
    openLightbox(prevIndex);
  }

  // Navegar para Próxima Imagem
  function nextImage() {
    let nextIndex = currentActiveIndex + 1;
    if (nextIndex >= galleryItems.length) {
      nextIndex = 0; // Loop para o início
    }
    openLightbox(nextIndex);
  }

  // Adicionar Event Listeners para acionar o Lightbox nos Cases de Sucesso
  const casesWrapper = document.getElementById('cases');
  if (casesWrapper) {
    casesWrapper.addEventListener('click', (e) => {
      if (e.target.classList.contains('lightbox-trigger')) {
        const src = e.target.getAttribute('src');
        const index = galleryItems.findIndex(item => item.src === src);
        if (index !== -1) {
          openLightbox(index);
        }
      }
    });
  }

  // Adicionar Event Listeners para acionar o Lightbox nos Projetos Conceituais
  const conceptGrid = document.querySelector('.concepts-grid');
  if (conceptGrid) {
    conceptGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.concept-card');
      if (card) {
        const src = card.getAttribute('data-image');
        const index = galleryItems.findIndex(item => item.src === src);
        if (index !== -1) {
          openLightbox(index);
        }
      }
    });
  }

  // Controles do Lightbox
  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', prevImage);
  btnNext.addEventListener('click', nextImage);

  // Fechar clicando no fundo escuro
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Atalhos de Teclado
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    }
  });

  /* ==========================================================================
     5. ANIMACAO SCROLL REVEAL (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Uma vez que o elemento revelou, não precisa mais observá-lo
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12, // Porcentagem do elemento visível para disparar
    rootMargin: '0px 0px -50px 0px' // Margem na rolagem inferior
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* ==========================================================================
     6. DIRECIONAMENTO INTUITIVO DO BOTÃO EXPLORAR
     ========================================================================== */
  // Garante um comportamento de clique suave para âncoras locais
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 70; // 70px é a altura do header fixo
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

});
