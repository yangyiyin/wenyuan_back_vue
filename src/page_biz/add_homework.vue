<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;width: 150px;font-weight: bolder"><i style="color:red;">*</i>标题:</span>
                <el-input clearable placeholder="请输入名称" v-model="data.name" style="width: 350px"></el-input>
                <span class="el-upload__tip">如:19春英语堂Level X 外（中）教课 - 第X次</span>
            </div>

            <div class="search_item" style="display: none">
                <span class="pre_info" style="font-size: 16px;width: 150px;font-weight: bolder"><i style="color:red;">*</i>作业形式:</span>
                <el-radio-group v-model="data.response_type" size="small">
                    <el-radio label="2" border >线下</el-radio>
                    <el-radio label="1" border>线上</el-radio>
                </el-radio-group>
            </div>

            <div class="search_item" style="display: none">
                <span class="pre_info" style="font-size: 16px;width: 150px;font-weight: bolder">建议完成时间:</span>
                <el-input clearable placeholder="60" type="number" v-model="data.limit_min" style="width: 150px"></el-input>分钟
            </div>
            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;width: 150px;"><i style="color:red;">*</i>学习内容:</span>
                <el-input
                        style="width: 450px;vertical-align: top"
                        type="textarea"
                        rows="5"
                        placeholder="请输入内容"
                        v-model="data.content">
                </el-input>
            </div>



            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;width: 150px;">附件资料:</span>

                <el-upload
                        style="display: inline-block;width: 500px;vertical-align: top"
                        class="upload-demo"
                        :action="upload_url"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        multiple
                        :limit="5"
                        :on-exceed="handleExceed"
                        :on-success="handleSuccess"
                        :before-upload="beforeUpload"
                        :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <span style="margin-left: 10px;" slot="tip" class="el-upload__tip">只限上传jpg/png/ppt/doc/xls/pdf文件，最多上传5个文件,且每个不超过5M</span>
                </el-upload>

            </div>


            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;">课后作业:</span>
                <el-input
                        style="width: 450px;vertical-align: top"
                        type="textarea"
                        rows="5"
                        placeholder="作业说明"
                        v-model="data.content_extra">
                </el-input>
                <span style="color: #999;font-size: 11px;">如:XX提高作业本第33页至第35页。表示线下练习等的作业</span>
            </div>

            <div  style="border: 1px dashed #999;margin: 10px;padding-bottom: 10px;margin-left: 150px;">
                <el-tag type="success" style="font-size: 16px;">线上作业(在线答,自动计算成绩):</el-tag>

                <div style="margin-left: 10px;">

                    <div class="search_item">
                        <span style="font-size: 16px;">选择题库题目:</span>

                        <el-button size="small" type="primary" @click="dialogFormVisibleQuestions = true;">选择</el-button>
                        <p style="display: inline-block">
                            <!--<span v-for="(item,index) in data.questions">{{item.title.substring(0,10)}}...</span>-->
                            <template v-for="(item,index) in data.questions">
                                <el-popover
                                        placement="top"
                                        width="160"
                                        v-model="item.visible"
                                        style="margin-left: 5px;">
                        <p>{{item.title}}</p>
                        <div style="text-align: center; margin: 0">

                            <el-button type="danger" size="mini" @click="data.questions.splice(index, 1)">删除</el-button>
                        </div>
                        <el-button slot="reference">{{item.title.substring(0,10)}}...</el-button>
                        </el-popover>
                </template>
                </p>
                </div>
                </div>
            </div>

            <div  style="border: 1px dashed #999;margin: 10px;padding-bottom: 10px;margin-left: 150px;">
                <el-tag type="success" style="font-size: 16px;">线下作业(可以包括题库题目,书本题目):</el-tag>

                <div style="margin-left: 10px;">
                    <div class="search_item">
                        <span style="font-size: 16px;">选择题库题目:</span>

                        <el-button size="small" type="primary" @click="dialogFormVisibleQuestions2 = true;">选择</el-button>
                        <span style="margin-left: 10px;" class="el-upload__tip">选择的题目将自动合成图片供学生下载</span>
                        <p style="display: inline-block">
                            <!--<span v-for="(item,index) in data.questions">{{item.title.substring(0,10)}}...</span>-->
                            <template v-for="(item,index) in data.questions2">
                                <el-popover
                                        placement="top"
                                        width="160"
                                        v-model="item.visible"
                                        style="margin-left: 5px;">
                                    <p>{{item.title}}</p>
                                    <div style="text-align: center; margin: 0">

                                        <el-button type="danger" size="mini" @click="data.questions2.splice(index, 1)">删除</el-button>
                                    </div>
                                    <el-button slot="reference">{{item.title.substring(0,10)}}...</el-button>
                                </el-popover>
                            </template>
                        </p>
                    </div>


                    <div class="search_item">
                        <span class="pre_info" style="font-size: 16px;font-weight: bolder">额外分:</span>
                        <el-input clearable placeholder="请输入总分" v-model="data.total_score_extra" style="width: 150px"></el-input>
                        <span style="color: #999;font-size: 11px;">此总分作为批改作业时的非题库作业的总分,<span style="color: red">如果有非题库作业(书本作业等),请务必输入此分数</span></span>
                    </div>

                    <div class="search_item">
                        <span class="pre_info" style="font-size: 16px;font-weight: bolder;">音频材料:</span>

                        <el-upload
                                style="display: inline-block;width: 500px;vertical-align: top"
                                class="upload-demo"
                                :action="upload_url"
                                :on-remove="(file, fileList) => {return handleRemove(file, fileList, 'audio')}"
                                multiple
                                :limit="2"
                                :on-exceed="(files, fileList) => {return handleExceed(files, fileList, 'audio')}"
                                :on-success="(res, file, fileList) => {return handleSuccess(res, file, fileList, 'audio')}"
                                :before-upload="(file) => {return beforeUpload(file, 'audio')}"
                                :file-list="fileList_audio">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传mp3/wav/m4a/aac文件，最多上传2个文件,且每个不超过8M</div>
                        </el-upload>

                    </div>

                    <div class="search_item">
                        <span class="pre_info" style="font-size: 16px;font-weight: bolder">学生是否需要上传图片:</span>
                        <el-radio @change="change_need_manual_check" v-model="data.need_upload_pic" label="1">是</el-radio>
                        <el-radio @change="change_need_manual_check" v-model="data.need_upload_pic" label="0">否</el-radio>
                    </div>

                    <div class="search_item">
                        <span class="pre_info" style="font-size: 16px;font-weight: bolder">学生是否需要上传录音:</span>
                        <el-radio @change="change_need_manual_check" v-model="data.need_record_voice" label="1">是</el-radio>
                        <el-radio @change="change_need_manual_check" v-model="data.need_record_voice" label="0">否</el-radio>
                    </div>

                    <div class="search_item">
                        <span class="pre_info" style="font-size: 16px;font-weight: bolder">是否需要人工批阅:</span>
                        <el-radio disabled v-model="data.need_manual_check" label="1">是</el-radio>
                        <el-radio disabled v-model="data.need_manual_check" label="0">否</el-radio>
                    </div>

                </div>


            </div>


            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>课程班级:</span>

                <el-button size="small" type="primary" @click="dialogFormVisibleClasses = true">选择</el-button>
                <p style="display: inline-block">
                    <!--<span v-for="(item,index) in data.classes">{{item.classname}};</span>-->

                    <template v-for="(item,index) in data.classes">
                        <el-popover
                                placement="top"
                                width="160"
                                v-model="item.visible"
                                style="margin-left: 5px;"
                        >
                                <div style="text-align: center; margin: 0">

                                    <el-button type="danger" size="mini" @click="data.classes.splice(index, 1)">删除</el-button>
                                </div>
                                <el-button slot="reference">{{item.classname}}</el-button>
                        </el-popover>
                </template>

                </p>
            </div>

            <!--<div class="search_item">-->
                <!--<span class="pre_info" style="font-size: 16px;font-weight: bolder"><i style="color:red;">*</i>布置老师:</span>-->
                <!--<el-input clearable placeholder="请输入老师姓名" v-model="data.teacher_name" style="width: 250px"></el-input>-->
            <!--</div>-->

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>课程老师:</span>
                <el-select v-model="data.author" multiple value-key="id" placeholder="请选择">
                    <el-option
                            v-for="item in authors"
                            :key="item.id"
                            :label="item.show_name"
                            :value="item">
                    </el-option>
                </el-select>
            </div>


            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">提交</el-button>


        </div>

        <el-dialog title="题库" :visible.sync="dialogFormVisibleQuestions" width="80%">

            <p>
                <questions v-if="dialogFormVisibleQuestions" :checked="data.questions" v-on:SelectionChange="SelectionChange"></questions>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleQuestions = false">关 闭</el-button>
            </div>
        </el-dialog>


    <el-dialog title="题库" :visible.sync="dialogFormVisibleQuestions2" width="80%">

        <p>
            <questions v-if="dialogFormVisibleQuestions2" :checked="data.questions2" v-on:SelectionChange="SelectionChangeQuestions2"></questions>
        </p>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleQuestions2 = false">关 闭</el-button>
        </div>
    </el-dialog>

        <el-dialog title="班级" :visible.sync="dialogFormVisibleClasses" width="80%">

            <p>
                <classes v-if="dialogFormVisibleClasses" :checked="data.classes" v-on:SelectionChange="SelectionChangeClass"></classes>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleClasses = false">关 闭</el-button>


            </div>
        </el-dialog>
        <canvas id="myCanvas" width="650" height="900" style="position: absolute;z-index: -1;top:-999999px;"></canvas>
<!--<img v-for="(homework_pic) in data.homework_pic" :src="homework_pic"/>-->

        <div  class="ql-editor" style="position: absolute;z-index:-1;top:-999999px;height:auto;background: #fff;font-size:20px;">
            <div ref="questions_paper" style="border-bottom: 1px solid #ddd;width:650px;white-space:normal">

                <template v-for="(item, index) in data.questions2">

                    <div v-if="item.type==1" style="height:180px;line-height: 25px;overflow: hidden;position: relative">
                        <p style="font-weight: bolder">(单选题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>
                        <p v-html="item.question_content.content" ></p>
                        <p v-for="(option) in item.question_answer.answer_options" style="'position:absolute;top: '+(50+20*index)+'px;'">
                            <span>{{option.label}}.{{option.text}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </p>
                    </div>

                </template>
                <template v-for="(item, index) in data.questions2">


                    <div  v-if="item.type==2" style="height:180px;line-height: 25px;overflow: hidden;position: relative">
                        <p style="font-weight: bolder">(判断题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>


                        <p v-html="item.question_content.content" ></p>

                        <p  v-for="(option2,index) in item.question_answer.answer_options2" :style="'position:absolute;top: '+(50+20*index)+'px;'">
                            <span>{{option2.label}}.{{option2.text}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </p>
                    </div>

                </template>
                <template v-for="(item, index) in data.questions2">
                    <div v-if="item.type==3" style="height:180px;line-height: 25px;overflow: hidden;position: relative">
                        <p v-if="item.type==3"  style="font-weight: bolder">(填空题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>
                        <p v-html="item.question_content.content"></p>

                    </div>
                </template>
                <template v-for="(item, index) in data.questions2">

                        <div v-if="item.type==4" style="height:180px;line-height: 25px;overflow: hidden;position: relative">
                            <p style="font-weight: bolder">(简答题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>

                            <p v-html="item.question_content.content"></p>

                        </div>

                </template>

                <template v-for="(item, index) in data.questions2">

                        <div v-if="item.type==5" style="height:180px;line-height: 25px;overflow: hidden;position: relative">
                            <p style="font-weight: bolder">(其他题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>

                            <p v-html="item.question_content.content"></p>

                        </div>
                </template>

            </div>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import questions from '../components/questions'
    import classes from '../components/classes'
    import {homework_edit,homework_info} from '@/api/getDatahomework'
    import {admin_user_all_list} from '@/api/getDataEarth'
    import html2canvas from 'html2canvas';
    export default {
        data(){
            return {
                id:0,
                loading:false,
                name:'',
                data:{
                    name:'',
                    response_type:'2',
                    limit_min:0,
                    content:'',
                    homework_downloads:'',
                    homework_downloads_objs:'',
                    other_downloads:'',
                    teacher_name:'',
                    total_score_extra:'0',
                    content_extra:'',
                    questions:[],
                    questions2:[],
                    classes:[],
                    author:[],
                    need_record_voice:'0',
                    need_upload_pic:'0',
                    need_manual_check:'0',

                },
                visible_question:false,
                visible_class:false,
                authors:[],
                fullscreenLoading:false,
                fileList:[],
                fileList_audio:[],
                upload_url:this.$store.state.constant.upload_url_local,
                dialogFormVisibleQuestions:false,
                dialogFormVisibleQuestions2:false,
                dialogFormVisibleClasses:false,
            }

        },
        components: {
            headTop,
            questions,
            classes
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
            vm.init_options().then(function () {
                if (vm.id && vm.id > 0) {
                    vm.get_info();
                } else {
                    vm.init();
                }
            });

        })
        },
        methods: {

            init() {
                this.loading = false;
                this.name = '';
                this.data = {
                    name:'',
                    response_type:'2',
                    limit_min:0,
                    content:'',
                    homework_downloads:'',
                    homework_downloads_objs:'',
                    other_downloads:'',
                    teacher_name:'',
                    total_score_extra:'0',
                    content_extra:'',
                    questions:[],
                    questions2:[],
                    classes:[],
                    author:[],
                    need_record_voice:'0',
                    need_upload_pic:'0',
                    need_manual_check:'0',
                }
            },
            init_options(){
                return new Promise(function(resolve,reject){
                    this.loading_info = true;
                    admin_user_all_list({'is_question_author':1}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.authors = res.data;

                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                        this.loading_info = false;
                        resolve();
                    }.bind(this));
                }.bind(this))
            },

            get_info() {
                homework_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.data = res.data.homework_data;
//                        this.$set(this.data, 'questions', '123')
                        this.fileList = res.data.homework_data.fileList;
                        this.fileList_audio = res.data.homework_data.fileList_audio;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            submit: function () {

                if(this.data.questions2 && this.data.questions2.length) {//线下形式,生成图片
                    var total_height = this.data.questions2.length * 180;
                    if (total_height > 0) {
                        html2canvas(this.$refs.questions_paper, {useCORS:true}).then(function(canvas) {

                            var c=document.getElementById("myCanvas");
                            var ctx=c.getContext("2d");
                            var canvastx=canvas.getContext("2d");

                            function copy(x, y)
                            {
                                var imgData=canvastx.getImageData(x,y,650,900);
                                ctx.putImageData(imgData,0,0);
                                return c.toDataURL();
                            }
                            this.data.homework_pic = [];
                            for (var i=0;i<100;i+=5) {
                                this.data.homework_pic.push(copy(0,i*180));
                                //break;
                                if ((i+5)*180 >= total_height) {
                                    break;
                                }
                            }

                            this._submit();

                        }.bind(this));
                    } else {
                        this._submit();
                    }
                } else {
                    this._submit();
                }

            },
            _submit(){
                var error_msg = '';

                if (!this.data.name) error_msg = '请填写作业标题';
                if (!this.data.content) error_msg = '请填写学习内容';
//                if (this.data.response_type == 1 && !this.data.questions.length) error_msg = '请选择题目';
                if (!this.data.classes.length) error_msg = '请选择班级';
                if (!this.data.author.length) error_msg = '请选择老师';

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
                    homework_edit({id:this.id,data:this.data}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({path:'homework',query:{}});
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
                    const isJPG = (file.name.indexOf('.mp3') != -1) || (file.name.indexOf('.wav') != -1) || (file.name.indexOf('.m4a') != -1) || (file.name.indexOf('.aac') != -1)

                    const isLt2M = file.size / 1024  < 1024 * 8;

                    if (!isJPG) {
                        this.$message.error('只能上传mp3/wav/m4a/aac文件!');
                    }

                    if (!isLt2M) {
                        this.$message.error('文件大小不能超过 8M!');
                    }
                    return  isJPG && isLt2M;
                } else {
                    const isJPG = (file.name.indexOf('.jpg') != -1) || (file.name.indexOf('.jpeg') != -1)|| (file.name.indexOf('.png') != -1) || (file.name.indexOf('.ppt') != -1) || (file.name.indexOf('.pptx') != -1)|| (file.name.indexOf('.doc') != -1)|| (file.name.indexOf('.docx') != -1)|| (file.name.indexOf('.pdf') != -1)|| (file.name.indexOf('.xls') != -1)|| (file.name.indexOf('.xlsx') != -1)

                    const isLt2M = file.size / 1024  < 1024 * 5;

                    if (!isJPG) {
                        this.$message.error('只能上传jpg/png/ppt/doc/xls/pdf文件!');
                    }

                    if (!isLt2M) {
                        this.$message.error('文件大小不能超过 5M!');
                    }
                    return  isJPG && isLt2M;
                }

            },
            handleRemove(file, fileList, ele) {
                //console.log(file, fileList);
                if (ele == 'audio') {
                    this.data.homework_downloads_objs = [];
                    this.data.fileList_audio = fileList;
                    fileList.forEach(function(val){
                        var name_arr = val.name.split('.');
                        var ext = name_arr[name_arr.length - 1];
                        if (val.response.code == this.$store.state.constant.status_success && val.response.data) {
                            this.data.homework_downloads_objs.push({
                                url:val.response.data[0],
                                name:val.name,
                                ext:ext
                            });
                        }

                    }.bind(this));
                } else {
                    this.data.other_downloads = [];
                    this.data.fileList = fileList;
                    fileList.forEach(function(val){
                        var name_arr = val.name.split('.');
                        var ext = name_arr[name_arr.length - 1];
                        if (val.response.code == this.$store.state.constant.status_success && val.response.data) {
                            this.data.other_downloads.push({
                                url:val.response.data[0],
                                name:val.name,
                                ext:ext
                            });
                        }

                    }.bind(this));
                }

            },
            handlePreview(file) {
                //console.log(file);
            },
            handleExceed(files, fileList, ele) {
                if (ele == 'audio') {
                    this.$message.warning(`当前限制选择 2 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
                } else {
                    this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);

                }
            },
            beforeRemove(file, fileList) {
                //return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleSuccess(res, file, fileList, ele) {
                if (ele == 'audio') {
                    this.data.homework_downloads_objs = [];
                    this.data.fileList_audio = fileList;
                    fileList.forEach(function(val){
                        var name_arr = val.name.split('.');
                        var ext = name_arr[name_arr.length - 1];
                        if (val.response.code == this.$store.state.constant.status_success && val.response.data) {
                            this.data.homework_downloads_objs.push({
                                url:val.response.data[0],
                                name:val.name,
                                ext:ext
                            });
                        }

                    }.bind(this));

                } else {
                    this.data.other_downloads = [];
                    this.data.fileList = fileList;
                    fileList.forEach(function(val){
                        var name_arr = val.name.split('.');
                        var ext = name_arr[name_arr.length - 1];
                        if (val.response.code == this.$store.state.constant.status_success && val.response.data) {
                            this.data.other_downloads.push({
                                url:val.response.data[0],
                                name:val.name,
                                ext:ext
                            });
                        }

                    }.bind(this));

                }

                this.fullscreenLoading = false

            },
            SelectionChange(multipleSelectionAll){
                this.data.questions = multipleSelectionAll;
            },
            SelectionChangeQuestions2(multipleSelectionAll){
                this.data.questions2 = multipleSelectionAll;
            },
            SelectionChangeClass(multipleSelectionAll){
                this.data.classes = multipleSelectionAll;
            },

            change_need_manual_check(){
                this.data.need_manual_check = (this.data.need_record_voice == 1) ? this.data.need_record_voice : this.data.need_upload_pic;
            }

        }
    }
</script>

<style lang="less">
    @import '../style/mixin';
    .search_item{

        margin-top: 10px;

    }
    .pre_info{
        width: 150px;
        display:inline-block ;
    }

</style>
