exports.homePage = (req, res) => {
    res.render('index', {title: 'Lets travel'});
}

exports.listAllHotels = (req, res) => {
    res.render('all_hotels',{ title: 'All Hotels'});
    // res.render('index', {title: 'Lets travel'});
}

exports.signUp = (req, res, next) => {
    //validate user info
    console.log('sign up middleware')
    // next();
}

exports.logIn = (req, res) => {
    //login
    console.log('log in middleware')
}

// exports.listAllHotels = function(req,res){
//     res.render('all_hotels',{ title: 'All Hotels'});
//   };