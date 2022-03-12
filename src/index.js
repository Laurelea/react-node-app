import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { applyMiddleware, createStore, compose } from "redux";
import rootReducer from "./store/rootReducer";
import { Provider } from 'react-redux';
import ThunkMiddleware from 'redux-thunk';
import { getMyBase, getCats } from "./partials/allBase";

//промежуточная функция
const sampleMiddleWare = store => next => action => {
    return next(action);
    // return result
}

const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsDenylist, actionsCreators, serialize...
        })
        : compose;

// applyMiddleware - применение некой промежуточной функции/ Функция будет вызываться каждый раз, когда срабатывает триггер из rootReducer

const initialBase = async () => {
    await getMyBase()
        .then(async (baseResponse) => {
            console.log('30 index: ', baseResponse);
            const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sampleMiddleWare, ThunkMiddleware)));
            store.dispatch({
                type: 'GETBASE',
                payload: {
                    base: baseResponse
                }
            });
            await getCats()
                .then(catResponse => {
                    console.log('40 index: ', catResponse);
                    store.dispatch({
                        type: 'GETCATS',
                        payload: {
                            cats: catResponse
                        }
                    });
                    return store
                })
            return store
        })
        .then(store => {
            ReactDOM.render(
                <React.StrictMode>
                    <BrowserRouter>
                        <Provider store={store}>
                            <App />
                        </Provider>
                    </BrowserRouter>
                </React.StrictMode>,
                document.getElementById('root')
            );
        })
}

initialBase()

// export const updateBase = () => async(dispatch: Dispatch) => {
//     await getMyBase()
//         .then(response => {
//             console.log('updateBase: ', response);
//             dispatch(({
//                 type: GETBASE,
//                 payload: {
//                     base: response
//                 }
//             }));
//         })
// }


reportWebVitals();
