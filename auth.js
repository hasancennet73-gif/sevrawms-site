
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

  function requireRole(role, redirectPage) {
    const auth = getAuth();
    if (!auth || auth.role !== role) {
      window.location.href = redirectPage;
      return false;
    }
    return true;
  }

  function logout(redirectPage) {
    clearAuth();
    window.location.href = redirectPage;
  }

  window.SEVRA_AUTH = {
    getAuth,
    setAuth,
    clearAuth,
    isLoggedIn,
    requireRole,
    logout,
  };
})();
