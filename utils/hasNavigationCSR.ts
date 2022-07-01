// https://github.com/vercel/next.js/issues/13910#issuecomment-819524764

/**
 * Do not SSR the page when navigating.
 * Has to be added right before the final getServerSideProps function
 */
export const hasNavigationCSR = (next) => async (ctx) => {
  const dataForClientSideRender = {
    props: {},
  };

  if (ctx.req.url?.includes('/_next')) {
    ctx.res.removeHeader('Cache-Control');
    return dataForClientSideRender;
  }

  const callback = async () => {
    try {
      const result = await next?.(ctx);
      return result;
    } catch {
      ctx.res.removeHeader('Cache-Control');
      return dataForClientSideRender;
    }
  };

  return callback();
};
