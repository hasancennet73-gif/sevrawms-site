(function () {
  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function upsertApplication(app) {
    const apps = readJson('sevra_applications', []);
    const idx = apps.findIndex(x => x.username === app.username || (app.email && x.email === app.email));
    if (idx >= 0) apps[idx] = app;
    else apps.push(app);
    writeJson('sevra_applications', apps);
  }

  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;

  registerForm.addEventListener('submit', function () {
    const app = {
      id: 'APP-' + Date.now(),
      companyName: document.getElementById('companyName')?.value?.trim() || '',
      contactName: document.getElementById('contactName')?.value?.trim() || '',
      phone: document.getElementById('phone')?.value?.trim() || '',
      role: document.getElementById('role')?.value?.trim() || '',
      username: document.getElementById('username')?.value?.trim() || '',
      email: document.getElementById('email')?.value?.trim().toLowerCase() || '',
      password: document.getElementById('password')?.value?.trim() || '',
      status: 'Beklemede'
    };
    if (app.companyName && app.contactName && app.phone && app.role && (app.username || app.email) && app.password) {
      upsertApplication(app);
    }
  });
})();
