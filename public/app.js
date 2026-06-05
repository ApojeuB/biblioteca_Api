const state = {
  books: [],
  loans: [],
  user: null,
  token: null,
  authMode: 'login'
};

const $ = (selector) => document.querySelector(selector);

const elements = {
  sessionName: $('#sessionName'),
  openAuthButton: $('#openAuthButton'),
  logoutButton: $('#logoutButton'),
  authDialog: $('#authDialog'),
  authForm: $('#authForm'),
  authTitle: $('#authTitle'),
  authMessage: $('#authMessage'),
  closeAuthButton: $('#closeAuthButton'),
  searchInput: $('#searchInput'),
  languageFilter: $('#languageFilter'),
  refreshButton: $('#refreshButton'),
  catalogGrid: $('#catalogGrid'),
  loanList: $('#loanList'),
  bookForm: $('#bookForm'),
  deliveryForm: $('#deliveryForm'),
  deliveryBookSelect: $('#deliveryBookSelect'),
  suggestionForm: $('#suggestionForm'),
  suggestionName: $('#suggestionName'),
  suggestionEmail: $('#suggestionEmail'),
  bookCount: $('#bookCount'),
  availableCount: $('#availableCount'),
  activeLoanCount: $('#activeLoanCount'),
  toast: $('#toast')
};

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 3200);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(path, {
    headers,
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Nao foi possivel concluir a acao.');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function loadSession() {
  const session = JSON.parse(localStorage.getItem('biblioteca:session') || 'null');
  state.user = session?.user || null;
  state.token = session?.token || null;
  renderSession();
}

function saveSession(session) {
  localStorage.setItem('biblioteca:session', JSON.stringify(session));
  state.user = session.user;
  state.token = session.token;
  renderSession();
}

function renderSession() {
  if (state.user) {
    elements.sessionName.textContent = state.user.name || state.user.email;
    elements.openAuthButton.classList.add('hidden');
    elements.logoutButton.classList.remove('hidden');
    elements.suggestionName.value = state.user.name || '';
    elements.suggestionEmail.value = state.user.email || '';
    return;
  }

  elements.sessionName.textContent = 'Visitante';
  elements.openAuthButton.classList.remove('hidden');
  elements.logoutButton.classList.add('hidden');
}

function requireUser() {
  if (state.user) {
    return true;
  }

  elements.authDialog.showModal();
  showToast('Entre ou registre-se para continuar.');
  return false;
}

function setAuthMode(mode) {
  state.authMode = mode;
  elements.authTitle.textContent = mode === 'login' ? 'Entrar' : 'Registrar';
  document.querySelectorAll('.tab-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.authMode === mode);
  });
  document.querySelectorAll('.register-only').forEach((field) => {
    field.classList.toggle('hidden', mode !== 'register');
  });
  elements.authMessage.textContent = '';
}

function renderLanguages() {
  const current = elements.languageFilter.value;
  const languages = [...new Set(state.books.map((book) => book.language).filter(Boolean))].sort();

  elements.languageFilter.innerHTML = '<option value="">Todos os idiomas</option>';
  languages.forEach((language) => {
    const option = document.createElement('option');
    option.value = language;
    option.textContent = language;
    elements.languageFilter.appendChild(option);
  });

  elements.languageFilter.value = current;
}

function filteredBooks() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const language = elements.languageFilter.value;

  return state.books.filter((book) => {
    const matchesQuery = [book.title, book.author, book.country]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
    const matchesLanguage = !language || book.language === language;

    return matchesQuery && matchesLanguage;
  });
}

function renderStats() {
  const available = state.books.reduce((total, book) => total + Number(book.availableQuantity || 0), 0);
  const activeLoans = state.loans.filter((loan) => loan.status === 'active').length;

  elements.bookCount.textContent = state.books.length;
  elements.availableCount.textContent = available;
  elements.activeLoanCount.textContent = activeLoans;
}

function renderCatalog() {
  const books = filteredBooks();
  elements.catalogGrid.innerHTML = '';

  if (!books.length) {
    elements.catalogGrid.innerHTML = '<p class="meta-line">Nenhum livro encontrado.</p>';
    return;
  }

  books.forEach((book) => {
    const card = document.createElement('article');
    card.className = 'book-card';
    card.innerHTML = `
      <span class="tag">${escapeHtml(book.language || 'Idioma nao informado')}</span>
      <h3>${escapeHtml(book.title)}</h3>
      <p class="meta-line">${escapeHtml(book.author)}${book.country ? `, ${escapeHtml(book.country)}` : ''}</p>
      <p class="meta-line">${escapeHtml(book.year || 'Ano nao informado')}${book.pages ? ` - ${escapeHtml(book.pages)} paginas` : ''}</p>
      <div class="availability">
        <span>${escapeHtml(book.availableQuantity || 0)} de ${escapeHtml(book.quantity || 0)} disponiveis</span>
        <button class="primary-button" type="button" ${book.availableQuantity <= 0 ? 'disabled' : ''} data-rent="${book._id}">Alugar</button>
      </div>
    `;
    elements.catalogGrid.appendChild(card);
  });
}

function renderDeliveryOptions() {
  elements.deliveryBookSelect.innerHTML = '<option value="">Selecione um livro</option>';

  state.books.forEach((book) => {
    const option = document.createElement('option');
    option.value = book._id;
    option.textContent = book.title;
    elements.deliveryBookSelect.appendChild(option);
  });
}

function renderLoans() {
  const activeLoans = state.loans.filter((loan) => loan.status === 'active');
  elements.loanList.innerHTML = '';

  if (!activeLoans.length) {
    elements.loanList.innerHTML = '<p class="meta-line">Nenhum emprestimo ativo.</p>';
    return;
  }

  activeLoans.forEach((loan) => {
    const item = document.createElement('div');
    item.className = 'loan-item';
    item.innerHTML = `
      <strong>${escapeHtml(loan.book?.title || 'Livro removido')}</strong>
      <span class="meta-line">Leitor: ${escapeHtml(loan.borrowerName)}</span>
      <span class="meta-line">Devolucao prevista: ${escapeHtml(formatDate(loan.dueDate))}</span>
      <button class="secondary-button" type="button" data-return="${loan._id}">Marcar devolucao</button>
    `;
    elements.loanList.appendChild(item);
  });
}

function formatDate(value) {
  if (!value) {
    return 'Sem data';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
}

async function loadData() {
  const [books, loans] = await Promise.all([
    request('/books'),
    state.token ? request('/loans') : Promise.resolve([])
  ]);

  state.books = books;
  state.loans = loans;
  renderLanguages();
  renderStats();
  renderCatalog();
  renderLoans();
  renderDeliveryOptions();
}

async function rentBook(bookId) {
  if (!requireUser()) {
    return;
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  await request('/loans', {
    method: 'POST',
    body: JSON.stringify({
      book: bookId,
      dueDate: dueDate.toISOString()
    })
  });

  showToast('Livro alugado por 14 dias.');
  await loadData();
}

async function returnLoan(loanId) {
  await request(`/loans/${loanId}/return`, {
    method: 'PATCH'
  });

  showToast('Devolucao registrada.');
  await loadData();
}

function bindEvents() {
  elements.openAuthButton.addEventListener('click', () => elements.authDialog.showModal());
  elements.closeAuthButton.addEventListener('click', () => elements.authDialog.close());
  elements.logoutButton.addEventListener('click', async () => {
    localStorage.removeItem('biblioteca:session');
    state.user = null;
    state.token = null;
    renderSession();
    showToast('Sessao encerrada.');
    await loadData();
  });

  document.querySelectorAll('.tab-button').forEach((button) => {
    button.addEventListener('click', () => setAuthMode(button.dataset.authMode));
  });

  elements.authForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(elements.authForm);
    const email = String(form.get('email')).trim().toLowerCase();
    const password = String(form.get('password'));

    try {
      const path = state.authMode === 'register' ? '/auth/register' : '/auth/login';
      const payload = {
        email,
        password
      };

      if (state.authMode === 'register') {
        payload.name = String(form.get('name') || email.split('@')[0]).trim();
      }

      const session = await request(path, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      saveSession(session);
      elements.authDialog.close();
      elements.authForm.reset();
      showToast(state.authMode === 'register' ? 'Conta criada.' : 'Bem-vindo de volta.');
      await loadData();
    } catch (error) {
      elements.authMessage.textContent = error.message;
    }
  });

  elements.searchInput.addEventListener('input', renderCatalog);
  elements.languageFilter.addEventListener('change', renderCatalog);
  elements.refreshButton.addEventListener('click', loadData);

  elements.catalogGrid.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-rent]');
    if (button) {
      await rentBook(button.dataset.rent);
    }
  });

  elements.loanList.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-return]');
    if (button) {
      await returnLoan(button.dataset.return);
    }
  });

  elements.bookForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!requireUser()) {
      return;
    }

    const form = new FormData(elements.bookForm);
    const payload = Object.fromEntries(form.entries());
    payload.quantity = Number(payload.quantity || 1);
    if (payload.year) {
      payload.year = Number(payload.year);
    }

    await request('/books', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    elements.bookForm.reset();
    showToast('Livro adicionado ao acervo.');
    await loadData();
  });

  elements.deliveryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!requireUser()) {
      return;
    }

    const requests = JSON.parse(localStorage.getItem('biblioteca:delivery') || '[]');
    const form = new FormData(elements.deliveryForm);
    const book = state.books.find((item) => item._id === form.get('book'));

    requests.push({
      bookId: form.get('book'),
      title: book?.title,
      address: form.get('address'),
      requestedBy: state.user.email,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('biblioteca:delivery', JSON.stringify(requests));
    elements.deliveryForm.reset();
    showToast('Solicitacao de envio registrada.');
  });

  elements.suggestionForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!requireUser()) {
      return;
    }

    const form = new FormData(elements.suggestionForm);

    const suggestion = await request('/suggestions', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });

    elements.suggestionForm.reset();
    renderSession();
    const status = suggestion.emailStatus === 'sent' ? ' e enviada por email.' : '.';
    showToast(`Sugestao salva${status}`);
  });
}

async function start() {
  bindEvents();
  setAuthMode('login');
  loadSession();

  try {
    await loadData();
  } catch (error) {
    showToast(error.message);
  }
}

start();
