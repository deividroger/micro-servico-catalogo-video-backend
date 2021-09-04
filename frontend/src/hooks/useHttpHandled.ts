import { useSnackbar } from "notistack";
import axios from "axios";
import { useCallback } from "react";

const useHttpHandled = () => {
  const {enqueueSnackbar} = useSnackbar();

  return useCallback(async (request: Promise<any>) => {
    try {
      const { data } = await request;
      return data;
    } catch (error) {
      
      if (!axios.isCancel(error)) {
        enqueueSnackbar("Não foi possível carregar as infomações", {
          variant: "error",
        });
      }
      throw error;
    }
  },[enqueueSnackbar]);

  
};
export default useHttpHandled;