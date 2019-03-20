var FormWizard = function () {


    return {
        //main function to initiate the module
        init: function () {
            if (!jQuery().bootstrapWizard) {
                return;
            }

            function format(state) {
                if (!state.id) return state.text; // optgroup
                return "<img class='flag' src='assets/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
            }

            $("#country_list").select2({
                placeholder: "Select",
                allowClear: true,
                formatResult: format,
                formatSelection: format,
                escapeMarkup: function (m) {
                    return m;
                }
            });
            $.validator.addMethod("kong",function(value,element,params){
                var reg = /^\S+$/;
                if(reg.test(value)){
                    return true;
                }else{
                    return false;
                }
            },"别名不能带有空格");
            var form = $('#submit_form');
            var error = $('.alert-error', form);
            var success = $('.alert-success', form);

                    form.validate({
                        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                        errorElement: 'span', //default input error message container
                        errorClass: 'validate-inline', // default input error message class
                        focusInvalid: false, // do not focus the last invalid input
                        rules: {
                            //account  rules: {
                            msg: {
                                kong:true,
                                required: true,
                                remote: {
                                    url: "http://" + localhost + "/VirtualizationUnifiedBackup/strategyIsExist",
                                    type: "post",
                                    dataType: "json",
                                    data: {
                                        str: function () {
                                            var json={strategy:$("#msg-id").val()};　　　　//这个是取要验证的密码
                                            var json_ = JSON.stringify(json);
                                            return json_
                                        }
                                    },
                                    dataFilter: function (data) {　　　　//判断控制器返回的内容
                                        var data_ = JSON.parse(data);
                                        if(data_.res==0){
                                            if (data_.info == 1) {
                                                return false;//已存在
                                            }
                                            else if(data_.info==0) {
                                                return true;//不存在
                                            }
                                        }
                                        else if(data_.res==-1){
                                            alert(data_.err);
                                        }
                                    }
                                }
                                    },
                            vmidset: {
                                minlength: 1,
                                required: true
                            },
                            vmname: {
                                minlength: 1,
                                required: true
                            },
                            Deldata:{
                              required:true
                            },
                            keepnum:{
                                required:true
                            }
                            //profile

                        },
                        messages: {
                            msg: {
                                required: "请填写别名！",
                                remote: "此别名已经存在！"　　　　//这个地方如果不写的话，是自带的提示内容，加上就是这个内容。
                            },
                            Deldata:{
                                required:"保留数量不能为空",
                                min:"请至少保留1",
                                max:"最多能保留1000"
                            },
                            keepday:{
                                required:"请填写保留天数",
                                min:"请至少保留1天",
                                max:"最多能保留1000天"
                            }
                        },
                        onfocus: true,
                        onkeyup: false,　　　　//这个地方要注意，修改去控制器验证的事件。
                        onsubmit: false,

                        errorPlacement: function (error, element) { // render error placement for each input type
                            if (element.attr("name") == "gender") { // for uniform radio buttons, insert the after the given container
                                error.addClass("no-left-padding").insertAfter("#form_gender_error");
                            } else if (element.attr("name") == "payment[]") { // for uniform radio buttons, insert the after the given container
                                error.addClass("no-left-padding").insertAfter("#form_payment_error");
                            } else {
                                error.insertAfter(element); // for other inputs, just perform default behavoir
                            }
                        },

                        invalidHandler: function (event, validator) { //display error alert on form submit
                            success.hide();
                            error.show();
                            App.scrollTo(error, -200);
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
                            if (label.attr("for") == "gender" || label.attr("for") == "payment[]") { // for checkboxes and radip buttons, no need to show OK icon
                                label
                                    .closest('.control-group').removeClass('error').addClass('success');
                                label.remove(); // remove error label here
                            } else { // display success icon for other inputs
                                label
                                    .addClass('valid ok') // mark the current input as valid and display OK icon
                                    .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
                            }
                        },

                        submitHandler: function (form) {
                            success.show();
                            error.hide();
                            //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
                        }
                    });
            var displayConfirm = function() {
                $('.display-value', form).each(function(){
                    var input = $('[name="'+$(this).attr("data-display")+'"]', form);
                    if (input.is(":text") || input.is("textarea")) {
                        $(this).html(input.val());
                    } else if (input.is("select")) {
                        $(this).html(input.find('option:selected').text());
                    } else if (input.is(":radio") && input.is(":checked")) {
                        $(this).html(input.attr("data-title"));
                    } else if ($(this).attr("data-display") == 'card_expiry') {
                        $(this).html($('[name="card_expiry_mm"]', form).val() + '/' + $('[name="card_expiry_yyyy"]', form).val());
                    } else if ($(this).attr("data-display") == 'payment') {
                        var payment = [];
                        $('[name="payment[]"]').each(function(){
                            payment.push($(this).attr('data-title'));
                        });
                        $(this).html(payment.join("<br>"));
                    }
                });
            }

            // default form wizard
            $('#form_wizard_1').bootstrapWizard({

                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',

              onTabClick: function (tab, navigation, index) {
                    return false;
                },
                onNext: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    if (form.valid() == false) {
                        return false;
                    }
                       //验证第一界面是否选择了虚拟机
                    if($("#tab1").hasClass("active")){
                        //选择不同的虚拟化类型出现不同的策略类型
                        var VirtCentType = $("#VirtCentType").val();
                        var $panel_default = $(".panel.panel-default");
                        var $day2 = $(".b2.day2");
                        switch (VirtCentType){
                            case "0":
                                $panel_default.show();
                                break;
                            case "1":
                                $panel_default.show();
                                break;
                            case "2":
                                $panel_default.eq(1).hide();
                                $panel_default.eq(2).hide();
                                $day2.eq(1).click();
                                $day2.eq(2).click();
                                break;
                        }
                        var a1 = "";
                        $("#v_tbody").find(".checkboxes").each(function () {
                            if ($(this).prop("checked") == true) {
                                var vmid = $(this).parent().parent().parent("td").parent("tr").find("td").eq(3).text();
                                a1 = a1 + vmid + ",";
                            }
                        });
                        var a = a1.substring(0,a1.length-1);
                        $("#vmidset-id").val(a);
                        var b1 = "";
                        $("#v_tbody").find(".checkboxes").each(function () {
                            if ($(this).prop("checked") == true) {
                                var vmname = $(this).parent().parent().parent("td").parent("tr").find("td").eq(2).text();
                                b1 = b1 + vmname + ",";
                            }
                        });
                        var b =b1.substring(0,b1.length-1);
                        $("#vmnameset-id").val(b);
                        if($("#vmnameset-id").val()==""||$("#vmidset-id").val()==""){
                            $.confirm({
                                confirmButtonClass: 'btn btn-info',
                                cancelButtonClass: 'btn-danger',
                                confirmButton:'确认',
                                cancelButton:'取消',
                                animation: 'zoom',
                                closeAnimation: 'rotateXR',
                                title: '操作错误！',
                                content: '请选择虚拟机！（此确认框会在2秒后消失）',
                                autoClose: '返回|2000',
                                buttons: {
                                    返回: function () {

                                    }
                                }
                            });
                            return false;
                        }
                    }

                    //验证第二界面是否在按策略备份中选择了时间的策略
                    if($("#tab2").hasClass("active")){
                        if($("#backup_way").val()=="0") {
                            if ($(".panel-heading").eq(0).find(".celue").text() == "" && $(".panel-heading").eq(1).find(".celue").text() == "" && $(".panel-heading").eq(2).find(".celue").text() == "") {
                                $.confirm({
                                    confirmButtonClass: 'btn btn-info',
                                    cancelButtonClass: 'btn-danger',
                                    confirmButton: '确认',
                                    cancelButton: '取消',
                                    animation: 'zoom',
                                    closeAnimation: 'rotateXR',
                                    title: '操作错误！',
                                    content: '请选择时间策略！（此确认框会在2秒后消失）',
                                    autoClose: '返回|2000',
                                    buttons: {
                                        返回: function () {

                                        }
                                    }
                                });
                                return false;
                            }
                        }
                    }
                    //第三界面到第四界面数据传输
                    if($("#tab3").hasClass("active")){
                        var Deldata = $("#Deldata-id").val();
                        $("#Deldata-f").text(Deldata)
                    }
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    // set wizard title
                    $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
                    // set done steps
                    jQuery('li', $('#form_wizard_1')).removeClass("done");
                    var li_list = navigation.find('li');
                    for (var i = 0; i < index; i++) {
                        jQuery(li_list[i]).addClass("done");
                    }

                    if (current == 1) {
                        $('#form_wizard_1').find('.button-previous').hide();
                    } else {
                        $('#form_wizard_1').find('.button-previous').show();
                    }

                    if (current >= total) {
                        $('#form_wizard_1').find('.button-next').hide();
                        $('#form_wizard_1').find('.button-submit').show();
                        displayConfirm();
                    } else {
                        $('#form_wizard_1').find('.button-next').show();
                        $('#form_wizard_1').find('.button-submit').hide();
                    }
                    App.scrollTo($('.page-title'));
                },
                onPrevious: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    var total = navigation.find('li').length;
                    var current = index + 1;
                    // set wizard title
                    $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
                    // set done steps
                    jQuery('li', $('#form_wizard_1')).removeClass("done");
                    var li_list = navigation.find('li');
                    for (var i = 0; i < index; i++) {
                        jQuery(li_list[i]).addClass("done");
                    }

                    if (current == 1) {
                        $('#form_wizard_1').find('.button-previous').hide();
                    } else {
                        $('#form_wizard_1').find('.button-previous').show();
                    }

                    if (current >= total) {
                        $('#form_wizard_1').find('.button-next').hide();
                        $('#form_wizard_1').find('.button-submit').show();
                    } else {
                        $('#form_wizard_1').find('.button-next').show();
                        $('#form_wizard_1').find('.button-submit').hide();
                    }

                    App.scrollTo($('.page-title'));
                },
                onTabShow: function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#form_wizard_1').find('.bar').css({
                        width: $percent + '%'
                    });
                }
            });

            $('#form_wizard_1').find('.button-previous').hide();
            $('#form_wizard_1 .button-submit').hide();
        }

    };

}();