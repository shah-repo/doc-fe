import { ReactNode } from 'react';
import { Slide, toast as toastify, ToastOptions } from 'react-toastify';
import './styles.css';

enum ToastType {
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
  Success = 'success',
  Default = '',
}

const TOAST_OPTIONS: ToastOptions = {
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: Slide,
  closeButton: true,
};

const toast = (type: ToastType, message: string | ReactNode, options: ToastOptions = {}) =>
  toastify[type](
    message,
    {
      ...TOAST_OPTIONS,
      ...options,
    },
  );

export const toastError = (message: string | ReactNode, options: ToastOptions = {}) =>
  toast(ToastType.Error, message, options);

export const toastInfo = (message: string | ReactNode, options: ToastOptions = {}) =>
  toast(ToastType.Info, message, options);

export const toastSuccess = (message: string | ReactNode, options: ToastOptions = {}) =>
  toast(ToastType.Success, message, options);

