import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import Entity from "./components/Entity";
import GameController from "./components/GameController";
import countReducer from "./redux/reducer.js";

const debugMode = !!process.env.REACT_APP_DEBUG_MODE;

let store = createStore(
  countReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const App = () => (
  <Provider store={store}>
    {debugMode && <GameController />}
    <Entity />
  </Provider>
);

export default App;
