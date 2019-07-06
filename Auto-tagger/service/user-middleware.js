module.exports = function(req,res,next){
    if (req.session.loggedin) {next()}
        
    else {
            res.send('Please login to view this page!');
        }
}
