webpackJsonp([16],{196:function(t,e,a){a(489);var s=a(84)(a(368),a(516),"data-v-2d3f7740",null);t.exports=s.exports},368:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a(50),r=a.n(s),o=a(49),n=a.n(o),i=a(51),l=a.n(i),f=a(85),p=a(87);e.default={data:function(){return{loginForm:{username:"",password:""},rules:{username:[{required:!0,message:"请输入用户名",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"}]},showLogin:!1}},mounted:function(){this.showLogin=!0,this.adminInfo.id||this.getAdminData()},computed:l()({},a.i(p.b)(["adminInfo"])),methods:l()({},a.i(p.c)(["getAdminData"]),{submitForm:function(t){var e=this;return n()(r.a.mark(function s(){return r.a.wrap(function(s){for(;;)switch(s.prev=s.next){case 0:e.$refs[t].validate(function(){var t=n()(r.a.mark(function t(s){var o;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!s){t.next=7;break}return t.next=3,a.i(f.G)({user_name:e.loginForm.username,password:e.loginForm.password});case 3:o=t.sent,1==o.status?(e.$message({type:"success",message:"登录成功"}),e.$router.push("manage")):e.$message({type:"error",message:o.message}),t.next=9;break;case 7:return e.$notify.error({title:"错误",message:"请输入正确的用户名密码",offset:100}),t.abrupt("return",!1);case 9:case"end":return t.stop()}},t,e)}));return function(e){return t.apply(this,arguments)}}());case 1:case"end":return s.stop()}},s,e)}))()}}),watch:{adminInfo:function(t){t.id&&(this.$message({type:"success",message:"检测到您之前登录过，将自动登录"}),this.$router.push("manage"))}}}},396:function(t,e,a){e=t.exports=a(187)(!1),e.push([t.i,".allcover[data-v-2d3f7740]{position:absolute;top:0;right:0}.ctt[data-v-2d3f7740]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.tb[data-v-2d3f7740]{position:absolute;top:50%;transform:translateY(-50%)}.lr[data-v-2d3f7740]{position:absolute;left:50%;transform:translateX(-50%)}.login_page[data-v-2d3f7740]{background-color:#324057}.manage_tip[data-v-2d3f7740]{position:absolute;width:100%;top:-100px;left:0}.manage_tip p[data-v-2d3f7740]{font-size:34px;color:#fff}.form_contianer[data-v-2d3f7740]{width:320px;height:210px;position:absolute;top:50%;left:50%;margin-top:-105px;margin-left:-160px;padding:25px;border-radius:5px;text-align:center;background-color:#fff}.form_contianer .submit_btn[data-v-2d3f7740]{width:100%;font-size:16px}.tip[data-v-2d3f7740]{font-size:12px;color:red}.form-fade-enter-active[data-v-2d3f7740],.form-fade-leave-active[data-v-2d3f7740]{transition:all 1s}.form-fade-enter[data-v-2d3f7740],.form-fade-leave-active[data-v-2d3f7740]{transform:translate3d(0,-50px,0);opacity:0}",""])},489:function(t,e,a){var s=a(396);"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);a(188)("7fe89ad0",s,!0)},516:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"login_page fillcontain"},[a("transition",{attrs:{name:"form-fade",mode:"in-out"}},[a("section",{directives:[{name:"show",rawName:"v-show",value:t.showLogin,expression:"showLogin"}],staticClass:"form_contianer"},[a("div",{staticClass:"manage_tip"},[a("p",[t._v("elm后台管理系统")])]),t._v(" "),a("el-form",{ref:"loginForm",attrs:{model:t.loginForm,rules:t.rules}},[a("el-form-item",{attrs:{prop:"username"}},[a("el-input",{attrs:{placeholder:"用户名"},model:{value:t.loginForm.username,callback:function(e){t.$set(t.loginForm,"username",e)},expression:"loginForm.username"}},[a("span",[t._v("dsfsf")])])],1),t._v(" "),a("el-form-item",{attrs:{prop:"password"}},[a("el-input",{attrs:{type:"password",placeholder:"密码"},model:{value:t.loginForm.password,callback:function(e){t.$set(t.loginForm,"password",e)},expression:"loginForm.password"}})],1),t._v(" "),a("el-form-item",[a("el-button",{staticClass:"submit_btn",attrs:{type:"primary"},on:{click:function(e){t.submitForm("loginForm")}}},[t._v("登陆")])],1)],1),t._v(" "),a("p",{staticClass:"tip"},[t._v("温馨提示：")]),t._v(" "),a("p",{staticClass:"tip"},[t._v("未登录过的新用户，自动注册")]),t._v(" "),a("p",{staticClass:"tip"},[t._v("注册过的用户可凭账号密码登录")])],1)])],1)},staticRenderFns:[]}}});