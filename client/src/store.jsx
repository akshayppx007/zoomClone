import { combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import persistedReducer from "./utils/persistReducer";
import { userListReducer, userUpdateReducer } from "./reducers/userReducer";


const reducer = combineReducers({
    persistedReducer: persistedReducer,
    updatedUsers: userUpdateReducer,
    users: userListReducer
});

let initialState = {};

const store = configureStore({
  reducer: reducer,
  devTools: true,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableStateInvariantCheck: false,
    }).concat(thunkMiddleware),
});

export default store;
