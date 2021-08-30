import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "@redux-saga/core";
import upload from "./upload";
import rootSaga from "./root-saga";

const sagaMiddleaware = createSagaMiddleware();

const store = createStore(
    combineReducers({
        upload
    }),

    applyMiddleware(sagaMiddleaware)
);

sagaMiddleaware.run(rootSaga);

export default store;
