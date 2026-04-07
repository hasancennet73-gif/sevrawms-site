
(function () {
  const AUTH_KEY = "sevra_live_auth";

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
    isAdmin,
    isMember,
    requireAdmin,
    requireMember,
    logout
  };
})();
