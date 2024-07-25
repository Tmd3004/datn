import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import appReducer from './slices/app';
import authReducer from './slices/auth';



const rootPersistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
});

export { rootPersistConfig, rootReducer };
