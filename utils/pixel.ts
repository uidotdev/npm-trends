export const FB_PIXEL_ID = 2053669628174140;

export const pageview = () => {
  globalThis.fbq('track', 'PageView');
};

export const event = (name, options = {}) => {
  globalThis.fbq('track', name, options);
};
