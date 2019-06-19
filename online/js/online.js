~function (desW) {
    var winW = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = winW / desW * 100 + "px";
}(375);
function GetRequest() {
    let url = location.search; //获取url中"?"符后的字串
    let theRequest = {};
    if (url.indexOf("?") !== -1) {
        let str = url.substr(1);
        let strs = str.split("&");
        for(let i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] =strs[i].split("=")[1];
        }
    }
    return theRequest;
}
let Request = {};
Request = GetRequest();// var id=Request["id"];
let activeId,userId,token;
activeId = Request['activeId'];
userId = Request['userId'];
token = Request['token'];
let IP="http://39.105.11.4";
let isVip,giftId,day;
$.ajax({
    url:'http://39.105.11.4/eDrMd_App/active/v3.0/online/init',
    type:'post',
    contentType:'application/json',
    data:JSON.stringify({
        'userId':userId,
        'token':token,
        'activeId':activeId
        /*"userId":"164895c5bce1112","token":"1089055c3e7c1837c4fa17936a7425b9a","activeId":"169f369870c1114"*/
    }),
    dataType:'json',
    headers:{'Content-Type':'application/json'},
    success:function(res){
        console.log(res);
        let data=res.data;
        day=data.day;
        let presentData=data.giftData;
        isVip=data.isVip;
        giftId=data.userGift.id;
        $('#day').html('&nbsp'+day+'&nbsp');
        $(document).attr('title',data.name);
        if(day===0 || !data.userGift){
            $('#main_btn').attr('disabled',true).addClass('btn_dis');
        }
        let record=data.recordData;
        if(record){
            let str='';
            for(let i=0;i<record.length;i++){
                str+='<li>'+record[i]+'</li>';
            }
            $('#recordUl').html(str);
            ~function() {
                var recordOuter = document.getElementById("recordOuter");
                var recordU2 = document.getElementById("recordU2");
                var recordUl = document.getElementById("recordUl");
                recordU2.innerHTML = recordUl.innerHTML;
                function Marquee() {
                    if (recordOuter.scrollTop >= recordUl.offsetHeight) {
                        recordOuter.scrollTop = 0;
                    } else {
                        recordOuter.scrollTop += 1;
                    }
                }
                var MyMar = setInterval(Marquee, 40);
            }();
        }else{
            $('#recordOuter').hide();
            $('#noRecord').show();
        }
        //礼物对应图片
        let images=$('.main_pic img'),ems=$('.main_pic em');
        for(let i=0;i<presentData.length;i++){
            images.eq(i).attr('src',presentData[i].image);
            if(giftId===presentData[i].id && day!==0){
                ems.eq(i).hide().siblings().show();
            }
        }

    }
});
$('.main_btn').click(function(){
    if(!isVip){
        layer.open({
            content:'本活动仅对会员有效',
            skin:'msg',
            time:2
        });
        return false;
    }

    $('#address').show();
    $('#loading').show();
});
$('#cancel').click(function(){
    $('#address').hide();
    $('#loading').hide();
});
$('#OK').click(function(){
    let username=$('#username').val();
    username=username.replace(/(^\s*)|(\s*$)/g, "");
    let tel=$('#tel').val();
    tel=tel.replace(/(^\s*)|(\s*$)/g, "");
    let getAdd=$('#getAdd').val();
    getAdd=getAdd.replace(/(^\s*)|(\s*$)/g, "");
    if(!username){
        layer.open({
            content:'姓名不能为空，请重填',
            skin:'msg',
            time:2
        });
        return false;
    }
    if(!(/^1[34578]\d{9}$/.test(tel))){
        layer.open({
            content:'手机号码有误，请重填',
            skin:'msg',
            time:2
        });
        return false;
    }
    if(!getAdd){
        layer.open({
            content:'地址不能为空，请重填',
            skin:'msg',
            time:2
        });
        return false;
    }
    $.ajax({
        url: IP+'/eDrMd_App/active/v3.0/online/getGift',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
            'userId':userId,
            'token':token,
            'activeId':activeId,
            'giftId':giftId,
            'realName':username,
            'phone':tel,
            'address':getAdd
            /*"userId": "164895c5bce1112", "token": "1089055c3e7c1837c4fa17936a7425b9a", "activeId": "169f369870c1114"*/
        }),
        dataType: 'json',
        headers: {'Content-Type': 'application/json'},
        success: function (res) {
            layer.open({
                content:res.data.message,
                skin:'msg',
                time:2
            })
        }
    });
    $.ajax({
        url:'http://39.105.11.4/eDrMd_App/active/v3.0/online/init',
        type:'post',
        contentType:'application/json',
        data:JSON.stringify({
            'userId':userId,
            'token':token,
            'activeId':activeId
            /*"userId":"164895c5bce1112","token":"1089055c3e7c1837c4fa17936a7425b9a","activeId":"169f369870c1114"*/
        }),
        dataType:'json',
        headers:{'Content-Type':'application/json'},
        success:function(res){
            let presentData=res.data.giftData;
            let images=$('.main_pic img'),ems=$('.main_pic em');
            for(let i=0;i<presentData.length;i++){
                ems.eq(i).show();
            }
            $('#day').html('&nbsp'+0+'&nbsp');
            if(day===0 || !data.userGift){
                $('#main_btn').attr('disabled',true).addClass('btn_dis');
            }
        }
    });
    $('#address').hide();
    $('#loading').hide();
});

