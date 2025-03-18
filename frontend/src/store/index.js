import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import loadingReducer from "./slices/loaderSlice";
import userPostReducer from "./slices/userPostSlice";
import uiReducer from "./slices/uiSlice";
import userForumsReducer from "./slices/userForumsSlice";
import allForumsReducer from "./slices/allForumsSlice";
import dashboardReducer from "./slices/dashboardSlice";
import UserActivityReducer from "./slices/userActivitySlice";

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
    dashboard: dashboardReducer,
    userActivity: UserActivityReducer
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