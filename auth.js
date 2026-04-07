
(function () {
  const AUTH_KEY = "sevra_auth";

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

  function isLoggedIn() {
    const auth = getAuth();
    return !!(auth && auth.role && auth.username);
  }

  function isAdmin() {
    const auth = getAuth();
    return !!(auth && auth.role === "admin");
  }

  function isMember() {
    const auth = getAuth();
    return !!(auth && auth.role && auth.role !== "admin");
  }

  function requireAdmin(redirectPage) {
    const auth = getAuth();
    if (!auth || auth.role !== "admin") {
      window.location.href = redirectPage || "admin-login.html";
      return false;
    }
    return true;
  }

  function requireMember(redirectPage) {
    const auth = getAuth();
    if (!auth || auth.role === "admin") {
      window.location.href = redirectPage || "uye-login.html";
      return false;
    }
    return true;
  }

  function logout(redirectPage) {
    clearAuth();
    window.location.href = redirectPage || "index.html";
  }

  window.SEVRA_AUTH = {
    getAuth,
    setAuth,
    clearAuth,
    isLoggedIn,
    isAdmin,
    isMember,
    requireAdmin,
    requireMember,
    logout,
  };
})();
