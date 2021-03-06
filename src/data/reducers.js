import { combineReducers } from 'redux';
import Config from "../config/Config";

const defaultState = {
  config: new Config(),
  errorInfo: null,
  message: null,
  results: [],
  user: null
}

// console.log('theme', defaultState);

function config(state = defaultState.config, action) {
  switch (action.type) {
    case "SET_CONFIG":
      return action.data;
    default:
      return state;
  }
}

function errorInfo(state = defaultState.errorInfo, action) {
  switch (action.type) {
    case "SET_ERROR_INFO":
      return action.data;
    default:
      return state;
  }
}

function message(state = defaultState.message, action) {
  switch (action.type) {
    case "SET_MESSAGE":
      return action.data;
    default:
      return state;
  }
}

function results(state = defaultState.results, action) {
  switch (action.type) {
    case "SET_RESULTS":
      return action.data;
    default:
      return state;
  }
}

function user(state = defaultState.user, action) {
  switch (action.type) {
    case "SET_USER":
      return action.data;
    default:
      return state;
  }
}

export default combineReducers({ config, errorInfo, message, results, user });
