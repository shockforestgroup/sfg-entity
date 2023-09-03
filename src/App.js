import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import * as screenOrientation from "screen-orientation-js";
import EntityWrapper from "./components/Entity";
import GameController from "./components/GameController";
import countReducer from "./redux/reducer";
import { isDebugMode } from "./helpers/readEnvVar";
import isMobileDevice from "./helpers/isMobileDevice";

import settings from "./settings";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

let store = createStore(
  countReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

class App extends React.Component {
  componentDidMount() {
    if (isMobileDevice()) {
      screenOrientation.init({ color: "#fff", bgColor: "#000", fontSize: 3 });
    }
  }
  render() {
    return (
      <Router>
        <Provider store={store}>
          {isDebugMode && <GameController />}
          <div style={{ backgroundColor: settings.CANVAS_BG_COLOR }}>
            <Routes>
              <Route
                path=":state"
                element={<EntityWrapper />}
              />
            </Routes>
            {/* <Entity /> */}
          </div>
        </Provider>
      </Router>
    );
  }
}

export default App;

//I want to check the orientation of the device on start, and if its landscape show message
