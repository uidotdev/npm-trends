import { toast, ToastPosition } from 'react-toastify';

const config = {
  position: 'top-right' as ToastPosition,
  autoClose: 8000,
  closeOnClick: true,
  pauseOnHover: true,
};

class ToastService {
  static success(msg, configOverrides = {}) {
    config.autoClose = 2500;
    toast.success(msg, { ...config, ...configOverrides });
  }

  static error(msg, configOverrides = {}) {
    toast.error(msg, { ...config, ...configOverrides });
  }

  static warn(msg, configOverrides = {}) {
    toast.warn(msg, { ...config, ...configOverrides });
  }

  static info(msg, configOverrides = {}) {
    toast.info(msg, { ...config, ...configOverrides });
  }

  static default(msg, configOverrides = {}) {
    toast(msg, { ...config, ...configOverrides });
  }
}

export default ToastService;
