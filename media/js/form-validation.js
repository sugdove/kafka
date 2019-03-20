var FormValidation = function () {


    return {
        //main function to initiate the module
        init: function () {
          /*var ip = /^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;*/
            $.validator.addMethod("ip",function(value,element,params){
                var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                if(reg.test(value)){
                    return true;
                }else{
                    return false;
                }
            },"请输入一个IP地址，例192.168.23.50");

            $.validator.addMethod("integer",function(value,element,params){
                var reg = /^\d+$/;
                if(reg.test(value)){
                    return true;
                }else{
                    return false;
                }
            },"端口号必须为整数");
            // for more info visit the official plugin documentation: 
            // http://docs.jquery.com/Plugins/Validation

            var form1 = $('#pzmanager');
            var error1 = $('.alert-error', form1);
            var success1 = $('.alert-success', form1);

            form1.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
                rules: {
                    dbip: {
                        required: true,
                        ip:true
                    },
                    dbport: {
                        required: true,
                        integer:true,
                        range:[1,65536]
                    },
                    dbuser: {
                        required: true
                    },
                    dbpasswd: {
                        required: true
                    }
                },
                messages: {
                    dbip: {
                        required: "请输入IP"
                    },
                    dbport: {
                        required: "请输入端口号",
                        range:"端口号范围为1~65536"
                    },
                    dbuser: {
                        required: "请输入用户名",
                        minlength: "用户名长度不能小于 5 ",
                        maxlength: "用户名长度不能大于 13 "
                    },
                    dbpasswd: {
                        required: "请输入密码",
                        minlength: "密码长度不能小于 5 ",
                        maxlength: "密码长度不能大于 13 "
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
                    success1.show();
                    error1.hide();
                    var data;
                    if($("#dbtype").val()=="sqlite"){
                        var json = {"dbtype":"sqlite"};
                        var json_ = JSON.stringify(json);
                       data = {str:json_}
                    }
                    else if($("#dbtype").val()=="mysql"){
                        data = {str:JSON.stringify(serializeJson($("#pzmanager").serializeArray()))}
                    }
                                    $.ajax({
                                        cache: true,
                                        type: "post",
                                        url: "http://" + localhost + "/VirtualizationUnifiedBackup/mysqlConfSet",
                                        data:data,
                                        dataType:"json",
                                        async: false,
                                        success: function (data) {
                                            if(data.res==0){
                                                $.confirm({
                                                    confirmButtonClass: 'btn btn-info',
                                                    cancelButtonClass: 'btn-danger',
                                                    confirmButton:'确认',
                                                    cancelButton:'取消',
                                                    animation: 'zoom',
                                                    closeAnimation: 'rotateXR',
                                                    title: '配置成功！',
                                                    content: '配置修改成功（此确认框会在3秒后消失）',
                                                    autoClose: '确认|3000',
                                                    buttons: {
                                                        确认: function () {
                                                            window.location.href="index.html";
                                                        }
                                                    }
                                                });
                                            }
                                           else if(data.res==-1){
                                                alert("后台报错："+data.err)
                                            }
                                        }
                            })
                }
            });

        }

    };

}();