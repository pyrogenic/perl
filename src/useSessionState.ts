import useStorageState from "./useStorageState";

const useSessionState = useStorageState.bind(null, window.sessionStorage);
export default useSessionState;
