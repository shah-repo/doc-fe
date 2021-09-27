import { Slide, toast as taostify, ToastOptions } from "react-toastify";

enum ToastType {
  Error = "error",
  Info = "info",
  Warning = "warning",
  Success = "success",
  Default = "",
}

const TOAST_OPTIONS: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: Slide,
};

const toast = (type: ToastType, message: string, options: ToastOptions = {}) =>
  taostify[type](
    message,
    {
      ...TOAST_OPTIONS,
      ...options,
    },
  );

export const toastError = (message: string, options: ToastOptions = {}) =>
  toast(ToastType.Error, message, options);

export const toastInfo = (message: string, options: ToastOptions = {}) =>
  toast(ToastType.Info, message, options);

export const toastSuccess = (message: string, options: ToastOptions = {}) =>
  toast(ToastType.Success, message, options);
