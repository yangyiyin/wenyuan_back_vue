<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder"><i style="color:red;">*</i>作业标题:</span>
                <el-input clearable placeholder="请输入名称" v-model="data.name" style="width: 350px"></el-input>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder"><i style="color:red;">*</i>作业形式:</span>
                <el-radio-group v-model="data.response_type" size="small">
                    <el-radio label="2" border >线下</el-radio>
                    <el-radio label="1" border>线上</el-radio>
                </el-radio-group>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder">建议完成时间:</span>
                <el-input clearable placeholder="60" type="number" v-model="data.limit_min" style="width: 150px"></el-input>分钟
            </div>
            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>学习内容:</span>
                <el-input
                        style="width: 450px;vertical-align: top"
                        type="textarea"
                        rows="5"
                        placeholder="请输入内容"
                        v-model="data.content">
                </el-input>
            </div>



            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>附件资料:</span>

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
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png/ppt/doc/xls文件，最多上传5个文件,且每个不超过100kb</div>
                </el-upload>

            </div>


            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>选择题目:</span>

                <el-button size="small" type="primary" @click="dialogFormVisibleQuestions = true;">选择</el-button>
                <p style="display: inline-block">
                    <span v-for="(item,index) in data.questions">{{item.title.substring(0,10)}}...</span>
                </p>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>布置给班级:</span>

                <el-button size="small" type="primary" @click="dialogFormVisibleClasses = true">选择</el-button>
                <p style="display: inline-block">
                    <span v-for="(item,index) in data.classes">{{item.classname}};</span>
                </p>
            </div>

            <!--<div class="search_item">-->
                <!--<span class="pre_info" style="font-size: 16px;font-weight: bolder"><i style="color:red;">*</i>布置老师:</span>-->
                <!--<el-input clearable placeholder="请输入老师姓名" v-model="data.teacher_name" style="width: 250px"></el-input>-->
            <!--</div>-->

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>布置老师:</span>
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

        <el-dialog title="班级" :visible.sync="dialogFormVisibleClasses" width="80%">

            <p>
                <classes v-if="dialogFormVisibleClasses" :checked="data.classes" v-on:SelectionChange="SelectionChangeClass"></classes>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleClasses = false">关 闭</el-button>


            </div>
        </el-dialog>
        <canvas id="myCanvas" width="650" height="900" style="position: absolute;z-index: -1;top:-999999px;"></canvas>

        <div ref="questions_paper" class="ql-editor" style="position: absolute;z-index:-1;top:-999999px;height:auto;width:650px;background: #fff">
            <div  style="border-bottom: 1px solid #ddd">
                <template v-for="(item, index) in data.questions">
                    <template v-if="item.type==1">

                        <div style="height:180px;line-height: 15px;overflow: hidden;position: relative">
                            <p style="font-weight: bolder">(单选题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>
                            <p v-html="item.question_content.content" ></p>
                            <p v-for="(option) in item.question_answer.answer_options" style="'position:absolute;top: '+(50+20*index)+'px;'">
                                <span>{{option.label}}.{{option.text}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </p>
                        </div>

                    </template>
                </template>
                <template v-for="(item, index) in data.questions">
                    <template v-if="item.type==2">

                        <div style="height:180px;line-height: 15px;overflow: hidden;position: relative">
                            <p style="font-weight: bolder">(判断题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>


                            <p v-html="item.question_content.content" ></p>

                            <p  v-for="(option2,index) in item.question_answer.answer_options2" :style="'position:absolute;top: '+(50+20*index)+'px;'">
                                <span>{{option2.label}}.{{option2.text}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </p>
                        </div>

                    </template>
                </template>
                <template v-for="(item, index) in data.questions">
                    <template v-if="item.type==3">
                        <div style="height:180px;line-height: 15px;overflow: hidden">
                            <p v-if="item.type==3"  style="font-weight: bolder">(填空题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>
                            <p v-html="item.question_content.content"></p>

                        </div>
                    </template>
                </template>
                <template v-for="(item, index) in data.questions">
                    <template v-if="item.type==4">


                        <div style="height:180px;line-height: 15px;overflow: hidden">
                            <p style="font-weight: bolder">(简答题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>

                            <p v-html="item.question_content.content"></p>

                        </div>

                    </template>
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
                    other_downloads:'',
                    teacher_name:'',
                    questions:[],
                    classes:[],
                    author:[]

                },
                authors:[],
                fullscreenLoading:false,
                fileList:[],
                upload_url:this.$store.state.constant.upload_url_local,
                dialogFormVisibleQuestions:false,
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
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            submit: function () {

                if(this.data.response_type == 2) {//线下形式,生成图片
                    var total_height = this.data.questions.length * 180;
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

                        //this.data.homework_pic = canvas.toDataURL();
                        //return;
                        this._submit();

                    }.bind(this));
                } else {
                    this._submit();
                }

            },
            _submit(){
                var error_msg = '';

                if (!this.data.questions.length) error_msg = '请选择题目';

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
            beforeUpload(file){
                const isJPG = (file.name.indexOf('.jpg') != -1) || (file.name.indexOf('.jpeg') != -1)|| (file.name.indexOf('.png') != -1)|| (file.name.indexOf('.ppt') != -1)|| (file.name.indexOf('.pptx') != -1)|| (file.name.indexOf('.doc') != -1)|| (file.name.indexOf('.docx') != -1)|| (file.name.indexOf('.xls') != -1)|| (file.name.indexOf('.xlsx') != -1)

                const isLt2M = file.size / 1024  < 100;

                if (!isJPG) {
                    this.$message.error('只能上传jpg/png/ppt/doc/xls文件!');
                }

                if (!isLt2M) {
                    this.$message.error('文件大小不能超过 100kb!');
                }
                return  isJPG && isLt2M;
            },
            handleRemove(file, fileList) {
                //console.log(file, fileList);
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

            },
            handlePreview(file) {
                //console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                //return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleSuccess(res, file, fileList) {
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

                this.fullscreenLoading = false

            },
            SelectionChange(multipleSelectionAll){
                this.data.questions = multipleSelectionAll;
            },
            SelectionChangeClass(multipleSelectionAll){
                this.data.classes = multipleSelectionAll;
            }

        }
    }
</script>

<style lang="less">
    @import '../style/mixin';
    .search_item{

        margin-top: 10px;

    }

</style>
