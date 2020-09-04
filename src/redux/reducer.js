const initialState = {
  step: 0,
};

const countReducer = function (state = initialState, action) {
  switch (action.type) {
    case "NEXT":
      return { ...state, step: state.step + 1 };
    case "PREVIOUS":
      return { ...state, step: state.step - 1 };
    default:
      return state;
  }
};

export default countReducer;
