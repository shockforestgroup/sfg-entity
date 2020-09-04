import surveyData from "../content/survey-qanda";

const surveyQuestions = surveyData.data.questions;

const initialState = {
  data: surveyQuestions,
  step: 0,
  hasStarted: false,
  hasEnded: false,
};

const countReducer = function (state = initialState, action) {
  switch (action.type) {
    case "START":
      return { ...state, hasStarted: true };
    case "NEXT":
      if (state.step >= state.data.length - 1) {
        return {
          ...state,
          hasEnded: true,
        };
      }
      return {
        ...state,
        step: state.step + 1,
      };
    case "PREVIOUS":
      return { ...state, step: state.step - 1 };
    default:
      return state;
  }
};

export default countReducer;
