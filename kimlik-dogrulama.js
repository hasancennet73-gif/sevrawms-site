(function () {
  const AUTH_KEY = "sevra_live_auth";
  const MEMBERS_KEY = "sevra_live_members";
  const APPLICATIONS_KEY = "sevra_live_applications";
  const PRODUCTS_KEY = "sevra_live_products";
  const MESSAGES_KEY = "sevra_live_messages";
  const VISITS_KEY = "sevra_live_visits";
  const LOADS_KEY = "sevra_live_loads";
  const OFFERS_KEY = "sevra_live_offers";

  function parse(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch (e) { return fallback; }
  }
  function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  function getAuth() { return parse(AUTH_KEY, null); }
  function setAuth(data) { save(AUTH_KEY, data); }
  function clearAuth() { localStorage.removeItem(AUTH_KEY); }

  function getMembers() { return parse(MEMBERS_KEY, []); }
  function saveMembers(rows) { save(MEMBERS_KEY, rows); }
  function registerMember(payload) {
    const members = getMembers();
    const username = String(payload.username || "").trim();
    const password = String(payload.password || "").trim();
    if (!username) throw new Error("Kullanıcı adı zorunludur.");
    if (!password) throw new Error("Şifre zorunludur.");
    if (members.some(x => x.username === username)) throw new Error("Bu kullanıcı adı zaten kayıtlı.");
    const row = {
      id: Date.now(),
      username, password,
      role: String(payload.role || "member"),
      fullName: String(payload.fullName || "").trim() || username,
      company: String(payload.company || "").trim(),
      status: "Aktif",
      createdAt: new Date().toISOString()
    };
    members.push(row); saveMembers(members); return row;
  }
  function findMember(username, password) {
    const members = getMembers();
    return members.find(x =>
      x.username === String(username || "").trim() &&
      x.password === String(password || "").trim() &&
      x.status !== "Pasif"
    ) || null;
  }
  function removeMember(id) { saveMembers(getMembers().filter(x => String(x.id) !== String(id))); }
  function setMemberStatus(id, status) {
    const rows = getMembers(); const row = rows.find(x => String(x.id) === String(id));
    if (!row) throw new Error("Üye bulunamadı.");
    row.status = status; saveMembers(rows); return row;
  }

  function getApplications() { return parse(APPLICATIONS_KEY, []); }
  function saveApplications(rows) { save(APPLICATIONS_KEY, rows); }
  function addApplication(payload) {
    const rows = getApplications();
    const company = String(payload.company || "").trim();
    const contact = String(payload.contact || "").trim();
    const phone = String(payload.phone || "").trim();
    const appType = String(payload.appType || "").trim();
    if (!company || !contact || !phone || !appType) throw new Error("Firma, yetkili, telefon ve başvuru tipi zorunludur.");
    const row = {
      id: Date.now(), company, contact, phone, appType,
      note: String(payload.note || "").trim(),
      status: "Bekliyor", createdAt: new Date().toISOString()
    };
    rows.push(row); saveApplications(rows); return row;
  }
  function removeApplication(id) { saveApplications(getApplications().filter(x => String(x.id) !== String(id))); }
  function setApplicationStatus(id, status) {
    const rows = getApplications(); const row = rows.find(x => String(x.id) === String(id));
    if (!row) throw new Error("Başvuru bulunamadı.");
    row.status = status; saveApplications(rows); return row;
  }

  function getProducts() {
    const rows = parse(PRODUCTS_KEY, []);
    if (Array.isArray(rows) && rows.length) return rows;
    const seed = [
      { id: 1, code: "SR-001", name: "Kapı Menteşesi", category: "Yedek Parça", price: 350, status: "Aktif" },
      { id: 2, code: "SR-002", name: "Çamurluk", category: "Kaporta", price: 1250, status: "Aktif" },
      { id: 3, code: "SR-003", name: "Kilit Seti", category: "Güvenlik", price: 480, status: "Aktif" }
    ];
    save(PRODUCTS_KEY, seed); return seed;
  }
  function saveProducts(rows) { save(PRODUCTS_KEY, rows); }
  function addProduct(payload) {
    const rows = getProducts();
    const code = String(payload.code || "").trim();
    const name = String(payload.name || "").trim();
    const category = String(payload.category || "").trim();
    const price = Number(payload.price || 0);
    if (!code || !name) throw new Error("Ürün kodu ve ürün adı zorunludur.");
    if (rows.some(x => String(x.code).toUpperCase() === code.toUpperCase())) throw new Error("Bu ürün kodu zaten kayıtlı.");
    const row = { id: Date.now(), code, name, category: category || "-", price, status: "Aktif" };
    rows.push(row); saveProducts(rows); return row;
  }
  function removeProduct(id) { saveProducts(getProducts().filter(x => String(x.id) !== String(id))); }
  function setProductStatus(id, status) {
    const rows = getProducts(); const row = rows.find(x => String(x.id) === String(id));
    if (!row) throw new Error("Ürün bulunamadı.");
    row.status = status; saveProducts(rows); return row;
  }

  function getMessages() {
    const rows = parse(MESSAGES_KEY, []);
    if (Array.isArray(rows) && rows.length) return rows;
    const seed = [
      { id: 1, from: "Orhan Nakliyat", subject: "Teklif güncellemesi", message: "İstanbul çıkışlı yük için yeni fiyat gönderdik.", status: "Yeni", createdAt: new Date().toISOString() },
      { id: 2, from: "Demir Lojistik", subject: "Yeni araç bilgisi", message: "Aracımız yarın için uygun durumda.", status: "Okundu", createdAt: new Date().toISOString() }
    ];
    save(MESSAGES_KEY, seed); return seed;
  }
  function saveMessages(rows) { save(MESSAGES_KEY, rows); }
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
    rows.unshift(row); saveMessages(rows); return row;
  }
  function removeMessage(id) { saveMessages(getMessages().filter(x => String(x.id) !== String(id))); }
  function setMessageStatus(id, status) {
    const rows = getMessages(); const row = rows.find(x => String(x.id) === String(id));
    if (!row) throw new Error("Mesaj bulunamadı.");
    row.status = status; saveMessages(rows); return row;
  }

  function getVisits() { return parse(VISITS_KEY, []); }
  function saveVisits(rows) { save(VISITS_KEY, rows); }
  function trackVisit(pageName) {
    const rows = getVisits();
    rows.push({ id: Date.now() + Math.random(), page: String(pageName || "unknown"), time: new Date().toISOString(), user: getAuth()?.username || "ziyaretci" });
    saveVisits(rows);
  }
  function getVisitSummary() {
    const rows = getVisits(); const byPage = {};
    rows.forEach(x => { const key = x.page || "unknown"; byPage[key] = (byPage[key] || 0) + 1; });
    return { total: rows.length, byPage, recent: rows.slice(-20).reverse() };
  }

  function getLoads() {
    const rows = parse(LOADS_KEY, []);
    if (Array.isArray(rows) && rows.length) return rows;
    const seed = [
      { id: 1, title: "İstanbul → Ankara Parsiyel", owner: "Atlas Lojistik", route: "İstanbul / Ankara", weight: "4 ton", status: "Açık", createdBy: "system", createdAt: new Date().toISOString() },
      { id: 2, title: "Bursa → İzmir Komple", owner: "SEVRA Demo", route: "Bursa / İzmir", weight: "12 ton", status: "Açık", createdBy: "system", createdAt: new Date().toISOString() }
    ];
    save(LOADS_KEY, seed); return seed;
  }
  function saveLoads(rows) { save(LOADS_KEY, rows); }
  function addLoad(payload) {
    const rows = getLoads();
    const auth = getAuth() || {};
    const title = String(payload.title || "").trim();
    const route = String(payload.route || "").trim();
    const weight = String(payload.weight || "").trim();
    if (!title || !route || !weight) throw new Error("Başlık, güzergah ve ağırlık zorunludur.");
    const row = {
      id: Date.now(),
      title, route, weight,
      owner: auth.company || auth.fullName || auth.username || "Üye",
      status: "Açık",
      createdBy: auth.username || "unknown",
      createdAt: new Date().toISOString()
    };
    rows.unshift(row); saveLoads(rows); return row;
  }
  function setLoadStatus(id, status) {
    const rows = getLoads(); const row = rows.find(x => String(x.id) === String(id));
    if (!row) throw new Error("İlan bulunamadı.");
    row.status = status; saveLoads(rows); return row;
  }

  function getOffers() { return parse(OFFERS_KEY, []); }
  function saveOffers(rows) { save(OFFERS_KEY, rows); }
  function addOffer(payload) {
    const rows = getOffers();
    const auth = getAuth() || {};
    const loadId = String(payload.loadId || "").trim();
    const price = String(payload.price || "").trim();
    const note = String(payload.note || "").trim();
    if (!loadId || !price) throw new Error("İlan ve fiyat zorunludur.");
    const row = {
      id: Date.now(),
      loadId,
      member: auth.username || "unknown",
      memberName: auth.company || auth.fullName || auth.username || "Üye",
      price,
      note,
      status: "Bekliyor",
      createdAt: new Date().toISOString()
    };
    rows.unshift(row); saveOffers(rows); return row;
  }
  function setOfferStatus(id, status) {
    const rows = getOffers(); const row = rows.find(x => String(x.id) === String(id));
    if (!row) throw new Error("Teklif bulunamadı.");
    row.status = status; saveOffers(rows); return row;
  }

  function isAdmin() { const auth = getAuth(); return !!(auth && auth.role === "admin"); }
  function isMember() { const auth = getAuth(); return !!(auth && auth.role && auth.role !== "admin"); }

  function requireAdmin() {
    if (!isAdmin()) { window.location.href = "yonetici-giris.html"; return false; }
    return true;
  }
  function requireMember() {
    if (!isMember()) { window.location.href = "uye-login.html"; return false; }
    return true;
  }
  function logout(target) { clearAuth(); window.location.href = target || "index.html"; }

  window.SEVRA_KIMLIK = {
    getAuth, setAuth, clearAuth,
    getMembers, saveMembers, registerMember, findMember, removeMember, setMemberStatus,
    getApplications, saveApplications, addApplication, removeApplication, setApplicationStatus,
    getProducts, saveProducts, addProduct, removeProduct, setProductStatus,
    getMessages, saveMessages, addMessage, removeMessage, setMessageStatus,
    getVisits, saveVisits, trackVisit, getVisitSummary,
    getLoads, saveLoads, addLoad, setLoadStatus,
    getOffers, saveOffers, addOffer, setOfferStatus,
    isAdmin, isMember, requireAdmin, requireMember, logout
  };
})();
