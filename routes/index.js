var express = require('express');
var router = express.Router();
// require controllers:
const hotelController = require('../controller/hotelController')
const userController = require('../controller/userController')
/* GET home page. */
// router.get('/', function(req, res){
//         if(req.session.page_views){
//                 req.session.page_views++;
//                 res.send(`Number of page visits: ${req.session.page_views}`);
//         } else {
//                 req.session.page_views = 1;
//                 res.send('First visit');
//         }
// });
router.get('/', hotelController.homePageFilters)

// router.get('/all', function(req,res){
//   res.render('all_hotels',{ title: 'All Hotels'});
// });

// router.get('all', hotelController.listAllHotels) => mistake missing /
router.get('/all', hotelController.listAllHotels);
router.get('/all/:hotel', hotelController.hotelDetail);
router.get('/countries', hotelController.listAllCountries);
router.get('/countries/:country', hotelController.hotelsByCountry);
router.post('/results', hotelController.searchResults);
// router.get('/all/:name', function(req,res){
//   const name = req.params.name;
//   res.render('all_hotels',{ title: 'All Hotels', name});
// });
// router.get('/sign-up', hotelController.signUp, hotelController.logIn)
// router.get('/sign-up', hotelController.signUp)
// router.get('/log-in', hotelController.logIn);


// ADMIN Routes:
router.get('/admin', userController.isAdmin ,hotelController.adminPage);
router.get('/admin/*', userController.isAdmin);
router.get('/admin/add', hotelController.createHotelGet);
router.post('/admin/add', 
        hotelController.upload,
        hotelController.pushToCloudinary,
        hotelController.createHotelPost);
router.get('/admin/edit-remove', hotelController.editRemoveGet);
router.post('/admin/edit-remove', hotelController.editRemovePost);
router.get('/admin/:hotelId/update',hotelController.updateHotelGet);
router.post('/admin/:hotelId/update',hotelController.updateHotelPost);
router.get('/admin/:hotelId/delete',hotelController.deleteHotelGet);
router.post('/admin/:hotelId/delete',hotelController.deleteHotelPost);


// USER ROUTES
// ===============
router.get('/sign-up', userController.signUpGet);
router.post('/sign-up', 
        userController.signUpPost,
        userController.loginPost
        );
router.get('/login', userController.loginGet);
router.post('/login', userController.loginPost);
router.get('/logout', userController.logout);

module.exports = router;
