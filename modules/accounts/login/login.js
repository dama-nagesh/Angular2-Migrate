'use strict';

angular.module('myApp.login', ['ngRoute', 'oc.lazyLoad', 'ngLoadingSpinner'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'modules/accounts/login/login.html',
            controller: 'loginCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '/assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            'assets/global/plugins/jquery-validation/js/additional-methods.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js']
                    });
                }]
            }
        }).when('/login/:hassedcustomerId', {
            templateUrl: 'modules/accounts/login/login.html',
            controller: 'ssoLoginCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '/assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            'assets/global/plugins/jquery-validation/js/additional-methods.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js']
                    });
                }]
            }
        });
    }])

    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })

    .controller('loginCtrl', ['$http', '$scope', '$window', '$location','family_member_login','$rootScope', function ($http, $scope, $window, $location,family_member_login,$rootScope) {

        $(".page-header").hide();
        $(".page-sidebar-wrapper").hide();
        $(".page-footer").hide();
        $("body").addClass("login");

        //enter click

        //function

        $scope.username = "";
        $scope.password = "";
        $scope.SignInClicked = function () {

            var url = $window.data.account.login_api_url_dev;

            var ajaxRequest = $.ajax({
                type: "POST",
                url: url,
                dataType: "json",
                cache: false,
                data: {"UserName": $scope.username, "Password": $scope.password},
                beforeSend: function (request) {
                    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                }
            });

            ajaxRequest.done(function (a, b, c) {
                $window.location.hash = "#!/home";
                //$window.location.reload();

                //$location.path("/home");
                $window.sessionStorage.setItem("UserID", a.UserId);
                $window.sessionStorage.setItem("CustomerId", a.CustomerId);
                $window.sessionStorage.setItem("Token", a.Authorization_Token);
                $window.sessionStorage.setItem("CustomerName", a.FirstName);
                $window.sessionStorage.setItem("Gender", a.Gender);
                $window.sessionStorage.setItem("LogoPath", a.LogoPath);

                $rootScope.logourl = window.data.LOGO.LogoImgUrl + a.LogoPath;
                $window.isLogin = true;
                $('#txtLoginUserName').text(window.sessionStorage.getItem("CustomerName"));

                $window.sessionStorage.setItem("Main_CustomerID",a.CustomerId );

                family_member_login.getData().then(function (data) {
                    $window.sessionStorage.setItem("MembersData", JSON.stringify(data));
                    if (data.length > 1) {
                        $rootScope.memberDataItemSelected = data[0];
                        $rootScope.items = data;
                    }
                    else if(data.length <= 1){
                        $('#ulMember').hide();
                    }
                });

            });

            ajaxRequest.fail(function (xhr, textStatus, errorThrown) {
                if ("Unauthorized" == errorThrown) {
                    alert('Login failed! Incorrect Username and Password.')
                }
            });
        }

        $scope.enableForgotPassword = function () {
            $(".forget-form").css("display", "block");
            $(".login-form").css("display", "none");
        }

        $scope.forgotBackClicked = function () {
            $(".forget-form").css("display", "none");
            $(".login-form").css("display", "block");
        }

        $scope.forgotSubmitClicked = function () {

        }

    }])
    .controller('ssoLoginCtrl', ['$http', '$scope', '$window', '$location','$routeParams','family_member_login','$rootScope', function ($http, $scope, $window, $location, $routeParams,family_member_login,$rootScope) {

        $(".page-header").hide();
        $(".page-sidebar-wrapper").hide();
        $(".page-footer").hide();
        $("body").addClass("login");

        //enter click

        var url = $window.data.account.sso_login;
        var hassedcustomerId = $routeParams.hassedcustomerId;

        var ajaxRequest = $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            cache: false,
            data: "=" + JSON.stringify({
                        'hassedcustomerId': hassedcustomerId
                    }),
            beforeSend: function (request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            }
        });

        ajaxRequest.done(function (a, b, c) {
            $window.location.hash = "#!/home";
            //$window.location.reload();

            //$location.path("/home");
            $window.sessionStorage.setItem("UserID", a.UserId);
            $window.sessionStorage.setItem("CustomerId", a.CustomerId);
            $window.sessionStorage.setItem("Token", a.Authorization_Token);
            $window.sessionStorage.setItem("CustomerName", a.FirstName);
            $window.sessionStorage.setItem("Gender", a.Gender);
            $window.sessionStorage.setItem("LogoPath", a.LogoPath);
            $window.sessionStorage.setItem("Main_CustomerID",a.CustomerId );
            $window.isLogin = true;

            $('#txtLoginUserName').text(window.sessionStorage.getItem("CustomerName"));
            $rootScope.logourl = window.data.LOGO.LogoImgUrl + a.LogoPath;

            family_member_login.getData().then(function (data) {
                $window.sessionStorage.setItem("MembersData", JSON.stringify(data));
                if (data.length > 1) {
                    $rootScope.memberDataItemSelected = data[0];
                    $rootScope.items = data;
                }
                else if(data.length <= 1){
                    $('#ulMember').hide();
                }
            });

        });

        ajaxRequest.fail(function (xhr, textStatus, errorThrown) {
            if ("Unauthorized" == errorThrown) {
                alert('Login failed! Incorrect Username and Password.')
            }
        });

    }]) .factory('family_member_login', function ($q) {
    return {
        getData: function () {
            var deferred = $q.defer();
            $.ajax({
                type: "POST",
                data: "=" + JSON.stringify({
                    'CustomerId': window.sessionStorage.getItem("Main_CustomerID")
                }),
                beforeSend: function (request) {
                    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                },
                url: window.data.account.familyMember_url_dev,
                success: function (data) {
                    deferred.resolve(data);
                }
            });

            return deferred.promise;
        }
    };
});