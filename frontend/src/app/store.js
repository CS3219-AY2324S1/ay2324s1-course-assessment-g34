import { configureStore } from '@reduxjs/toolkit';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { combineReducers } from 'redux';
import {
  persistReducer,
  persistStore,
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import sessionReducer from '../features/session/sessionSlice';
import matchReducer from '../features/match/matchSlice';

const createNoopStorage = () => ({
  getItem(_key) {
    return Promise.resolve(null);
  },
  setItem(_key, value) {
    return Promise.resolve(value);
  },
  removeItem(_key) {
    return Promise.resolve();
  },
});

const customStorage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage: customStorage,
  stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers({
  match: matchReducer,
  session: sessionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store, {}, () => {
  persistor.persist();
});

export default store;
