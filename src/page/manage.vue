<template>
	<div class="manage_page fillcontain">

		<el-row style="height: 100%;">
			<el-col :span="4"  style="height: 100%;overflow:scroll ">
				<el-menu :default-active="defaultActive" style="min-height: 100%;"   background-color="#545c64"  text-color="#fff" active-text-color="#ffd04b" router>
					<div style="background: rgb(255, 208, 75);height: 5px;"></div>


					<el-submenu  v-for="(item, index) in menu" :index="item.uri" :key="item.id">
						<template slot="title"><i class="iconfont el-icon-cc" v-html="item.ico"></i>{{item.name}}</template>
						<template v-if="item.children">
							<el-menu-item style="padding-left: 60px;" v-for="item in item.children" :index="item.uri" :key="item.id">{{item.name}}</el-menu-item>
						</template>

					</el-submenu>


				</el-menu>
			</el-col>
			<el-col :span="20" style="height: 100%;overflow: auto;">
				<div @click="showHelp=true" style="position: fixed;cursor:pointer;left: 0px;bottom:0px;z-index: 100;background: #F5B587;font-size: 12px;padding: 5px;">查看帮助与更新</div>
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</el-col>
		</el-row>
		<el-dialog
				title="帮助与更新"
				:visible.sync="showHelp"
				width="80%">
			<div>
				<help></help>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showHelp = false">关 闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {get_menu} from '@/api/getDataEarth'
	import help from '@/components/help'
	export default {
		data(){
			return {
				menu:[],
				showHelp:false
			}

		},
		created(){
			this.get_menu();
		},
		components: {
			help
		},
		methods: {
			get_menu(){
				get_menu().then(function (res) {
					if (res.code == this.$store.state.constant.status_success) {
						res.data.forEach(function(ele){
							ele.children.forEach(function(e){
								e.uri = e.uri.replace('menu_', '');
							})
						})
						this.menu = res.data;
					} else {
						this.$message({
							message: res.msg,
							type: 'warning'
						});
					}

				}.bind(this));
			},
		},
		computed: {
			defaultActive: function(){
				var index = this.$route.path.replace('/', '');
				index = index.replace('add_', '');
				return index;
			}
		},
	}
</script>


<style lang="less" >
	@import '../style/mixin';
	.iconfont{
		vertical-align: middle;
		margin-right: 5px;
		width: 24px;
		text-align: center;
		font-size: 18px;
	}
	.el-menu-item{
		background-color: rgb(67, 74, 80)!important;
	}
	.el-menu-item:hover{
		background-color: rgb(60, 70, 80)!important;
	}
	.el-menu-item.is-active{
		background-color: rgb(60, 70, 70)!important;
	}
	img.kfformula {
		vertical-align: middle;
	}
</style>
