const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const fs = require('fs');
const url = require('url');
const morgan = require('morgan');
const winston = require('./config/winston');
//const mongoose         = require('mongoose');
//const mongooseSchema   = require('./mongooseSchema');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const debug = require('debug')('app');
const chalk = require('chalk');
const Kayxlav = require('./kayxlav');
const path = require('path');
const settings = require('./config/settings').settings;
var hostName = settings.serverHostName;
var portNumber = settings.serverPortNumber;
var mongoHostName = settings.mongoHostName;
var mongoPortNumber = settings.mongoPortNumber;
var refreshStructure = settings.refreshStructure;
var mongoCollection = settings.mongoCollectionName;
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
var mongoURL = 'mongodb://' + mongoHostName + ':' + mongoPortNumber;
// Database Name
var mDB = settings.mongoCollection;
//mongoose.connect('mongodb://' + hostName + '/' + collection);
//var staticFile       = nodeStatic.Server(__dirname);
var header = readHTMLFile('header.html');
var topSection = readHTMLFile('topsection.html');
var midSection = readHTMLFile('midsection.html');
var bottomSection = readHTMLFile('bottomsection.html');
var background = readHTMLFile('background.html');
var compValues = readHTMLFile('compvalues.html');
var slider = readHTMLFile('slider.html');
var footer = readHTMLFile('footer.html');
var dashboard = readHTMLFile('dashboard.ejs');
var pages = [];
var subPages = [];
var pageSections = [];
var isFirtstRun = true;
//var adminSubFooter     = readHTMLFile('subfooter.html');
///var login              = readHTMLFile('login.html');
//var error              = readHTMLFile('error.html');
//var visions      = readHTMLFile('vision.html');
//var genInfo      = readHTMLFile('general_information.html');
//var mission      = readHTMLFile('mission.html');
//var values       = readHTMLFile('values.html');

var sessionInfo = {};
var runDBInitialization = true;
if (isFirtstRun && cluster.isMaster) {
    isFirtstRun = false;
    checkCollections(runDBInitialization);
} else {
    startProcesses();

}
//var kayXlavPages = new Kayxlav.Page().getObjectName();
function checkCollections(runDBInit) {
    debug('runDBInitialization: ' + runDBInit);
    if (runDBInit) {
        runDBInitialization = false;
        runDBInit = false;
        runMongoDBInitialization();
    }
    //  callback();
}

function startProcesses() {
    if (cluster.isMaster) {
        console.log(`Master ${process.pid} is running`);
        (async function checkInit() {
            testMongoConnection();
        }(initWorkers()));
    } else {

        hostName = "localhost";
        portNumber = 8000;
        startExpressHttpServer(hostName, portNumber);
        console.log(`Worker ${process.pid} started`);

    }
}

function initWorkers() {
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} terminated`);
    });

}

var session = function(request, response, next) {
    request.sessionInfo = sessionInfo;
    next();
}



function startExpressHttpServer(hostname, port) {
    var express = require('express');
    var path = require('path');
    var app = express();
    require('./config/passport')(app);

    app.use(morgan('combined', { stream: winston.stream }));
    app.use((req, res, next) => {
        const test = /\?[^]*\//.test(req.url);
        if ((req.url.substr(-1) === '/' || req.url.substr(-1) === '#') && req.url.length > 1 && !test)
            res.redirect(301, req.url.slice(0, -1));
        else
            next();
    });
    app.set('views', __dirname);
    app.set('view engine', 'ejs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    //app.use(express.favicon());
    //app.use(express.logger('dev'));
    app.use(express.urlencoded({ extended: true }));
    //app.use(express.methodOverride());
    // app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    // app.use(express.errorHandler());

    app.set('port', process.env.OPENSHIFT_NODEJS_PORT || port);
    app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || hostname);
    //app.use(express.static(__dirname + '/public'));
    //app.use('/js', express.static(__dirname + '/js'));
    //app.use('/assets', express.static(__dirname + '/assets'));
    //app.use('/css', express.static(__dirname + '/css'));
    //app.use('/images', express.static(__dirname + '/images'));
    //app.use('/fonts', express.static(__dirname + '/fonts'));
    app.set('views', __dirname);
    app.engine('html', require('ejs').renderFile);

    //var favicon = require('serve-favicon');
    //app.use(favicon(__dirname + '/public/images/favicon.ico'));

    app.get('/', function(request, response) {

        response.send(renderHMTLPage("home"));

    });
    app.get('/home', function(request, response) {

        response.send(renderHMTLPage("home"));

    });

    app.get('/aboutus', function(request, response) {
        response.send(renderHMTLPage("aboutus"));
        // response.render('index',request.sessionInfo);
    });

    app.get('/background', function(request, response) {
        response.send(renderHMTLPage("background"));
        // response.render('index',request.sessionInfo);
    });
    app.get('/compvalues', function(request, response) {
        response.send(renderHMTLPage("compvalues"));
        // response.render('index',request.sessionInfo);
    });
    app.get('/geninfo', function(request, response) {
        response.send(renderHMTLPage("geninfo"));
        // response.render('index',request.sessionInfo);
    });
    app.get('/login', function(request, response) {
        //response.send(login);
        //  response.render('login',request.sessionInfo);
        response.sendFile(path.join(__dirname + '/login.html'));
    });
    app.get('/dashboard', function(request, response) {
        //response.send(login);
        //  response.render('login',request.sessionInfo);
        response.sendFile(path.join(__dirname + '/dashboard.ejs'));
    });

    app.get('/blank', function(request, response) {
        //response.send(login);
        //  response.render('login',request.sessionInfo);
        drawSideBar('', function(sidebar) {
            var page = dashboard.toString()
                .replaceAll('<%=siteName1%>', 'KayxlavComs')
                .replaceAll('<%=siteName%>', 'Kayxlav Communications')
                .replaceAll('<%=logo%>', '/images/kayxlav_medium.jpg')
                .replaceAll('<%=favincon%>', '/images/icons/favicon.ico')
                .replaceAll('<%=mainPage%>', 'Dashboard')
                .replaceAll('<%=subPage%>', 'Updates')
                .replaceAll('<%=currentPage%>', 'Requests')
                .replaceAll('<%=sidebar%>', sidebar);
            response.send(page);


        });

    });
    app.all('/kayxlav', function(request, response) {
        // debug(request);
        // debug(response);

        var options = request.body;
        debug(options);
        //  var database   = options.d ? options.d : mDb;
        var collection = options.c ? options.d : "kayxlavcoms";
        var collection = options.c ? options.c : "";
        var srcOptions = options.f ? options.f : "";
        var type = options.t ? options.t : "";


        debug(JSON.stringify(options));
        if (type === "table") {
            getDataFromServer(collection, srcOptions, function(data) {
                var tabData = data;
                var dataCount = data.length;
                var columns = dataCount > 0 ? Object.getOwnPropertyNames(data[0]) : [];
                var resData = JSON.stringify({ columns, tabData, dataCount });
                response.send(resData);

            });
        } else if (type === "form") {

            getDataFromServer(collection, srcOptions, function(data) {
                var tabData = data;
                var dataCount = data.length;
                var columns = dataCount > 0 ? Object.getOwnPropertyNames(data[0]) : [];
                var resData = JSON.stringify({ columns, tabData, dataCount });
                response.send(resData);

            });

        } else {

            var itemIDName = '';
            if (options.data_item == 'page_section') {

                collection = 'PageSections';
                srcOptions = { 'sectionID': parseInt(options.sectionid_element) };
                //data = JSON.stringify(options);
                var pSection = new Kayxlav.PageSection();
                //  configSection.sectionID = 1;
                // pSection.sectionName = options.sectionname_element;
                // pSection.sectionText = options.sectiontext_element;
                //  configSection.creationDate = datePrevDaysfromNow(0);
                var data = { 'sectionName': options.sectionname_element, 'sectionText': options.sectiontext_element };
                updateMongoRecord(collection, srcOptions, data, function(err) {
                    if (err) {
                        debug(err);
                    } else {
                        var message = 'The record with ' + JSON.stringify(srcOptions) + ' of  ' + collection + '  has been updated successfully';
                        var isSuccessful = true;
                        var mode = 1;
                        var resData = JSON.stringify({ message, isSuccessful, collection, mode });
                        response.send(resData);
                        return;

                    }

                });
            }



        }
        //response.sendFile(path.join(__dirname + '/dashboard.ejs'));
    });

    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        // add this line to include winston logging
        winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        // render the error page
        res.status(err.status || 500);
        // res.render('error');
        res.sendFile(path.join(__dirname + '/error.html'));
    });
    http.createServer(app).listen(app.get('port'), function() {
        console.log(`Server running at http://${hostname}:${port}/`);

    });
}

function renderHMTLPage(page) {

    var pageClass = "";

    var indexPage = '<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head>' +
        '<title>KayXlav Communications</title>' +
        '<meta charset="utf-8" />' +
        '<meta name="viewport" content="width=device-width, initial-scale=1" />' +
        '<link rel="stylesheet" href="assets/css/bootstrap.min.css">' +
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">' +
        '<!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->' +
        '<link rel="stylesheet" href="assets/css/main.css" />' +
        '<!--[if lte IE 8]><link rel="stylesheet" href="assets/css/ie8.css" /><![endif]-->' +
        '<!--[if lte IE 9]><link rel="stylesheet" href="assets/css/ie9.css" /><![endif]-->' +
        '<!--    <link rel="stylesheet" href="css/demo2.css">' +
        '<link rel="stylesheet" href="css/demo3.css"> -->' +
        '<script src="js/jquery-1.11.1.min.js"></script>' +
        '<script src="assets/js/fontawesome-all.min.js"></script>';

    if (page == "home") {
        pageClass = "homepage";
        indexPage +=
            '<link rel="stylesheet" href="css/jquery.animateSlider.css">' +
            '<link rel="stylesheet" href="css/font-awesome.css">' +
            '<link rel="stylesheet" href="css/normalize.css">' +
            '<link rel="stylesheet" href="css/demo2.css">' +
            '<link rel="stylesheet" href="assets/css/responsiveslides.css" />';

    }
    var selectedPageClass = page + "_page_class";
    indexPage += '</head> <body class="' + pageClass + '"><div id="page-wrapper">';
    indexPage += ' <body class="' + pageClass + '"><div id="page-wrapper">';
    if (selectedPageClass === 'aboutus' || selectedPageClass === 'background' || selectedPageClass === 'compvalues' || selectedPageClass === 'geninfo') {

        indexPage += header.toString().replace("aboutus_page_class", "current_page_item");


    } else {

        indexPage += header.toString().replace(selectedPageClass, "current_page_item");

    }
    indexPage += slider;
    indexPage += ' <!-- Main Wrapper --><div id="main-wrapper" >';

    if (page == "home") {
        indexPage += topSection;
        indexPage += midSection;
        indexPage += bottomSection;
    } else if (page == "aboutus") {

        indexPage += background;

    } else if (page == "background") {

        indexPage += background;

    } else if (page == "compvalues") {

        indexPage += compValues;

    } else if (page == "geninfo") {

        indexPage += compValues;

    }
    indexPage += '</div>';
    indexPage += footer;
    indexPage += '</div>' +
        ' <script src="assets/js/popper.min.js"></script>' +
        '<script src="assets/js/bootstrap.min.js"></script>' +
        '<script src="assets/js/jquery.dropotron.min.js"></script>' +
        '<script src="assets/js/skel.min.js"></script>' +
        '<script src="assets/js/skel-viewport.min.js"></script>' +
        '<script src="assets/js/util.js"></script>' +
        '    <!--[if lte IE 8]><script src="assets/js/ie/respond.min.js"></script><![endif]-->' +
        '<script src="assets/js/main.js"></script>' +
        '<script src="assets/js/responsiveslides.min.js"> </script>' +
        '</body>' +
        '</html>';

    return indexPage;

}



function startHttpServer(hostname, port) {

    http.createServer(function(request, response) {

        var pathname = url.parse(request.url).pathname;
        console.log("Processing request for " + pathname);

        // Print the name of the file for which request is made.
        //  console.log("Request for " + pathname + " received.");

        // Read the requested file content from file system
        fs.readFile(pathname.substr(1), function(err, data) {
            if (err) {
                console.log(err);
                // HTTP Status: 404 : NOT FOUND
                // Content Type: text/plain
                response.writeHead(404, { 'Content-Type': 'text/html' });
            } else {
                //Page found	  
                // HTTP Status: 200 : OK
                // Content Type: text/plain
                response.writeHead(200, { 'Content-Type': 'text/html' });

                // Write the content of the file to response body
                response.write(data.toString());
            }
            // Send the response body 
            response.end();
        });
    }).listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`)
    });

}

function readHTMLFile(fileName) {

    return fs.readFileSync(fileName);

}


async function testMongoConnection() {

    // Use connect method to connect to the server


    await MongoClient.connect(mongoURL, function(err, client) {
        assert.equal(null, err);
        debug(chalk.green("Connected successfully to server"));
        const db = client.db(mDB);
        client.close();
    });

}

function checkCollection(collectionName, callback) {
    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(mongoURL);
            debug('Connected successfully to Mongo server');
            const db = client.db(mDB);
            let items = await db.listCollections().toArray();
            debug(items);
            for (var i = 0; i < items.length; i++) {
                debug('item name: ' + items[i].name);
                debug('collection name: ' + collectionName);
                if (items[i].name === collectionName) {
                    callback(true);
                    return;
                }
            }
            // if (items.length==0)
            callback(false);
            client.close();
        } catch (err) {
            debug(err.stack);
        }

    }());;
}

function reinitializeCollections(itemList, callback) {
    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(mongoURL);
            debug('Connected successfully to Mongo server');
            const db = client.db(mDB);

            let items = await db.listCollections().toArray();
            var names = new Array();
            if (items.length > 0) {
                for (var j = 0; j < items.length; j++) {
                    names[j] = items[j].name;
                }
                // debug(items);
                for (var i = 0; i < itemList.length; i++) {

                    for (var j = 0; j < items.length; j++) {
                        if (names.indexOf(itemList[i]) > -1) {
                            debug('Droping collection: ' + itemList[i]);
                            await removeCollection(itemList[i]);
                            break;
                        }
                    }
                }
            } else {
                debug("All collections dropped");

            }
            callback();
            if (itemList.length == 0) callback(false);
            client.close();
        } catch (err) {
            debug(err.stack);
        }
    }());;
}
async function removeCollection(collectionName) {

    let client;
    try {
        client = await MongoClient.connect(mongoURL);
        debug('Connected successfully to Mongo server');
        const db = client.db(mDB);
        const colly = client.db(mDB).collection(collectionName);

        await colly.drop(

            function(err, reply) {
                if (err) {
                    debug(err);
                } else {

                    debug(collectionName + ' has been successfully dropped');
                }

            }
        );
        // client.close();
    } catch (err) {
        debug(err.stack);
    }

    ;
}

function runMongoDBInitialization() {
    var list = ['PageSectionItems', 'Pages', 'PageSections'];
    if (true) reinitializeCollections(list, function() {

        var configSection = new Kayxlav.PageSection();
        configSection.sectionID = 1;
        configSection.sectionName = 'Configuration';
        configSection.sectionText = 'All configuration items';
        configSection.creationDate = datePrevDaysfromNow(0);

        var administration = new Kayxlav.PageSection();
        administration.sectionID = 2;
        administration.sectionName = 'Administration';
        administration.sectionText = 'Site Administration';
        administration.creationDate = datePrevDaysfromNow(0);

        var pageSections = [configSection, administration];
        var sectionCollection = new Kayxlav.PageSection().getObjectName();
        addDataToServer(sectionCollection, pageSections, function() {
            createIndexOnField(sectionCollection, 'sectionID', { unique: true }, function(field) {
                debug('Index on ' + field + ' successfully created');
            });
            createIndexOnField(sectionCollection, 'sectionName', { unique: true }, function(field) {
                debug('Index on ' + field + ' successfully created');
            });
            debug('Page Sections successfully configured.');

        });




        var pageSectionCategory = new Kayxlav.PageSectionItem();
        pageSectionCategory.categoryID = 1;
        pageSectionCategory.name = 'Page Sections';
        pageSectionCategory.pageSectionID = 1;
        pageSectionCategory.creationDate = datePrevDaysfromNow(0);
        pageSectionCategory.iconClass = 'glyphicon glyphicon-book';
        pageSectionCategory.class = 'ajax-link';
        pageSectionCategory.description = 'Representation of page sections on the admin interface';

        var pages = new Kayxlav.PageSectionItem();
        pages.categoryID = 2;
        pages.name = 'Pages';
        pages.pageSectionID = 1;
        pages.creationDate = datePrevDaysfromNow(0);
        pages.iconClass = 'glyphicon glyphicon-file';
        pages.class = 'ajax-link';
        pages.description = 'Representation of pages on the admin interface';

        var banners = new Kayxlav.PageSectionItem();
        banners.categoryID = 3;
        banners.name = 'Banners';
        banners.pageSectionID = 1;
        banners.creationDate = datePrevDaysfromNow(0);
        banners.iconClass = 'glyphicon glyphicon-flag';
        banners.class = 'ajax-link';
        banners.description = 'Banners on home page';

        var togglers = new Kayxlav.PageSectionItem();
        togglers.categoryID = 4;
        togglers.name = 'Togglers';
        togglers.pageSectionID = 1;
        togglers.creationDate = datePrevDaysfromNow(0);
        togglers.iconClass = 'glyphicon glyphicon-adjust';
        togglers.class = 'ajax-link';
        togglers.description = 'Home page section toggle buttons';

        var sliders = new Kayxlav.PageSectionItem();
        sliders.categoryID = 5;
        sliders.name = 'Sliders';
        sliders.pageSectionID = 1;
        sliders.iconClass = 'glyphicon glyphicon-film';
        sliders.class = 'ajax-link';
        sliders.creationDate = datePrevDaysfromNow(0);
        sliders.description = 'Sliders used in top section of home page';

        var posts = new Kayxlav.PageSectionItem();
        posts.categoryID = 6;
        posts.name = 'Posts';
        posts.pageSectionID = 1;
        posts.creationDate = datePrevDaysfromNow(0);
        posts.iconClass = 'glyphicon glyphicon-envelope';
        posts.class = 'ajax-link';
        posts.description = 'Posts used in bottom section of home page';

        var galleryItem = new Kayxlav.PageSectionItem();
        galleryItem.categoryID = 7;
        galleryItem.name = 'Gallery Items';
        galleryItem.pageSectionID = 1;
        galleryItem.creationDate = datePrevDaysfromNow(0);
        galleryItem.iconClass = 'glyphicon glyphicon-picture';
        galleryItem.class = 'ajax-link';
        galleryItem.description = 'Gallery items';

        var fillers = new Kayxlav.PageSectionItem();
        fillers.categoryID = 8;
        fillers.name = 'Fillers';
        fillers.pageSectionID = 1;
        fillers.creationDate = datePrevDaysfromNow(0);
        fillers.iconClass = 'glyphicon glyphicon-glass';
        fillers.class = 'ajax-link';
        fillers.description = 'filler links at footers';

        var auditTrail = new Kayxlav.PageSectionItem();
        auditTrail.categoryID = 9;
        auditTrail.name = 'Audit Trail';
        auditTrail.pageSectionID = 1;
        auditTrail.creationDate = datePrevDaysfromNow(0);
        auditTrail.iconClass = 'glyphicon glyphicon-road';
        auditTrail.class = 'ajax-link';
        auditTrail.description = 'Audit Trail Entries';

        var users = new Kayxlav.PageSectionItem();
        users.categoryID = 10;
        users.name = 'Users';
        users.pageSectionID = 2;
        users.creationDate = datePrevDaysfromNow(0);
        users.iconClass = 'glyphicon glyphicon-user';
        users.class = 'ajax-link';
        users.description = 'KayxLav Users';

        var clients = new Kayxlav.PageSectionItem();
        clients.categoryID = 11;
        clients.name = 'Clients';
        clients.pageSectionID = 2;
        clients.creationDate = datePrevDaysfromNow(0);
        clients.iconClass = 'glyphicon glyphicon-heart';
        clients.class = 'ajax-link';
        clients.description = 'KayxLav Clients';

        var productItems = new Kayxlav.PageSectionItem();
        productItems.categoryID = 12;
        productItems.name = 'Products';
        productItems.pageSectionID = 2;
        productItems.creationDate = datePrevDaysfromNow(0);
        productItems.iconClass = 'glyphicon glyphicon-gift';
        productItems.class = 'ajax-link';
        productItems.description = 'KayxLav Products';

        var orders = new Kayxlav.PageSectionItem();
        orders.categoryID = 13;
        orders.name = 'Orders';
        orders.pageSectionID = 2;
        orders.creationDate = datePrevDaysfromNow(0);
        orders.iconClass = 'glyphicon glyphicon-briefcase';
        orders.class = 'ajax-link';
        orders.description = 'Client  Orders';

        var roles = new Kayxlav.PageSectionItem();
        roles.categoryID = 14;
        roles.name = 'Roles';
        roles.pageSectionID = 2;
        roles.creationDate = datePrevDaysfromNow(0);
        roles.iconClass = 'glyphicon glyphicon-cog';
        roles.class = 'ajax-link';
        roles.description = 'User roles';

        var invoices = new Kayxlav.PageSectionItem();
        invoices.categoryID = 15;
        invoices.name = 'Invoices';
        invoices.pageSectionID = 2;
        invoices.creationDate = datePrevDaysfromNow(0);
        invoices.iconClass = 'glyphicon glyphicon-book';
        invoices.class = 'ajax-link';
        invoices.description = 'Client Invoices';

        var configItems = [pageSectionCategory, pages, banners, togglers, sliders, posts, galleryItem, fillers, auditTrail, users, clients, productItems, orders, roles, invoices];
        var configurationCollection = new Kayxlav.PageSectionItem().getObjectName();

        addDataToServer(configurationCollection, configItems, function() {
            debug('Page section items successfully populated.');
            createIndexOnField(configurationCollection, 'categoryID', { unique: true }, function(field) {
                debug('Index on ' + field + ' successfully created');
            });

            createIndexOnField(configurationCollection, 'name', { unique: true }, function(field) {
                debug('Index on ' + field + ' successfully created');
            });
        });

        var home = new Kayxlav.Page();
        home.name = 'Home';
        home.isMainPage = true;
        home.description = 'Home page for kayxlavcoms';
        home.pageurl = '/home';
        home.navID = 1;
        home.subPageList = [];
        home.creationDate = datePrevDaysfromNow(0);
        home.parentPageID = 0;

        var aboutus = new Kayxlav.Page();
        aboutus.name = 'About Us';
        aboutus.isMainPage = true;
        aboutus.description = 'Page that gives historical, structural,etc information about Kayxlav';
        aboutus.pageurl = '/aboutus';
        aboutus.navID = 2;
        aboutus.subPageList = ['background', 'compvalues', 'geninfo'];
        aboutus.creationDate = datePrevDaysfromNow(0);
        aboutus.parentPageID = 0;

        var products = new Kayxlav.Page();
        products.name = 'Products';
        products.isMainPage = true;
        products.description = 'Page that shows all the products and services';
        products.pageurl = '/products';
        products.navID = 3;
        products.subPageList = [];
        products.creationDate = datePrevDaysfromNow(0);
        products.parentPageID = 0;


        var gallery = new Kayxlav.Page();
        gallery.name = 'Gallery';
        gallery.isMainPage = true;
        gallery.description = 'Gallery for all Kayxlav products';
        gallery.pageurl = '/gallery';
        gallery.navID = 4;
        gallery.subPageList = {};
        gallery.creationDate = datePrevDaysfromNow(0);
        gallery.parentPageID = 0;


        var background = new Kayxlav.Page();
        background.name = 'background';
        background.isMainPage = true;
        background.description = 'Kayxlav background page';
        background.pageurl = '/background';
        background.navID = 5;
        background.subPageList = {};
        background.creationDate = datePrevDaysfromNow(0);
        background.parentPageID = 2;

        var compvalues = new Kayxlav.Page();
        compvalues.name = 'compvalues';
        compvalues.isMainPage = false;
        compvalues.description = 'Company values page';
        compvalues.pageurl = '/compvalues';
        compvalues.navID = 6;
        compvalues.subPageList = {};
        compvalues.creationDate = datePrevDaysfromNow(0);
        compvalues.parentPageID = 2;

        var geninfo = new Kayxlav.Page();
        geninfo.name = 'geninfo';
        geninfo.isMainPage = false;
        geninfo.description = 'General information page';
        geninfo.pageurl = '/geninfo';
        geninfo.navID = 7;
        geninfo.subPageList = {};
        geninfo.creationDate = datePrevDaysfromNow(0);
        geninfo.parentPageID = 2;

        pages = [home, aboutus, products, gallery, background, compvalues, geninfo];
        navCollection = new Kayxlav.Page().getObjectName();
        addDataToServer(navCollection, pages, function() {
            debug('Pages sucessfully populated.');
            createIndexOnField(navCollection, 'navID', { unique: true }, function(field, err) {
                if (err) {
                    debug(err);
                }
                debug('Index on ' + field + ' successfully created');
            });

            createIndexOnField(navCollection, 'name', { unique: true }, function(field, err) {
                if (err) {
                    debug(err);
                }
                debug('Index on ' + field + ' successfully created');
            });

            createIndexOnField(navCollection, 'parentPageID', { unique: false }, function(field, err) {
                if (err) {
                    debug(err);
                }
                debug('Index on ' + field + ' successfully created');
            });
        });


    });
    startProcesses();
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function getDataFromServer(collectionName, dataFilter, callback) {
    (async function mongoData() {
        let client;
        try {
            client = await MongoClient.connect(mongoURL);
            //  debug('Connected successfully to Mongo server');
            if (!dataFilter) {
                searchCriteria = "";
            } else {
                searchCriteria = dataFilter;

            }
            debug('Running  query for ' + collectionName.toString() + ' with  filter ' + JSON.stringify(dataFilter));
            const db = client.db(mDB);
            const colly = client.db(mDB).collection(collectionName);
            //debug('Successfully connected to ' + colly.toString());
            if (dataFilter.length > 0) {
                await colly.find(searchCriteria).toArray(function(err, items) {
                    assert.equal(null, err);
                    if (items.length !== 0) {
                        debug("Search returned: " + JSON.stringify(items));

                        callback(items);
                    } else {
                        debug('Search returned no results');
                    }
                });
            } else {
                colly.find({}).toArray(function(err, items) {
                    assert.equal(null, err);
                    if (items.length !== 0) {
                        debug("Search returned: " + JSON.stringify(items));
                        callback(items);
                    } else {
                        debug('Search returned no results');
                    }
                });

            }
            client.close();
        } catch (err) {
            debug(err.stack);
        }

    }());;
}

function addDataToServer(collectionName, itemArray, callback) {
    (async function mongoData1() {
        let client;
        try {
            client = await MongoClient.connect(mongoURL);
            //test.equal(null, err);

            const collectn = client.db(mDB).collection(collectionName);

            collectn.insert(itemArray, function(err, result) {
                assert.equal(null, err);
                debug(result.ops.length + ' ' + collectionName + ' entries inserted');
            });

            client.close();
            callback();
        } catch (err) {
            debug(err.stack);
        }
    }());
}


function updateMongoRecord(collectionName, searchOps, itemArray, callback) {
    (async function mongoData1() {
        let client;
        try {
            client = await MongoClient.connect(mongoURL);
            //test.equal(null, err);

            const collectn = client.db(mDB).collection(collectionName);

            collectn.update(searchOps, { $set: itemArray }, { upsert: false }, function(err, result) {
                assert.equal(null, err);
                debug(searchOps + ' ' + collectionName + ' updated');
            });

            client.close();
            callback();
        } catch (err) {
            debug(err.stack);
        }
    }());
}

function createIndexOnField(collectionName, fieldName, options, callback) {

    (async function mongoData1() {
        let client;
        try {
            client = await MongoClient.connect(mongoURL);
            // test.equal(null, err);

            const collectn = client.db(mDB).collection(collectionName);
            collectn.createIndex(
                fieldName,
                options,
                function(err, results) {
                    console.log(results);
                    callback(fieldName);
                }
            );

            client.close();
        } catch (err) {
            debug(err.stack);
        }
    }());

}

function drawSideBar(dummy, callback) {

    var options = {};
    var addedPageList = [];
    var sideBar = '<ul class="nav nav-pills nav-stacked main-menu">';

    getDataFromServer(new Kayxlav.PageSection().getObjectName(), options, function(pSections) {

        getDataFromServer(new Kayxlav.PageSectionItem().getObjectName(), options, function(pageCat) {
            sideBar = '<ul class="nav nav-pills nav-stacked main-menu">';
            var i = 0;
            var j = 0;
            var addedPageList = [];
            pSections.forEach(pSection => {
                ++i;
                debug('pSection: ' + JSON.stringify(pSection));
                if (i == 1 || i == 2) {
                    sideBar += '<li class="nav-header">' + pSection.sectionName + '</li>';
                } else {
                    sideBar += '<li  class="nav-header hidden-md">' + pSection.sectionName + '</li>';
                }

                pageCat.forEach(PageSectionItem => {
                    ++j;
                    //   debug('pageCategories: ' + JSON.stringify(PageSectionItem));
                    if (PageSectionItem.subCategoryList.length > 0) {
                        if (addedPageList.indexOf(PageSectionItem.name) < 0 && PageSectionItem.pageSectionID == i) {
                            sideBar += '<li class="accordion"><a href="#"  class="ajax-link" data="' + pageCat[p].categoryID + '"><i class="glyphicon glyphicon-plus"></i><span>  ' + PageSectionItem.name + '</span></a><ul class="nav nav-pills nav-stacked">';
                            addedPageList.push(PageSectionItem.name);
                        }
                        for (var k = 0; k < PageSectionItem.subCategoryList.length; k++) {

                            var name = PageSectionItem.subCategoryList[k];

                            if (addedPageList.indexOf(subCat.name) < 0) {
                                for (var p = 0; p < pageCat.length; p++) {

                                    if (pageCat[p].name == subCat.name)
                                        sideBar += '<li><a href="#" class="ajax-link"  data="' + pageCat[p].categoryID + '">' + pageCat[p].name + '</a></li>';
                                    addedPageList.push(subCat.name);
                                }
                            }
                        }
                        sideBar += '</ul>';
                    } else {
                        if (addedPageList.indexOf(PageSectionItem.name) < 0 && PageSectionItem.pageSectionID == i) {
                            sideBar += '<li><a class="ajax-link" href="#" data="' + PageSectionItem.categoryID + '"><i class="' + PageSectionItem.iconClass + '"></i><span> ' + PageSectionItem.name + '</span></a></li>';
                            addedPageList.push(PageSectionItem.name);
                        }

                    }


                });

            });
            sideBar += '</ul>';
            callback(sideBar);
        });


    });

}


function datePrevDaysfromNow(previousDay) {
    var newDate = new Date();
    var curDate = new Date();
    curDate.setDate(newDate.getDate() - previousDay);
    var yyyy = curDate.getFullYear();
    var mm = curDate.getMonth() < 9 ? "0" + (curDate.getMonth() + 1) : (curDate.getMonth() + 1); // getMonth() is zero-based
    var dd = curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate();
    var hh = curDate.getHours() < 10 ? "0" + curDate.getHours() : curDate.getHours();
    var min = curDate.getMinutes() < 10 ? "0" + curDate.getMinutes() : curDate.getMinutes();
    var ss = curDate.getSeconds() < 10 ? "0" + curDate.getSeconds() : curDate.getSeconds();
    return "".concat(yyyy).concat("-").concat(mm).concat("-").concat(dd).concat(" ").concat(hh).concat(":").concat(min).concat(":").concat(ss);
};

function prepareCollection(collectionName, indexProperties) {
    (async function mongoData2() {
        let client;
        try {
            client = await MongoClient.connect(mongoURL);
            const collectn = client.db(mDB).collection(collectionName);
            debug('Checking if ' + collectionName + ' exists');
            collectn.count(function(err, count) {
                if (!err && count === 0) {
                    collectn.createCollection(collectionName, function(err, result) {
                        assert.equal(null, err);
                        debug(collectionName + ' created successfully');
                        indexProperties.forEach(indexProp => {
                            var field = indexProp.fieldName;
                            createIndexOnField(collectionName, indexProp.name, { unique: indexProp.isUnique }, function(field) {
                                debug('Index on ' + field + ' successfully created');
                            });

                        });

                    });
                } else {
                    debug(collectionName + ' already exists. skipping...');

                }
            });
            client.close();
            callback();
        } catch (err) {
            debug(err.stack);
        }
    }());
}