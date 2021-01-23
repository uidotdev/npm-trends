import { toast } from 'react-toastify';

const config = {
  position: 'top-right',
  autoClose: false,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
};

class ToastService {
  static success(msg, configOverrides = {}) {
    config.autoClose = 2500;
    toast.success(msg, { config, ...configOverrides });
  }

  static error(msg, configOverrides = {}) {
    config.autoClose = false;
    toast.error(msg, { config, ...configOverrides });
  }

  static warn(msg, configOverrides = {}) {
    config.autoClose = false;
    toast.warn(msg, { config, ...configOverrides });
  }

  static info(msg, configOverrides = {}) {
    config.autoClose = false;
    toast.info(msg, { config, ...configOverrides });
  }

  static default(msg, configOverrides = {}) {
    config.autoClose = false;
    toast(msg, { config, ...configOverrides });
  }
}

export default ToastService;
