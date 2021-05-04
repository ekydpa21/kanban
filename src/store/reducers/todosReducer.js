const initialState = {
  loading: false,
  error: false,
  columns: [],
};

function todosReducer(state = initialState, action) {
  switch (action.type) {
    case "START_FETCHING":
      return {
        ...state,
        loading: true,
      };
    case "COLUMNS_FETCHING":
      return {
        ...state,
        columns: action.payload,
        loading: false,
      };
    case "ERROR":
      return {
        ...state,
        error: true,
      };
    default:
      return state;
  }
}

export default todosReducer;
