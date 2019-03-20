/**
 * Created by suge on 2017/7/18.
 */
/********************************************选择主机*****************************************************/
//虚拟机初始树形图
$.ajax({
            cache: true,
            type: "post",
            url: "http://"+localhost+"/VirtualizationUnifiedBackup/getVirtCentBaseInfoByRe",
            dataType: "json",
            async: false,
            success: function (data2) {
                if(data2.res==0){
                    var data = data2.info;
                    var string = "";
                    for(var temp in data){
                        for (var k in data[temp]) {
                            var length = data[temp][k].length;
                            var ip = k;
                            //k为第一层
                            string += "<li><a href='javascript:void(0)' data-role='branch' class='tree-toggle closed' data-toggle='branch' data-value='Bootstrap_Tree'><span class='ip'></span>" + k + "</a><ul class='branch'>"
                            var a = data[temp][k];
                            for (var i = 0; i < length - 1; i++) {
                                var b = a[i];
                                var vcuser = a[length - 1].vcuser;
                                var vcpasswd = a[length - 1].vcpasswd;
                                for (var n in b) {
                                    //n为第二层
                                    var length2 = b[n].length;
                                    if (length2 >= 1) {
                                        string += "<li><a href='javascript:void(0)' class='tree-toggle closed two' data-toggle='branch' data-value='Bootstrap_Tree'><span class='flag'></span>" + n + "</a> <ul class='branch'>"
                                        for (var l = 0; l < length2; l++) {
                                            //b[l]为第三层
                                            string += "<li><a href='javascript:void(0)' data-role='leaf' class='tree-toggle closed vmid three' data-value='Bootstrap_Tree'><span class='vm'></span>" + b[n][l] + "</a></li>"
                                        }
                                        string += "</li></ul>"
                                    }
                                }
                            }
                            string += "</li></ul>"
                        }
                    }
                    $("#tree_1").append(string);
                }
                else if(data2.res==-1){
                    alert("后台报错:"+data2.err)
                }
            }
});
//点击树形图虚拟机名出现相应备份点
$("body").on("click",".vmid",function(){
    var vcuser =$(this).children(".vcuser").val();
    var vcpasswd =$(this).children(".vcpasswd").val();
    var strategy = $(this).parent().parent().parent().children(".two").text();
    var ip =$(this).children(".ip").val();
    var VmName = $(this).text();
    var this_=$(this).parent("li");
    var this_2 = $(this);
    var str_ = {"VmName": VmName,"strategy":strategy};
    var str = JSON.stringify(str_);
    if(this_.children("ul").length==0) {
                $.ajax({
                    cache: true,
                    type: "post",
                    url: "http://" + localhost + "/VirtualizationUnifiedBackup/getVersionByVmNameRe",
                    data: {str:str},
                    dataType: "json",
                    async: false,
                    success: function (data2) {
                        if(data2.res==0){
                            var data = data2.info;
                            var arr=data;
                            var resJson={};
                            var a=[];
                            for(var i=0;i<arr.length;i++){
                                var key=arr[i]['vmFullNum'];
                                if(!resJson[key]){
                                    var cc=[];
                                    a.push(cc);
                                    resJson[key]=cc;
                                }
                                resJson[key].push(arr[i]);
                            }
                            var length2 = a.length;
                            var string = "<ul class='branch in'>";
                            for (var n = 0; n < length2; n++) {
                                var starttime = a[n][0].starttime;
                                var length3 = a[n].length;
                                var id = (a[n][0].id).replace(/^0+/,"");
                                var vcid = a[n][0].vcid;
                                var bkstatus = (a[n][0].bkstatus).replace(/^0+/,"");
                                var vmbktype =a[n][0].vmbktype;
                                var starttime1 = starttime.substring(0,starttime.length-2);
                                if (length3 == 1 && vmbktype!=3 && bkstatus!=2) {
                                    string += "<li><input type='radio' name='ip' value='' class='radio ip_'><a href='javascript:void(0)' data-role='leaf' class='five hover_' ><span class='timepoint2'></span><span class='starttime'>" + starttime1 + "</span><span class='id hide'>"+id+"</span><span class='vcid_ hide'>"+vcid+"</span><span class='type'>(完全备份点)</span></a></li>"
                                }
                                if(length3!=1 && vmbktype!=3 && bkstatus!=2) {
                                    string += "<li><input type='radio' name='ip' value='' class='radio ip_'><a href='javascript:void(0)' class='tree-toggle closed four hover_' data-toggle='branch' data-value='Bootstrap_Tree'><span class='timepoint2'></span><span class='starttime'>" + starttime1 + "</span><span class='id hide'>"+id+"</span><span class='vcid_ hide'>"+vcid+"</span><span class='type'>(完全备份点)</span></a><ul class='branch'>";
                                    for (var h = 1; h < length3; h++) {
                                        var starttime2 = a[n][h].starttime.substring(0,a[n][h].starttime.length-2);
                                        var id2 =(a[n][h].id).replace(/^0+/,"");
                                        var vcid2 = a[n][h].vcid;
                                        string += "<li><input type='radio' name='ip' class='radio ip_2' value=''><a href='javascript:void(0)' data-role='leaf' class='six hover_'><span class='timepoint'></span><span class='starttime'>" + starttime2 + "</span><span class='id hide'>"+id2+"</span><span class='vcid_ hide'>"+vcid2+"</span><span class='type'>(增量备份点)</span></a>";
                                    }
                                    string += "</ul></li>"
                                }


                            }
                            string += "</ul>";
                            this_.append(string)

                        }
                        else if(data.res==-1){
                            alert("后台报错："+data.err)
                        }
                    }
                })
            }
});
//点击-时收起
$("body").on("click",".tree-toggle",function () {
    $(this).addClass("closed");
    $(this).parent("li").children("ul").removeClass("in");
});
//点击+是展开
$("body").on("click",".closed",function () {
    $(this).removeClass("closed");
    $(this).parent("li").children("ul").addClass("in");
});
//点击备份点
$("body").on("click",".hover_",function () {
    $(".hover_").removeClass("eee");
    $(this).addClass("eee");
    $(this).parent("li").children("input[type='radio']").attr("checked",true);
    console.log($("#tree_1").find(".eee").children(".id").text())
});

/****************************恢复目标*************************************/
//宿主机第一层vcip的展现
$.ajax({
            cache: true,
            type: "post",
            url: "http://" + localhost + "/VirtualizationUnifiedBackup/getVcentListbyRe",
            dataType: "json",
            async: false,
            success: function (data2) {
                if(data2.res==0){
                    var data = data2.info;
                    var length =data.length;
                    for(var i=0;i<length;i++) {
                        var vcip = data[i].vcip;
                        var vcuser = data[i].vcuser;
                        var vcpasswd = data[i].vcpasswd;
                        var id = (data[i].id).replace(/^0+/,"");
                        $("#tree_2").append("<li><a href='javascript:void(0)' data-role='branch'  class='tree-toggle closed vcip' data-toggle='branch' data-value='Bootstrap_Tree' data-id='"+id+"'><span class='vmware'></span>"+vcip+"</a><input type='text' class='vcuser hide' value='"+vcuser+"'><input type='text' class='vcpasswd hide' value='"+vcpasswd+"'></li>")
                    }
                }
                else if(data2.res==-1){
                    alert("后台报错："+data2.err)
                }
            }


        });
$("body").on("click",".vcip",function () {
    var ip =$(this).text();
    var this_1 = $(this);
    var this_=$(this).parent("li");
    var vcuser =$(this).parent("li").children(".vcuser").val();
    var vcpasswd =$(this).parent("li").children(".vcpasswd").val();
    var str_ = {"Ip": ip, "Username": vcuser, "PassWord": vcpasswd};
    var str = JSON.stringify(str_);
    if(this_.children("ul").length==0) {
        $(".spinner").show();
        $(".black_overlay").show();
                $.ajax({
                    cache: true,
                    type: "post",
                    url: "http://" + localhost + "/VirtualizationUnifiedBackup/getEsxiIpList",
                    dataType: "json",
                    data: {str:str},
                    async: true,
                    success: function (data2) {
                        if(data2.res==0){
                            $(".spinner").hide();
                            $(".black_overlay").hide();
                            var data = data2.info;
                            var length = data.length;
                            var string = "<ul class='branch in'>";
                            for (var i = 0; i < length; i++) {
                                string += "<li><a href='javascript:void(0)' data-role='leaf' class='host_' data-value='Bootstrap_Tree'><span class='host'></span>" + data[i] + "</a></li>";
                            }
                            string += "</ul>";
                            this_.append(string);
                        }
                        else if(data2.res==-1){
                            alert("后台报错："+data2.err)
                            $(".spinner").hide();
                            $(".black_overlay").hide();
                        }

                    }
                })
            }
});
function showtime(){
    var mydate =new Date();
    var t =mydate.toLocaleString();
    var time ="服务器时间:"+ t;
    $("#time_show").html(time);
    setTimeout(showtime,1000)
}
showtime();
//标签页效果
$("#tab_1_").click(function(){
    $(this).parent("li").removeClass("active");
    $("#tab_2_").parent("li").removeClass("active");
    $(this).parent("li").addClass("active");
    $("#tab_1").fadeIn();
    $("#tab_2").hide();
});
//标签页效果
$("#tab_2_").click(function(){
    $(this).parent("li").removeClass("active");
    $("#tab_1_").parent("li").removeClass("active");
    $(this).parent("li").addClass("active");
    $("#tab_1").hide();
    $("#tab_2").fadeIn();
});
//选择宿主机调用方法获取存储池信息
$("body").on("click",".host_",function(){
    $(".host_").removeClass("eee");
    $(this).addClass("eee");
    $("#backup_2").show();
    var Ip = $(".iframe2").find(".eee").parent().parent().parent().children(".vcip").text();
    var Username = $(".iframe2").find(".eee").parent().parent().parent().children(".vcuser").val();
    var PassWord = $(".iframe2").find(".eee").parent().parent().parent().children(".vcpasswd").val();
    var TarIp = $(".iframe2").find(".eee").text();
    var name = $("#tab1").find($("input[type='radio']:checked")).parent().parent("ul").parent("li").children("a").text();
    var name2 =name+"/"+name+".vmdk";
    var str_  = {"Ip":Ip,"Username":Username,"PassWord":PassWord,"TarIp":TarIp};
    var str = JSON.stringify(str_);
            $.ajax({
                cache:true,
                type:"post",
                url:"http://"+localhost+"/VirtualizationUnifiedBackup/getDatastoreNameList",
                dataType:"json",
                data:{str:str},
                async:false,
                success:function(data2){
                    if(data2.res==0){
                        var data = data2.info;
                        var length = data.length;
                        var string ="";
                        for(var i=0;i<length;i++){
                            var data_ = "["+data[i]+"]";
                            string+="<option value='"+data[i]+"'><i class='fa hostcluster icon-default'></i>"+data[i]+"</option>"
                        }
                        $("#store").html(string)
                    }
                    else if(data2.res==-1){
                        alert("后台报错："+data2.err)
                    }

                }
            });
});
//最后的提交方法
$(".button-submit").click(function(){
    var zz_ = $("#tree_2").find(".eee").parent().parent().parent().children(".vcip").text();
    var esxiIp_ = $("#tree_2").find(".eee").text();
    var esxiIp;
    if(esxiIp_ =="localhost.localdomain"){
        esxiIp =zz_
    }
    else{
        esxiIp = esxiIp_
    }
    var id = $("#tree_1").find(".eee").children(".id").text();
    var id_2 = $("#tree_1").find(".eee").children(".vcid_").text();
    var VmNewname = $("#vm_name").val();
    var vcid = $("#tree_2").find(".eee").parent("li").parent("ul").parent("li").children("a").data("id");
    var datastore =$("#store").val();
    var str_ = {"id": id, "esxiIp": esxiIp, "VmNewname": VmNewname, "vcid": vcid, "datastore": datastore};
    var str = JSON.stringify(str_);
    $.confirm({
        confirmButtonClass: 'btn btn-info',
        cancelButtonClass: 'btn-danger',
        confirmButton: '确认',
        cancelButton: '取消',
        animation: 'zoom',
        closeAnimation: 'rotateXR',
        title: '恢复？',
        content: '确认是否进行恢复（此确认框会在8秒后消失）',
        autoClose: '否|8000',
        buttons: {
            deleteUser: {
                text: '是',
                action: function () {
                            $.ajax({
                                cache: true,
                                type: "post",
                                url: "http://" + localhost + "/VirtualizationUnifiedBackup/submitRestorPlane",
                                dataType:"json",
                                data: {str:str},
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
                                            title: '操作成功！',
                                            content: '虚拟机恢复任务已提交（此确认框会在3秒后消失）',
                                            autoClose: '确认|3000',
                                            buttons: {
                                                确认: function () {
                                                    window.location.href="all_task.html";
                                                },
                                            }
                                        });

                                    }
                                    else if(data.res==-1){
                                        alert("后台报错："+data.err)
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