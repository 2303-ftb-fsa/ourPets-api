// This function checks to see if a parent is on the request.

const requireUser = (req, res, next) => {
  if (!req.parent) {
    next({
      name: 'NotAuthorizedError',
      message: 'Not Authorized',
      status: 403,
    });
  } else {
    next();
  }
};

module.exports = {
  requireUser,
};
