/**
 * Created by suge on 2017/6/7.
 */
//显示zookeeper方法
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
            str += "<li class='vcip_li' title='"+timestam+"' data-zookeeper='"+zookeeper+"' data-znode='"+znode+"'><img src='media/image/datacenter.png' class='zookeeper_img'>"+showzookeeper+"</li>";
        }
        $("#vmware-list").html(str);
        $("#vmware-list-2").html(str);
    }
});
//获取右侧具体信息
var znode;
$("#vmware-list").on("click",".vcip_li",function () {
    $("#sample_1").dataTable().fnDestroy();
    $("#vmware-list").find(".vcip_li").removeClass("eee");
    $(this).addClass("eee");
    var zookeeper = $(this).data("zookeeper");
    var ip = zookeeper.split(":")[0];
    var port = zookeeper.split(":")[1];
    znode = $(this).data("znode");
    $("#alert-info").hide();
    $("#vcid-id").val(zookeeper);
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
                var length = data.length;
                var i = 0;
                $("#table_div").show();
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

                $("#table_refresh").find("th").eq(0).css("width","6%");

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
                    }
                }
            });
        }
    })
});
//时间显示
$('.timepicker1').timepicker({
    showMeridian: false,
});
$(function () {
    $("[data-toggle='popover']").popover();
});
function showtime() {
    var mydate = new Date();
    var t = mydate.toLocaleString();
    var time = "服务器时间:" + t;
    $("#time_show").html(time);
    setTimeout(showtime, 1000)
}
//hbase的zookeeper选择
var hznode;
$("#vmware-list-2").on("click",".vcip_li",function () {
    $("#vmware-list-2").find("li").removeClass("ccc");
    $(this).addClass("ccc");
    hznode = $(this).data("znode");
    $("#zhbasehide").val($(this).data("zookeeper"));
});
$("#vmware-list-2").find(".vcip_li").eq(0).click();
showtime();
//保留相关js
$("body").on("change", "#DelType-id", function () {
    var value = $(this).val();
    //时间保留
    if (value == 1) {
        $(".keep-text").html("保留天数<span class='required' aria-required='true'>*</span>")
    }
    //个数保留
    else if (value == 2) {
        $(".keep-text").html("保留个数<span class='required' aria-required='true'>*</span>")
    }
});
//选择一次性备份和按策略备份出现不同的区域
$("body").on("change", "#backup_way", function () {
    //0:HIVE 1:HBASE
    if ($("#backup_way").val() == "1") {
        $("#backup_2").hide();
        $("#tableName_hide").hide();
        $("#list-div-2").show()
    }
    if ($("#backup_way").val() == "0") {
        $("#backup_2").show();
        $("#tableName_hide").show();
        $("#list-div-2").hide()
    }
});
var topic;
//checkbox改变时效果
$("#v_tbody").on("change",".checkboxes",function () {
    topic = $(this).val();
    $("#vmidset-id").val(topic);
});
//取得UUID方法
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
/***********************************以下为提交方法相关JS***************************************************/
//最后的提交方法
$(".button-submit").click(function () {
    var exetype = $("#backup_way").val();
    var topic = $("#vmidset-f").text();
    var zookeeper = $("#vcid-f").text();
    var groupname = $("#bktype-f").text();
    var tableName = $("#bktype-f23").text();
    var description = $("#msg-g").text();
    var serviceId = generateUUID();
    var ip = zookeeper.split(":")[0];
    var port = zookeeper.split(":")[1];
    var zookeeper2 = $("#zhbase").text();
    var hzookeeper = zookeeper2.split(":")[0];
    var hport = zookeeper2.split(":")[1];
    //HBase
     if (exetype === "1") {
          $.ajax({
              url: "http://" + localhost + "/longGangKafka/consumer/toHbase",
              cache: true,
              type: "post",
              data: {serviceId:serviceId,topic:topic,ip:ip,port:port,znode:znode,groupname:groupname,description:description,hzookeeper:hzookeeper,hport:hport,hznode:hznode},
              async: false,
              success: function (data) {
                  //这里的-1是BUG后期会进行修改
                  if (data === true) {
                      $.confirm({
                          confirmButtonClass: 'btn btn-info',
                          cancelButtonClass: 'btn-danger',
                          confirmButton: '确认',
                          cancelButton: '取消',
                          animation: 'zoom',
                          closeAnimation: 'rotateXR',
                          title: 'HBase导入成功！',
                          content: '即将跳转到数据流任务（此确认框会在2秒后消失）',
                          autoClose: '确定|2000',
                          buttons: {
                              确定: function () {
                                  location.href = "all_task.html";
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
                          title: 'HBase导入失败！',
                          content: '对不起，导入失败（此确认框会在2秒后消失）',
                          autoClose: '确定|2000',
                          buttons: {
                              确定: function () {
                                  //  location.href = "all_task.html";
                              }
                          }
                      });
                  }
              }
          })
      }
      //Hive
      if (exetype === "0") {
          $.ajax({
              url: "http://" + localhost + "/longGangKafka/consumer/toHive",
              cache: true,
              data: {serviceId:serviceId,topic:topic,ip:ip,port:port,znode:znode,groupname:groupname,tableName:tableName},
              type: "post",
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
                          title: 'Hive导入成功！',
                          content: '即将跳转到数据流任务（此确认框会在2秒后消失）',
                          autoClose: '确定|2000',
                          buttons: {
                              确定: function () {
                                    location.href = "all_task.html";
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
                          title: 'Hive导入失败！',
                          content: '对不起，导入失败（此确认框会在2秒后消失）',
                          autoClose: '确定|2000',
                          buttons: {
                              确定: function () {
                                  //  location.href = "all_task.html";
                              }
                          }
                      });
                  }

              }
          })
      }
});
