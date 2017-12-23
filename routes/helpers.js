module.exports = {

    needsGroup: function(group) {
        return function(req, res, next) {
            if (req.user && req.user.group === group) {
                //console.log('Your role is ' + req.user.group);
                next();
            } else {
                //console.log('Your role is ' + req.user.group);
                res.status(401).render('error', {
                    'message': "Unauthorized, please contact an administrator for more information"
                });
            }
        };
    }
}