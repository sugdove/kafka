var $body = $("body");
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
            var zookeeper = ip+":"+port;
            var znode = data[key].znode;

            var showip;
            if(ip.split(",").length>2){
                showip = ip.split(",")[0]+","+ip.split(",")[1]
            }
            else{
                showip = ip;
            }
            var description = data[key].description;
            var showzookeeper =description+" "+znode+" "+showip+":"+port;

                str += "<li class='vcip_li' data-znode='"+znode+"' data-zookeeper='"+zookeeper+"' title='"+timestam+"'><img src='media/image/datacenter.png' class='zookeeper_img'>"+showzookeeper+"</li>";
        }
        $("#vmware-list").html(str);
    },
});
//获取右侧具体信息
var znode;
var ip;
var port;
$("#vmware-list").on("click",".vcip_li",function () {
    $("#sample_1").dataTable().fnDestroy();
    $(".vcip_li").removeClass("eee");
    $(this).addClass("eee");
    var zookeeper = $(this).data("zookeeper");
     ip = zookeeper.split(":")[0];
     port = zookeeper.split(":")[1];
    znode = $(this).data("znode");
    $("#table_refresh").find("th").eq(0).css("width","7%");
    $(".black_overlay").show();
    $(".spinner").show();
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/longGangKafka/topic/all",
        data:{ip:ip,port:port,znode:znode},
        async: true,
        success: function (data) {
            $(".black_overlay").hide();
            $(".spinner").hide();
            $(".clearfix").show();
            $(".alert-info").hide();
            $("#table_div").show();
            var length = data.length;
            var i = 0;
            var string = "";
            for (i; i < length; i++) {
                var topic = data[i];
                var vmnum = i + 1;
                string+= "<tr class='odd gradeX'><td class='sorting_1' style='width: 5px;'><input type='radio' class='checkboxes'  name='gender[]' value='" + topic + "'></td><td>" + vmnum + "</td><td>" + topic + "</td></tr>"
            }
            $("#v_tbody").html(string);

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
                "aLengthMenu": [
                    [5, 10],
                    [5, 10] // change per page values here
                ],
                "aoColumnDefs": [
                    {"bSortable": false, "aTargets": [0]}// 制定列不参与排序
                ],
                // set the initial value
                "iDisplayLength": 10,
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

            //全选方法
            jQuery('#sample_1 .group-checkable').change(function () {
                var set = jQuery(this).attr("data-set");
                var checked = jQuery(this).is(":checked");
                jQuery(set).each(function () {
                    if (checked && $(this).prop("disabled") == false) {
                        $(this).attr("checked", true);
                    } else {
                        $(this).attr("checked", false);
                    }
                });
                jQuery.uniform.update(set);
            });
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
                        $("#table_div").hide();
                        $(".clearfix").hide();
                        $(".alert-info").show()
                    }
                }
            });
        }
    })
});
var topicname;
$body.on("change",".checkboxes",function () {
    $("#delete_virtcent").attr("disabled",false);
    topicname=$(this).val();
});
//删除topic
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
                        url: "http://" + localhost + "/longGangKafka/topic/delete",
                        cache: true,
                        type: "post",
                        dataType: "json",
                        data: {topicname: topicname,ip:ip,port:port,znode:znode},
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
                                content: 'topic已删除！（此确认框会在3秒后消失）',
                                autoClose: '确定|3000',
                                buttons: {
                                    确定: function () {
                                        tr.each(function () {
                                            $("#sample_1").DataTable().row($(this)).remove().draw(false);
                                            $("#delete_virtcent").attr("disabled", true);
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
//创建topic
$body.on("click", "#creat", function () {
    var zookeeper = $(".eee").data("zookeeper");
    console.log(zookeeper);
    $("#zookeeper").val(zookeeper);
});
$body.on("click", "#modal-submit", function () {
    var topicname = $("#topicname").val();
    var partitions = $("#partitions").val();
    var replicationFactor = $("#replicationFactor").val();
    var topicConfigs_ = $(".textFirstSpan").text()+":"+$("#selectDC").val();
    var arr = [];
    arr.push(topicConfigs_);
    $(".InputParentLi").each(function () {
       var key = $(this).children("label").children("span").text();
       var value = $(this).children("input[type='text']").val();
       var str = key+":"+value;
       if(key!=="cleanup.policy"){
           arr.push(str)
       }
    });
    var topicConfigs = arr.join(",");
    console.log(topicConfigs);
                       $.ajax({
                        url: "http://" + localhost + "/longGangKafka/topic/create",
                        cache: true,
                        type: "post",
                        dataType: "json",
                        data: {ip: ip,port:port,znode:znode,topicname:topicname,partitions:partitions,replicationFactor:replicationFactor,topicConfigs:topicConfigs},
                        async: false,
                        success: function (data) {
                            $.confirm({
                                confirmButtonClass: 'btn btn-info',
                                cancelButtonClass: 'btn-danger',
                                confirmButton: '确认',
                                cancelButton: '取消',
                                animation: 'zoom',
                                closeAnimation: 'rotateXR',
                                title: '创建成功！',
                                content: 'topic创建成功！（此确认框会在3秒后消失）',
                                autoClose: '确定|3000',
                                buttons: {
                                    确定: function () {
                                        $('#myModal').modal('hide');
                                        $(".eee").click();
                                    }
                                }
                            });
                        }
                    })
});