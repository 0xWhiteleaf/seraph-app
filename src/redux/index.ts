import { appReducer } from "@src/redux/modules"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { applyMiddleware, combineReducers, compose, createStore } from "redux"
import thunk, { ThunkDispatch, ThunkMiddleware } from "redux-thunk"
import { AppAction } from "./modules/app/types"

const rootReducer = combineReducers({
  app: appReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type RootAction = AppAction

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk as ThunkMiddleware<RootState, RootAction>)))

export type RootDispatch = ThunkDispatch<RootState, undefined, RootAction>

const useRootSelector: TypedUseSelectorHook<RootState> = useSelector
const useRootDispatch = () => useDispatch<RootDispatch>()

export { store, useRootSelector, useRootDispatch }

