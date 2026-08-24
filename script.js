/*
  script.js
  Scripts principais:
    - Menu responsivo
    - Modo escuro/claro (persistente via localStorage)
    - Validação do formulário de contato
    - Modal de sucesso
    - Scroll suave com correção de offset de header

  Comentários adicionados para facilitar entendimento.
*/

// Helpers
const select = (s, root = document) => root.querySelector(s);
const selectAll = (s, root = document) => Array.from(root.querySelectorAll(s));

// Aplica o tema salvo no localStorage (padrão: claro)
function applySavedTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.body.classList.add('dark');
}

// Alterna tema e salva preferência
function setupThemeToggle() {
  const toggles = selectAll('.theme-toggle');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      // Atualiza ícone/label simples
      toggles.forEach(t => t.textContent = isDark ? '☀️' : '🌙');
    });
  });
}

// Menu responsivo: abre e fecha as instâncias do menu nas páginas
function setupNavToggles() {
  const toggleButtons = selectAll('.nav-toggle');
  toggleButtons.forEach(btn => {
    const nav = btn.nextElementSibling; // estrutura criada com botão seguido de nav
    btn.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  });

  // Fecha o menu ao clicar em um link (experiência mobile)
  const navLinks = selectAll('.main-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      selectAll('.main-nav').forEach(n => n.classList.remove('open'));
    });
  });
}

// Scroll suave com offset para header fixo (quando necessário)
function setupSmoothScroll() {
  const headerHeight = () => select('.site-header')?.offsetHeight || 0;
  selectAll('a[href^="/"]').forEach(a => {
    // Links entre páginas não precisam de ajuste; apenas para âncoras
  });

  // Para navegacao interna com hash
  if (window.location.hash) {
    setTimeout(() => {
      const el = document.querySelector(window.location.hash);
      if (el) window.scrollTo({top: el.offsetTop - headerHeight(), behavior: 'smooth'});
    }, 100);
  }
}

// Validação do formulário de contato
function setupContactForm() {
  const form = select('#contact-form');
  if (!form) return;

  const nameField = select('#name');
  const emailField = select('#email');
  const messageField = select('#message');

  const errorName = select('#error-name');
  const errorEmail = select('#error-email');
  const errorMessage = select('#error-message');

  const modal = select('#modal');
  const modalClose = select('#modal-close');

  // Regex simples para validação de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  // Mostra erro de campo com mensagem
  function showError(el, message) {
    el.textContent = message;
  }

  function clearErrors() {
    showError(errorName, '');
    showError(errorEmail, '');
    showError(errorMessage, '');
  }

  // Abre modal de sucesso e limpa formulário
  function showSuccessModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    // Fecha modal ao clicar no botão
    modalClose?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
  }

  modalClose?.addEventListener('click', () => {
    closeModal();
  });

  // Permite fechar modal com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let valid = true;

    if (!nameField.value.trim()) {
      showError(errorName, 'Por favor, informe seu nome.');
      valid = false;
    }

    if (!emailField.value.trim()) {
      showError(errorEmail, 'Por favor, informe seu e-mail.');
      valid = false;
    } else if (!emailRegex.test(emailField.value.trim())) {
      showError(errorEmail, 'E-mail inválido. Verifique e tente novamente.');
      valid = false;
    }

    if (!messageField.value.trim()) {
      showError(errorMessage, 'Por favor, escreva uma mensagem.');
      valid = false;
    }

    if (!valid) return;

    // Simula envio bem-sucedido (aqui seria feito o fetch se houvesse backend)
    showSuccessModal();

    // Limpa o formulário
    form.reset();

    // Força foco para o botão fechar (melhora acessibilidade)
    setTimeout(() => {
      modalClose?.focus();
    }, 80);
  });
}

// Animar contadores das estatísticas (quando presentes)
function setupStatsCounters() {
  const counters = selectAll('.stat-value[data-target]');
  if (!counters.length) return;

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 20));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = String(target);
        clearInterval(interval);
      } else {
        counter.textContent = String(current);
      }
    }, 40);
  });
}

// Inicialização quando DOM pronto
document.addEventListener('DOMContentLoaded', () => {
  applySavedTheme();
  setupThemeToggle();
  setupNavToggles();
  setupSmoothScroll();
  setupContactForm();
  setupStatsCounters(); // animação das estatísticas (se existir)
});
