/* eslint-disable @typescript-eslint/no-explicit-any */
import "@tanstack/react-query";
import { AxiosError } from "axios";
import { ResponseModel } from "./response.type";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError<ResponseModel<any>>;
  }
}
