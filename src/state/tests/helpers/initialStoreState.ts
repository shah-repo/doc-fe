import { createStore } from "redux";
import rootReducer, { ApplicationState } from "../../reducers";

const initialStoreState: ApplicationState = createStore(rootReducer).getState();

export default initialStoreState;
