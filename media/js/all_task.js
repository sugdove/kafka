//获取任务
$.ajax({
    cache: true,
    type: "post",
    url: "http://" + localhost + "/longGangKafka/consumer/getConsumers",
    async: false,
    success: function (data) {
            var length = data.length;
            var i = 0;
            var num2 = 0;
            var num1 = 0;
            for (i; i < length; i++) {
                var topic = data[i].topic;
                var zookeeper = data[i]["zookeeper"].split("/",2)[0];
                var znode = data[i]["zookeeper"].split("/",2)[1];
                var groupname = data[i].groupname;
                var tablename = data[i].tablename;
                var todo = data[i].todo;
                var timestam = data[i].timestam;
                var description = data[i].description;
                var id = data[i].id;
                if(todo==="fromHbase"){
                     num2++;
                    $("#v_tbody_2").append("<tr class='odd gradeX'><td class='sorting_1'><input type='radio' name='id' class='checkboxes ck2' value='" + id + "'></td><td>" + num2 + "</td><td class='hidden-480'>" + topic + "</td><td class='hidden-480'>" + zookeeper + "</td><td>"+znode+"</td><td class='hidden-480'>" + tablename + "</td><td>" + todo + "</td><td>"+description+"</td><td>" + timestam + "</td><td><span class='btn btn yellow pad run2' data-toggle='modal' data-target='#myModal'><i class='fa fa-search'></i> 查看</span></td></tr>")
                }
                else{
                     num1++;
                    $("#v_tbody").append("<tr class='odd gradeX'><td class='sorting_1'><input type='radio' name='id' class='checkboxes ck1' value='" + id + "'></td><td>" + num1 + "</td><td class='hidden-480'>" + topic + "</td><td class='hidden-480'>" + zookeeper + "</td><td class='hidden-480'>" + groupname + "</td><td>" + todo + "</td><td>"+description+"</td><td>" + timestam + "</td><td><span class='btn btn yellow pad run' data-toggle='modal' data-target='#myModal'><i class='fa fa-search'></i> 查看</span></td></tr>")
                }
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
            //初始化datatable
            $('#sample_2').dataTable({
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
$body.on("change",".ck2",function () {
    $("#bk_plan_delete_2").attr("disabled",false);
    Choose_Id2=$(this).val();
    var $tr = $(this).parent().parent().parent().parent("tr");
    zookeeper2 = $tr.find("td").eq(3).text();
    znode2 = $tr.find("td").eq(4).text();
    console.log(Choose_Id2);
    console.log(zookeeper2);
    console.log(znode2);
});
//删除任务
$body.on("click","#bk_plan_delete",function () {
    var $v_tobdy =  $("#v_tbody");
    var tr =$v_tobdy.find("input[type='radio']:checked").parent().parent().parent().parent("tr");
   /* var id;
    $v_tobdy.find("input[type='radio']:checked").each(function(){
         id=$(this).val();
    });*/
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
                        url: "http://" + localhost + "/longGangKafka/consumer/deleteConsumer",
                        cache: true,
                        type: "post",
                        data: {serviceId:Choose_Id},
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
                    })

                }
            },
            否: function () {

            }
        }
    });
});
$body.on("click","#bk_plan_delete_2",function () {
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
});
//查看消费信息
$body.on("click", ".run", function () {
    var id = $(this).parent().parent("tr").find("input[type='radio']").val();
    var topic = $(this).parent().parent("tr").children("td").eq(2).text();
    var zookeeper = $(this).parent().parent("tr").children("td").eq(3).text();
    var groupname = $(this).parent().parent("tr").children("td").eq(4).text();
    var details = {
        topic:topic,
        zookeeper:zookeeper,
        groupname:groupname
    };
    $.cookie("details",JSON.stringify(details));
    window.location.href = "cost_details.html";
});
$body.on("click", ".run2", function () {
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
});

