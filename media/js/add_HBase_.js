/**
 * Created by suge on 2017/7/27.
 */
$.ajax({
    url: "http://" + localhost + "/longGangKafka/zookeeper/get",
    cache: true,
    type: "post",
    async: false,
    success: function (data) {
        console.log(data);
        var str = "";
        for(var key in data){
            var ip = data[key].ip;
            var port = data[key].port;
            var timestam ="创建时间:"+data[key].timestam;
            var znode = data[key].znode;
            var zookeeper = ip+":"+port;
            var showip;
            if(ip.split(",").length>2){
                showip = ip.split(",")[0]+","+ip.split(",")[1]
            }
            else{
                showip = ip;
            }
            var description = data[key].description;
            var showzookeeper =description+" "+znode+" "+showip+":"+port;
            if (key==="0"){
                    str += "<li class='vcip_li eee' data-zookeeper='"+zookeeper+"' data-znode='"+znode+"' title='"+timestam+"'><img src='media/image/datacenter.png' class='zookeeper_img'>"+showzookeeper+"</li>";
            }
            else {
                str += "<li class='vcip_li' data-zookeeper='"+zookeeper+"' data-znode='"+znode+"' title='"+timestam+"'><img src='media/image/datacenter.png' class='zookeeper_img'>"+showzookeeper+"</li>";
            }
        }
        $("#vmware-list").html(str);
    },
});
//点击选中
$("#vmware-list").on("click",".vcip_li",function () {
    $(".vcip_li").removeClass("eee");
    $(this).addClass("eee");

});
var FormValidation = function () {
    return {
        //main function to initiate the module
        init: function () {
            $.validator.addMethod("ip",function(value,element,params){
                var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                if(reg.test(value)){
                    return true;
                }else{
                    return false;
                }
            },"请输入一个IP地址，例192.168.2.76");
            $.validator.addMethod("backpath",function(value,element,params){
                var reg= /^[a-zA-Z]:\/+$/;
                var reg2=/\/.+$/;
                if(reg.test(value)||reg2.test(value)){
                    return true;
                }else{
                    return false;
                }
            },"请输入备份路径，例c:\\a");
            // for more info visit the official plugin documentation:
            // http://docs.jquery.com/Plugins/Validation

            var form1 = $('#add_virtcenter');
            var error1 = $('.alert-error', form1);
            var success1 = $('.alert-success', form1);

            form1.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
                rules: {
                    tableName: {
                        required: true
                    },
                    rowFamilys: {
                        required: true
                    }
                },
                messages: {
                    tableName: {
                        required: "表名"
                    },
                    rowFamilys: {
                        required: "请输入列族名"
                    }
                },
                invalidHandler: function (event, validator) { //display error alert on form submit
                    success1.hide();
                    error1.show();
                    App.scrollTo(error1, -200);
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.help-inline').removeClass('ok'); // display OK icon
                    $(element)
                        .closest('.control-group').removeClass('success').addClass('error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change dony by hightlight
                    $(element)
                        .closest('.control-group').removeClass('error'); // set error class to the control group
                },

                success: function (label) {
                    label
                        .addClass('valid').addClass('help-inline ok') // mark the current input as valid and display OK icon
                        .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
                },

                submitHandler: function (form) {
                    var zookeeper = $(".iframe").find(".eee").data("zookeeper");
                   var z_ip = zookeeper.split(":")[0];
                   var z_port = zookeeper.split(":")[1];
                    success1.show();
                    error1.hide();
                    var l_arr=[];
                    var tableName = $("#tableName").val();
                    var znode_ = $(".eee").data("znode");
                    var znode ={name:"znode",value:znode_};
                    var json ={name:"tableName",value:tableName};
                    var hbasezk = {name:"hbasezk",value:z_ip};
                    var hbaseport = {name:"hbaseport",value:z_port};
                    var arr = $("#rowFamilys").val().split(",");
                    l_arr.push(json,hbasezk,hbaseport,znode);
                    for(var key in arr){
                     var json_ = {name:"rowFamilys",value:arr[key]};
                        l_arr.push(json_);
                    }
                           $.ajax({
                                cache: true,
                                type: "post",
                                url: "http://"+localhost+"/longGangKafka/createTable",
                                dataType:"json",
                                data:l_arr,
                                async: false,
                                success: function (data) {
                                        $.confirm({
                                            confirmButtonClass: 'btn btn-info',
                                            cancelButtonClass: 'btn-danger',
                                            confirmButton:'确认',
                                            cancelButton:'取消',
                                            animation: 'zoom',
                                            closeAnimation: 'rotateXR',
                                            title: '添加成功！',
                                            content: 'HBase添加成功（3秒后跳转到HBase管理界面）',
                                            autoClose: '确认|3000',
                                            buttons: {
                                                确认: function () {
                                                    window.location.href="HBase.html";
                                                }
                                            }
                                        });
                                }
                            })
                }
            });

        }

    };

}();