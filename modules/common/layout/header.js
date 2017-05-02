'use strict';

angular.module('myApp.header', ['ngRoute', 'oc.lazyLoad'])

    .controller('headerCtrl', ['$http', '$scope', '$window', '$location', '$rootScope', function ($http, $scope, $window, $location, $rootScope) {
        $scope.Logout = function () {

            $window.sessionStorage.setItem("UserID", "");
            $window.sessionStorage.setItem("Token", "");
            $window.sessionStorage.setItem("CustomerId", "");
            $window.sessionStorage.setItem("CustomerName", "");
            $window.sessionStorage.setItem("Gender", "");

            window.sessionStorage.setItem("memberDetails", "");
            window.sessionStorage.setItem("MembersData", "");
            window.sessionStorage.setItem("MemberDropdown", "");
            window.sessionStorage.setItem("Main_CustomerID", "");


            $window.isLogin = false;
            $location.path("/login");
        }

        $('#txtLoginUserName').text(window.sessionStorage.getItem("CustomerName"));

        if (window.sessionStorage.getItem("Gender") == "M") {
            $scope.imgSrc = "../assets/global/img/male.png";
        } else {
            $scope.imgSrc = "../assets/global/img/female.png";
        }

        $scope.MyProfile = function () {
            $location.path("/myprofile");
        }

        if($window.sessionStorage.getItem("MembersData") != null && $window.sessionStorage.getItem("MembersData") != ""){
            var MembersData = JSON.parse($window.sessionStorage.getItem("MembersData"));
            $rootScope.items = MembersData;
            if(MembersData.length <= 1){
                $('#ulMember').hide();
            }
        }

        if (window.sessionStorage.getItem("MemberDropdown") != null && window.sessionStorage.getItem("MemberDropdown") != "") {
            $rootScope.memberDataItemSelected = JSON.parse(window.sessionStorage.getItem("MemberDropdown"));
        }

        $scope.ChangeMemberOption = function () {
            $window.sessionStorage.setItem("MemberDropdown", JSON.stringify($scope.memberDataItemSelected));
            $window.sessionStorage.setItem("CustomerId", $scope.memberDataItemSelected.C_CustomerId);
            window.location.reload();
        }
        $( window ).unload(function() {
            $window.sessionStorage.setItem("MemberDropdown", JSON.stringify($scope.memberDataItemSelected));
        });
    }]);