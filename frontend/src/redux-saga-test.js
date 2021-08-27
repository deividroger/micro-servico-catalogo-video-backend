const { createStore, applyMiddleware } = require('redux');
const { default: createSagaMiddleware } = require('redux-saga');
const { take, put,call, actionChannel,debounce } = require('redux-saga/effects');
const axios = require('axios');
function reducer(state, action) {

    if (action.type === 'acaoX') {
        return { value: action.value };
    }

    return state;
}

function* searchData(action) {
    //console.log('HelloWorld');
    //const channel = yield actionChannel('acaoY');
    //console.log(channel);
    // while (true) {
        //const action = yield take(channel);
        const search = action.value;
        const {data} = yield call(axios.get,'http://nginx/api/videos?search=' + search)
        //console.log(data);
        const value = 'novo valor' + Math.random();
        console.log(data);
        const result = yield put({
            type: 'acaoX',
            value: data
        });
        //console.log(result);
    //}

}

function* debounceSearch(){
    yield debounce(1000,'acaoY',searchData)
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer,
    applyMiddleware(sagaMiddleware));

sagaMiddleware.run(debounceSearch);

const action = (type, value) => store.dispatch({ type, value });

 action('acaoY', 'D');
 action('acaoY', 'e');
 action('acaoY', 'i');
 action('acaoY', 'v');
 action('acaoY', 'i');
 action('acaoY', 'D');


console.log(store.getState());