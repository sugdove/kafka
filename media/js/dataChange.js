//表单传值转key为str的json样式字符串
function  serializeJson(a) {
    var length = a.length;
    var json = {};
    var json_ = {};
    for(var i=0;i<length;i++){
        var name = a[i]["name"];
        var value = a[i]["value"];
        json_[name] = value ;
    }
    JSON.stringify(json_);
    return json_;
}
//显示隐藏密码
var $body = $("body");
$(".icon-eye-close").attr("title","点击显示密码");
$body.on("click",".icon-eye-close",function () {
   $(this).removeClass("icon-eye-close").addClass("icon-eye-open");
    $(this).next("input").attr("type","text");
    $(".icon-eye-open").attr("title","点击隐藏密码");
});
$body.on("click",".icon-eye-open",function () {
    $(this).removeClass("icon-eye-open").addClass("icon-eye-close");
    $(this).next("input").attr("type","password");
    $(".icon-eye-close").attr("title","点击显示密码");
});