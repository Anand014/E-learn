const middlewareObj = {};

middlewareObj.isLoggedOut = function(req, res, next) {
        if (!req.isAuthenticated()) {
          return next();
        }
        res.redirect("/");
      }
      
middlewareObj.isLoggedIn = function(req, res, next) {
        if (req.isAuthenticated()) {
          return next();
        }
        res.redirect("/login");
      }


module.exports = middlewareObj;