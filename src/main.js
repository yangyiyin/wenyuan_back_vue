import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css';
// import 'element-ui/lib/theme-chalk/index.css';
import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
import uploader from 'vue-simple-uploader'

import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'
import '../static/UE/kityformula-plugin/addKityFormulaDialog.js'
import '../static/UE/kityformula-plugin/getKfContent.js'
import '../static/UE/kityformula-plugin/defaultFilterFix.js'

// import VueDraggableResizable from 'vue-draggable-resizable'
//
// // optionally import default styles
// import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
//
// Vue.component('vue-draggable-resizable', VueDraggableResizable)

// use
Vue.use(mavonEditor);
Vue.use(uploader);

Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
