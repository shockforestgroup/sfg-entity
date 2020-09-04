import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import Entity from "./components/Entity";
import GameController from "./components/GameController";

import countReducer from "./redux/reducer.js";

let store = createStore(
  countReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const App = () => (
  <Provider store={store}>
    <GameController />
    <Entity />
  </Provider>
);

export default App;
