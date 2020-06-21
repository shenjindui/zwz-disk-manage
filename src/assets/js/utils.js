export default {
   	install(Vue, options) {
        Vue.prototype.alertMsg = function (code,msg) {
			if(code==0){
				this.$message({ message: msg, type: 'success'});
			}else{
				if("ssofail"==msg){
					this.$message.error("登录失效,请重新登录系统!");
					this.removeSession();
					this.$router.push("/");
				}else{
					this.$message.error(msg);
				}
			}
       	},
       	Vue.prototype.addSession = function (userid,username,token) {
			sessionStorage.setItem("token",token);
			sessionStorage.setItem("userid",userid);
			sessionStorage.setItem("username",username);
       	},
       	Vue.prototype.removeSession = function () {
			sessionStorage.removeItem("token");
			sessionStorage.removeItem("userid");
			sessionStorage.removeItem("username");
						
			sessionStorage.removeItem("activeIndex");
       	}
    }
}
