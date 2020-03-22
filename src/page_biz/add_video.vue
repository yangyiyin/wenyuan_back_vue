<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">


            <el-form ref="form" :rules="rule" :model="form" label-width="200px" style="width: 500px">
                <el-form-item label="视频分类" prop="type">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option
                                v-for="item in [{label:'题目精讲',value:'1'},{label:'课堂录制',value:'2'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="科目" prop="entity">
                    <el-select v-model="form.entity" placeholder="请选择">
                        <el-option
                                v-for="item in [{label:'语文',value:'1'},{label:'数学',value:'2'},{label:'英语',value:'3'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="视频标题" prop="title">
                    <el-input clearable v-model="form.title"></el-input>
                </el-form-item>

                <el-form-item label="视频简介(最多250字)" prop="desc">
                    <span style="font-size: 14px" slot="label">视频简介<br/>(最多250字)</span>
                    <el-input
                            clearable
                            v-model="form.desc"
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                    ></el-input>
                </el-form-item>


                <el-form-item label="视频封面"  prop="img">
                    <el-upload
                            class="avatar-uploader"
                            :action="upload_url"
                            :on-remove="(file, fileList) => {return handleRemove(file, fileList, 'img')}"
                            :show-file-list="false"
                            :on-exceed="(files, fileList) => {return handleExceed(files, fileList, 'img')}"
                            :on-success="(res, file, fileList) => {return handleSuccess(res, file, fileList, 'img')}"
                            :before-upload="(file) => {return beforeUpload(file, 'img')}">
                        <img v-if="form.img" :src="form.img" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"  ></i>
                        <!--<el-button size="small" type="primary">点击上传</el-button>-->
                        <div slot="tip" class="el-upload__tip">宽:高=3:2,且请不要超过2M大小</div>
                    </el-upload>
                </el-form-item>

                <el-form-item label="视频上传"  prop="url">
                    <el-upload
                            :action="upload_url_time_fangdao"
                            :limit="1"
                            :on-remove="(file, fileList) => {return handleRemove(file, fileList, 'audio')}"
                            :on-exceed="(files, fileList) => {return handleExceed(files, fileList, 'audio')}"
                            :on-progress="()=>{url_info = '上传尚未完成,请耐心等待...'}"
                            :on-success="(res, file, fileList) => {return handleSuccess(res, file, fileList, 'audio')}"
                            :before-upload="(file) => {return beforeUpload(file, 'audio')}"
                            >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">请控制视频大小不要过大(40M)</div>
                    </el-upload>
                    <!--<el-dialog :visible.sync="dialogVisible" style="width: ">-->
                    <!--<img width="100%" :src="dialogImageUrl" alt="">-->
                    <!--</el-dialog>-->
                    <video  style="width: 200px" controls="controls" v-if="form.url" :src="form.url"></video>
                    <div>{{url_info}}</div>
                </el-form-item>

                <el-form-item label="视频星级" prop="level">
                    <span style="font-size: 14px" slot="label">视频星级<br/>(星级越高,越优先展示)</span>
                    <el-select style="margin-top: 10px" v-model="form.level" placeholder="请选择">
                        <el-option
                                v-for="item in ['1','2','3','4','5']"
                                :key="item"
                                :label="item+'星级'"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="年级" prop="grade">
                    <el-select v-model="form.grade" placeholder="请选择年级" multiple value-key="value">
                        <el-option
                                v-for="item in grades"
                                :key="item.value"
                                :label="item.label"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="知识点" prop="knowledge">

                    <el-select v-model="form.knowledge_group" value-key="id" placeholder="请选择知识点分组" style="width: 120px;" @change="get_knowledge_points()" clearable>
                        <el-option
                                v-for="item in groups"
                                :key="item.id"
                                :label="item.name"
                                :value="item">
                        </el-option>
                    </el-select>

                    <el-select v-model="form.knowledge_group_subject" value-key="id" placeholder="请选择知识点科目分组" style="width: 120px;" @change="get_knowledge_points()" clearable>
                        <el-option
                                v-for="item in groups_subject"
                                :key="item.id"
                                :label="item.name"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" >

                    <template v-if="knowledge_points.length > 0">
                        <div style="max-height: 200px;width: 500px;">
                            <el-checkbox-group class="checkbox-border" v-model="form.knowledge_point" size="mini" style="display: inline-block;">
                                <template v-for="(item, index) in knowledge_points">
                                    <el-checkbox :label="item.id" border>{{item.name}}</el-checkbox>
                                </template>
                            </el-checkbox-group>
                        </div>
                    </template>
                    <template v-else>
                        <span style="color: red">当前分组下无标签</span>
                    </template>
                </el-form-item>
                <el-form-item label="标签组" prop="label">
                    <el-select v-model="form.label_group" value-key="id" placeholder="请选择标签组" style="width: 120px;" @change="get_labels()" clearable>
                        <el-option
                                v-for="item in label_groups"
                                :key="item.id"
                                :label="item.name"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签">
                    <template v-if="labels.length > 0">
                        <div style="max-height: 200px;width: 500px;">
                            <el-checkbox-group class="checkbox-border" v-model="form.label" size="mini" style="display: inline-block" >
                                <template v-for="(item, index) in labels">
                                    <el-checkbox :label="item.id" border>{{item.name}}</el-checkbox>
                                </template>
                            </el-checkbox-group>
                        </div>
                    </template>
                    <template v-else>
                        <span style="color: red">当前标签组下无标签</span>
                    </template>
                </el-form-item>
                <el-form-item label="选择关联原题" prop="questions">
                    <el-button size="small" type="primary" @click="dialogFormVisibleQuestions = true;">选择题目</el-button>
                    <div style="display: inline-block">
                        <!--<span v-for="(item,index) in data.questions">{{item.title.substring(0,10)}}...</span>-->
                        <template v-for="(item,index) in form.questions">
                            <el-popover
                                    placement="top"
                                    width="160"
                                    v-model="item.visible"
                                    style="margin-left: 5px;">
                                <p>{{item.title}}</p>
                                <div style="text-align: center; margin: 0">

                                    <el-button type="danger" size="mini" @click="form.questions.splice(index, 1)">删除</el-button>
                                </div>
                                <el-button slot="reference">{{item.title.substring(0,10)}}...</el-button>
                            </el-popover>
                        </template>
                    </div>
                </el-form-item>
                <el-form-item label="价格(元)" prop="price">
                    <el-input type="number" clearable v-model="form.price"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">提交</el-button>


        </div>

        <el-dialog title="题库" :visible.sync="dialogFormVisibleQuestions" width="80%">

            <p>
                <questions v-if="dialogFormVisibleQuestions" :checked="form.questions" v-on:SelectionChange="SelectionChange"></questions>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleQuestions = false">关 闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import questions from '../components/questions'
    import {get_grades} from '@/api/getDataEarth'

    import {deepCopy} from '../config/mUtils'
    import {video_edit,video_info} from '@/api/getDatavideo'
    import {knowledge_point_all_list,get_groups,get_groups_subject} from '@/api/getDataknowledge_point'
    import {label_all_list, label_group_all_list} from '@/api/getDatalabel'
    export default {
        data(){
            return {
                id:0,
                url_info:'',
                loading:false,
                dialogFormVisibleQuestions:false,
                form: {
                    type: {label:'题目精讲',value:'1'},
                    entity: '',
                    title: '',
                    desc: '',
                    img: '',
                    url: '',
                    level: '1',
                    knowledge_group_subject:{id:1,name:'语文'},
                    knowledge_group:{id:1,name:'一年级'},
                    grade:[],
                    knowledge_point:[],
                    label:[],
                    label_group:{id:'0',name:'全部'},
                    questions:[],
                    price:''
                },
                rule:{
                    type: { required: true, message: '请输入视频类型', trigger: 'blur' },
                    entity: { required: true, message: '请选择科目', trigger: 'blur' },
                    title: { required: true, message: '请输入视频标题', trigger: 'blur' },
                    img: { required: true, message: '请上传视频封面', trigger: 'blur' },
                    url: { required: true, message: '请上传视频', trigger: 'blur' },
                    level: { required: true, message: '请选择星级', trigger: 'blur' },
                    questions: { type:'array', required: true, message: '请选择原题', trigger: 'blur' },
                    price: { required: true, message: '请输入价格', trigger: 'blur' },
                },
                knowledge_points:[],
                labels:[],
                label_groups:[],
                groups:[],
                groups_subject:[],
                grades:[],
                upload_url:this.$store.state.constant.upload_url,
                upload_video_url_local:this.$store.state.constant.upload_video_url_local,
                upload_url_time_fangdao:this.$store.state.constant.upload_url_time_fangdao,

            }

        },
        components: {
            headTop,
            questions
        },
        created(){

        },
        mounted(){

        },

        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.id = to.query.id ? to.query.id : 0;
//                console.log(vm.id )
                if (vm.id && vm.id > 0) {
                    vm.get_info().then(()=>{
                        vm.init_options().then(function () {
                            vm.init_groups().then(function(){
                                vm.init_grades();
                            })

                        })
                    })
                } else {
                    vm.init();
                    vm.init_options().then(function () {
                        vm.init_groups().then(function(){
                            vm.init_grades();
                        })

                    })
                }

            })
        },
        methods: {

            init() {
                this.loading = false;
                this.name = '';
            },
            async get_info() {
                await video_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.form = {
                            title: res.data.title,
                            type: res.data.type,
                            entity: res.data.entity,
                            desc: res.data.desc,
                            img: res.data.img,
                            url: res.data.url,
                            level: res.data.level,
                            knowledge_group_subject:res.data.knowledge_group_subject,
                            knowledge_group:res.data.knowledge_group,
                            grade:res.data.grade,
                            knowledge_point:res.data.knowledge_point,
                            label:res.data.label,
                            label_group:res.data.label_group,
                            questions:res.data.questions,
                            price:res.data.price,
                        }
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },

            init_groups(){
                return new Promise(function(resolve,reject){
                    this.loading_info = true;
                    get_groups({}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.groups = res.data;

                            get_groups_subject({}).then(function (res) {
                                if (res.code == this.$store.state.constant.status_success) {
                                    this.groups_subject = res.data;

                                } else {
                                    this.$message({
                                        message: res.msg,
                                        type: 'warning'
                                    });
                                }
                                this.loading_info = false;
                                resolve();
                            }.bind(this));

                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                        //this.loading_info = false;
                        //resolve();
                    }.bind(this));
                }.bind(this))
            },
            init_grades(){
                return new Promise(function(resolve,reject){
                    this.loading_info = true;
                    get_grades({}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.grades = res.data;
                            label_group_all_list().then(function (res) {
                                if (res.code == this.$store.state.constant.status_success) {
                                    res.data.unshift({id:'0',name:'全部'})
                                    this.label_groups = res.data;
                                } else {
                                    this.$message({
                                        message: res.msg,
                                        type: 'warning'
                                    });
                                }
                                this.loading_info = false;
                                resolve();
                            }.bind(this));
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                        // this.loading_info = false;
                        // resolve();
                    }.bind(this));
                }.bind(this))
            },
            init_options(){
                return new Promise(function(resolve,reject){
                    this.loading_info = true;
                    knowledge_point_all_list({group:this.form.knowledge_group, group_subject:this.form.knowledge_group_subject}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.knowledge_points = res.data;
                            label_all_list({group_id:this.form.label_group.id}).then(function (res) {
                                if (res.code == this.$store.state.constant.status_success) {
                                    this.labels = res.data;
                                    resolve();
                                } else {
                                    this.$message({
                                        message: res.msg,
                                        type: 'warning'
                                    });
                                }

                            }.bind(this));
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                    }.bind(this));
                }.bind(this))
            },
            get_knowledge_points() {
                knowledge_point_all_list({group:this.form.knowledge_group,group_subject:this.form.knowledge_group_subject}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.form.knowledge_point = [];
                        this.knowledge_points = res.data;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                }.bind(this));
            },
            get_labels() {
                label_all_list({group_id:this.form.label_group.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.form.label = [];
                        this.labels = res.data;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                }.bind(this));
            },
            submit: function () {

                var error = false;
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //alert('submit!');
                    } else {
//                        console.log('error submit!!');
                        error = true;
                        return false;
                    }
                });
                if (error) {
                    return ;
                }
                var error_msg = '';
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
                    video_edit({id:this.id,...this.form}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({path:'video',query:{}});
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


            beforeUpload(file, ele){
                if (ele == 'audio') {
                    const isJPG = (file.name.indexOf('.mp4') != -1|| (file.name.indexOf('.MP4') != -1))
//                    const isJPG = true;

                    const isLt2M = file.size / 1024  < 1024 * 40;

                    if (!isJPG) {
                        this.$message.error('只能上传mp4文件!');
                    }

                    if (!isLt2M) {
                        this.$message.error('文件大小不能超过 40M!');
                    }
                    return  isJPG && isLt2M;
                } else {
//            const isJPG = (file.name.indexOf('.jpg') != -1) || (file.name.indexOf('.jpeg') != -1)|| (file.name.indexOf('.png') != -1)
                    const isJPG = true;

                    const isLt2M = file.size / 1024  < 1024 * 4;

                    if (!isJPG) {
                        this.$message.error('只能上传jpg/png文件!');
                    }

                    if (!isLt2M) {
                        this.$message.error('文件大小不能超过 4M!');
                    }
                    return  isJPG && isLt2M;
                }

            },
            handleRemove(file, fileList, ele) {
                //console.log(file, fileList);
                if (ele == 'audio') {
                    this.form.url = '';
                } else {
                    this.form.img = '';
                }

            },
            handlePreview(file) {
                //console.log(file);
            },
            handleExceed(files, fileList, ele) {
                if (ele == 'audio') {
                    this.$message.warning('当前限制 1 个视频');
                } else {
                    this.$message.warning('当前限制 1 个图片');

                }
            },
            beforeRemove(file, fileList) {
                //return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleSuccess(res, file, fileList, ele) {
                if (ele == 'audio') {
                    this.form.url = res.data[0];
                    this.url_info = '';
                } else {
                    this.form.img = res.data[0];
                }


            },

            SelectionChange(multipleSelectionAll){
                if (multipleSelectionAll) {
                    this.form.questions = [multipleSelectionAll[0]];
                } else {
                    this.form.questions = [];
                }
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
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 300px;
        height: 200px;
        line-height: 200px;
        text-align: center;
    }
    .avatar {
        width: 300px;
        height: 200px;
        display: block;
    }

</style>
