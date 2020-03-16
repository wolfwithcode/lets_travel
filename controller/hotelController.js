const Hotel = require('../models/hotel');
const cloudinary = require('cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


// // Set The Storage Engine
// const storage = multer.diskStorage({
//     destination: 'public/images/hotels',
//     filename: function(req, file, cb){
//       cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
//   });
  
// // Init Upload
// const upload = multer({
// storage: storage,
// limits:{fileSize: 1000000},
// fileFilter: function(req, file, cb){
//     checkFileType(file, cb);
// }
// }).single('image');


// const storage = multer.diskStorage({});
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
const upload = multer({ storage });
// const upload = multer({ dest: 'public/images/hotels' });

exports.upload = upload.single('image');

exports.pushToCloudinary = (req, res, next) => {
    console.log('Upload to Cloundinary ');
    console.log(req.file);
    if(req.file){
        console.log('Upload to Cloundinary '+req.file);
        cloudinary.uploader.upload(req.file.path)
        // cloudinary.uploader.upload('public/images/countries/greece.jpg')
        .then((result) => {
            console.log('Upload successfull with ' + req.file.path);
            // console.log('Upload successfull with ' + 'public/images/countries/greece.jpg');
            req.body.image = result.public_id;
            next();
        })
        .catch( () => {
            res.redirect('/admin/add');
        });
    } else {
        next();
    }
};
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
        console.log('process.env.USER ' + process.env.USER);
        console.log('process.env.DB ' + process.env.DB);

        const hotels = await Hotel.aggregate([
            {$match: {available: true}},
            {$sample: {size: 9}}
        ]);

        const countries = await Hotel.aggregate([
            {$group: {_id: '$country'}},
            {$sample: {size: 9}}
        ]);

        const [filteredCountries, filteredHotels] = await Promise.all([countries, hotels]);

        // const food = ['cheese', 'fish', 'rice'];
        // const [a,b,c] = food;
        // res.send(a);

        // res.render('index', {countries, hotels});
        res.render('index', { filteredCountries, filteredHotels });

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
        res.render('hotel_detail', {
            title: 'Lets Travel', 
            hotelData,
            name: 'Chris'
         });
    }catch(error){
        next(error);
    }
}

exports.hotelsByCountry = async (req, res, next) => {
    try{
        const countryParam = req.params.country;
        const countryList = await Hotel.find({ country: countryParam});
        // res.json(countryList);       
        res.render('hotels_by_country', {title: `Browse by country: ${countryParam}`, countryList });
    }catch(error){
        next(error);
    }
}

exports.searchResults = async(req, res, next) => {
    console.log("testtt");
    try{
        const searchQuery = req.body;
        const searchData = await Hotel.aggregate([
            {$match: { $text: {$search: `\"${searchQuery.destination}\"` } } },
            {$match: {available: true}}
        ]);
        res.json(searchData);
    }catch(error){
        next(error);
    }
};