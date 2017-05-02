/**
 * Created by abhishek on 8/6/16.
 */

function sideItemHighLight(e){
    $(".highlighted").css("background-color","rgba(0,0,0,0)").removeClass("highlighted");
    $(e).parent().css("background-color","#c5c5c3").addClass("highlighted");
}