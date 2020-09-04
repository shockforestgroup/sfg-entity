const initialState = {
  step: 0,
  hasStarted: false,
};

const countReducer = function (state = initialState, action) {
  switch (action.type) {
    case "START":
      return { ...state, hasStarted: true };
    case "NEXT":
      return { ...state, step: state.step + 1 };
    case "PREVIOUS":
      return { ...state, step: state.step - 1 };
    default:
      return state;
  }
};

export default countReducer;
