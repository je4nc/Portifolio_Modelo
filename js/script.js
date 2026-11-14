// SRFilmes | Menu, filtros, animações, vídeos e rodapé

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const aberto = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(aberto));
    menuToggle.textContent = aberto ? '×' : '☰';
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  }));
}

// Vídeos locais: informe o caminho do MP4 em data-video-src no index.html.
// Se não houver caminho, a imagem de prévia permanece visível.
// Os players usam controles nativos, reproduzem inline no celular e não iniciam automaticamente.
const players = document.querySelectorAll('video[data-video-src]');
players.forEach(video => {
  const caminho = video.dataset.videoSrc.trim();
  if (!caminho) return;

  const area = video.closest('.project-media');
  video.addEventListener('loadedmetadata', () => {
    area.classList.add('has-video');
  });
  video.addEventListener('error', () => {
    area.classList.remove('has-video');
    console.warn('SRFilmes: vídeo não encontrado ou inválido:', caminho);
  });
  video.src = caminho;
  video.load();
});

// Filtros: pausa o vídeo quando o card deixa de estar visível.
document.querySelectorAll('.filter').forEach(botao => {
  botao.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    botao.classList.add('active');
    botao.setAttribute('aria-pressed', 'true');

    const filtro = botao.dataset.filter;
    document.querySelectorAll('.project').forEach(card => {
      const mostrar = filtro === 'all' || card.dataset.category === filtro;
      card.hidden = !mostrar;
      if (!mostrar) card.querySelectorAll('video').forEach(video => video.pause());
    });
  });
});

// Não permite que dois vídeos toquem ao mesmo tempo.
players.forEach(atual => {
  atual.addEventListener('play', () => {
    players.forEach(outro => { if (outro !== atual) outro.pause(); });
  });
});

// Animações suaves de entrada.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observer.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(elemento => observer.observe(elemento));
} else {
  document.querySelectorAll('.reveal').forEach(elemento => elemento.classList.add('visible'));
}

const ano = document.getElementById('year');
if (ano) ano.textContent = new Date().getFullYear();
