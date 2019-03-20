//获取zookeeper列表
$.ajax({
    cache: true,
    type: "post",
    url: "http://" + localhost + "/longGangKafka/zookeeper/get",
    dataType: "json",
    async: false,
    success: function (data) {
            var length = data.length;
            var i = 0;
            for (i; i < length; i++) {
                var num = i+1;
                var ip = data[i].ip;
                var port = data[i].port;
                var timestam = data[i].timestam;
                var description = data[i].description;
                var znode = data[i].znode;
                var showznode;
                if(znode===""){
                    showznode="空"
                }
                else {
                    showznode=znode;
                }
                $("#v_tbody").append("<tr class='odd gradeX'><td class='sorting_1'><input type='radio' name='z' data-ip='"+ip+"' data-port='"+port+"' data-znode='"+znode+"' class='checkboxes' ></td><td>" + num + "</td><td>" + ip + "</td><td class='hidden-480'>" + port + "</td><td class='hidden-480'>" + showznode + "</td><td class='hidden-480'>" + timestam + "</td><td class='hidden-480'>" + description + "</td></tr>")

            }


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
                    {"orderable": false, "aTargets": [0, 2, 3, 4, 5]}// 制定列不参与排序
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
                "aaSorting": [[1, "asc"]]//默认第几个排序
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

        alert("ajax调用失败");

    }

});
var d_ip;
var d_port;
var d_znode;
//点击radio删除按钮可用
$("body").on("change",".checkboxes",function () {
    $("#delete_virtcent").attr("disabled",false);
    d_ip = $(this).data("ip");
    d_port = $(this).data("port");
    d_znode = $(this).data("znode");
});
//删除zookeeper
$("#delete_virtcent").click(function () {
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
                        url: "http://" + localhost + "/longGangKafka/zookeeper/delete",
                        cache: true,
                        type: "post",
                        data: {ip:d_ip,port:d_port,znode:d_znode},
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
                                    content: 'zookeeper成功删除！（此确认框会在3秒后消失）',
                                    autoClose: '确定|3000',
                                    buttons: {
                                        确定: function () {
                                            tr.each(function () {
                                                $("#sample_1").DataTable().row($(this)).remove().draw(false);
                                                $("#delete_virtcent").attr("disabled",true);
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
//同步虚拟机
$("body").on("click", ".oneway", function () {
    var this_ = $(this).parent("li").parent("ul").parent().parent("td").parent("tr");
    var vcid = this_.find("td").eq(1).text();
    var ip = this_.find("td").eq(2).text();
    var username = this_.find("td").eq(4).text();
    var path = this_.find("td").eq(7).text();
    var password = this_.find(".pwd").val();
    var VirtType = this_.find("td").eq(3).data("type");
    var str_ = {
        "vcid": vcid,
        "vcip": ip,
        "vcUser": username,
        "vcPassword": password,
        "backupPath": path,
        "VirtType":VirtType
    };
    var str = JSON.stringify(str_);
    $.confirm({
        confirmButtonClass: 'btn btn-info',
        cancelButtonClass: 'btn-danger',
        confirmButton: '确认',
        cancelButton: '取消',
        animation: 'zoom',
        closeAnimation: 'rotateXR',
        title: '同步？',
        content: '确认是否同步（此确认框会在8秒后消失）',
        autoClose: '否|8000',
        buttons: {
            deleteUser: {
                text: '是',
                action: function () {
                    $(".spinner").show();
                    $(".black_overlay").show();
                    $.ajax({
                        url: "http://" + localhost + "/VirtualizationUnifiedBackup/synchronousVirtCent",
                        cache: true,
                        type: "post",
                        dataType:"json",
                        data: {str:str},
                        async: true,
                        success: function (data) {
                            $(".spinner").hide();
                            $(".black_overlay").hide();
                            if (data.res == 0) {
                                $.confirm({
                                    confirmButtonClass: 'btn btn-info',
                                    cancelButtonClass: 'btn-danger',
                                    confirmButton: '确认',
                                    cancelButton: '取消',
                                    animation: 'zoom',
                                    closeAnimation: 'rotateXR',
                                    title: '同步成功！',
                                    content: '恭喜你同步成功！（此确认框会在3秒后消失）',
                                    autoClose: '确定|3000',
                                    buttons: {
                                        确定: function () {

                                        },
                                    }
                                });
                            }
                            else {
                                alert("后台错误："+data.err)
                            }
                        }
                    })
                }
            },
            否: function () {

            },
        }
    });
});
//将选中Kafka数据赋值在模态框里
$("body").on("click", ".change", function () {
    var this_ = $(this).parent("li").parent("ul").parent().parent("td").parent("tr");
    var port = this_.find("td").eq(3).text();
    var ip = this_.find("td").eq(2).text();
    var zookeeper = ip+":"+port;
    var modal = $("#change_vcenter").find("input");
    modal.eq(0).val(zookeeper);
});
//添加topic分区
$("body").on("click", "#modal-submit", function () {
    $.ajax({
        url: "http://" + localhost + "/longGangKafka/partition/add",
        cache: true,
        type: "post",
        dataType:"json",
        data: $("#modal-form").serializeArray(),
        async: false,
        success: function (data) {
            if(data===true){
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton: '确认',
                    cancelButton: '取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '添加成功！',
                    content: 'topic分区添加成功！（此确认框会在3秒后消失）',
                    autoClose: '确定|3000',
                    buttons: {
                        确定: function () {
                         //   window.location.reload();
                        },
                    }
                });
            }
            else if(data===false){
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton: '确认',
                    cancelButton: '取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '添加失败！',
                    content: 'topic分区添加失败！（此确认框会在3秒后消失）',
                    autoClose: '确定|3000',
                    buttons: {
                        确定: function () {
                            window.location.reload();
                        },
                    }
                });
            }

        }
    })
});