import { useDispatch } from 'react-redux';
import { Action, applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { persistStore } from 'redux-persist';
import thunk, { ThunkDispatch } from 'redux-thunk';
import apiMiddleware from './middlewares/api';
import reducers from './reducers';

const middlewares = [apiMiddleware, thunk];

const store = createStore(
  reducers,
  {},
  composeWithDevTools(applyMiddleware(...middlewares)),
);

const persistor = persistStore(store);
type RootState = ReturnType<typeof store.getState>;
type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;
const useAsyncDispatch = (): ThunkAppDispatch => useDispatch<ThunkAppDispatch>();

export { persistor, store, useAsyncDispatch };
