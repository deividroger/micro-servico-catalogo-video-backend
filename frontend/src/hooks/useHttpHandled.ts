import { useSnackbar } from "notistack";
import axios from "axios";

const useHttpHandled = () => {
  const snackbar = useSnackbar();
  return async (request: Promise<any>) => {
    try {
      const { data } = await request;
      return data;
    } catch (error) {
      
      if (!axios.isCancel(error)) {
        snackbar.enqueueSnackbar("Não foi possível carregar as infomações", {
          variant: "error",
        });
      }
      throw error;
    }
  };
};
export default useHttpHandled;
