import surveyData from "../content/survey-qanda";

const surveyQuestions = surveyData.data.questions;

const initialState = {
  data: surveyQuestions,
  step: 0,
  gameState: "startscreen",
  hasEndedWhen: null,
};

const countReducer = function (state = initialState, action) {
  switch (action.type) {
    case "START":
      return {
        ...state,
        hasEndedWhen: null,
        gameState: "startscreen",
      };
    case "PLAY":
      return {
        ...state,
        hasEndedWhen: null,
        gameState: "playing",
      };
    case "NEXT":
      if (state.step >= state.data.length - 1) {
        return {
          ...state,
          hasEndedWhen: new Date(),
          gameState: "afterendidle",
        };
      }
      return {
        ...state,
        step: state.step + 1,
      };
    case "PREVIOUS":
      if (state.step === 0) {
        return state;
      }
      return { ...state, step: state.step - 1 };
    default:
      return state;
  }
};

export default countReducer;
