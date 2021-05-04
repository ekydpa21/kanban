import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import todosReducer from "./reducers/todosReducer";

const rootReducer = combineReducers({
  todos: todosReducer,
});

let store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
