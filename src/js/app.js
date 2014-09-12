var app = angular.module(
	'wavestack-sync', 
	[
		'ngRoute',
        'ui.bootstrap',
        'LoadingCtrl',
        'ProjectCtrl',
        // 'RegisterCtrl'
        // 'PricingCtrl'
    ]);

app.config(function ($routeProvider, $locationProvider) {
    console.log("HEEY")
    $routeProvider.when('/loading', {
            templateUrl: 'views/_loading.html',
            controller: 'LoadingController'
        });

    $routeProvider.when('/projects', {
            templateUrl: 'views/_projects.html',
            controller: 'ProjectController'
        });

        
        // .state('user', {
        //     url: '/user',
        //     templateUrl: 'views/_user.html',
        //     controller: 'UserController'
        // })

        // .state('register', {
        //     url: '/register',
        //     templateUrl: 'views/_register.html',
        //     controller: 'RegisterController'
        // })
    ;

    $routeProvider.otherwise({ redirectTo: '/loading' });

    $locationProvider.html5Mode(true);
});