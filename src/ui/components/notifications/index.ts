import { Slide, ToastOptions } from "react-toastify";
import "./styles.css";

enum ToastType {
  Error = "error",
  Info = "info",
  Warning = "warning",
  Success = "success",
  Default = "",
}

const TOAST_OPTIONS: ToastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: Slide,
};

const toast = (type: ToastType, message: string | React.ReactNode, options: ToastOptions = {}) =>
  taostify[type](
    message,
    {
      ...TOAST_OPTIONS,
      ...options,
    },
  );

export const toastError = (message: string | React.ReactNode, options: ToastOptions = {}) =>
  toast(ToastType.Error, message, options);

export const toastInfo = (message: string | React.ReactNode, options: ToastOptions = {}) =>
  toast(ToastType.Info, message, options);

export const toastSuccess = (message: string | React.ReactNode, options: ToastOptions = {}) =>
  toast(ToastType.Success, message, options);

