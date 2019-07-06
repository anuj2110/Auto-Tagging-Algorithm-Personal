module.exports = function(req,res,next){
    if (req.session.loggedin) {
        if(req.session.user.role=='admin'){res.render('./admin/home')}
        else{res.render('./user/home_user')}
        } else {
            res.send('Please login to view this page!');
        }
}