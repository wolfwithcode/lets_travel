const Hotel = require('../models/hotel');


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

exports.adminPage = (req, res) => {
    res.render('admin', {title: 'Admin'});
}

exports.createHotelGet = (req, res) => {
    res.render('add_hotel', {title: 'Add new hotel'});
}

exports.createHotelPost = async (req, res, next) => {
    // res.json(req.body);
    try{
        const hotel = new Hotel(req.body);
        await hotel.save();
        res.redirect(`/all/${hotel._id}`);
    }catch(error){
        next(error);
    }
        // const hotel = new Hotel(req.body);
        // await hotel.save();

}