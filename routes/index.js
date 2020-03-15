var express = require('express');
var router = express.Router();
// require controllers:
const hotelController = require('../controller/hotelController')
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
//   // res.send('hello again');
// });

// router.get('/', hotelController.homePage)
router.get('/', hotelController.homePageFilters)

// router.get('/all', function(req,res){
//   res.render('all_hotels',{ title: 'All Hotels'});
// });

// router.get('all', hotelController.listAllHotels) => mistake missing /
router.get('/all', hotelController.listAllHotels);
router.get('/all/:hotel', hotelController.hotelDetail);
router.get('/countries', hotelController.listAllCountries);
router.get('/countries/:country', hotelController.hotelsByCountry);
// router.get('/all/:name', function(req,res){
//   const name = req.params.name;
//   res.render('all_hotels',{ title: 'All Hotels', name});
// });
router.get('/sign-up', hotelController.signUp, hotelController.logIn)
router.get('log-in', hotelController.logIn);


// ADMIN Routes:
router.get('/admin', hotelController.adminPage);
router.get('/admin/add', hotelController.createHotelGet);
router.post('/admin/add', hotelController.createHotelPost);
router.get('/admin/edit-remove', hotelController.editRemoveGet);
router.post('/admin/edit-remove', hotelController.editRemovePost);
router.get('/admin/:hotelId/update',hotelController.updateHotelGet);
router.post('/admin/:hotelId/update',hotelController.updateHotelPost);
router.get('/admin/:hotelId/delete',hotelController.deleteHotelGet);
router.post('/admin/:hotelId/delete',hotelController.deleteHotelPost);
module.exports = router;
