/**
 * Created by suge on 2017/7/27.
 */
var FormValidation = function () {
    return {
        //main function to initiate the module
        init: function () {
            $.validator.addMethod("ip",function(value,element,params){
                var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                var reg2 =/^(?:(?:^|,)(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(?:\.(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3})+$/
                if(reg2.test(value)){
                    return true;
                }else{
                    return false;
                }
            },"您输入的格式错误，请检查");
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
                    ip: {
                        required: true,
                        ip:true
                    },
                    port: {
                        required: true,
                        number:true
                    },
                    description: {
                        required: true
                    }
                },
                messages: {
                    ip: {
                        required: "请输入IP"
                    },
                    port: {
                        required: "请输入端口号",
                        number: "端口号必须为数字"
                    },
                    description: {
                        required: "说明不能为空"
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
                            $.ajax({
                                cache: true,
                                type: "post",
                                url: "http://"+localhost+"/longGangKafka/zookeeper/add",
                                dataType:"json",
                                data:$("#add_virtcenter").serializeArray(),
                                async: false,
                                success: function (data) {
                                    if(data===true){
                                        $.confirm({
                                            confirmButtonClass: 'btn btn-info',
                                            cancelButtonClass: 'btn-danger',
                                            confirmButton:'确认',
                                            cancelButton:'取消',
                                            animation: 'zoom',
                                            closeAnimation: 'rotateXR',
                                            title: '添加成功！',
                                            content: 'zookeeper添加成功（3秒后跳转到zookeeper管理界面）',
                                            autoClose: '确认|3000',
                                            buttons: {
                                                确认: function () {
                                                    window.location.href="virtualization.html";
                                                }
                                            }
                                        });
                                    }
                                    else if(data===false){
                                        $.confirm({
                                            confirmButtonClass: 'btn btn-info',
                                            cancelButtonClass: 'btn-danger',
                                            confirmButton:'确认',
                                            cancelButton:'取消',
                                            animation: 'zoom',
                                            closeAnimation: 'rotateXR',
                                            title: '添加失败！',
                                            content: 'zookeeper添加失败（3秒后消失）',
                                            autoClose: '确认|3000',
                                            buttons: {
                                                确认: function () {
                                                }
                                            }
                                        });
                                    }
                                }
                            })
                }
            });

        }

    };

}();