'use strict';

angular.module('myApp.register', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/register', {
            templateUrl: 'modules/accounts/register/register.html',
            controller: 'registerCtrl'
        });
    }])

    .controller('registerCtrl', ['$http', '$scope', '$window', function ($window, $http, $scope) {

        $scope.username = "";
        $scope.email = "";
        $scope.password = "";
        $scope.confirmpassword = "";

        $scope.doRegister = function () {
            if ($scope.password != $scope.confirmpassword) {
                return false;
            }
            var url = $window.data.account.register_api_url_dev;
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {username: $scope.username, email: $scope.email, password: $scope.password}
            }).success(function (data, status, headers, config) {
                if (data.code == 200) {
                    $window.alert("register done");
                } else {
                    $window.alert("Something went wrong try again later");
                }
            }).error(function (data, status, headers, config) {

            });
        }
    }]);