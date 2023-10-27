import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { authReducer } from '../reducers/userReducer';


const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
   user: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;