import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

const initialState = {};

const persistConfig = {
    key: 'root',
    storage,
};

const middleWare = [thunk];

const persistedReducer = persistReducer(persistConfig, rootReducer);

// let store = createStore(
//     rootReducer,
//     initialState,
//     composeWithDevTools(applyMiddleware(...middleWare))
// );

let store = createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleWare))
);

let persistor = persistStore(store);

export { store, persistor };