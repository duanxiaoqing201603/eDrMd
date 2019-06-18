<template>
  <div class="activity">
    <section class="title">
      <div>
        <span>每天连续学习十分钟打卡成功</span>
        <span @click="handleRule">活动规则</span>
      </div>
    </section>
    <section class="present">
      <div class="day"><span>已连续学习</span> {{day}} <span>天</span></div>
      <img id="giftImage" src="../assets/images/reading_activity_jiangpin.png" alt=""/>
      <div class="get">
        <p>连续学习时间越长，可得的奖励越丰厚，是否领取奖励？</p>
        <mt-button id="getBtn" type="primary" @click="handleGet">领取</mt-button>
      </div>
    </section>
    <section class="getRecord">
    <h6>领取记录</h6>
      <div class="recordNum">
        <div class="recordOuter" id="recordOuter" v-show="recordData.length">
          <ul class="recordUl" id="recordUl">
            <li v-for="record in recordData">{{record}} </li>
            <!--<li>1恭喜ZD,手机号:186****6520,领取3天奖品一个</li>
            <li>2恭喜edrmder_K9F8,手机号:133****3242,领取1天奖品一个</li>
            <li>3、恭喜edrmder_alon,手机号:178****5789,领取1天奖品一个</li>
            <li>4、恭喜edrmder_5iZ3,手机号:186****6520,领取1天奖品一个</li>
            <li>5、恭喜edrmder_xeHi,手机号:138****7758,领取1天奖品一个</li>
            <li>6、恭喜edrmder_d7u9,手机号:178****5789,领取3天奖品一个</li>
            <li>7、恭喜edrmder_87yL,手机号:158****1635,领取3天奖品一个</li>
            <li>8、恭喜edrmder_J90V,手机号:135****7623,领取3天奖品一个</li>
            <li>9、恭喜edrmder_LKjt,手机号:132****8702,领取1天奖品一个</li>
            <li>0、恭喜edrmder_T16A,手机号:150****5305,领取7天奖品一个</li>-->
          </ul>
          <div class="recordU2" id="recordU2"></div>
        </div>
        <div v-show="!recordData.length">没有领取记录</div>
      </div>

    </section>
    <section class="rule" id="rule">
      <div class="ruleBg">
        <h4>活动规则</h4>
        <p>为回馈广大用户，医得平台推出学习赢奖品活动，学习天数越多赢得奖品越就越丰厚。</p>
        <p>1、参加此活动的用户每天必须连续在线十分钟以上为当天打卡成功。</p>
        <p>2、连续打卡1天可领小镜子、3天可领杯子、7天可领AR图书、12天可领书签、21天可领魔方分别获得不同奖品。</p>
        <p>3、奖品领取后学习时长自动清零，用户每次只能领当前学习时长的奖品。</p>
        <p>4、用户获得奖品后需要领取，填写邮递地址及领取成功。每月可免费邮寄一次，再次邮寄须自付邮费。</p>
        <p>5、系统不定期更换价值相近的奖品。</p>
        <p>6、本活动仅限会员用户参与。医得平台每周为所有用户统一邮寄。</p>
				<p>7、本活动最终解释权由北京博雅君益健康管理有限公司所有。</p>
      </div>
      <mt-button @click="handleClose">X</mt-button>
    </section>
    <section class="address" id="address">
        <label class="label">收货人姓名</label><input placeholder="请输入收货人姓名" v-model="username">
        <label class="label">收货人电话</label><input placeholder="请输入收货人电话" v-model="tel">
        <label class="label">收货地址</label><textarea placeholder="请输入收货地址" v-model="address"></textarea>
        <div>
          <mt-button type="default" @click.native="handleCancel">取消</mt-button>
          <mt-button type="primary" @click.native="handleOK">确定</mt-button>
        </div>
    </section>
    <div class="loading" id="loading"></div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        userId:'',
        token:'',
        activeId:'',
        username:'',
        tel:'',
        address:'',
        getList:'',
        presentData:'',
        giftId:'',
        day:0,//连续学习时间
        recordData:'',//领取列表
        userData:'',
        giftStatus:'',//礼物领取状态
        state:'',//0不可领取礼物，1可以
        isVip:'',//是否为会员
        IP:'39.105.11.4' //59.110.163.242   39.105.11.4
      }
    },
    created:function() {
      var flag;

      //获取用户信息
      function GetRequest() {
        let url = location.href; //获取url中"?"符后的字串
        let theRequest = {},num;
        num=url.indexOf("?");
        if (url.indexOf("?") !== -1) {
          let str = url.substr(num+1);
          let strs = str.split("&");
          for(let i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] =strs[i].split("=")[1];
          }
        }
        return theRequest;
      }
      let Request = {};
      Request = GetRequest();// var id=Request["id"];
      this.activeId = Request['activeId'];
      this.userId = Request['userId'];
      this.token = Request['token'];

      //console.log(this.activeId,this.userId,this.token);
      //获取礼物信息59.110.163.242   39.105.11.4
      this.$axios.post('http://'+this.IP+'/eDrMd_App/active/v3.0/online/init',
        {"userId":this.userId,"token":this.token,"activeId":this.activeId},
        {headers:{'Content-Type': 'application/json'}}).then(res=>{
        // 响应成功回调
        //"userId":this.userId,"token":this.token,"activeId":this.activeId
        //{params:{"userId":"164895c5bce1112","token":"1089055c3e7c1837c4fa17936a7425b9a","activeId":"16a25a276c81119"}}

        this.presentData=res.data.data;
        this.day=this.presentData.day;
        this.isVip=this.presentData.isVip;

        document.title = this.presentData.name;
        this.state=res.data.data.state;
        //领取记录，无缝向上滚动
        this.recordData=this.presentData.recordData;
        this.$nextTick(function(){
          if(this.recordData.length){//>6暂定有6条记录向上滚动
            ~function() {
              var recordOuter = document.getElementById("recordOuter");
              var recordU2 = document.getElementById("recordU2");
              var recordUl = document.getElementById("recordUl");
              recordU2.innerHTML = recordUl.innerHTML;
              function Marquee() {
                //console.log(recordOuter.scrollTop,recordUl.offsetHeight);
                if (recordOuter.scrollTop >= recordUl.offsetHeight) {
                  recordOuter.scrollTop = 0;
                } else {
                  recordOuter.scrollTop = recordOuter.scrollTop + 1;
                }
              }
              var MyMar = setInterval(Marquee, 40);
            }();
          }
        });

				// console.log(this.presentData.userGift.image,res.data);
        //对应的奖品图片
        var giftImage=document.getElementById('giftImage');
				giftImage.src=this.presentData.userGift.image;
				this.giftId=this.presentData.userGift.id;
      }, res=>{
        // 响应错误回调
        this.$toast(res.data.message);
      });

      //获取用户地址
      this.$axios.post('http://'+this.IP+'/eDrMd_App/active/v3.0/online/address',
        {"userId":this.userId,"token":this.token,"activeId":this.activeId},
        {headers:{'Content-Type':'application/json'}}).then(res=>{
          this.userData=res.data.data;
          this.username=this.userData.realName;
          this.address=this.userData.address;
          this.tel=this.userData.phone;
      },res=>{

      })
    },
    methods:{
      handleRule(){
        var ruleBox=document.getElementById("rule");
        ruleBox.style.display='block';
        var loading=document.getElementById('loading');
        loading.style.display='block';
        //弹出遮罩，body禁止滑动
       /* var body=document.getElementById('app');
        body.style.height=window.innerHeight/100+'rem';
        body.style.overflow='hidden';*/
      },
      handleClose(){
        var ruleBox=document.getElementById("rule");
        ruleBox.style.display='none';
        var loading=document.getElementById('loading');
        loading.style.display='none';
        //关闭遮罩，恢复正常
       /* var body=document.getElementById('app');;
        body.style.height='100%';
        body.style.overflow='visible';*/
      },
      handleGet(){
        if(!this.presentData.isVip){
          this.$toast("本活动仅对会员有效");
          return false;
        }
        var addrDlg=document.getElementById('address');
        addrDlg.style.display='block';
        var loading=document.getElementById('loading');
        loading.style.display='block';
        //:class="{on:state==='0'}" :disabled="state==='0'"
        //弹出遮罩，body禁止滑动
        /*var body=document.getElementById('app');;
        body.style.height=window.innerHeight/100+'rem';
        body.style.overflow='hidden';*/
      },
      //提交表单
      handleOK(){
        this.username=this.username.replace(/(^\s*)|(\s*$)/g, "");
        this.tel=this.tel.replace(/(^\s*)|(\s*$)/g, "");
        this.address=this.address.replace(/(^\s*)|(\s*$)/g, "");
        if(!this.username){
          /*this.$layer.open({
            content:'姓名不能为空，请重填',
            skin:'msg',
            time:2
          });*/
          this.$toast("姓名不能为空，请重填");

          /*this.$toast({
            message:'姓名不能为空，请重填', //弹窗内容
            position: "middle", //弹窗位置
            duration: -1, //弹窗时间毫秒,如果值为-1，则不会消失
            className: "mytoast" //自定义Toast 样式，需要自己提供一个类名
          });*/
          return false;
        }
        if(!this.address){
          this.$toast("地址不能为空，请重填");
          return false;
        }
        if(!(/^1[34578]\d{9}$/.test(this.tel))){
          this.$toast("手机号码有误，请重填");
          return false;
        }
        this.$axios.post('http://'+this.IP+'/eDrMd_App/active/v3.0/online/getGift',
          {"userId":this.userId,"token":this.token,"activeId":this.activeId,
            "giftId":this.giftId,"realName":this.username,"phone":this.tel,"address":this.address
          },
          {headers:{'Content-Type':'application/json'}}).then(res=>{
          this.giftStatus=res.data.message;
          this.$toast(this.giftStatus);//this.giftStatus?this.giftStatus:'领取失败'
        });
        //重新获取数据
        this.$axios.post('http://'+this.IP+'/eDrMd_App/active/v3.0/online/init',
          {"userId":this.userId,"token":this.token,"activeId":this.activeId},
          {headers:{'Content-Type': 'application/json'}}).then(res=>{
          this.presentData=res.data.data;
          this.day=this.presentData.day;
          this.isVip=this.presentData.isVip;
          //对应的奖品图片
          var giftImage=document.getElementById('giftImage');
          giftImage.src=this.presentData.giftData[0].image;
        });
        var addrDlg=document.getElementById('address');
        addrDlg.style.display='none';
        var loading=document.getElementById('loading');
        loading.style.display='none';
        //关闭遮罩，恢复正常
        /*var body=document.getElementById('app');
        body.style.height='100%';
        body.style.overflow='visible';*/
      },
      handleCancel(){
        var addrDlg=document.getElementById('address');
        addrDlg.style.display='none';
        var loading=document.getElementById('loading');
        loading.style.display='none';
        //关闭遮罩，恢复正常
        /*var body=document.getElementById('app');
        body.style.height='100%';
        body.style.overflow='visible';*/
      }
    }
  }
</script>
<style>
  .loading{
    position: fixed;
    top: 0;
    background: rgba(0,0,0,.5);
    height: 100%;
    width: 100%;
    display: none;
    z-index: 8;
  }
  .mint-toast-text{
    font-size: 0.12rem;
  }
  .activity{
    font-size: 0.12rem;
    /* width:100%; */
		padding-bottom: 0.5rem;
    height:100%;
    background-image: url("../assets/images/reading_activity_big_bg.png");
    background-color: #32D5D6;
  }
  .title{
    position: relative;
    font-size: 0;
    text-align: center;
    width:100%;
    height:2.5rem;
    background: url("../assets/images/reading_activity_banner.png") no-repeat center;
    background-size: 85%;
  }
  .title img{
    width:85%;
    margin:-0.5rem auto;
  }
  .title div{
    position: absolute;
    top:1.65rem;
    width:100%;
  }
  .title span{
    color:#fff;
    font-size: 0.12rem;
    padding:0.03rem;
  }
  .title span:nth-of-type(1){
    background: #E79D5A;
    border-radius: 0.03rem 0 0 0.03rem;
  }
  .title span:nth-of-type(2){
    background: #22CAB8;
    border-radius: 0 0.03rem 0.03rem 0;
  }
  .present{
    position: relative;
    z-index: 3;
    width:90%;
    margin:-0.3rem auto 0;
    background-image: url("../assets/images/reading_activity_top_bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding-bottom: 0.1rem;

  }
  .present img{
    width:90%;
    margin:0 auto;
    border-radius: 0.04rem;
  }
  .present .day{
    width:100%;
    text-align: center;
    font-size: .20rem;
    height:.3rem;
    line-height: .3rem;
    color: #e79d5a;
    padding-top: 0.3rem;
		padding-bottom: 0.1rem;
		font-weight: bold;
  }
  .present .day span{
    font-size: 0.14rem;
    color:#004E5E;
  }
  .get{
    width:90%;
    margin:0.1rem auto;
    height:0.5rem;
    border-radius: 0.4rem;
    border:1px solid #4FAFBC;
    position:relative;
    background:#fff;
  }
  .get p{
    width:60%;
    height:0.35rem;
    margin:0.08rem 0 0 0.15rem
  }
  .get .mint-button--primary {
    float:right;
    position:absolute;
    height:0.5rem;
    top:0;
    right:0;
    width:1rem;
    border-radius: 0.4rem;
    font-size: 0.16rem;
    background: #4FAFBC;
  }
  .get .mint-button--primary.on{
    background:#c3c3c3;
  }
  .getRecord{
    width:90%;
    margin:0.4rem auto;
  }
  .getRecord h6{
    font-size: 0.18rem;
    color:#fff;
    text-align: center;
    font-weight: normal;
		margin-bottom: 0.1rem;
  }
  .recordNum{
    width:84%;
    height:1.25rem;
    background: #FFFFFF;
    border-radius: 0.1rem;
    padding:0.15rem 7%;
    font-size: 0.12rem;
		opacity: 0.8;
  }
  .recordOuter{
    width:100%;
    height:1.25rem;
    overflow: hidden;
  }
  .recordUl{
    height:auto;
    /*overflow: hidden;*/
  }
  .recordU2{
     height:auto;
     /*overflow: hidden;*/
   }
  .recordUl li,.recordU2 li{
    line-height: 0.18rem;
    margin-bottom: 0.03rem;
    /*overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;*/
  }
  .rule {
    position:fixed;
    top:50%;
    left:50%;
    display: none;
    width:70%;
    height:4rem;
    margin:-2rem 0 0 -35%;
    text-align:center;
    z-index: 9;
  }
  .rule .ruleBg{
    padding:8% 5%;
    background:#fff;
    border-radius: 0.1rem;
    text-align: left;
  }
  .address{
    position:fixed;
    top:50%;
    left:50%;
    margin:-2rem 0 0 -40%;
    display: none;
    width:70%;
    padding:1% 5%;
    height:3.5rem;
    background:#fff;
    border-radius: 0.1rem;
    font-size: 0.14rem;
    z-index: 9;
  }
  .rule .mint-button--default{
    width:0.4rem;
    height:0.4rem;
    border-radius: 50%;
    border:1px solid #979797;
    background:#fff;
    margin:0.3rem auto;
  }
  .address .label{
    display: block;
    width:100%;
    margin:0.2rem 0 0.02rem 0;
  }
  .address input{
    border:0.01rem solid #c1c1c1;
    height:0.3rem;
    width:95%;
    border-radius: 0.04rem;
    padding-left: 0.05rem;
  }
  .address textarea{
    height:0.8rem;
    border:0.01rem solid #c1c1c1;
    width:95%;
    border-radius: 0.04rem;
    padding:0.02rem 0 0 0.05rem;
    outline: none;
  }
  .address div{
    margin-top: 0.15rem;
    text-align: center;
  }
  .address .mint-button--default,.address .mint-button--primary{
    height:0.3rem;
    width:0.85rem;
    line-height: 0.3rem;
    text-align: center;
    border-radius: 0.4rem;
    font-size: 0.16rem;
  }
  .address .mint-button--default{
    border:1px solid #4FAFBC;
    color:#4FAFBC;
  }
  .address .mint-button--primary{
    border:1px solid #4FAFBC;
    background:#4FAFBC;
    margin-left: 0.2rem;
  }
</style>
