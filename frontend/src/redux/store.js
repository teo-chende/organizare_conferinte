import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import conferinteReducer from './slices/conferinteSlice';
import articoleReducer from './slices/articoleSlice';
import utilizatoriReducer from './slices/utilizatorSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conferinte: conferinteReducer,
    articole: articoleReducer,
    utilizatori: utilizatoriReducer,
  },
});

export default store;