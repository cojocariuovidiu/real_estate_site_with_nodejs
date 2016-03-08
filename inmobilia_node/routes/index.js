var express = require('express');
var router = express.Router();
var accountModule = require('./../modules/account-module.js');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index');
    //res.render('home', { title: 'Express' });
 /*   if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
	}	else{
		res.redirect('/properties');
// attempt automatic login //
		/*accountModule.autoLogin(req.cookies.user, req.cookies.pass, function(o){
			if (o != null){
			    req.session.user = o;
				res.redirect('/properties');
			}	else{
				res.render('login', { title: 'Hello - Please Login To Your Account' });
			}
		});*/
	//}
	
});

router.post('/', function(req, res){
	accountModule.manualLogin(req.param('user'), req.param('pass'), function(e, o){
		if (!o){
			res.send(e, 400);
		}	else{
		    req.session.user = o;
			if (req.param('remember-me') == 'true'){
				res.cookie('user', o.user, { maxAge: 900000 });
				res.cookie('pass', o.pass, { maxAge: 900000 });
			}
			res.send(o, 200);
		}
	});
});
	
router.get('/home', function(req, res) {
	    if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }   else{
			res.render('home', {
				title : 'Control Panel',
				udata : req.session.user
			});
	    }
	});





module.exports = router;