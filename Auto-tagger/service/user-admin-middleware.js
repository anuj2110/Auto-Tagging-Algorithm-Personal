module.exports = function(req,res,next){
    if (req.session.loggedin) {
        if(req.session.user.role=='admin'){console.log("Inside admin");return res.redirect('/admin')}
        else{console.log("Inside user");return res.redirect('/user')}
        } else {
            res.redirect('/login');
        }
}