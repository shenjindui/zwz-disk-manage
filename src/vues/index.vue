<template>
	<div style="height: 100%;">
		<el-container style="height: 100%;">
			<el-header class="header">
				<el-row>
	  				<el-col :span="19" class="headercol">
	  					<span class="logo">网盘后台管理系统</span>
	  				</el-col>
	  				<el-col :span="5" class="headercol right">
	  					<el-popover width="160" v-model="visible">
		  					<p style="line-height: 30px;text-align: center;">是否退盘系统?</p>
		  					<div style="text-align: center; margin-top: 10px;">
		    					<el-button type="text" size="mini" @click="visible = false">取消</el-button>
		    					<el-button type="primary" size="mini" @click="logout">确定</el-button>
		  					</div>
		  					<el-button type="primary" icon="el-icon-s-check" size="small" slot="reference">{{nickname}}</el-button>
						</el-popover>
	  				</el-col>
	  			</el-row>
			</el-header>
			<el-container style="height: 100%;">
				<el-aside  style="height:100%;width: 220px;">
					<el-menu
			      		:default-active="activeIndex"
			      		@select="handleSelected"
			      		style="height: 100%;"
			      		background-color="#545c64"
			      		text-color="#fff"
			      		active-text-color="#ffd04b"
			      		v-loading="loading"
			      		>
				      	<el-menu-item :index="item.id" class="item"  v-for="item in menus">
				        	<i :class="item.icon"></i>
				        	<span slot="title">{{item.name}}</span>
				      	</el-menu-item>
			    	</el-menu>
				</el-aside>
    			<el-main style="background-color: #F2F6FC;overflow:auto;height: 100%;">
    				<router-view></router-view>
    			</el-main>
  			</el-container>
		</el-container>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				visible:false,
				nickname:sessionStorage.getItem("username"),
				loading:false,
				menus:[],
				activeIndex:""//默认选择哪个菜单
			}
		},
		created() {
			//加载菜单
			this.findMenus();
			
			//默认选择菜单
			var activeIndex=sessionStorage.getItem("activeIndex");
			if(activeIndex==null){
				activeIndex="0";
			}
			this.activeIndex=activeIndex;
    	},
		methods: {
			findMenus(){
				this.loading=true;
				this.$http.post('menu/findList',{
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.menus=data.data;
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.loading=false;
				});
			},
	    	handleSelected(index, path) {
	    		sessionStorage.setItem("activeIndex",index);
	    		var menu=this.menus[index];
	    		this.$router.push(menu.url);
	      	},
	      	logout(){
	      		this.loading=true;
				this.$http.post('security/logout',{
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						//清空session
						this.removeSession();
			      		//登录页面
			      		this.$router.push("/");
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.loading=false;
				});
	      	}
	    }
	}
</script>

<style scoped="scoped">
	.header{
		background: #409EFF;
	}
	.logo{
		font-size: 20px;
		font-weight: bold;
		color: white;
	}
	.headercol{
		height: 60;
		/*line-height: 60px;*/
		box-sizing: border-box;
		margin-top: 15px;
	}
	.right{
		text-align: right;
	}
</style>
