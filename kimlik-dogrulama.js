(function () {
  const AUTH_KEY = "sevra_auth";
  const MEMBERS_KEY = "sevra_members";
  const LOADS_KEY = "sevra_loads";
  const OFFERS_KEY = "sevra_offers";
  const APPS_KEY = "sevra_apps";

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function seed() {
    const members = read(MEMBERS_KEY, null);
    if (!Array.isArray(members) || members.length === 0) {
      write(MEMBERS_KEY, [
        {
          id: Date.now(),
          username: "uye1",
          password: "123456",
          fullName: "Demo Uye",
          company: "SEVRA Demo",
          phone: "",
          role: "member",
          provider: "manual",
          status: "Aktif",
          createdAt: new Date().toISOString()
        }
      ]);
    }

    const loads = read(LOADS_KEY, null);
    if (!Array.isArray(loads) || loads.length === 0) {
      write(LOADS_KEY, [
        {
          id: 1001,
          title: "Istanbul - Ankara Parsiyel",
          owner: "Atlas Lojistik",
          route: "Istanbul / Ankara",
          weight: "4 ton",
          status: "Açık",
          createdBy: "system",
          createdAt: new Date().toISOString()
        },
        {
          id: 1002,
          title: "Bursa - Izmir Komple",
          owner: "SEVRA Demo",
          route: "Bursa / Izmir",
          weight: "12 ton",
          status: "Açık",
          createdBy: "system",
          createdAt: new Date().toISOString()
        }
      ]);
    }

    const offers = read(OFFERS_KEY, null);
    if (!Array.isArray(offers)) {
      write(OFFERS_KEY, []);
    }

    const apps = read(APPS_KEY, null);
    if (!Array.isArray(apps)) {
      write(APPS_KEY, []);
    }
  }

  seed();

  function getAuth() {
    return read(AUTH_KEY, null);
  }

  function setAuth(row) {
    write(AUTH_KEY, row);
  }

  function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
  }

  function isAdmin() {
    const a = getAuth();
    return !!(a && a.role === "admin");
  }

  function isMember() {
    const a = getAuth();
    return !!(a && a.role && a.role !== "admin");
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

  function getMembers() {
    return read(MEMBERS_KEY, []);
  }

  function saveMembers(rows) {
    write(MEMBERS_KEY, rows);
  }

  function registerMember(payload) {
    const rows = getMembers();
    const username = String(payload.username || "").trim();
    const password = String(payload.password || "").trim();

    if (!username) throw new Error("Kullanici adi zorunlu.");
    if (!password) throw new Error("Sifre zorunlu.");

    const exists = rows.some(x => String(x.username).toLowerCase() === username.toLowerCase());
    if (exists) throw new Error("Bu kullanici adi zaten kayitli.");

    const row = {
      id: Date.now(),
      username: username,
      password: password,
      fullName: String(payload.fullName || "").trim() || username,
      company: String(payload.company || "").trim(),
      phone: String(payload.phone || "").trim(),
      role: String(payload.role || "member").trim() || "member",
      provider: String(payload.provider || "manual").trim() || "manual",
      status: "Aktif",
      createdAt: new Date().toISOString()
    };

    rows.push(row);
    saveMembers(rows);
    return row;
  }

  function findMember(username, password) {
    const user = String(username || "").trim();
    const pass = String(password || "").trim();
    return getMembers().find(x =>
      x.username === user &&
      x.password === pass &&
      x.status !== "Pasif"
    ) || null;
  }

  function setMemberStatus(id, status) {
    const rows = getMembers();
    const row = rows.find(x => String(x.id) === String(id));
    if (!row) throw new Error("Uye bulunamadi.");
    row.status = status;
    saveMembers(rows);
    return row;
  }

  function getLoads() {
    return read(LOADS_KEY, []);
  }

  function saveLoads(rows) {
    write(LOADS_KEY, rows);
  }

  function addLoad(payload) {
    const auth = getAuth() || {};
    const title = String(payload.title || "").trim();
    const route = String(payload.route || "").trim();
    const weight = String(payload.weight || "").trim();

    if (!title || !route || !weight) {
      throw new Error("Baslik, guzergah ve agirlik zorunlu.");
    }

    const rows = getLoads();
    const row = {
      id: Date.now(),
      title: title,
      owner: auth.company || auth.fullName || auth.username || "Uye",
      route: route,
      weight: weight,
      status: "Açık",
      createdBy: auth.username || "unknown",
      createdAt: new Date().toISOString()
    };
    rows.unshift(row);
    saveLoads(rows);
    return row;
  }

  function setLoadStatus(id, status) {
    const rows = getLoads();
    const row = rows.find(x => String(x.id) === String(id));
    if (!row) throw new Error("Ilan bulunamadi.");
    row.status = status;
    saveLoads(rows);
    return row;
  }

  function getOffers() {
    return read(OFFERS_KEY, []);
  }

  function saveOffers(rows) {
    write(OFFERS_KEY, rows);
  }

  function addOffer(payload) {
    const auth = getAuth() || {};
    const loadId = String(payload.loadId || "").trim();
    const price = String(payload.price || "").trim();
    const note = String(payload.note || "").trim();

    if (!loadId || !price) throw new Error("Ilan ve fiyat zorunlu.");

    const rows = getOffers();
    const row = {
      id: Date.now(),
      loadId: loadId,
      member: auth.username || "unknown",
      memberName: auth.company || auth.fullName || auth.username || "Uye",
      price: price,
      note: note,
      status: "Bekliyor",
      adminNote: "",
      createdAt: new Date().toISOString()
    };
    rows.unshift(row);
    saveOffers(rows);
    return row;
  }

  function setOfferStatus(id, status) {
    const rows = getOffers();
    const row = rows.find(x => String(x.id) === String(id));
    if (!row) throw new Error("Teklif bulunamadi.");
    row.status = status;
    saveOffers(rows);
    return row;
  }

  function setOfferAdminNote(id, note) {
    const rows = getOffers();
    const row = rows.find(x => String(x.id) === String(id));
    if (!row) throw new Error("Teklif bulunamadi.");
    row.adminNote = String(note || "").trim();
    saveOffers(rows);
    return row;
  }

  function getApplications() {
    return read(APPS_KEY, []);
  }

  function saveApplications(rows) {
    write(APPS_KEY, rows);
  }

  function addApplication(payload) {
    const company = String(payload.company || "").trim();
    const contact = String(payload.contact || "").trim();
    const phone = String(payload.phone || "").trim();
    const appType = String(payload.appType || "").trim();
    const note = String(payload.note || "").trim();

    if (!company || !contact || !phone || !appType) {
      throw new Error("Firma, yetkili, telefon ve basvuru tipi zorunlu.");
    }

    const rows = getApplications();
    rows.unshift({
      id: Date.now(),
      company: company,
      contact: contact,
      phone: phone,
      appType: appType,
      note: note,
      status: "Bekliyor",
      createdAt: new Date().toISOString()
    });
    saveApplications(rows);
  }

  function setApplicationStatus(id, status) {
    const rows = getApplications();
    const row = rows.find(x => String(x.id) === String(id));
    if (!row) throw new Error("Basvuru bulunamadi.");
    row.status = status;
    saveApplications(rows);
    return row;
  }

  window.SEVRA_KIMLIK = {
    getAuth,
    setAuth,
    clearAuth,
    isAdmin,
    isMember,
    requireAdmin,
    requireMember,
    logout,
    getMembers,
    saveMembers,
    registerMember,
    findMember,
    setMemberStatus,
    getLoads,
    saveLoads,
    addLoad,
    setLoadStatus,
    getOffers,
    saveOffers,
    addOffer,
    setOfferStatus,
    setOfferAdminNote,
    getApplications,
    saveApplications,
    addApplication,
    setApplicationStatus
  };
})();
