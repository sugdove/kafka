/**
 * Created by suge on 2018/1/26
 */
//获取任务
$.ajax({
    cache: true,
    type: "post",
    url: "http://"+localhost+"/HBaseToHBaseProject/listAllTask",
    async: false,
    success: function (data) {
        var length = data.length;
        var i = 0;
        var num1 = 0;
        for (i; i < length; i++) {
            var sinkTabName = data[i].sinkTabName;
            var groupname = data[i].groupName;
            var targetZNode = data[i].targetZNode;
            var topic = data[i].topic;
            var sourceZK = data[i].sourceZK;
            var targetZK = data[i].targetZK;
            var id = data[i].id;
            var sourTabName = data[i].sourTabName;
            var sourceZNode = data[i].sourceZNode;
            var timestamp = data[i].timestamp;
            num1++;
            $("#v_tbody").append("<tr class='odd gradeX'><td class='sorting_1'><input type='radio' name='id' class='checkboxes ck1' value='" + id + "'></td><td>" + num1 + "</td><td class='hidden-480'>" + sourTabName + "</td><td class='hidden-480'>" + sinkTabName + "</td><td class='hidden-480' style='word-break:break-all'>" + sourceZK + "</td><td style='word-break:break-all'>" + targetZK + "</td><td>" + sourceZNode + "</td><td>" + targetZNode + "</td><td>"+topic+"</td><td>"+groupname+"</td><td>"+timestamp+"</td><td><span class='btn btn yellow pad getnum' data-toggle='modal' data-target='#myModal'><i class='fa fa-search'></i>数量</span></td></tr>")
        }
        //初始化datatable
        $('#sample_1').dataTable({
            "aoColumnDefs": [
                {"orderable": false, "aTargets": [0, 2, 3, 4, 5,6,8]}// 制定列不参与排序
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
            "aaSorting": [[1, "asc"]]//默认第几个排序
        });
    },


    error: function (data) {

        alert("ajax调用失败");

    }

});
var $body = $("body");
var Choose_Id;
var Choose_Id2;
var zookeeper2;
var znode2;
//删除按钮可用
$body.on("change",".ck1",function () {
    $("#bk_plan_delete").attr("disabled",false);
    Choose_Id=$(this).val();
    console.log(Choose_Id)
});
/*$body.on("change",".ck2",function () {
    $("#bk_plan_delete_2").attr("disabled",false);
    Choose_Id2=$(this).val();
    var $tr = $(this).parent().parent().parent().parent("tr");
    zookeeper2 = $tr.find("td").eq(3).text();
    znode2 = $tr.find("td").eq(4).text();
    console.log(Choose_Id2);
    console.log(zookeeper2);
    console.log(znode2);
});*/
//删除任务
$body.on("click","#bk_plan_delete",function () {
    var $v_tobdy =  $("#v_tbody");
    var tr =$v_tobdy.find("input[type='radio']:checked").parent().parent().parent().parent("tr");
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
                        url: "http://"+localhost+"/HBaseToHBaseProject/shutDownService",
                        cache: true,
                        type: "post",
                        data: {param:JSON.stringify({serviceId:Choose_Id})},
                        async: false,
                        success: function (data) {
                            if(data.success===true){
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
                                                $("#sample_1").DataTable().row($(this)).remove().draw(false);
                                                $("#bk_plan_delete").attr("disabled",true)
                                            });
                                        }
                                    }
                                });
                            }
                            else if(data.success===false){
                                $.confirm({
                                    confirmButtonClass: 'btn btn-info',
                                    cancelButtonClass: 'btn-danger',
                                    confirmButton: '确认',
                                    cancelButton: '取消',
                                    animation: 'zoom',
                                    closeAnimation: 'rotateXR',
                                    title: '删除失败！',
                                    content: '请检查失败原因！（此确认框会在3秒后消失）',
                                    autoClose: '确定|3000',
                                    buttons: {
                                        确定: function () {
                                        }
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
});
/*$body.on("click","#bk_plan_delete_2",function () {
    var $v_tobdy =  $("#v_tbody_2");
    var tr =$v_tobdy.find("input[type='radio']:checked").parent().parent().parent().parent("tr");
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
                        url: "http://" + localhost + "/longGangKafka/stopService",
                        cache: true,
                        type: "post",
                        data: {param:JSON.stringify({serviceId:Choose_Id2,zookeeper:zookeeper2,znode:znode2})},
                        async: false,
                        success: function (data) {
                            if(data.success===true){
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
                                                $("#sample_2").DataTable().row($(this)).remove().draw(false);
                                                $("#bk_plan_delete_2").attr("disabled",true)
                                            });
                                        }
                                    }
                                });
                            }
                            else if(data.success===false){
                                $.confirm({
                                    confirmButtonClass: 'btn btn-info',
                                    cancelButtonClass: 'btn-danger',
                                    confirmButton: '确认',
                                    cancelButton: '取消',
                                    animation: 'zoom',
                                    closeAnimation: 'rotateXR',
                                    title: '删除失败！',
                                    content: '任务删除失败！（此确认框会在3秒后消失）',
                                    autoClose: '确定|3000',
                                    buttons: {
                                        确定: function () {
                                        }
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
});*/
//查看日志
$body.on("click", ".run", function () {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://"+localhost+"/HBaseToHBaseProject/readLogFile",
        dataType:"text",
        async: false,
        success: function (data) {
            if(data===""){
                data="暂无错误信息"
            }
            alert(data)
        },


        error: function (data) {

            alert("ajax调用失败");

        }

    });
});

//查看同步数量
$body.on("click", ".getnum", function () {
    var serviceId = $(this).parent().parent("tr").find("input[type='radio']").val();
    $.ajax({
        cache: true,
        type: "post",
        url: "http://"+localhost+"/HBaseToHBaseProject/getDataNum",
        data:{param:JSON.stringify({serviceId:serviceId})},
        async: false,
        success: function (data) {
            if(data.success===true){
                var all = data["总条数"];
                var cost = data["已消费的条数"];
                alert("总条数:"+all+"条"+"\n"+"已消费条数:"+cost+"条")
            }
            else if(data.success===false){
                alert("查看同步数量失败")
            }
        },
        error: function (data) {

            alert("ajax调用失败");

        }

    });
});
/*$body.on("click", ".run2", function () {
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/longGangKafka/getLogInfo",
        dataType:"text",
        async: false,
        success: function (data) {
            alert(data)
        },


        error: function (data) {

            alert("ajax调用失败");

        }

    });
});*/

