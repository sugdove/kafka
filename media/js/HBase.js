/*******************HBase表DIV部分****************/
var $body = $("body");
//获取zookeeper列表
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
                str += "<li class='vcip_li' data-zookeeper='"+zookeeper+"' data-znode='"+znode+"' title='"+timestam+"'><img src='media/image/datacenter.png' class='zookeeper_img'>"+showzookeeper+"</li>";
        }
        $("#vmware-list").html(str);
    }
});
var z_ip;
var z_port;
var z_znode;
$("#vmware-list").on("click",".vcip_li",function () {
    $("#sample_1").dataTable().fnDestroy();
    $(".vcip_li").removeClass("eee");
    $(this).addClass("eee");
    var zookeeper = $(this).data("zookeeper");
    z_znode = $(this).data("znode");
    z_ip = zookeeper.split(":")[0];
    z_port = zookeeper.split(":")[1];
    $(".black_overlay").show();
    $(".spinner").show();
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/longGangKafka/getAllTables",
        data:{hbasezk:z_ip,hbaseport:z_port,znode:z_znode},
        async: true,
        success: function (data) {
            if(data.length==1&&data[0].tableName==="-1"){
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
                            $("#virtcent").hide();
                            $(".clearfix").hide();
                            $(".alert-info").show();
                        }
                    }
                });
            }else{
                $(".alert-info").hide();
                $(".clearfix").show();
                $("#virtcent").show();
                $(".black_overlay").hide();
                $(".spinner").hide();
                $("#sample_1").dataTable().fnDestroy();
                $("#sample_1_thead").find("th").eq(4).css("width","10%");
                $("#sample_1_thead").find("th").eq(0).css("width","3%");
                var length = data.length;
                var i = 0;
                var str ="";
                for (i; i < length; i++) {
                    var num = i + 1;
                    var tableName = data[i].tableName;
                    var enable = data[i].enable;
                    var manage;
                    switch (enable) {

                        case true:
                            enable = "<span class='label label-success'>可用</span>";
                            manage = "<a href='javascript:void(0)' class='stop1'><i class='glyphicon glyphicon-stop'></i>禁&nbsp&nbsp&nbsp用</a>";
                            break;
                        case false:
                            enable = "<span class='label label-danger'>不可用</span>";
                            manage = "<a href='javascript:void(0)' class='start1'><i class='glyphicon glyphicon-play'></i>启&nbsp&nbsp&nbsp用</a>";
                            break;
                    }
                    str+="<tr class='odd gradeX'><td class='sorting_1'><input type='radio' name='tableName' class='checkboxes ck2' value='" + tableName + "'></td><td>" + num + "</td><td>" + tableName + "</td><td class='hidden-480'>" + enable + "</td><td><div class='btn-group mmm'><button type='button' class='btn btn yellow pad' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='glyphicon glyphicon-hand-up'></i>操作<span class='fa fa-angle-down'></span></button><ul class='dropdown-menu'><li class='change_point'>" + manage + "</li><li><a href='javascript:void(0)'   class='oneway empty_data'><i class='fa fa-trash'></i>清空表数据</a></li></ul></div></td></tr>"


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
                        {"orderable": false, "aTargets": [0, 2, 3, 4]}// 制定列不参与排序
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
                    "aaSorting": [[1, "asc"]],//默认第几个排序
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
            }

        },

        error:function (data) {
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
var Choose_tableName;
//点击radio删除和浏览按钮可用
$body.on("change", ".ck2", function () {
    $("#delete_virtcent").attr("disabled", false);
    var $status = $(this).parent().parent().parent().parent("tr").children("td").eq(3).text();
    var $search1 = $("#search1");
    //根据状态浏览按钮可否能用判断
    switch ($status) {
        case "不可用":
            $search1.attr("disabled", true);
            break;
        case "可用":
            $search1.attr("disabled", false);
            break;
    }
    Choose_tableName = $(this).val();
});
//创建HBase表
$body.on("click", "#modal-submit2", function () {
    var zookeeper = $(".iframe").find(".eee").data("zookeeper");
    var z_ip = zookeeper.split(":")[0];
    var z_port = zookeeper.split(":")[1];
    var l_arr=[];
    var tableName = $("#TableName_2").val();
    var znode_ = $(".eee").data("znode");
    var znode ={name:"znode",value:znode_};
    var json ={name:"tableName",value:tableName};
    var hbasezk = {name:"hbasezk",value:z_ip};
    var hbaseport = {name:"hbaseport",value:z_port};
    var arr = $("#rowFamilys_2").val().split(",");
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
                    }
                }
            });
        }
    })
});
//删除HBase表
$body.on("click", "#delete_virtcent", function () {
    var tr = $("#v_tbody").find("input[type='radio']:checked").parent().parent().parent().parent("tr");
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
                    $.ajax({
                        url: "http://" + localhost + "/longGangKafka/deleteTable",
                        cache: true,
                        type: "post",
                        dataType: "json",
                        data: {tableName: Choose_tableName,hbasezk:z_ip,hbaseport:z_port,znode:z_znode},
                        async: false,
                        success: function (data) {
                            $.confirm({
                                confirmButtonClass: 'btn btn-info',
                                cancelButtonClass: 'btn-danger',
                                confirmButton: '确认',
                                cancelButton: '取消',
                                animation: 'zoom',
                                closeAnimation: 'rotateXR',
                                title: '删除成功！',
                                content: 'HBase表删除！（此确认框会在3秒后消失）',
                                autoClose: '确定|3000',
                                buttons: {
                                    确定: function () {
                                        tr.each(function () {
                                            $("#sample_1").DataTable().row($(this)).remove().draw(false);
                                            $("#delete_virtcent").attr("disabled", true);
                                            $("#search1").attr("disabled", true);
                                        });
                                    }
                                }
                            });
                        }
                    })
                }
            },
            否: function () {

            }
        }
    });
});
//启动HBase表
$body.on("click", ".start1", function () {
    var this_ = $(this).parent("li").parent("ul").parent().parent("td").parent("tr");
    var tableName = this_.find("td").eq(2).text();
    var the = $(this);
    $.confirm({
        confirmButtonClass: 'btn btn-info',
        cancelButtonClass: 'btn-danger',
        confirmButton: '确认',
        cancelButton: '取消',
        animation: 'zoom',
        closeAnimation: 'rotateXR',
        title: '启动？',
        content: '确认是否启动该表（此确认框会在8秒后消失）',
        autoClose: '否|8000',
        buttons: {
            deleteUser: {
                text: '是',
                action: function () {
                    $.ajax({
                        url: "http://" + localhost + "/longGangKafka/enableTable",
                        cache: true,
                        type: "post",
                        dataType: "json",
                        data: {tableName: tableName,hbasezk:z_ip,hbaseport:z_port,znode:z_znode},
                        async: false,
                        success: function (data) {
                            $.confirm({
                                confirmButtonClass: 'btn btn-info',
                                cancelButtonClass: 'btn-danger',
                                confirmButton: '确认',
                                cancelButton: '取消',
                                animation: 'zoom',
                                closeAnimation: 'rotateXR',
                                title: '启动成功！',
                                content: '恭喜你启动该表成功！（此确认框会在3秒后消失）',
                                autoClose: '确定|3000',
                                buttons: {
                                    确定: function () {
                                        the.parent("li").html("<a href='javascript:void(0)' class='stop1'><i class='glyphicon glyphicon-stop'></i>禁&nbsp&nbsp&nbsp用</a>");
                                        this_.find("td").eq(3).html("<span class='label label-success'>可用</span>")
                                    }
                                }
                            });
                        }
                    })
                }
            },
            否: function () {

            },
        }
    });
});
//禁用HBase表
$body.on("click", ".stop1", function () {
    var this_ = $(this).parent("li").parent("ul").parent().parent("td").parent("tr");
    var the = $(this);
    var tableName = this_.find("td").eq(2).text();
    $.confirm({
        confirmButtonClass: 'btn btn-info',
        cancelButtonClass: 'btn-danger',
        confirmButton: '确认',
        cancelButton: '取消',
        animation: 'zoom',
        closeAnimation: 'rotateXR',
        title: '禁用？',
        content: '确认是否禁用该表（此确认框会在8秒后消失）',
        autoClose: '否|8000',
        buttons: {
            deleteUser: {
                text: '是',
                action: function () {
                    $.ajax({
                        url: "http://" + localhost + "/longGangKafka/disableTable",
                        cache: true,
                        type: "post",
                        data: {tableName: tableName,hbasezk:z_ip,hbaseport:z_port,znode:z_znode},
                        async: false,
                        success: function (data) {
                            $.confirm({
                                confirmButtonClass: 'btn btn-info',
                                cancelButtonClass: 'btn-danger',
                                confirmButton: '确认',
                                cancelButton: '取消',
                                animation: 'zoom',
                                closeAnimation: 'rotateXR',
                                title: '禁用成功！',
                                content: '恭喜你禁用该表成功！（此确认框会在3秒后消失）',
                                autoClose: '确定|3000',
                                buttons: {
                                    确定: function () {
                                        the.parent("li").html("<a href='javascript:void(0)' class='start1'><i class='glyphicon glyphicon-play'></i>启&nbsp&nbsp&nbsp用</a>");
                                        this_.find("td").eq(3).html("<span class='label label-danger'>不可用</span>");
                                        if(this_.find("td").eq(0).prop("checked",true)){
                                         $("#search1").attr("disabled",true)
                                        }
                                    }
                                }
                            });
                        }
                    })
                }
            },
            否: function () {

            },
        }
    });
});
//清空表数据
$body.on("click", ".empty_data", function () {
    var this_ = $(this).parent("li").parent("ul").parent().parent("td").parent("tr");
    var tableName = this_.find("td").eq(2).text();
    $.confirm({
        confirmButtonClass: 'btn btn-info',
        cancelButtonClass: 'btn-danger',
        confirmButton: '确认',
        cancelButton: '取消',
        animation: 'zoom',
        closeAnimation: 'rotateXR',
        title: '清空表？',
        content: '确认是清空表（此确认框会在8秒后消失）',
        autoClose: '否|8000',
        buttons: {
            deleteUser: {
                text: '是',
                action: function () {
                    $.ajax({
                        url: "http://" + localhost + "/longGangKafka/deleteAllColumn",
                        cache: true,
                        type: "post",
                        data: {tableName: tableName,hbasezk:z_ip,hbaseport:z_port,znode:z_znode},
                        async: false,
                        success: function (data) {
                            $.confirm({
                                confirmButtonClass: 'btn btn-info',
                                cancelButtonClass: 'btn-danger',
                                confirmButton: '确认',
                                cancelButton: '取消',
                                animation: 'zoom',
                                closeAnimation: 'rotateXR',
                                title: '成功！',
                                content: '表的数据成功清空！（此确认框会在3秒后消失）',
                                autoClose: '确定|3000',
                                buttons: {
                                    确定: function () {
                                    },
                                }
                            });

                        }
                    })
                }
            },
            否: function () {

            },
        }
    });

});
//获取到表数据后的操作
$body.on("change", ".empty_data", function () {
    var this_ = $(this).parent("li").parent("ul").parent().parent("td").parent("tr");
    var tableName = this_.find("td").eq(2).text();
    $.confirm({
        confirmButtonClass: 'btn btn-info',
        cancelButtonClass: 'btn-danger',
        confirmButton: '确认',
        cancelButton: '取消',
        animation: 'zoom',
        closeAnimation: 'rotateXR',
        title: '清空表？',
        content: '确认是清空表（此确认框会在8秒后消失）',
        autoClose: '否|8000',
        buttons: {
            deleteUser: {
                text: '是',
                action: function () {
                    $.ajax({
                        url: "http://" + localhost + "/longGangKafka/deleteAllColumn",
                        cache: true,
                        type: "post",
                        data: {tableName: tableName,hbasezk:z_ip,hbaseport:z_port,znode:z_znode},
                        async: false,
                        success: function (data) {
                            $.confirm({
                                confirmButtonClass: 'btn btn-info',
                                cancelButtonClass: 'btn-danger',
                                confirmButton: '确认',
                                cancelButton: '取消',
                                animation: 'zoom',
                                closeAnimation: 'rotateXR',
                                title: '成功！',
                                content: '表的数据成功清空！（此确认框会在3秒后消失）',
                                autoClose: '确定|3000',
                                buttons: {
                                    确定: function () {
                                    },
                                }
                            });

                        }
                    })
                }
            },
            否: function () {

            },
        }
    });

});
function TableInfo(json) {
    var str = "";
    for (var key in json) {
        str += "<div class='view-row'><div class='search2 navbar navbar-default'>" + key + "</div><ul class='smartview-cells'>"
        for (var key2 in json[key]) {
            var familyName = json[key][key2]["familyName"];
            var colName = json[key][key2]["colName"];
            var colValue = json[key][key2]["colValue"];
            str += "<li class='liclass' ><div class='remove_data'><img src='media/image/remove_data.png' alt='删除' class='remove_data_img'></div><div><h6><span class='familyName' >" + familyName + ":</span><span class='laber'>" + colName + "</span><div><input type='text'  name='colValue' class='pre' value='" + colValue + "' data-colvalue='" + colValue + "' data-colname='" + colName + "' data-familyname='" + familyName + "' data-key='" + key + "'></div></h6></div></li>"
        }
        str += "</ul></div>"
    }
    $("#itemContainer").html(str)
}
//浏览HBase表
$body.on("click", "#search1", function () {
    var this_ = $(this).parent("li").parent("ul").parent().parent("td").parent("tr");
    var tableName = this_.find("td").eq(2).text();
    $.ajax({
        url: "http://" + localhost + "/longGangKafka/scanTable",
        cache: true,
        type: "post",
        data: {tableName: Choose_tableName,hbasezk:z_ip,hbaseport:z_port,znode:z_znode},
        async: false,
        success: function (data) {
            $("#HBase_table").hide();
            $("#TableInfo").show();
            $("#TableName_").val(Choose_tableName);
            TableInfo(data);
        }
    })
});
/*******************表信息DIV部分****************/
//点击返回返回到上一个部分
$body.on("click", "#Return", function () {
    $("#HBase_table").show();
    $("#TableInfo").hide();
});
//修改表数据
$body.on("change", ".pre", function () {
    var tableName = Choose_tableName;
    var rowKey = $(this).data("key");
    var rowFamilys = $(this).data("familyname");
    var colName = $(this).data("colname");
    var colValue = $(this).val();
    $.ajax({
        url: "http://" + localhost + "/longGangKafka/updateTable",
        cache: true,
        type: "post",
        data: {tableName: tableName, rowKey: rowKey, rowFamilys: rowFamilys, colName: colName, colValue: colValue,hbasezk:z_ip,hbaseport:z_port,znode:z_znode},
        async: false,
        success: function (data) {

        }
    })
});
//检索表数据
$body.on("click", "#modal-submit", function () {
    var tableName = Choose_tableName;
    var rowPrefix = $("#rowPrefix_").val();
    var limit = $("#limit_").val();
    var rowKey = $("#rowKey_").val();
    var rowFamilys = $("#rowFamilys_").val();
    var compstr = $("#compstr_").val();
    var statrtRowkey = $("#statrtRowkey_").val();
    var endRowkey = $("#endRowkey_").val();
    $.ajax({
        url: "http://" + localhost + "/longGangKafka/getData",
        cache: true,
        type: "post",
        data:{tableName:tableName,limit:limit,hbasezk:z_ip,hbaseport:z_port,znode:z_znode,statrtRowkey:statrtRowkey,endRowkey:endRowkey},
        /*{tableName:tableName,rowPrefix:rowPrefix,limit:limit,rowKey:rowKey,rowFamilys:rowFamilys,compstr:compstr,hbasezk:z_ip,hbaseport:z_port,znode:z_znode},*/
        async: false,
        success: function (data) {
            TableInfo(data);
            $('#myModal').modal('hide');
        }
    })
});
//不填写时间不能提交
$body.on("change", ".Rowkey_time", function () {
    if($(".Rowkey_time").eq(0).val()===""||$(".Rowkey_time").eq(1).val()===""){
      $("#modal-submit").attr("disabled",true);
    }
    else if($(".Rowkey_time").eq(0).val()!==""&&$(".Rowkey_time").eq(1).val()!==""){
        $("#modal-submit").attr("disabled",false);
    }
});
//控制删除按钮的可见
$body.on("mouseover", ".liclass", function () {
    $(this).find(".remove_data_img").show()
});
$body.on("mouseout", ".liclass", function () {
    $(this).find(".remove_data_img").hide()
});
//删除列
$body.on("click", ".remove_data_img", function () {
    var $liclass = $(this).parent("div").parent(".liclass");
    var $input = $(this).parent("div").parent(".liclass").find("input[type='text']");
    var tableName = Choose_tableName;
    var rowKey = $input.data("key");
    var rowFamilys = $input.data("familyname");
    var colName = $input.data("colname");
    $.confirm({
        confirmButtonClass: 'btn btn-info',
        cancelButtonClass: 'btn-danger',
        confirmButton: '确认',
        cancelButton: '取消',
        animation: 'zoom',
        closeAnimation: 'rotateXR',
        title: '删除？',
        content: '确认是否删除（此确认框会在4秒后消失）',
        autoClose: '否|4000',
        buttons: {
            deleteUser: {
                text: '是',
                action: function () {
                    $.ajax({
                        url: "http://" + localhost + "/longGangKafka/deleteColumn",
                        cache: true,
                        type: "post",
                        dataType: "json",
                        data: {tableName: tableName,rowKey:rowKey,rowFamilys:rowFamilys,colName:colName,hbasezk:z_ip,hbaseport:z_port,znode:z_znode},
                        async: false,
                        success: function (data) {
                            $liclass.remove();
                        }
                    })
                }
            },
            否: function () {

            }
        }
    });
});

