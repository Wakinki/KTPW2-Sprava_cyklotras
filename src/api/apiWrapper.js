// src/api/apiWrapper.js

/**
 * Obalí API funkce pro zachycení a logování chyb
 * @param {Function} apiFunction - Původní API funkce
 * @param {string} functionName - Název funkce (pro debug)
 * @returns {Function} Obalená funkce
 */
export function wrapApiFunction(apiFunction, functionName) {
  return async function(...args) {
    try {
      const result = await apiFunction.apply(this, args);

      if (result?.status === "REJECTED") {
        console.warn(`[API ${functionName}] Chyba:`, result.reason || "Neznámá chyba");
        showToast(`Odmítnuto: ${result.reason || "Neznámá chyba"}`, "warning");
      }

      return result;
    } catch (error) {
      console.error(`[API ${functionName}] Neočekávaná chyba:`, error);
       showToast(`Neočekávaná chyba: ${error.message}`, "error");
      return { status: "ERROR", reason: error.message || "Neočekávaná chyba" };
    }
  };
}

/**
 * Obalí celé API
 * @param {Object} api - API objekt
 * @returns {Object} Obalené API
 */
export function wrapApi(api) {
  const wrappedApi = {};

  for (const [key, value] of Object.entries(api)) {
    if (typeof value === 'function') {
      wrappedApi[key] = wrapApiFunction(value, key);
    } else if (typeof value === 'object' && value !== null) {
      wrappedApi[key] = wrapApi(value); // Rekurzivně obalí vnořené objekty
    } else {
      wrappedApi[key] = value;
    }
  }

  return wrappedApi;
}

/**
 * Zobrazí toast notifikaci
 * @param {string} message - Zpráva
 * @param {string} type - Typ (success, error, warning)
 */
function showToast(message, type = "error") {

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;


  document.body.appendChild(toast);


  setTimeout(() => {
    toast.classList.add("fading-out");
    setTimeout(() => toast.remove(), 300); // Doba animace fade-out
  }, 5000);
}