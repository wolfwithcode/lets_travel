const Hotel = require('../models/hotel');


// exports.homePage = (req, res) => {
//     res.render('index', {title: 'Lets travel'});
// }

exports.listAllHotels = async (req, res, next) => {
    try {
        const allHotels = await Hotel.find({ available: { $eq: true}});
        res.render('all_hotels',{ title: 'All Hotels', allHotels});
    }catch(errors){
        next(errors);
    }
    
}

exports.listAllCountries = async (req, res, next) => {
    try {
        // const allCountries = await Hotel.find({ available: { $eq: true}});
        const allCountries = await Hotel.distinct('country');
        res.render('all_countries',{ title: 'Browse by country', allCountries});
        // res.render('all_countries',{ title: 'All Hotels'});
    }catch(errors){
        next(errors);
    }
    
}


exports.homePageFilters = async (req, res, next) => {
    try{
        const hotels = await Hotel.aggregate([
            {$match: {available: true}},
            {$sample: {size: 9}}
        ]);
        const countries = await Hotel.aggregate([
            {$group: {_id: '$country'}},
            {$sample: {size: 9}}
        ]);
        res.render('index', {countries, hotels});
    }catch(error){
        next(error);
    }
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

exports.editRemoveGet = (req, res) => {
    res.render('edit_remove', {title: 'Search for hotel to edit or remove'});
}

exports.editRemovePost = async (req, res, next) => {
    try{
        const hotelId = req.body.hotel_id || null;
        const hotelName = req.body.hotel_name || null;
        const hotelData = await Hotel.find({ $or: [
            { _id: hotelId },
            {hotel_name: hotelName}
        ]}).collation({
            locale: 'en',
            strength: 2
        });

        if(hotelData.length > 0){
            // res.json(hotelData);
            res.render('hotel_detail', {title: 'Add / Remove Hotel', hotelData});
            return
        }else{
            res.redirect('/admin/edit-remove');
        }

    }catch(errors){
        next(errors);
    }
}

exports.updateHotelGet = async (req, res, next) => {
    try{
        const hotel = await Hotel.findOne({ _id: req.params.hotelId});
        // res.json(hotel);
        res.render('add_hotel', {title: 'Update hotel', hotel });
    }catch(error){
        next(error);
    }
}

exports.updateHotelPost = async (req, res, next) => {
    try{
        const hotelId = req.params.hotelId;
        const hotel = await Hotel.findByIdAndUpdate(hotelId, req.body, {new:true});
        // res.json(hotel);
        // res.render('add_hotel', {title: 'Update hotel', hotel });
        res.redirect(`/all/${hotelId}`);
    }catch(error){
        next(error);
    }
}

exports.deleteHotelGet = async (req, res, next) => {
    try{
        const hotelId = req.params.hotelId;
        const hotel = await Hotel.findOne({ _id: hotelId});
        // res.json(hotel);
        res.render('add_hotel', {title: 'Delete hotel', hotel });
    }catch(error){
        next(error);
    }
}

exports.deleteHotelPost = async (req, res, next) => {
    try{
        const hotelId = req.params.hotelId;
        const hotel = await Hotel.findByIdAndRemove({ _id: hotelId});
        // res.json(hotel);
        // res.render('add_hotel', {title: 'Delete hotel', hotel });
        res.redirect('/');
    }catch(error){
        next(error);
    }
}

exports.hotelDetail = async (req, res, next) => {
    try{
        const hotelParam = req.params.hotel;
        const hotelData = await Hotel.find({ _id: hotelParam});
        // res.json(hotel);
        res.render('hotel_detail', {title: 'Lets Travel', hotelData });
    }catch(error){
        next(error);
    }
}