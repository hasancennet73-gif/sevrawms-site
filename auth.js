
(function () {
  const AUTH_KEY = "sevra_live_auth";
  const MEMBERS_KEY = "sevra_live_members";

  function getAuth() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
    } catch (e) {
      return null;
    }
  }

  function setAuth(data) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  }

  function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
  }

  function getMembers() {
    try {
      return JSON.parse(localStorage.getItem(MEMBERS_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveMembers(rows) {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(rows));
  }

  function registerMember(payload) {
    const members = getMembers();
    const username = String(payload.username || "").trim();
    if (!username) {
      throw new Error("Kullanıcı adı zorunludur.");
    }
    if (members.some(x => x.username === username)) {
      throw new Error("Bu kullanıcı adı zaten kayıtlı.");
    }
    members.push({
      username,
      password: String(payload.password || "").trim(),
      role: String(payload.role || "member"),
      fullName: String(payload.fullName || "").trim() || username,
      company: String(payload.company || "").trim()
    });
    saveMembers(members);
    return true;
  }

  function findMember(username, password) {
    const members = getMembers();
    return members.find(
      x => x.username === String(username || "").trim() &&
           x.password === String(password || "").trim()
    ) || null;
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
      window.location.href = "yönetici-giriş.html";
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
    getAuth,
    setAuth,
    clearAuth,
    getMembers,
    registerMember,
    findMember,
    isAdmin,
    isMember,
    requireAdmin,
    requireMember,
    logout
  };
})();
