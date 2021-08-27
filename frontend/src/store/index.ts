import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "@redux-saga/core";
import reducer from "./upload";
import rootSaga from "./root-saga";

const sagaMiddleaware = createSagaMiddleware();

const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleaware)
);

sagaMiddleaware.run(rootSaga);

export default store;
