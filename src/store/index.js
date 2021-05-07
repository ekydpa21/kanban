import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import todosReducer from "./reducers/todosReducer";
import taskReducer from "./reducers/taskReducer";

const rootReducer = combineReducers({
  todos: todosReducer,
  tasks: taskReducer,
});

let store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
