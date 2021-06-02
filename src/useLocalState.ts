import useStorageState from "./useStorageState";

const useLocalState = useStorageState.bind(null, window.localStorage);
export default useLocalState;
