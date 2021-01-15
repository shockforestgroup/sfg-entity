import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import Entity from "./components/Entity";
import GameController from "./components/GameController";

import countReducer from "./redux/reducer.js";
import { isDebugMode } from "./helpers/readEnvVar.js";

import settings from "./settings";

let store = createStore(
  countReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const App = () => (
  <Provider store={store}>
    {isDebugMode && <GameController />}
    <div style={{backgroundColor: settings.CANVAS_BG_COLOR}}>
      <Entity />
    </div>
  </Provider>
);

export default App;
