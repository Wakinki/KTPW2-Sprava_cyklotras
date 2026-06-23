// src/app/actions/loadInitialData.js
export async function loadInitialData({ store, api, payload }) {
      console.log("loadInitialData")
  const { token } = payload || store.getState().auth;

  if (!token) {
    console.warn("loadInitialData: No token provided");
    return;
  }

  try {
    const [routesResult, signsResult] = await Promise.all([
      api.routes.getRoutes(token),
      api.signs.getSigns(token),
    ]);

    store.setState((state) => {
      if (routesResult.status === "SUCCESS" && signsResult.status === "SUCCESS") {
        return {
          ...state,
          routes: routesResult.routes,
          signs: signsResult.signs,
        };
      }
      return state;
    });
  } catch (error) {
    console.error("Chyba při načítání dat:", error);
  }
}