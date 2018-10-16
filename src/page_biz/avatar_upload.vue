<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>头像:</span>
                <el-upload
                        style="display: inline-block;vertical-align: middle"

                        class="avatar-uploader"
                        :action="upload_url"
                        :show-file-list="false"
                        :on-success="(res,file)=>{return handleAvatarSuccess(res,file)}"
                        :before-upload="beforeAvatarUpload">
                    <img v-if="img" :src="img" class="avatar" v-loading.fullscreen.lock="fullscreenLoading">
                    <i v-else class="el-icon-plus avatar-uploader-icon" v-loading.fullscreen.lock="fullscreenLoading"></i>
                </el-upload>
            </div>


            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">生成地址</el-button>

            <div class="search_item" v-if="avatar_url">
                <span class="pre_info" style="font-size: 14px;">学员照片地址:</span>
                <el-input placeholder="" v-model="avatar_url"  style="width: 450px"></el-input>(请手动复制输入框内内容)

            </div>

        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {upload_avatar} from '@/api/getDataEarth'

    export default {
        data(){
            return {
                id:0,
                loading:false,
                img:'',
                avatar_url:'',
                data:{img:'',content:{img_text:[],teacher:{info:{img:'',name:'',desc:''},img_text:[]},options:[]}},
                content:'',
                link:'',
                upload_url:this.$store.state.constant.upload_url,
                editor:1,
                fullscreenLoading:false
            }

        },
        components: {
            headTop
        },
        created(){

        },
        mounted(){
        },

        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.id = to.query.id ? to.query.id : 0;
                if (vm.id && vm.id > 0) {
                    vm.get_info();
                } else {
                    vm.init();
                }

            })
        },
        methods: {


            handleAvatarSuccess(res, file) {

                this.fullscreenLoading = false;
                this.img = res.data[0];
            },

            beforeAvatarUpload(file) {
                this.fullscreenLoading = true
                const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 1;

//                if (!isJPG) {
//                    this.fullscreenLoading = false
//                    this.$message.error('图片格式只支持jpg和png!');
//                }
                if (!isLt2M) {
                    this.fullscreenLoading = false
                    this.$message.error('图片大小不能超过 1MB!');
                }
                return  isLt2M;
            },

            init() {
                this.loading = false;
                this.data = {img:'',content:{img_text:[],teacher:{info:{img:'',name:'',desc:''},img_text:[]},options:[]}};
            },
            get_info() {
                goods_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.data = res.data;

                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            submit: function () {


                if (!this.img) {
                    var error_msg = '请上传头像';
                }
                if (error_msg) {
                    this.$message({
                        type: 'warning',
                        message: error_msg
                    });
                    return;
                }

                this.loading = true;
                upload_avatar({avatar:this.img}).then(function (res) {
                    this.loading = false;
                    if (res.code == this.$store.state.constant.status_success) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.avatar_url = res.data;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                        this.avatar_url = '';
                    }

                }.bind(this));

            },
            add_img_text(type) {
                var item = {
                    type:type,
                    val:''
                };

                this.data.content.img_text.push(item);
//                console.log(this.data);
            },
            del_img_text(index) {
                this.data.content.img_text.splice(index,1);
            },

        }
    }
</script>

<style lang="less">
    @import '../style/mixin';
    .search_item{

        margin-top: 10px;

    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader-round .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 100px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }
    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
    .ql-editor{
        min-height: 100px;
    }
    .pre_info{
        display:inline-block ;
        width: 140px;
    }
</style>
