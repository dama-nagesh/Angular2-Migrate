/********get side bar*********/
'use strict';

angular.module('myApp.side', ['ngRoute', 'oc.lazyLoad'])

    .controller('sideCtrl', ['$http', '$scope', '$window', '$location', 'dataService_sidebar', '$rootScope', function($http, $scope, $window, $location, dataService_sidebar,$rootScope) {

        $(".page-header").show();
        $(".page-sidebar-wrapper").show();
        $(".page-footer").show();
        $("body").removeClass("login");

        dataService_sidebar.getData().then(function(data) {
            var sidebar = data;
            var sidebarItems = [];
            for (var s = 0; s < sidebar.length; s++) {

                var li = $("<li>").addClass("nav-item");
                var a = $("<a>").addClass("nav-link nav-toggle")
                if (sidebar[s].Type == "Link")
                    a.attr("href", "#!" + sidebar[s].MainLink);
                var i = $("<i>").addClass(sidebar[s].Info.Properties[0]);
                var spanName = $("<span>").addClass("title uppercase").text(sidebar[s].Name);
                var spanType = $("<span>").addClass(sidebar[s].Info.Properties[1]);

                a.append(i);
                a.append(spanName);
                a.append(spanType);

                var ulSub = $("<ul>").addClass("sub-menu hide");

                for (var u = 0; u < sidebar[s].Info.Link_Name.length; u++) {
                    var liSub = $("<li>").addClass("nav-item");
                    var aSub = $("<a>").addClass("nav-link").attr("href", "#!" + sidebar[s].Info.Link_URL[u]).attr("onclick", "sideItemHighLight(this)");
                    var spanTitle = $("<span>").addClass("title").text(sidebar[s].Info.Link_Name[u]);
                    aSub.append(spanTitle);
                    liSub.append(aSub);
                    ulSub.append(liSub);
                }

                li.append(a);
                li.append(ulSub);

                sidebarItems.push(li);
            }

            for (var i = 0; i < sidebarItems.length; i++) {
                $(".page-sidebar-menu").append(sidebarItems[i][0]);
            }

            $(".nav-toggle").click(function() {
                $(this).parent().parent().find("ul.sub-menu").hide();
                $(this).parent().parent().find("ul.sub-menu").addClass("hide");
                var item = $(this).next("ul.sub-menu");
                if (item.hasClass("hide")) {
                    item.show();
                    item.removeClass("hide")
                }
                else {
                    item.hide();
                    item.addClass("hide");
                }
            })

            $(".menu-toggler").click(function() {
                //$(".page-sidebar-menu").addClass("page-sidebar-menu-closed");
                var item = $(".page-sidebar-menu");
                if (item.hasClass("page-sidebar-menu-closed")) {
                    item.removeClass("page-sidebar-menu-closed");
                    $('.applogo').show();
                }
                else {
                    item.addClass("page-sidebar-menu-closed");
                    $('.applogo').hide();
                }

                var item1 = $(".page-header-fixed");
                if (item1.hasClass("page-sidebar-closed")) {
                    item1.removeClass("page-sidebar-closed")
                }
                else {
                    item1.addClass("page-sidebar-closed");
                }
            })

            $rootScope.logourl = window.data.LOGO.LogoImgUrl + window.sessionStorage.getItem("LogoPath");
        });
    } ])

    .factory('dataService_sidebar', function($q) {
        return {
            getData: function() {
                var deferred = $q.defer();
                $.getJSON("config/sidebar.json", function(data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
        };
    });