/*用于获取用户信息*/
var Username = $.cookie("username");
//
$(".username").html(Username);

/*attr("href","http://" + localhost + "/VirtualizationUnifiedBackup/logout");*/
$(".logout").click(function () {
    $.ajax({
        url: "http://" + localhost + "/VirtualizationUnifiedBackup/logout",
        type: "post",
        async: false,
        success: function (data) {
            window.location.href = "login.html"
        }
    });
});

$(".return_main").click(function () {
   window.location.href=local_url;
});