<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <el-input clearable placeholder="请输入标题" v-model="title" style="width: 350px">
                    <template slot="prepend">标题</template>
                </el-input>
            </div>

            <div class="search_item">

                <el-input clearable placeholder="请输入链接地址" v-model="link" style="width: 350px">
                    <template slot="prepend">链接地址</template>
                </el-input>
            </div>

            <p class="search_item" style="font-size: 12px">上传图片:</p>
            <el-upload

                    class="avatar-uploader"
                    :action="upload_url"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                <img v-if="img" :src="img" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div v-if="!link">
                <p class="search_item" style="font-size: 12px">内容编辑:<a href="javascript:;" v-if="editor == 1" @click="editor=2">< 使用代码编辑 > </a><a href="javascript:;" v-if="editor == 2" @click="editor=1">[使用可视化编辑]</a></p>
                <div class="search_item" v-if="editor == 1">

                    <quill-editor ref="myQuillEditor" :content="content" :options = "editorOption" @change="onEditorChange($event)"></quill-editor>

                    <el-upload style="display: none"
                               class="avatar-uploader"
                               ref="upload"
                               :action="upload_url"
                               :show-file-list="false"
                               :on-success="handleImgSuccess"
                               :before-upload="beforeAvatarUpload">
                        <el-button id="imgInput"  v-loading.fullscreen.lock="fullscreenLoading"
                                   element-loading-text="插入中,请稍候"></el-button>
                    </el-upload>

                </div>
                <div class="search_item" v-if="editor == 2">

                    <mavon-editor :toolbars="toolbars" v-model="content"/>
                </div>
            </div>
            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">发布</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {goods_edit,goods_info} from '@/api/getDataEarth'

    export default {
        data(){
            return {
                id:0,
                loading:false,
                title:'',
                img:'',
                content:'',
                link:'',
                upload_url:this.$store.state.constant.upload_url,
                editor:1,
                fullscreenLoading:false
            }

        },
        components: {
            headTop,
            quillEditor
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

            // 点击图片ICON触发事件
            imgHandler(state) {
                this.addRange = this.$refs.myQuillEditor.quill.getSelection()
                if (state) {
                    let fileInput = document.getElementById('imgInput')
                    fileInput.click() // 加一个触发事件
                }
                this.uploadType = 'image'
            },

            handleAvatarSuccess(res, file) {
                this.fullscreenLoading = false
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
                this.title = '';
                this.link = '';
                this.img = '';
                this.content='';
            },
            get_info() {
                goods_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.title = res.data.title;
                        this.link = res.data.link;
                        this.content = res.data.content;
                        this.img = res.data.img;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            submit: function () {

                if (!this.title) {
                    var error_msg = '请填写标题';
                }
                if (!this.img) {
                    var error_msg = '请上传图片';
                }
                if (!this.content && !this.link) {
                    var error_msg = '请填写内容';
                }
                if (error_msg) {
                    this.$message({
                        type: 'warning',
                        message: error_msg
                    });
                    return;
                }

                this.$confirm('确认无误, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    this.loading = true;
                    goods_edit({id:this.id,title:this.title,link:this.link,img:this.img,content:this.content}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({path:'goods',query:{}});
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }

                    }.bind(this));

                }.bind(this)).catch(() => {

                }).finally(function(){
                    this.loading = false;
                }.bind(this));

            }

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
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 200px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }
    .avatar {
        width: 200px;
        height: 100px;
        display: block;
    }
    .ql-editor{
        min-height: 300px;
    }
</style>
