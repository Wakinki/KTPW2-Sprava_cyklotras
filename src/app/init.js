// src/app/init.js
import { createInitialState } from './state.js';
import { createStore } from '../infra/store/createStore.js';
import { createDispatcher } from './dispatch.js';
import { render } from '../ui/render.js';
import { createApi } from '../api/mockApi.js';
import { urlToAction } from '../infra/router/router.js';

// 1. Vytvoření API
const api = createApi();

// 2. Inicializace infrastruktury
const store = createStore(createInitialState());
const dispatch = createDispatcher(store, api);

// 3. Napojení renderu
const root = document.getElementById('app');
store.subscribe((state) => render(root, state, dispatch));

// 4. Inicializace aplikace
dispatch({ type: 'APP_INIT' });

// 5. Naslouchání změnám URL
window.addEventListener('popstate', () => {
  const action = urlToAction(window.location.href);
  const state = store.getState();
  

  if (state.auth.role === "ANONYMOUS" && action.type !== "ENTER_AUTHENTICATION") {
    dispatch({ type: "ENTER_AUTHENTICATION" });
    window.history.replaceState({}, "", "#/auth");
  } else {
    dispatch(action);
  }
});