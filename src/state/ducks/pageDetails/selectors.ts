import { ApplicationState } from "../../reducers";

const byCategory = (state: ApplicationState) => state.pageDetails.byCategory;

export default { byCategory };
