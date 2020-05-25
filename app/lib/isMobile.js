const mobileRE = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;

// function for testing if the request is sent from a mobile browser by checking the user-agent header
export default function isMobile(opts) {
  if (!opts) {
    opts = {};
  }

  let ua = opts.ua;
  if (!ua && typeof navigator !== 'undefined') {
    // navigator is an obj used on client side to determine browser size
    ua = navigator.userAgent;
  }

  if (
    !ua &&
    opts.req &&
    opts.req.headers &&
    typeof opts.req.headers['user-agent'] === 'string'
  ) {
    ua = opts.req.headers['user-agent'];
  }

  if (typeof ua !== 'string') {
    return false;
  }

  return mobileRE.test(ua);
}
