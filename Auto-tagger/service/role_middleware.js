module.exports = function(req,res,next){
    if (req.session.loggedin) {
        if(req.session.user.role=='admin'){next();}
        else{res.send('You are not authorised Personnel')}
        } else {
            res.send('Please login to view this page!');
        }
}