'use strict';

/**
 * Config for the router
 */
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES',
function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires) {

    app.controller = $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
    app.constant = $provide.constant;
    app.value = $provide.value;

    // LAZY MODULES

    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: jsRequires.modules
    });

    // APPLICATION ROUTES
    // -----------------------------------
    // For any unmatched url, redirect to /app/dashboard
    $urlRouterProvider.otherwise("/app/dashboard");

    // Set up the states
    $stateProvider.state('app', {
        url: "/app",
        templateUrl: "resources/views/app.html",
        resolve: loadSequence('modernizr', 'moment', 'angularMoment', 'uiSwitch', 'perfect-scrollbar-plugin', 'toaster', 'ngAside', 'vAccordion', 'sweet-alert', 'chartjs', 'tc.chartjs', 'oitozero.ngSweetAlert', 'truncate', 'htmlToPlaintext', 'angular-notification-icons','loginController'),
        abstract: true,
        data: {
            requireLogin: true
          }
    }).state('app.dashboard', {
        url: "/dashboard",
        templateUrl: "resources/views/dashboard/dashboard.html",
        title: 'Dashboard',
        ncyBreadcrumb: {
            label: 'Dashboard'
        }
    })

    //User Routes here
    .state('app.user', {
        url: '/user',
        template: '<div ui-view class="fade-in-up"></div>',
        title: 'User',
        resolve: loadSequence('ngTable'),
        ncyBreadcrumb: {
            label: 'User'
        }
    }).state('app.user.view', {
        url: "/view",
        templateUrl: "resources/views/user/view.html",
        resolve: loadSequence('usercontroller'),
        title: 'View Registerd Users',
        ncyBreadcrumb: {
            label: 'View Registerd Users'
        }
    }).state('app.user.register', {
        url: "/register",
        templateUrl: "resources/views/user/register.html",
        resolve: loadSequence('usercontroller'),
        title: 'Register New User',
        ncyBreadcrumb: {
            label: 'Register New User'
        }
    })


    //Asset Routes here
    .state('app.asset', {
        url: '/asset',
        template: '<div ui-view class="fade-in-up"></div>',
        title: 'Asset',
        resolve: loadSequence('ngTable','assetController'),
        ncyBreadcrumb: {
            label: 'Asset'
        }
    }).state('app.asset.register', {
        url: '/register',
        templateUrl: 'resources/views/asset/register.html',
        title: 'Register',
        ncyBreadcrumb: {
            label: 'Register'
        }
    }).state('app.asset.view', {
        url: '/view',
        templateUrl: 'resources/views/asset/view.html',
        title: 'View Assets',
        ncyBreadcrumb: {
            label: 'View Assets'
        }
    })
    
    //Asset Bookings
    .state('app.asset.booking', {
        url: '/booking',
        template: '<div ui-view class="fade-in-up"></div>',
        title: 'Asset',
        resolve: loadSequence('ngTable','assetBookingController'),
        ncyBreadcrumb: {
            label: 'Asset'
        }
    }).state('app.asset.booking.view', {
        url: '/view',
        templateUrl: 'resources/views/assetbooking/view.html',
        title: 'Register',
        ncyBreadcrumb: {
            label: 'Register'
        }
    })

    //Bulk Features
    .state('app.bulk', {
        url: '/bulk',
        template: '<div ui-view class="fade-in-up"></div>',
        title: 'Bulk',
        resolve: loadSequence('bulkController'),
        ncyBreadcrumb: {
            label: 'BulkController'
        }
    }).state('app.bulk.user', {
        url: '/user',
        templateUrl: 'resources/views/bulk/register_user.html',
        title: 'Register User',
        ncyBreadcrumb: {
            label: 'Register User'
        }
    })

    //Login Routese here
    .state('login', {
        url: '/login',
        template: '<div ui-view class="fade-in-right-big smooth"></div>',
        abstract: true
    }).state('login.signin', {
        url: '/signin',
        templateUrl: "resources/views/login/signin.html",
        resolve: loadSequence('loginController')
    }).state('login.forgot', {
        url: '/forgot',
        templateUrl: "assets/views/login_forgot.html"
    }).state('login.registration', {
        url: '/registration',
        templateUrl: "assets/views/login_registration.html"
    }).state('login.lockscreen', {
        url: '/lock',
        templateUrl: "assets/views/login_lock_screen.html"
    });

    // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
    function loadSequence() {
        var _args = arguments;
        return {
            deps: ['$ocLazyLoad', '$q',
			function ($ocLL, $q) {
			    var promise = $q.when(1);
			    for (var i = 0, len = _args.length; i < len; i++) {
			        promise = promiseThen(_args[i]);
			    }
			    return promise;

			    function promiseThen(_arg) {
			        if (typeof _arg == 'function')
			            return promise.then(_arg);
			        else
			            return promise.then(function () {
			                var nowLoad = requiredData(_arg);
			                if (!nowLoad)
			                    return $.error('Route resolve: Bad resource name [' + _arg + ']');
			                return $ocLL.load(nowLoad);
			            });
			    }

			    function requiredData(name) {
			        if (jsRequires.modules)
			            for (var m in jsRequires.modules)
			                if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
			                    return jsRequires.modules[m];
			        return jsRequires.scripts && jsRequires.scripts[name];
			    }
			}]
        };
    }
}]);