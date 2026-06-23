
/**
 * Vytvoří store pro správu stavu aplikace
 * @param {Object} initialState - Počáteční stav
 * @returns {Object} Store s metodami getState, setState, subscribe
 */
export function createStore(initialState) {
  let state = initialState;
  const listeners = [];

   /**
   * Vrací aktuální stav
   * @returns {Object} Aktuální stav
   */
  function getState() {
    return state;
  }

   /**
   * Aktualizuje stav a notifikuje všechny listenery
   * @param {Function} updateFunction - Funkce, která přijímá aktuální stav a vrací nový
   */
  function setState(updateFunction) {
    // Aktualizace stavu
    state = updateFunction(state);

    // Volání všech zaregistrovaných listenerů
    listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (error) {
        console.error("Chyba v listeneru:", error);
      }
    });
  }

   /**
   * Registruje nového listenera
   * @param {Function} listener - Funkce, která bude volána při změně stavu
   * @returns {Function} Funkce pro odregistrování listeneru
   */
  function subscribe(listener) {
    listeners.push(listener);

    // Vrací funkci pro odregistrování
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  return {
    getState,
    setState,
    subscribe,
  };
}
