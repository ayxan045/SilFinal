import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import {
  userReducer,
  loaderReducer,
  langReducer,
  notificationReducer,
  catReducer,
  edit,
} from "./reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  user: userReducer,
  loader: loaderReducer,
  langs: langReducer,
  cats: catReducer,
  edit:edit,
  notification: notificationReducer,
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
