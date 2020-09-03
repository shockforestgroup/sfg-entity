import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import Entity from "./components/Entity";
import GameController from "./components/GameController";

import countReducer from "./redux/reducer.js";

let store = createStore(countReducer);

const App = () => (
  <Provider store={store}>
    <GameController />
    <Entity />
  </Provider>
);

export default App;
