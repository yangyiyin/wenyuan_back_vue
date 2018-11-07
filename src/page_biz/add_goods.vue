<template>
    <div class="fillcontain">
        <head-top></head-top>


        <div class="table_container" style="padding:20px">
            <el-alert
                    title="温馨提示:主图尺寸建议750*428;图文详情尺寸建议750*高(任意);每张图片大小建议不要超过200kb,否则小程序端加载页面会比较慢。专项课是指单节的，多时间地点选择项，无试听课；小课是指一次课程多期上，可安排试听课和正式上课规律。"
                    type="warning"
                    close-text="X">
            </el-alert>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>课程类型:</span>
                <el-select v-model="data.type" placeholder="类型">
                    <el-option
                            v-for="item in types"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>

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

            <!--<div class="search_item">-->
                <!--<span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>价格(元):</span>-->
                <!--<el-input clearable placeholder="请输入价格" v-model="data.price" type="number" style="width: 150px"></el-input>-->
            <!--</div>-->

            <div style="border: 1px dashed #999;padding: 10px;margin: 10px;">

                <div class="search_item" style="margin-bottom: 30px;">
                    <span class="pre_info" style="font-size: 14px;">可选项(时间-地点):</span>
                    <div style="display: inline-block;vertical-align: top;padding: 5px;">
                        <template v-if="data.content.options">

                            <div style="margin-bottom: 3px;" v-for="(sub, index)  in data.content.options">
                                <!--<el-input clearable placeholder="请输入时间" v-model="sub.time" style="width: 350px"></el-input>-->

                                <el-date-picker
                                        v-model="sub.time"
                                        type="datetime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期时间">
                                </el-date-picker>

                                <el-input clearable placeholder="请输入地点" v-model="sub.place" style="width: 350px"></el-input>
                                <!--<el-input clearable placeholder="可预订数" v-model="sub.sum" style="width: 120px" type="number"></el-input>-->
                                <el-button type="danger" @click="del_option(index)" round size="mini">删除</el-button>

                            </div>
                        </template>

                        <el-button @click="add_option()" type="danger" round size="mini"><i class="iconfont" style="font-size: 10px;">&#xe658;</i>添加</el-button>
                    </div>
                </div>

                <div class="search_item" style="margin-bottom: 30px;">
                    <span class="pre_info" style="font-size: 14px;">可选项(属性类型):</span>
                    <div style="display: inline-block;vertical-align: top;">
                        <template v-for="(prop, index) in properties">
                            <el-checkbox @change="change_prop(prop)" v-model="prop.checked">{{prop.name}}</el-checkbox>

                        </template>

                    </div>
                </div>

                <div class="search_item" style="margin-bottom: 30px;">
                    <span class="pre_info" style="font-size: 14px;">可选项(属性值):</span>
                    <div style="display: inline-block;vertical-align: top;padding: 5px;">
                        <template v-for="(prop, index) in properties">
                            <div>
                                <span style="font-size: 14px;width: 120px;display: inline-block" v-if="prop.checked">{{prop.name}}:</span>
                                <template v-if="prop.checked" v-for="(prop_value, index2) in prop.children">
                                    <el-checkbox v-model="prop_value.checked">{{prop_value.name}}</el-checkbox>
                                </template>
                            </div>
                        </template>

                    </div>
                </div>


                <div class="search_item" style="margin-bottom: 30px;">
                    <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>所有可选项: <el-button type="success" @click="gen_all_options" round size="mini">生成</el-button></span>
                    <div style="display: inline-block;vertical-align: top;padding: 5px;">
                        <template v-if="data.content.all_options">

                            <div style="margin-bottom: 3px;" v-for="(sub, index)  in data.content.all_options">
                                <!--<el-input clearable placeholder="请输入时间" v-model="sub.time" style="width: 350px"></el-input>-->
                                <span style="font-size: 14px;display: inline-block" v-for="(item, indexx) in sub.list">
                                    <span v-if="item.time && item.place">【时间地点{{item.index}}】</span>
                                    <span v-else>[{{item.name}}]</span>

                                </span>

                                <el-input clearable placeholder="请输入库存" v-model="sub.stock" type="number" style="width: 150px"></el-input>
                                <el-input clearable placeholder="请输入全款价格" v-model="sub.price" type="number" style="width: 150px"></el-input>
                                <el-input v-if="sub.price_type == 1" clearable placeholder="请输入押金" v-model="sub.deposit" type="number" style="width: 150px"></el-input>
                                <el-checkbox  v-model="sub.price_type==1" @change="change_price_type(sub)">押金形式</el-checkbox>
                                <!--<el-input clearable placeholder="可预订数" v-model="sub.sum" style="width: 120px" type="number"></el-input>-->
                                <el-button type="danger" @click="del_all_options(index)" round size="mini">删除</el-button>

                            </div>
                        </template>
                    </div>
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


                    <div style="display: inline-block;vertical-align: top;">
                        <template v-for="(info, index)  in data.content.teacher.infos">
                            <div style="margin-bottom: 10px;position: relative;border: 1px dashed #ddd;padding: 10px;">
                                <div style="display:block">
                                    <i style="color:red;">*</i>头像:
                                    <el-upload
                                            style="display: inline-block;vertical-align: middle;"
                                            class="avatar-uploader avatar-uploader-round"
                                            :action="upload_url"
                                            :show-file-list="false"
                                            :on-success="(res,file)=>{return handleAvatarSuccess(res,file, info)}"
                                            :before-upload="beforeAvatarUpload">
                                        <img v-if="info.img" :src="info.img" class="avatar" style="width: 80px;height: 80px;border-radius: 80px;">
                                        <i v-else class="el-icon-plus avatar-uploader-icon" style="width: 80px;height: 80px;border-radius: 80px;line-height: 80px;"></i>
                                    </el-upload>

                                </div>
                                <el-input clearable placeholder="请输入姓名" v-model="info.name" style="width: 350px;margin-bottom: 10px">
                                    <template slot="prepend"><i style="color:red;">*</i>姓名</template>
                                </el-input>
                                <br/>
                                <el-input maxlength="200" clearable placeholder="请输入一句话描述" v-model="info.desc" style="width: 450px">
                                    <template slot="prepend">一句话描述(1-200字)</template>
                                </el-input>


                                <el-button style="position: absolute;right: 10px;top:10px;" type="danger" @click="del_teacher_info(index)" round size="mini">删除</el-button>
                            </div>
                        </template>
                        <div >
                            <el-button @click="add_teacher_info()" type="danger" round size="mini"><i class="iconfont" style="font-size: 10px;">&#xe658;</i>添加老师主要信息</el-button>

                        </div>

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
    import {goods_edit,goods_info,get_all_properties} from '@/api/getDataEarth'
    import {setStore,getStore,deepCopy} from '@/config/mUtils'
    export default {
        data(){
            return {
                id:0,
                loading:false,
                data:{ type:'1',img:'',content:{img_text:[],teacher:{infos:[{img:'',name:'',desc:''}],img_text:[]},options:[],all_options:[],checked_options:[],properties:[]}},
                content:'',
                link:'',
                upload_url:this.$store.state.constant.upload_url,
                editor:1,
                fullscreenLoading:false,
                properties:[{'name':'','children':[]}],
                types:[{id:'1',name:'专项课'},{id:'2',name:'小课'}]
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
                vm.get_all_properties().then(function(){
                    if (vm.id && vm.id > 0) {
                        vm.get_info();
                    } else {
                        vm.init();
                    }
                });
            })
        },
        methods: {

            get_all_properties() {
                return new Promise(function(resolve, reject){
                    get_all_properties().then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.properties = res.data;

                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                        resolve();
                    }.bind(this));
                }.bind(this))
            },
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
                this.data = {img:'',content:{img_text:[],teacher:{infos:[{img:'',name:'',desc:''}],img_text:[]},options:[],all_options:[],checked_options:[]}};

                //草稿中获取
                var course_edit_data = getStore('course_edit_data_20181024');
                course_edit_data = JSON.parse(course_edit_data);
                if (course_edit_data) {
                    this.data = course_edit_data;
                    this.data.id = 0;//清空,已避免修改之前的记录
                    this.properties = this.data.content.properties;
                }
            },
            get_info() {
                goods_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.data = res.data;
                        this.properties = this.data.content.properties;
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

                if (this.data.content.options.length) {
                    this.data.content.options.forEach(function(val,i){
                        if (!val.time) {
                            error_msg.push('请设置时间-地点第'+(i+1)+'项的时间');
                        }
                        if (!val.place) {
                            error_msg.push('请设置时间-地点第'+(i+1)+'项的地点');
                        }
                    });
                }

                //检测所有选项
                if(! this.data.content.all_options.length) {
                    error_msg.push('请设置所有选项,起码包含一项可选');
                }

                 this.data.content.all_options.forEach(function(val,i){
                    if (!val.stock) {
                        error_msg.push('请设置所有选项第'+(i+1)+'项的库存');
                    }
                    if (!val.price) {
                        error_msg.push('请设置所有选项第'+(i+1)+'项的价格');
                    }
                     if (!val.price_type) {
                         error_msg.push('请设置所有选项第'+(i+1)+'项的付费类型');
                     }

                     if(val.price_type == 1 && !val.deposit) {
                         error_msg.push('请设置所有选项第'+(i+1)+'项的押金');
                     }
                })

                this.data.content.checked_options = [];
                this.properties.forEach(function(val1){
                    if (val1.checked) {
                        var item = {name:val1.name,children:[]};
                        if (val1.children) {
                            val1.children.forEach(function(val2){
                                if (val2.checked) {
                                    item.children.push(val2);
                                }
                            }.bind(this))
                        }

                        this.data.content.checked_options.push(item);

                    }
                }.bind(this));

                if (this.data.content.options.length) {
                    var item = {name:'时间地点',children:[]};
                    this.data.content.options.forEach(function(val){
                        item.children.push(val);
                    }.bind(this));
                    this.data.content.checked_options.push(item);
                }



                if (!this.data.content.img_text.length) {
                    error_msg.push('请设置图文详情');
                }
                this.data.content.img_text.forEach(function(val,i){
                    if (!val.val) {
                        error_msg.push('请设置图文详情第'+(i+1)+'项的图片或内容');
                    }
                });

                if (!this.data.content.teacher.infos.length) {
                    error_msg.push('请设置授课老师基本信息');
                }
                this.data.content.teacher.infos.forEach(function(val,i){
                    if (!val.img) {
                        error_msg.push('请设置授课老师第'+(i+1)+'项的头像');
                    }
                    if (!val.name) {
                        error_msg.push('请设置授课老师第'+(i+1)+'项的姓名');
                    }
                })

                if (error_msg.length) {
                    this.$message({
                        type: 'warning',
                        message: error_msg.join(';')
                    });
                    return;
                }

                this.data.content.properties = this.properties;

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
                            setStore('course_edit_data_20181024', this.data);
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
                //this.gen_all_options();
            },
            del_option(index) {
                this.data.content.options.splice(index,1);
                //this.gen_all_options();
            },
            del_all_options(index) {
                 this.data.content.all_options.splice(index,1);
            },
            add_teacher_info() {
                var item = {
                    img:'',
                    name:'',
                    desc:''
                };

                this.data.content.teacher.infos.push(item);
//                console.log(this.data);
            },
            del_teacher_info(index) {
                this.data.content.teacher.infos.splice(index,1);
            },
            gen_all_options(){
                 this.data.content.all_options = [];

                var is_first = true;
                this.properties.forEach(function(val1){
                    if (val1.checked && val1.children.length) {
                        var all_options = [];
                        val1.children.forEach(function(val2){
                            if (val2.checked) {
                                if (!is_first) {
                                     this.data.content.all_options.forEach(function(val){
                                        var new_val = deepCopy(val);
                                        new_val.list.push(val2);
                                        all_options.push(new_val);
                                    })
                                } else {
                                    if (this.data.content.options.length) {
                                        this.data.content.options.forEach(function(val3, i){
                                            val3.index = i+1;
                                             this.data.content.all_options.push({info:{},price_type:1,price:'',deposit:'',stock:'',list:[val3,val2]});
                                        }.bind(this));
                                    } else {
                                         this.data.content.all_options.push({info:{},price_type:1,price:'',deposit:'',stock:'',list:[val2]});
                                    }

                                }

                            }
                        }.bind(this));
                        if (all_options.length) {
                             this.data.content.all_options = all_options;
                        }
                        is_first = false;
                    }
                }.bind(this));


                if (! this.data.content.all_options.length){
                    if (this.data.content.options.length) {
                        this.data.content.options.forEach(function(val3, i){
                            val3.index = i+1;
                             this.data.content.all_options.push({info:{},price_type:1,price:'',deposit:'',stock:'',list:[val3]});
                        }.bind(this));
                    }
                }

               //console.log( this.data.content.all_options);
            },
            change_price_type(item){
                if(item.price_type == 1) {
                    item.price_type = 2;
                } else {
                    item.price_type = 1;
                }
//                if (prop.children.length) {
//                    prop.children.forEach(function(val){
//                        val.checked = prop.checked;
//                    });
//                    //this.gen_all_options();
//                }
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
