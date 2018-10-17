<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">
            <el-alert
                    title="温馨提示:主图尺寸建议750*428;图文详情尺寸建议750*高(任意);每张图片大小建议不要超过200kb,否则小程序端加载页面会比较慢;"
                    type="warning"
                    close-text="X">
            </el-alert>
            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>主图:</span>
                <el-upload
                        style="display: inline-block;vertical-align: middle"

                        class="avatar-uploader"
                        :action="upload_url"
                        :show-file-list="false"
                        :on-success="(res,file)=>{return handleAvatarSuccess(res,file, data)}"
                        :before-upload="beforeAvatarUpload">
                    <img v-if="data.img" :src="data.img" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>标题:</span>
                <el-input clearable placeholder="请输入标题" v-model="data.title" style="width: 350px">
                </el-input>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>价格(元):</span>
                <el-input clearable placeholder="请输入价格" v-model="data.price" type="number" style="width: 150px"></el-input>
            </div>

            <div class="search_item" style="margin-bottom: 30px;">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>时间-地点:</span>
                <div style="display: inline-block;vertical-align: top;border-bottom: 1px dashed #999;padding: 5px;">
                    <template v-if="data.content.options">

                        <div style="margin-bottom: 3px;" v-for="(sub, index)  in data.content.options">
                            <!--<el-input clearable placeholder="请输入时间" v-model="sub.time" style="width: 350px"></el-input>-->

                            <i style="color:red;">*</i><el-date-picker
                                    v-model="sub.time"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期时间">
                            </el-date-picker>

                            <el-input clearable placeholder="请输入地点" v-model="sub.place" style="width: 350px"></el-input>
                            <el-input clearable placeholder="可预订数" v-model="sub.sum" style="width: 120px" type="number"></el-input>
                            <el-button type="danger" @click="del_option(index)" round size="mini">删除</el-button>

                        </div>
                    </template>

                    <el-button @click="add_option()" type="danger" round size="mini"><i class="iconfont" style="font-size: 10px;">&#xe658;</i>添加</el-button>
                </div>
            </div>

            <div class="search_item" style="margin-bottom: 30px;">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>图文详情:</span>
                <div style="display: inline-block;vertical-align: top;border-bottom: 1px dashed #999;padding: 5px;width: 500px;">
                    <template v-if="data.content.img_text">

                        <div style="margin-bottom: 3px;" v-for="(sub, index)  in data.content.img_text">
                            <i style="color:red;">*</i>
                            <template v-if="sub.type=='img'">
                                 <el-upload
                                        style="display: inline-block;vertical-align: middle"
                                        class="avatar-uploader"
                                        :action="upload_url"
                                        :show-file-list="false"
                                        :on-success="(res,file)=>{return handleAvatarSuccess(res,file, sub)}"
                                        :before-upload="beforeAvatarUpload">
                                    <img v-if="sub.val" :src="sub.val" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </template>

                            <el-input v-if="sub.type == 'text'" style="width: 200px" placeholder="内容..." v-model="sub.val" type="textarea" :rows="4" ></el-input>
                            <el-button type="danger" @click="del_img_text(index, data.content.img_text)" round size="mini">删除</el-button>

                        </div>
                    </template>

                    <el-button @click="add_img_text('img', data.content.img_text)" type="danger" round size="mini"><i class="iconfont" style="font-size: 10px;">&#xe658;</i>添加图片</el-button>
                    <el-button @click="add_img_text('text', data.content.img_text)" type="danger" round size="mini"><i class="iconfont" style="font-size: 10px;">&#xe658;</i>添加文字</el-button>
                </div>
            </div>


            <div class="search_item" style="margin-bottom: 30px;">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>授课老师:</span>

                <template >
                    <div style="display: inline-block">
                        <i style="color:red;">*</i>头像:
                        <el-upload
                                style="display: inline-block;vertical-align: middle"
                                class="avatar-uploader avatar-uploader-round"
                                :action="upload_url"
                                :show-file-list="false"
                                :on-success="(res,file)=>{return handleAvatarSuccess(res,file, data.content.teacher.info)}"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="data.content.teacher.info.img" :src="data.content.teacher.info.img" class="avatar" style="width: 80px;height: 80px;border-radius: 80px;">
                            <i v-else class="el-icon-plus avatar-uploader-icon" style="width: 80px;height: 80px;border-radius: 80px;line-height: 80px;"></i>
                        </el-upload>

                    </div>
                    <div style="margin-left:120px;">

                        <el-input clearable placeholder="请输入姓名" v-model="data.content.teacher.info.name" style="width: 350px;margin-bottom: 10px">
                            <template slot="prepend"><i style="color:red;">*</i>姓名</template>
                        </el-input>
                        <br/>
                        <el-input maxlength="20" clearable placeholder="请输入一句话描述" v-model="data.content.teacher.info.desc" style="width: 450px">
                            <template slot="prepend">一句话描述(1-20字)</template>
                        </el-input>
                    </div>
                    <div style="margin-left:120px;border-bottom: 1px dashed #999;padding: 5px;width: 500px;">
                        <template v-if="data.content.teacher.img_text">

                            <div style="margin-bottom: 3px;" v-for="(sub, index)  in data.content.teacher.img_text">

                                <template v-if="sub.type=='img'">
                                    <el-upload
                                            style="display: inline-block;vertical-align: middle"
                                            class="avatar-uploader"
                                            :action="upload_url"
                                            :show-file-list="false"
                                            :on-success="(res,file)=>{return handleAvatarSuccess(res,file, sub)}"
                                            :before-upload="beforeAvatarUpload">
                                        <img v-if="sub.val" :src="sub.val" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </template>

                                <el-input v-if="sub.type == 'text'" style="width: 200px" placeholder="内容..." v-model="sub.val" type="textarea" :rows="4" ></el-input>
                                <el-button type="danger" @click="del_img_text(index, data.content.teacher.img_text)" round size="mini">删除</el-button>

                            </div>
                        </template>

                        <el-button @click="add_img_text('img', data.content.teacher.img_text)" type="danger" round size="mini"><i class="iconfont" style="font-size: 10px;">&#xe658;</i>添加图片</el-button>
                        <el-button @click="add_img_text('text', data.content.teacher.img_text)" type="danger" round size="mini"><i class="iconfont" style="font-size: 10px;">&#xe658;</i>添加文字</el-button>
                    </div>
                </template>

            </div>

            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">发布</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {goods_edit,goods_info} from '@/api/getDataEarth'
    import {setStore,getStore} from '@/config/mUtils'
    export default {
        data(){
            return {
                id:0,
                loading:false,
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


            handleAvatarSuccess(res, file, obj) {

                this.fullscreenLoading = false;
                if (obj) {
                    obj.val = res.data[0];
                    obj.img = res.data[0];
                }
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

                //草稿中获取
                var course_edit_data = getStore('course_edit_data_20181016');
                course_edit_data = JSON.parse(course_edit_data);
                if (course_edit_data) {
                    this.data = course_edit_data;
                    this.data.id = 0;//清空,已避免修改之前的记录
                }
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

//                console.log(this.data);return;
                var error_msg = [];
                if (!this.data.title) {
                    error_msg.push('请填写标题');
                }
                if (!this.data.img) {
                    error_msg.push('请上传图片');
                }
                if (!this.data.price) {
                    error_msg.push('请填写价格');
                }
                if (!this.data.content.options.length) {
                    error_msg.push('请设置时间-地点');
                }
                this.data.content.options.forEach(function(val,i){
                    if (!val.time) {
                        error_msg.push('请设置时间-地点第'+(i+1)+'项的时间');
                    }
                    if (!val.place) {
                        error_msg.push('请设置时间-地点第'+(i+1)+'项的地点');
                    }
                    if (!val.sum) {
                        error_msg.push('请设置时间-地点第'+(i+1)+'项的可预订数');
                    }
                })

                if (!this.data.content.img_text.length) {
                    error_msg.push('请设置图文详情');
                }
                this.data.content.img_text.forEach(function(val,i){
                    if (!val.val) {
                        error_msg.push('请设置图文详情第'+(i+1)+'项的图片或内容');
                    }
                });

                if (!this.data.content.teacher.info.img) {
                    error_msg.push('请设置授课老师头像');
                }
                if (!this.data.content.teacher.info.name) {
                    error_msg.push('请设置授课老师姓名');
                }

                if (error_msg.length) {
                    this.$message({
                        type: 'warning',
                        message: error_msg.join(';')
                    });
                    return;
                }

                this.$confirm('确认无误, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    this.loading = true;
                    goods_edit(this.data).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            setStore('course_edit_data_20181016', this.data);
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

            },
            add_img_text(type, obj) {
                var item = {
                    type:type,
                    val:''
                };

                obj.push(item);
//                console.log(this.data);
            },
            del_img_text(index, obj) {
                obj.splice(index,1);
            },

            add_option() {
                var item = {
                    time:'',
                    place:''
                };

                this.data.content.options.push(item);
//                console.log(this.data);
            },
            del_option(index) {
                this.data.content.options.splice(index,1);
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
        width: 200px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 200px;
        height: 120px;
        display: block;
    }
    .ql-editor{
        min-height: 300px;
    }
    .pre_info{
        display:inline-block ;
        width: 120px;
    }
</style>
