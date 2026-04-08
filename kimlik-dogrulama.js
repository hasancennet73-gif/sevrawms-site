(function () {
  const AUTH_KEY = "sevra_live_auth";
  const MEMBERS_KEY = "sevra_live_members";
  const APPLICATIONS_KEY = "sevra_live_applications";
  const PRODUCTS_KEY = "sevra_live_products";
  const MESSAGES_KEY = "sevra_live_messages";
  const VISITS_KEY = "sevra_live_visits";

  function getAuth() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); }
    catch (e) { return null; }
  }

  function setAuth(data) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  }

  function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
  }

  function getMembers() {
    try { return JSON.parse(localStorage.getItem(MEMBERS_KEY) || "[]"); }
    catch (e) { return []; }
  }

  function saveMembers(rows) { localStorage.setItem(MEMBERS_KEY, JSON.stringify(rows)); }

  function registerMember(payload) {
    const members = getMembers();
    const username = String(payload.username || "").trim();
    const password = String(payload.password || "").trim();
    if (!username) throw new Error("Kullanıcı adı zorunludur.");
    if (!password) throw new Error("Şifre zorunludur.");
    if (members.some(x => x.username === username)) throw new Error("Bu kullanıcı adı zaten kayıtlı.");

    const row = {
      id: Date.now(),
      username,
      password,
      role: String(payload.role || "member"),
      fullName: String(payload.fullName || "").trim() || username,
      company: String(payload.company || "").trim(),
      status: "Aktif",
      createdAt: new Date().toISOString()
    };

    members.push(row);
    saveMembers(members);
    return row;
  }

  function findMember(username, password) {
    const members = getMembers();
    return members.find(
      x =>
        x.username === String(username || "").trim() &&
        x.password === String(password || "").trim() &&
        x.status !== "Pasif"
    ) || null;
  }

  function removeMember(id) {
    const members = getMembers().filter(x => String(x.id) !== String(id));
    saveMembers(members);
  }

  function setMemberStatus(id, status) {
    const members = getMembers();
    const row = members.find(x => String(x.id) === String(id));
    if (!row) throw new Error("Üye bulunamadı.");
    row.status = status;
    saveMembers(members);
    return row;
  }

  function getApplications() {
    try { return JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || "[]"); }
    catch (e) { return []; }
  }

  function saveApplications(rows) { localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(rows)); }

  function addApplication(payload) {
    const rows = getApplications();
    const company = String(payload.company || "").trim();
    const contact = String(payload.contact || "").trim();
    const phone = String(payload.phone || "").trim();
    const appType = String(payload.appType || "").trim();

    if (!company || !contact || !phone || !appType) {
      throw new Error("Firma, yetkili, telefon ve başvuru tipi zorunludur.");
    }

    const row = {
      id: Date.now(),
      company, contact, phone, appType,
      note: String(payload.note || "").trim(),
      status: "Bekliyor",
      createdAt: new Date().toISOString()
    };

    rows.push(row);
    saveApplications(rows);
    return row;
  }

  function removeApplication(id) {
    const rows = getApplications().filter(x => String(x.id) !== String(id));
    saveApplications(rows);
  }

  function setApplicationStatus(id, status) {
    const rows = getApplications();
    const row = rows.find(x => String(x.id) === String(id));
    if (!row) throw new Error("Başvuru bulunamadı.");
    row.status = status;
    saveApplications(rows);
    return row;
  }

  function getProducts() {
    try {
      const rows = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
      if (Array.isArray(rows) && rows.length) return rows;
    } catch (e) {}
    const seed = [
      { id: 1, code: "SR-001", name: "Kapı Menteşesi", category: "Yedek Parça", price: 350, status: "Aktif" },
      { id: 2, code: "SR-002", name: "Çamurluk", category: "Kaporta", price: 1250, status: "Aktif" },
      { id: 3, code: "SR-003", name: "Kilit Seti", category: "Güvenlik", price: 480, status: "Aktif" }
    ];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seed));
    return seed;
  }

  function saveProducts(rows) { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(rows)); }

  function addProduct(payload) {
    const rows = getProducts();
    const code = String(payload.code || "").trim();
    const name = String(payload.name || "").trim();
    const category = String(payload.category || "").trim();
    const price = Number(payload.price || 0);
    if (!code || !name) throw new Error("Ürün kodu ve ürün adı zorunludur.");
    if (rows.some(x => String(x.code).toUpperCase() === code.toUpperCase())) throw new Error("Bu ürün kodu zaten kayıtlı.");

    const row = { id: Date.now(), code, name, category: category || "-", price, status: "Aktif" };
    rows.push(row);
    saveProducts(rows);
    return row;
  }

  function removeProduct(id) {
    const rows = getProducts().filter(x => String(x.id) !== String(id));
    saveProducts(rows);
  }

  function setProductStatus(id, status) {
    const rows = getProducts();
    const row = rows.find(x => String(x.id) === String(id));
    if (!row) throw new Error("Ürün bulunamadı.");
    row.status = status;
    saveProducts(rows);
    return row;
  }

  function getMessages() {
    try {
      const rows = JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]");
      if (Array.isArray(rows) && rows.length) return rows;
    } catch (e) {}
    const seed = [
      { id: 1, from: "Orhan Nakliyat", subject: "Teklif güncellemesi", message: "İstanbul çıkışlı yük için yeni fiyat gönderdik.", status: "Yeni", createdAt: new Date().toISOString() },
      { id: 2, from: "Demir Lojistik", subject: "Yeni araç bilgisi", message: "Aracımız yarın için uygun durumda.", status: "Okundu", createdAt: new Date().toISOString() }
    ];
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(seed));
    return seed;
  }

  function saveMessages(rows) { localStorage.setItem(MESSAGES_KEY, JSON.stringify(rows)); }

  function addMessage(payload) {
    const rows = getMessages();
    const row = {
      id: Date.now(),
      from: String(payload.from || "").trim() || "Bilinmeyen",
      subject: String(payload.subject || "").trim() || "Konu yok",
      message: String(payload.message || "").trim() || "-",
      status: "Yeni",
      createdAt: new Date().toISOString()
    };
    rows.unshift(row);
    saveMessages(rows);
    return row;
  }

  function removeMessage(id) {
    const rows = getMessages().filter(x => String(x.id) !== String(id));
    saveMessages(rows);
  }

  function setMessageStatus(id, status) {
    const rows = getMessages();
    const row = rows.find(x => String(x.id) === String(id));
    if (!row) throw new Error("Mesaj bulunamadı.");
    row.status = status;
    saveMessages(rows);
    return row;
  }

  function getVisits() {
    try { return JSON.parse(localStorage.getItem(VISITS_KEY) || "[]"); }
    catch (e) { return []; }
  }

  function saveVisits(rows) { localStorage.setItem(VISITS_KEY, JSON.stringify(rows)); }

  function trackVisit(pageName) {
    const rows = getVisits();
    rows.push({
      id: Date.now() + Math.random(),
      page: String(pageName || "unknown"),
      time: new Date().toISOString(),
      user: getAuth()?.username || "ziyaretci"
    });
    saveVisits(rows);
  }

  function getVisitSummary() {
    const rows = getVisits();
    const byPage = {};
    rows.forEach(x => {
      const key = x.page || "unknown";
      byPage[key] = (byPage[key] || 0) + 1;
    });
    return {
      total: rows.length,
      byPage,
      recent: rows.slice(-20).reverse()
    };
  }

  function isAdmin() {
    const auth = getAuth();
    return !!(auth && auth.role === "admin");
  }

  function isMember() {
    const auth = getAuth();
    return !!(auth && auth.role && auth.role !== "admin");
  }

  function requireAdmin() {
    if (!isAdmin()) {
      window.location.href = "yonetici-giris.html";
      return false;
    }
    return true;
  }

  function requireMember() {
    if (!isMember()) {
      window.location.href = "uye-login.html";
      return false;
    }
    return true;
  }

  function logout(target) {
    clearAuth();
    window.location.href = target || "index.html";
  }

  window.SEVRA_KIMLIK = {
    getAuth, setAuth, clearAuth,
    getMembers, saveMembers, registerMember, findMember, removeMember, setMemberStatus,
    getApplications, saveApplications, addApplication, removeApplication, setApplicationStatus,
    getProducts, saveProducts, addProduct, removeProduct, setProductStatus,
    getMessages, saveMessages, addMessage, removeMessage, setMessageStatus,
    getVisits, saveVisits, trackVisit, getVisitSummary,
    isAdmin, isMember, requireAdmin, requireMember, logout
  };
})();
