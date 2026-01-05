import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

export const useAuth = () => {
  return useSelector((state: RootState) => state.auth.user);
};
