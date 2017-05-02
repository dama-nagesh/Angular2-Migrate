'use strict';

angular.module('myApp.myprofile', ['ngRoute', 'oc.lazyLoad', 'ngLoadingSpinner'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/myprofile', {
            templateUrl: 'modules/accounts/profile/myprofile.html',
            controller: 'myprofileCtrl'
        })
    }])

    .controller('myprofileCtrl', ['$http', '$scope', '$rootScope', '$window', '$location', function ($http, $scope, $rootScope, $window, $location) {

        $(".page-header").show();
        $(".page-sidebar-wrapper").show();
        $(".page-footer").show();
        $("body").removeClass("login");

        // MyProfile API**********************
        $scope.CustomerName = customerName();
        $scope.CustomerId = $window.sessionStorage.getItem("Main_CustomerID");
        $scope.Name = "";
        $scope.Mobile = "";
        $scope.Email = "";
        $scope.Address = "";

        var url = $window.data.account.myprofile_url_dev;
        var ajaxRequest = $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            cache: false,
            data:  "=" + JSON.stringify({
                'customerId': $scope.CustomerId
            }),
            beforeSend: function (request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
            }
        });

        ajaxRequest.done(function (data) {
            $window.location.hash = "#!/myprofile";
            $scope.Name = data.FirstName;
            $scope.Mobile = data.Mobile1;
            $scope.Email = data.Email;
            $scope.Address = data.Adr1Line1 + "," + data.Adr1Line2 + "," + data.Adr1Line3 + "," + data.Adr1City;

            $('.profileField').focus();
        });

        ajaxRequest.fail(function (xhr, textStatus, errorThrown) {
            if ("Unauthorized" == errorThrown) {
                alert('Failed to retrieve profile details.')
            }
        });

        // Change Password API*******************
        $scope.CurrPassword = "";
        $scope.NewPassword = "";
        $scope.ReNewPassword = "";

        $scope.ChangePswd = function () {

            if ($scope.NewPassword != $scope.ReNewPassword) {
                alert('Confirm password doesnot match.');
                return false;
            }

            var url = $window.data.account.changePswd_url_dev;
            var ajaxRequest = $.ajax({
                type: "POST",
                url: url,
                dataType: "json",
                cache: false,
                data: "=" + JSON.stringify({ "UserId": $window.sessionStorage.getItem("UserID"), "Password": $scope.CurrPassword, "NewPassword": $scope.NewPassword }),
                beforeSend: function (request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                }
            });

            ajaxRequest.done(function (data) {
                if(data.CommonStatusMessageModel.StatusCode == 'WERP1005')
                    alert('Old password is wrong.');
                else if(data.CommonStatusMessageModel.StatusCode == '01'){
                    $('#spanChngPswd').css("display","inline");
                    $('#spanChngPswd').hide().fadeIn('slow').delay(5000).hide(1);
                }
            });

            ajaxRequest.fail(function (xhr, textStatus, errorThrown) {
                if ("Unauthorized" == errorThrown) {
                    alert('Failed to change password! Some technical error.')
                }
            });
        }

        $("#link_tab_1").click(function(){
            $("#tab_2").hide();
            $("#tab_1").show();
        });

        $("#link_tab_2").click(function(){
            $("#tab_1").hide();
            $("#tab_2").show();
        });
    }]);