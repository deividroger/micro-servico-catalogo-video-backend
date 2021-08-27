const {createStore, applyMiddleware } = require('redux')

function reducer(state,action){
    return {value: action.value};
}

const customMiddleware = store => next => action => {
    console.log('Hello World');
    next(action);
    console.log('Deivid');
};

const store = createStore(
    reducer,
    applyMiddleware(customMiddleware)
);

const action = (type,value) => store.dispatch({type,value});

action('acao','a');

console.log(store.getState());