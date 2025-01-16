import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice";
import loadingReducer from "./loaderSlice";
import userPostReducer from "./userPostSlice";
import uiReducer from "./uiSlice";
import userForumsReducer from "./userForumsSlice";
import allForumsReducer from "./allForumsSlice";
import dashboardReducer from "./dashboardSlice";

const persistConfig = {
    key: "root",
    storage,
};

const rootReducer = combineReducers({
    user: userReducer,
    loading: loadingReducer,
    userPosts: userPostReducer,
    ui: uiReducer,
    userForums: userForumsReducer,
    allForums: allForumsReducer,
    dashboard: dashboardReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    devTools: import.meta.env.MODE !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export const persistor = persistStore(store);