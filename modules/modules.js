/*************GET ALL API URL DETAILS****************/
$.getJSON("config/api.json", function (data) {
    window.data = data;
});

function isLoggedIn() {
    if (window.isLogin || window.sessionStorage.getItem("CustomerId") != "") {
        return true;
    } else {
        return false;
    }
}

function checkLogin()
{
    if(!isLoggedIn()){ window.location.hash = "#!/login";}
}

function customerName(){
    return window.sessionStorage.getItem("CustomerName");
}
