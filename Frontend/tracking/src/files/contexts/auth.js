export function getToken() {
    return localStorage.getItem("token");
  }
  
  export function isTokenExpired(token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
  
  export function getValidTokenOrLogout() {
    const token = getToken();
  
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      alert("Session expired. Please log in again.");
      window.location.href = "/login";
      return null;
    }
  
    return token;
  }
  