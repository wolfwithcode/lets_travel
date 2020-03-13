exports.homePage = (req, res) => {
    res.render('index', {title: 'Lets travel'});
}

exports.listAllHotels = (req, res) => {
    res.render('all_hotels',{ title: 'All Hotels'});
}