//开发环境（直连）
var baseurl="http://127.0.0.1:8011/netdisk-web-manage/";
var logurl="http://127.0.0.1:8014/netdisk-log-provider/";

//运行环境（经过Nginx转发）
//var baseurl="http://106.15.248.223:80/netdisk-web-manage/";
//var logurl="http://106.15.248.223:80/netdisk-log-provider/";

Vue.prototype.baseurl=baseurl;//网盘后台接口
Vue.prototype.logurl=logurl;//日志后台接口

import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/common.css';

import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import JsonViewer from 'vue-json-viewer';
import utils from './assets/js/utils.js';

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(JsonViewer);
Vue.use(utils);

import App from './App.vue';
import login from './vues/login.vue';
import index from './vues/index.vue';

import appindex from './vues/app/index.vue';
import userindex from './vues/user/index.vue';
import typeindex from './vues/type/index.vue';
import typecomponentindex from './vues/typecomponent/index.vue';
import fileindex from './vues/file/index.vue';
import logtraceindex from './vues/logtrace/index.vue';
import analyindex from './vues/analy/index.vue';

var router=new VueRouter({
	routes:[
		{path:'/',redirect:'/toLogin'},
		{path:"/toLogin",component:login},
		{path:"/main",component:index,children:[
			{path:'/main',redirect:'app/index'},
			{path:"app/index",component:appindex},
			{path:"user/index",component:userindex},
			{path:"type/index",component:typeindex},
			{path:"typecomponent/index",component:typecomponentindex},
			{path:"file/index",component:fileindex},
			{path:"logtrace/index",component:logtraceindex},
			{path:"analy/index",component:analyindex}
		]}
	]
});

//ajax
Vue.http.options.emulateJSON=true;
Vue.http.options.root=baseurl;

new Vue({
  	el: '#app',
  	router:router,
  	render: h => h(App)
})
