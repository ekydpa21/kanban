const initialState = {
  loading: false,
  error: false,
  isChanged: false,
  tasks: [],
};

function todosReducer(state = initialState, action) {
  switch (action.type) {
    case "START_FETCHING":
      return {
        ...state,
        loading: true,
      };
    case "TASKS_FETCHING":
      return {
        ...state,
        tasks: action.payload,
        loading: false,
      };
    case "ERROR":
      return {
        ...state,
        error: true,
      };
    case "IS_CHANGED":
      return {
        ...state,
        isChanged: action.payload,
      };
    default:
      return state;
  }
}

export default todosReducer;
