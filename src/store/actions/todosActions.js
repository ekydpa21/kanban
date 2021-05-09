import axios from "axios";
const baseUrl = "https://todos-project-api.herokuapp.com/todos";
const authToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2MjA4ODY2OTh9.SKIV2sXUShLHAnuSl9r9kOa9vK84EE9nmJa624jx8Pg";

axios.interceptors.request.use(
  (config) => {
    config.headers.authorization = `Bearer ${authToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchLoading = () => {
  return {
    type: "START_FETCHING",
  };
};

export const isChangedAction = (payload) => {
  return {
    type: "IS_CHANGED",
    payload: payload,
  };
};

export const storeColumns = (payload) => {
  return {
    type: "COLUMNS_FETCHING",
    payload: payload,
  };
};

export const fetchColumns = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchLoading());

      const response = await axios.get(baseUrl);
      const payload = response.data;

      dispatch(storeColumns(payload));
    } catch (err) {
      return {
        type: "ERROR",
      };
    }
  };
};
