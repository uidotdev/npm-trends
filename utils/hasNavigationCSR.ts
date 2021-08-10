// https://github.com/vercel/next.js/issues/13910#issuecomment-819524764

/**
 * Do not SSR the page when navigating.
 * Has to be added right before the final getServerSideProps function
 */
export const hasNavigationCSR = (next) => async (ctx) => {
  if (ctx.req.url?.startsWith('/_next')) {
    return {
      props: {},
    };
  }
  return next?.(ctx);
};
