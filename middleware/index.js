const middleware = {};

middleware.isLoggedOut = function(req, res, next) {
        if (!req.isAuthenticated()) {
          return next();
        }
        res.redirect("/");
      }
      
middleware.isLoggedIn = function(req, res, next) {
        if (req.isAuthenticated()) {
          return next();
        }
        res.redirect("/login");
      }


module.exports = middleware;