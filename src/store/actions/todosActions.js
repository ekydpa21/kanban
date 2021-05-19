import axios from "axios";
const baseUrl = "https://new-kanbans.herokuapp.com/todos";
const access_token = localStorage.getItem("access_token");

export const fetchLoading = () => {
  return {
    type: "START_FETCHING",
  };
};

export const fetchTodos = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchLoading());

      const response = await axios.get(baseUrl, { headers: { access_token } });
      const payload = response.data;

      dispatch({
        type: "COLUMNS_FETCHING",
        payload: payload,
      });
    } catch (err) {
      return {
        type: "ERROR",
      };
    }
  };
};

export const addTodo = (newTodo) => {
  return async (dispatch) => {
    try {
      dispatch(fetchLoading());

      await axios.post(baseUrl, newTodo, {
        headers: { access_token },
      });

      dispatch(fetchTodos());
    } catch (err) {
      return {
        type: "ERROR",
      };
    }
  };
};

export const deleteTodo = (id) => {
  return async (dispatch) => {
    try {
      dispatch(fetchLoading());

      await axios.delete(`${baseUrl}/${id}`, {
        headers: { access_token },
      });

      dispatch(fetchTodos());
    } catch (err) {
      return {
        type: "ERROR",
      };
    }
  };
};

export const editTodo = (id, updatedTodo) => {
  return async (dispatch) => {
    try {
      dispatch(fetchLoading());

      await axios.put(`${baseUrl}/${id}`, updatedTodo, {
        headers: { access_token },
      });

      dispatch(fetchTodos());
    } catch (err) {
      return {
        type: "ERROR",
      };
    }
  };
};

export const addTask = (todoId, newTask) => {
  return async (dispatch) => {
    try {
      dispatch(fetchLoading());

      await axios.post(`${baseUrl}/${todoId}/tasks`, newTask, {
        headers: { access_token },
      });

      dispatch(fetchTodos());
    } catch (err) {
      return {
        type: "ERROR",
      };
    }
  };
};
