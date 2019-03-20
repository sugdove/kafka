/**
 * Created by suge on 2018/2/28.
 */

//初始化datatable
$('#files').dataTable({
    "aoColumnDefs": [
        {"orderable": false, "aTargets": [0, 1]}// 制定列不参与排序
    ],
    "aLengthMenu": [
        [7, 14, -1],
        [7, 14, "All"] // change per page values here
    ],
    // set the initial value
    "iDisplayLength": 7,
    "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
    "sPaginationType": "bootstrap",
    language: {
        "sProcessing": "处理中...",
        "sLengthMenu": "显示 _MENU_ 项结果",
        "sZeroRecords": "没有匹配结果",
        "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
        "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
        "sInfoPostFix": "",
        "sSearch": "搜索:",
        "sUrl": "",
        "sEmptyTable": "表中数据为空",
        "sLoadingRecords": "载入中...",
        "sInfoThousands": ",",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "上页",
            "sNext": "下页",
            "sLast": "末页"
        },
        "oAria": {
            "sSortAscending": ": 以升序排列此列",
            "sSortDescending": ": 以降序排列此列"
        }
    },
    "aaSorting": [[2, "asc"]]//默认第几个排序
});
//文件夹hover效果
$("body").on("mouseover mouseout", ".tr", function (event) {
    if (event.type == "mouseover") {
        var $i = $(this).children("td").eq(1).children("i");
        if ($i.hasClass("fa-folder")) {
            $i.addClass("fa-folder-open");
        }
        //鼠标悬浮
    } else if (event.type == "mouseout") {
        var $i = $(this).children("td").eq(1).children("i");
        if ($i.hasClass("fa-folder-open")) {
            $i.removeClass("fa-folder-open");
        }
        //鼠标离开
    }
})

$("body").on("click", ".tr_folder", function () {

});

//获取hdfs文件方法
function getfiles(filePath) {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost2 + "/commandExecute/data/getHDFSFiles",
        data: {filePath: filePath},
        async: false,
        success: function (data) {
            //导航链接部分

            if (filePath === "/") {
                $("#show_path").html("<li><a href='javascript:void(0)' data-filepath='/' class='tr_folder'><i class='fa fa-home' style='margin-right: 2px;'></i>Home</a></li>")
            }
            else {
                var pathArr = filePath.split("/");
                var str = "<li><a href='javascript:void(0)' data-filepath='/' class='tr_folder'><i class='fa fa-home' style='margin-right: 2px;'></i>Home</a></li>";
                for (var i = 1; i < pathArr.length; i++) {
                    if (i !== pathArr.length - 1) {
                        var newArray = pathArr.slice(0, i + 1);
                        var newPath = newArray.join("/");
                        str += "<li><a href='javascript:void(0)' class='tr_folder' data-filepath='" + newPath + "'>" + pathArr[i] + "</a></li>"
                    }
                    else if (i === pathArr.length - 1) {
                        str += "<li class='active'>" + pathArr[i] + "</li>";
                    }
                }
                $("#show_path").html(str);
            }

            //table部分
            $("#files").dataTable().fnDestroy();
            var string = "";
            if (filePath !== "/") {
                var path = filePath.split("/").slice(0, -1).join("/");
                if (path === "") {
                    path = "/"
                }
                string += "<tr class='tr tr_folder' data-filepath='" + path + "'><td class='radio_'><input type='radio' name='path' class='checkboxes' data-filepath='" + path + "'></td><td class='radio__'><i class='fa fa-folder'></i></td><td><a href='javascript:void(0)'><i class='fa fa-level-up'></i></a></td><td>hdfs</td></tr>";
            }
            string += "<tr class='tr tr_folder' data-filepath='" + filePath + "'><td class='radio_'><input type='radio' name='path'  class='checkboxes' data-filepath='" + filePath + "'></td><td class='radio__'><i class='fa fa-folder'></i></td><td><a href='javascript:void(0)' title='当前目录'>.</a></td><td>hdfs</td></tr>";
            for (var key in data) {
                if (data[key] === "isDir") {
                    var arr = key.split("/");
                    var showpath = arr[arr.length - 1];
                    string += "<tr class='tr tr_folder' data-filepath='" + key + "'><td class='radio_'><input type='radio' name='path'  class='checkboxes' data-filepath='" + key + "'></td><td class='radio__'><i class='fa fa-folder'></i></td><td><a href='javascript:void(0)'>" + showpath + "</a></td><td>hdfs</td></tr>";
                }
                else if (data[key] === "isFile") {
                    var arr2 = key.split("/");
                    var showpath2 = arr2[arr2.length - 1];
                    string += "<tr class='tr tr_file' data-filepath='" + key + "'><td class='radio_'><input type='radio' name='path' class='checkboxes' data-filepath='" + key + "'></td><td class='radio__'><i class='fa fa-file-o'></i></td><td><a href='javascript:void(0)'>" + showpath2 + "</a></td><td>hdfs</td></tr>";
                }
            }
            $("#files_tbody").html(string);
            //改变checkbox样式
            if (!jQuery().uniform) {
                return;
            }
            var test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle, .star)");
            if (test.size() > 0) {
                test.each(function () {
                    if ($(this).parents(".checker").size() == 0) {
                        $(this).show();
                        $(this).uniform();
                    }
                });
            }
            $('#files').dataTable({
                "aoColumnDefs": [
                    {"orderable": false, "aTargets": [0, 1, 2, 3]}// 制定列不参与排序
                ],
                "aLengthMenu": [
                    [7, 14, -1],
                    [7, 14, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 7,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                language: {
                    "sProcessing": "处理中...",
                    "sLengthMenu": "显示 _MENU_ 项结果",
                    "sZeroRecords": "没有匹配结果",
                    "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                    "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                    "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                    "sInfoPostFix": "",
                    "sSearch": "搜索:",
                    "sUrl": "",
                    "sEmptyTable": "表中数据为空",
                    "sLoadingRecords": "载入中...",
                    "sInfoThousands": ",",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "上页",
                        "sNext": "下页",
                        "sLast": "末页"
                    },
                    "oAria": {
                        "sSortAscending": ": 以升序排列此列",
                        "sSortDescending": ": 以降序排列此列"
                    }
                },
                "aaSorting": [[2, "asc"]]//默认第几个排序
            });

        },
        error: function () {
            alert("系统错误")
        }
    })
}

//点击进入文件夹
$("body").on("click", ".tr_folder", function () {
    var filePath = $(this).data("filepath");
    getfiles(filePath);
});
//阻止radio的冒泡事件
$("body").on("click", "input[type='radio']", function (e) {
    e.stopPropagation();
});
//点击查看详细内容调用api
$("#all_task_tbody").on("click", ".detail_content", function () {
    var $tr = $(this).parent("td").parent("tr");
    var filePath = $tr.children("td").eq(1).text();
    var type = $tr.children("td").eq(2).text();
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost2 + "/commandExecute/data/resultData",
        data: {filePath: filePath, type: type},
        async: false,
        success: function (data) {
            var str;
            var thstr = "<thead><tr><td></td>";
            if (type === "统计检验" || type === "分类建模") {
                //thead部分
                for (var nn in data['keys']) {
                    thstr += "<th>" + data['keys'][nn] + "</th>"
                }
                thstr += "</tr></thead>";
                delete data['keys']
                //tbody部分

                for (let key in data) {
                    var CN_key;
                    switch (key) {
                        case "min":
                            CN_key = "最小值";
                            break;
                        case "max":
                            CN_key = "最大值";
                            break;
                        case "median":
                            CN_key = "中位数";
                            break;
                        case "mean":
                            CN_key = "平均值";
                            break;
                        case "var":
                            CN_key = "方差";
                            break;
                        case "sd":
                            CN_key = "标准差";
                            break;
                        case "q1":
                            CN_key = "四分之一分位点";
                            break;
                        case "q3":
                            CN_key = "四分之三分位点";
                            break;
                        case "zero":
                            CN_key = "零的个数";
                            break;
                        case "norm":
                            CN_key = "正太分布";
                            break;
                        case "na":
                            CN_key = "NA的个数";
                            break;
                        case "na_p":
                            CN_key = "NA所占的比例";
                            break;
                        case "cv":
                            CN_key = "变异系数";
                            break;
                        case "skewness":
                            CN_key = "偏度";
                            break;
                        case "kurtosis":
                            CN_key = "峰度";
                            break;
                        case "colnames":
                            CN_key = "列名";
                            break;
                        case "type":
                            CN_key = "类型";
                            break;
                        default:
                            CN_key = key;
                            break;
                    }
                    var string2 = "<tr><td style='width: 10%;'>" + CN_key + "</td>";


                    for (var key2 in data[key]) {
                        var message;
                        if (key === "norm" && data[key][key2] == "1") {
                            message = "服从"
                        }
                        if (key === "norm" && data[key][key2] == "0") {
                            message = "不服从"
                        }
                        else {
                            message = data[key][key2];
                        }
                        string2 += "<td title='"+message+"' class='overhide2'>" + message + "</td>";
                    }
                    string2 += "</tr>";
                    str += string2;
                }
                str = "<tbody>" + str + "</tbody>";
                str = thstr + str;
            }
            else {
                var rstr1 = "";
                for (var key3 in data[0]) {
                    rstr1 += "<th>" + key3 + "</th>";
                }
                str += "<thead><tr>" + rstr1 + "</tr></thead>";
                var rstr2 = "";
                var arr = [];
                for (var key_ in data[0]) {
                    arr.push(key_);
                }
                console.log(arr)
                for (let key in data) {
                    rstr2 += "<tr>";
                    for (var i = 0; i < arr.length; i++) {
                        var val = data[key][arr[i]];
                        if (val === undefined) {
                            val = ""
                        }
                        rstr2 += "<td>" + val + "</td>";
                    }
                    /*  for(var key2 in data[key]){
                      var val = data[key][key2];

                      }*/
                    rstr2 += "</tr>";
                }
                str += "<tbody>" + rstr2 + "</tbody>"
            }
            if (data == "" || JSON.stringify(data) === "{}") {
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton: '确认',
                    cancelButton: '取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '数据为空！',
                    content: '内容数据为空（此确认框会在3秒后消失）',
                    autoClose: '确认|3000',
                    buttons: {
                        确认: function () {

                        },
                    }
                });
            }
            else {
                $("#detail_content").html(str);
                $("#myModal").modal();
            }
        },
        error: function () {
            alert("系统错误")
        }
    });
});
//删除
$("body").on("click", "#model_task_delete", function () {
    var length = $("#all_task_tbody").find("input[type='checkbox']:checked").length;
    if (length >= 1) {
        $.confirm({
            confirmButtonClass: 'btn btn-info',
            cancelButtonClass: 'btn-danger',
            confirmButton: '确认',
            cancelButton: '取消',
            animation: 'zoom',
            closeAnimation: 'rotateXR',
            title: '删除？',
            content: '确认是否删除（此确认框会在8秒后消失）',
            autoClose: '否|8000',
            buttons: {
                deleteUser: {
                    text: '是',
                    action: function () {
                        var arr = [];
                        $("#all_task_tbody").find("input[type='checkbox']:checked").each(function () {
                            arr.push($(this).val())
                        });
                        var serverids = arr.join(",");
                        var $v_tobdy = $("#all_task_tbody");
                        var tr = $v_tobdy.find("input[type='checkbox']:checked").parent().parent().parent().parent("tr");
                        $.ajax({
                            url: "http://" + localhost2 + "/commandExecute/model/delete",
                            cache: true,
                            type: "post",
                            data: {jobIds: serverids},
                            async: false,
                            success: function (data) {
                                if (data === true) {
                                    $.confirm({
                                        confirmButtonClass: 'btn btn-info',
                                        cancelButtonClass: 'btn-danger',
                                        confirmButton: '确认',
                                        cancelButton: '取消',
                                        animation: 'zoom',
                                        closeAnimation: 'rotateXR',
                                        title: '删除成功！',
                                        content: '任务成功删除！（此确认框会在3秒后消失）',
                                        autoClose: '确定|3000',
                                        buttons: {
                                            确定: function () {
                                                tr.each(function () {
                                                    $("#all_task").DataTable().row($(this)).remove().draw(false);
                                                });
                                            }
                                        }
                                    });
                                }
                                else if (data === false) {
                                    $.confirm({
                                        confirmButtonClass: 'btn btn-info',
                                        cancelButtonClass: 'btn-danger',
                                        confirmButton: '确认',
                                        cancelButton: '取消',
                                        animation: 'zoom',
                                        closeAnimation: 'rotateXR',
                                        title: '删除失败！',
                                        content: '系统原因删除失败（此确认框会在3秒后消失）',
                                        autoClose: '确认|3000',
                                        buttons: {
                                            确认: function () {

                                            },
                                        }
                                    });
                                }
                            }
                        })

                    }
                },
                否: function () {

                }
            }
        });

    }
    else if (length === 0) {
        $.confirm({
            confirmButtonClass: 'btn btn-info',
            cancelButtonClass: 'btn-danger',
            confirmButton: '确认',
            cancelButton: '取消',
            animation: 'zoom',
            closeAnimation: 'rotateXR',
            title: '操作错误！',
            content: '请勾选至少一个模型（此确认框会在3秒后消失）',
            autoClose: '确认|3000',
            buttons: {
                确认: function () {

                },
            }
        });
    }
});
//获取R文件列表
$.ajax({
    url: "http://" + localhost2 + "/commandExecute/rcommand/getFiles",
    cache: true,
    type: "post",
    async: false,
    success: function (data) {
        console.log(data);
        var str1 = "";
        var str2 = "";
        var str3 = "";
        for (var key in data) {
            var type = data[key]["type"];
            var choose_type = type.substring(type.length - 2, type.length);
            console.log(choose_type)
            if (choose_type === '建模') {
                str1 += "<li><a href='javascript:void(0)' data-role='leaf' class='vmid' data-type='" + type + "'><span class='vm'></span>" + type + "</a></li>";

            }
            else if (type === '预测') {
                str2 += "<li><a href='javascript:void(0)' data-role='leaf' class='vmid'  data-type='" + type + "'><span class='vm'></span>" + type + "</a></li>";
            }
            else {
                str3 += "<li><a href='javascript:void(0)' data-role='leaf' class='vmid' data-type='" + type + "'><span class='vm'></span>" + type + "</a></li>";
            }
        }
        $("#tree_node").html(str1);
        $("#tree_node_2").html(str2);
        $("#tree_node_3").html(str3);
    }
});
$("body").on("click", ".tree-toggle", function () {
    $(this).addClass("closed");
    $(this).next("ul").removeClass("in");
});
$("body").on("click", ".closed", function () {
    $(this).removeClass("closed");
    $(this).next("ul").addClass("in");
});
//获取R方法列表
$("#tree_1").on("click", ".vmid", function () {
    $("#sample_1").dataTable().fnDestroy();
    $(".vmid").removeClass("eee");
    $(this).addClass("eee");
    var type = $(this).text();
    $(".black_overlay").show();
    $(".spinner").show();
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost2 + "/commandExecute/rcommand/selectMethods",
        data: {type: type},
        async: true,
        success: function (data) {
            $(".alert-info").hide();
            $(".clearfix").show();
            $("#virtcent").show();
            $("#sample_1").show();
            $(".black_overlay").hide();
            $(".spinner").hide();
            $("#sample_1").dataTable().fnDestroy();
            $("#sample_1_thead").find("th").eq(0).css("width", "6%");
            var length = data.length;
            var str = "";

            for (var i = 0; i < length; i++) {
                var file = data[i].file
                var num = i + 1;
                var method = data[i].method;
                var description = data[i].description;
                var parameters = data[i].parameters;
                str += "<tr class='odd gradeX' data-file='" + file + "'><td>" + num + "</td><td>" + method + "</td><td>" + description + "</td><td><span class='label label-info runR' onclick='return false' data-target='#myModal2' data-toggle='modal' data-parameters='" + parameters + "'><i class='fa fa-play'></i> 调用方法</span></td></tr>"
            }
            $("#v_tbody").html(str);
            if (!jQuery().uniform) {
                return;
            }
            var test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle, .star)");
            if (test.size() > 0) {
                test.each(function () {
                    if ($(this).parents(".checker").size() == 0) {
                        $(this).show();
                        $(this).uniform();
                    }
                });
            }
            $('#sample_1').dataTable({
                "aoColumnDefs": [
                    {"orderable": false, "aTargets": [1, 2, 3]}// 制定列不参与排序
                ],
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 5,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                language: {
                    "sProcessing": "处理中...",
                    "sLengthMenu": "显示 _MENU_ 项结果",
                    "sZeroRecords": "没有匹配结果",
                    "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                    "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                    "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                    "sInfoPostFix": "",
                    "sSearch": "搜索:",
                    "sUrl": "",
                    "sEmptyTable": "表中数据为空",
                    "sLoadingRecords": "载入中...",
                    "sInfoThousands": ",",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "上页",
                        "sNext": "下页",
                        "sLast": "末页"
                    },
                    "oAria": {
                        "sSortAscending": ": 以升序排列此列",
                        "sSortDescending": ": 以降序排列此列"
                    }
                },
                "aaSorting": [[0, "asc"]],//默认第几个排序
            });
            //checkboxes的全选和全不选
            jQuery('#sample_1 .group-checkable').change(function () {

                var set = jQuery(this).attr("data-set");
                var checked = jQuery(this).is(":checked");
                jQuery(set).each(function () {
                    if (checked) {
                        $(this).attr("checked", true);
                    } else {
                        $(this).attr("checked", false);
                    }
                });
                jQuery.uniform.update(set);
            });


        },

        error: function (data) {
            $.confirm({
                confirmButtonClass: 'btn btn-info',
                cancelButtonClass: 'btn-danger',
                confirmButton: '确认',
                cancelButton: '取消',
                animation: 'zoom',
                closeAnimation: 'rotateXR',
                title: '连接超时！',
                content: '连接超时请检查错误（此确认框会在3秒后消失）',
                autoClose: '确定|3000',
                buttons: {
                    确定: function () {
                        $(".black_overlay").hide();
                        $(".spinner").hide();
                        $("#v_tbody").html("");
                    }
                }
            });
        }

    });
});
var file;
var type;
var method;
var description;
//点击调用方法弹出参数模态框
$("body").on("click", ".runR", function () {
    var this_ = $(this);
    var $eee = $(".eee");
    var $tr = this_.parent().parent("tr");
    file = $(this).parent().parent('tr').data('file');
    type = $eee.data("type");
    method = $tr.find("td").eq(1).text();
    description = $tr.find("td").eq(2).text();
    var parameters_ = this_.data("parameters");
    var string = "";
    for (var key in parameters_) {
        var showkey = key.substring(1, key.length);
        var way = key.substring(0, 1);
        switch (way) {
            //真实存在路径
            case "T":
                string += "<div class='control-group rel' ><label class='control-label param_key'>" + showkey + "<span class='required'>*</span></label><div class='controls'><input type='text' class='param_value T_path' required><span class='label label-success choose_path' data-toggle='modal' data-target='#myModal3'>选择路径</span><p class='help-block param_block'>" + parameters_[key] + ".</p></div></div>";
                break;
            //可以为自己创建路径
            case "F":
                string += "<div class='control-group rel' ><label class='control-label param_key'>" + showkey + "<span class='required'>*</span></label><div class='controls'><input type='text' class='param_value F_path' name='f_path' required><span class='label label-success choose_path' data-toggle='modal' data-target='#myModal3'>选择路径</span><p class='help-block param_block'>" + parameters_[key] + ".</p></div></div>";
                break;
            //整型
            case "I":
                string += "<div class='control-group rel' ><label class='control-label param_key'>" + showkey + "<span class='required'>*</span></label><div class='controls'><input type='text'  class='param_value'  name='int' required><p class='help-block param_block'>" + parameters_[key] + ".</p></div></div>";
                break;
            //列名
            case "L":
                string += "<div class='control-group rel' ><label class='control-label param_key'>" + showkey + "<span class='required'>*</span></label><div class='controls'><input type='text' class='param_value RowName' name='rowName' required><p class='help-block param_block'>" + parameters_[key] + ".</p></div></div>";
                break;
            //唯一的模型路径
            case "M":
                string += "<div class='control-group rel' ><label class='control-label param_key'>" + showkey + "<span class='required'>*</span></label><div class='controls'><input type='text' class='param_value M_path' name='f_path' required><span class='label label-success choose_path' data-toggle='modal' data-target='#myModal4'>选择路径</span><p class='help-block param_block'>" + parameters_[key] + ".</p></div></div>";
                break;
            //模型名称
            case "N":
                string += "<div class='control-group rel' ><label class='control-label param_key'>" + showkey + "<span class='required'>*</span></label><div class='controls'><input type='text' class='param_value ModelName' name='ModelName' required><p class='help-block param_block'>" + parameters_[key] + ".</p></div></div>";
                break;
            //普通情况(传值加引号)
            case "P":
                string += "<div class='control-group rel' ><label class='control-label param_key'>" + showkey + "<span class='required'>*</span></label><div class='controls'><input type='text' class='param_value PuTong' name='PuTong' required><p class='help-block param_block'>" + parameters_[key] + ".</p></div></div>";
                break;

        }
    }
    $("#param").html(string);
    /*  $.validator.addMethod("rowName",function(value,element,params){
          //var reg= /^([a-zA-Z]:\/(\w*\/)*\w*)|([a-zA-Z]:\\(\w*\\)*\w*)|\/(\w*\/)*\w*|\\(\w*\\)*\w*$/;
          var reg= /^\S*(,\S*)*$/;
          /!*var reg= /^([a-zA-Z]:((\\[0-9a-zA-Z]+)+)|(\\))|([a-zA-Z]:((\/[0-9a-zA-Z]+)+)|(\/))$/;*!/
          //var reg2=/\/.+$/;
          if(reg.test(value)){
              return true;
          }else{
              return false;
          }
      },"格式不正确，请用逗号分隔");
      $("#modal2").validate({
          rules:{
              rowName:"rowName",
              int:"int"
          },
          submitHandler: function() {
              alert("提交事件!");
          }
      });*/
});
//点击choose_path
var $path_in;
$("body").on("click", ".choose_path", function () {
    getfiles("/");
    $path_in = $(this).parent().children("input[type='text']")
});
//调用R方法
$("#modal2").on("submit", function () {
    var arr = [];
    $(".param_value").each(function () {
        var param;
        if ($(this).hasClass("T_path")) {
            param = "\"" + "hdfs://" + $(this).val() + "\"";
        }
        else if ($(this).hasClass("F_path")) {
            var str = new Date().getTime();
            param = "\"" + "hdfs://" + $(this).val() + "\/" + str + "\"";
        }
        else if ($(this).hasClass("RowName")) {
            param = "\"" + $(this).val() + "\"";
        }
        else if ($(this).hasClass("PuTong")) {
            param = "\"" + $(this).val() + "\"";
        }
        else if($(this).hasClass("M_path")){
            param = "\"" + $(this).val()+"\""
        }
        else {
            param = $(this).val();
        }
        arr.push(param);
    });
    var parameters = arr.join(",");
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost2 + "/commandExecute/rcommand/execute",
        data: {file: file, method: method, description: description, type: type, parameters: parameters},
        async: true,
        success: function (data) {
            if (data === true) {
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton: '确认',
                    cancelButton: '取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '调用成功！',
                    content: 'R方法调用成功（此确认框会在3秒后消失）',
                    autoClose: '确认|3000',
                    buttons: {
                        确认: function () {
                            $("#myModal2").modal('hide');
                        },
                    }
                });
            }
            else if (data === false) {
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton: '确认',
                    cancelButton: '取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '调用失败！',
                    content: 'R方法调用失败（此确认框会在3秒后消失）',
                    autoClose: '确认|3000',
                    buttons: {
                        确认: function () {
                            $("#myModal2").modal('hide');
                        },
                    }
                });
            }
        },

        error: function (data) {
            alert("后台错误" + data);
            $("#myModal2").modal('hide');
        }
    });

    return false;
});

/**
 * 获取列名方法
 */

function getRowName(filePath) {
    let param;
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost2 + "/commandExecute/data/getListName",
        data: {filePath: filePath},
        dataType: 'text',
        async: false,
        success: function (data) {
            param = data
        },

        error: function (err) {
        }
    });
    return param
}

/**
 * 获取真实路径并在存在列名的情况下获取列名并将值赋值到input上
 */

$(".path_submit").click(function () {
    var path = $("#files_tbody").find("input[type='radio']:checked").data("filepath");
    $path_in.val(path);
    if ($path_in.hasClass('T_path')) {
        $('.param_value').each(function () {
            if ($(this).hasClass('RowName')) {
                $(this).val(getRowName(path));
                return false
            }
        });
    }
    $("#myModal3").modal("hide")
});

/**
 * 用户直接进行真实路径修改判断并调用获取列名方法
 */

$('#param').on('change', '.T_path', function () {
    let path = $(this).val();
    $('.param_value').each(function () {
        if ($(this).hasClass('RowName')) {
            $(this).val(getRowName(path));
            return false
        }
    });

});

/**
 * 点击确定赋值路径到模型路径上
 */

$('.path_submit4').click(function () {
    let path = $('.MPathRadio:checked').val();
    path = path.substring(1, path.length - 1);
    $('.M_path').val(path);
    $('#myModal4').modal('hide');
});
