import { objectUpdate } from "../utils/utils";
import store from "./store";

export function setConfig(data) {
  return dispatch => {
    dispatch({ type: "SET_CONFIG", data: data });
  };
}

export function setErrorInfo(data) {
  return dispatch => {
    dispatch({ type: "SET_ERROR_INFO", data: data });
  };
}

export function setMessage(data) {
  return dispatch => {
    dispatch({ type: "SET_MESSAGE", data: data });
  };
}

export function setResults(data) {
  return dispatch => {
    dispatch({ type: "SET_RESULTS", data: data });
  };
}
