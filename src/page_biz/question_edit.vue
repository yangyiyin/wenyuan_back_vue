<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder"><i style="color:red;">*</i>题型:</span>
                <el-radio-group v-model="question.type" size="small" @change="change_type()">
                    <el-radio label="1" border>单选题</el-radio>
                    <el-radio label="2" border >判断题</el-radio>
                    <el-radio label="3" border >填空题</el-radio>
                    <el-radio label="4" border >简答题</el-radio>
                </el-radio-group>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>题干:</span>
                <quill-editor style="display:inline-block;width: 600px;vertical-align: top" ref="myQuillEditor" :content="question.content" :options = "editorOption" @change="onEditorChange($event)"></quill-editor>
            </div>


            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>知识点:</span>

                <el-checkbox-group v-model="question.label" size="mini" style="display: inline-block">
                    <el-checkbox label="A" border>1</el-checkbox>
                    <el-checkbox label="B" border>2</el-checkbox>
                </el-checkbox-group>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;">标签:</span>

                <el-checkbox-group v-model="question.label" size="mini" style="display: inline-block">
                    <el-checkbox label="A" border>1</el-checkbox>
                    <el-checkbox label="B" border>2</el-checkbox>
                </el-checkbox-group>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>难度:</span>

                <el-slider style="display: inline-block;width: 300px;vertical-align: middle"
                        v-model="question.hard_level"
                        :step="1"
                           :max="10"
                        show-stops
                           show-input
                >
                </el-slider>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>年份:</span>
                <el-date-picker
                        v-model="question.year"
                        type="year"
                        placeholder="选择年份">
                </el-date-picker>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>年级:</span>
                <el-select v-model="question.grade" placeholder="请选择年级">
                    <el-option
                            v-for="item in [{label:'一年级',value:'1'},{label:'二年级',value:'2'},{label:'三年级',value:'3'},{label:'四年级',value:'4'},{label:'五年级',value:'5'},{label:'六年级',value:'6'},{label:'初一',value:'7'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>



            <div v-if="question.type==1" class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>答案:</span>

                <div style="display: inline-block;vertical-align: top">

                    <el-radio-group v-model="question.answer" size="small">
                        <template v-for="(item,index) in question.answer_options">
                            <p class="option"><el-radio :label="item.label" > {{item.label}}:<el-input placeholder="选项内容" style="width: 100px" v-model="item.text" ></el-input></el-radio><el-tag v-if="item.label==question.answer" type="success">正解</el-tag><el-button type="danger" size="mini" style="margin-left: 10px;" v-on:click="del_option(index)" >x</el-button></p>

                        </template>

                    </el-radio-group>

                    <br/>
                    <el-button type="primary" style="margin-bottom: 10px;" v-on:click="add_option()" >增加选项</el-button>
                </div>
            </div>


            <div v-if="question.type==2" class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>答案:</span>

                <div style="display: inline-block;vertical-align: top">

                    <el-radio-group v-model="question.answer" size="small">
                        <template v-for="(item,index) in question.answer_options_2">
                            <p class="option"><el-radio :label="item.label" > <el-input placeholder="判断内容" style="width: 100px" v-model="item.text" ></el-input></el-radio><el-tag v-if="item.label==question.answer" type="success">正解</el-tag></p>

                        </template>

                    </el-radio-group>



                </div>
            </div>

            <div v-if="question.type==3" class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>答案:</span>
                <el-input style="width: 300px" placeholder="答案" v-model="question.answer" ></el-input>
            </div>

            <div v-if="question.type==4" class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>答案:</span>
                <quill-editor style="display:inline-block;width: 600px;vertical-align: top" ref="myQuillEditor" :content="question.answer" :options = "editorOption" @change="onEditorChange($event)"></quill-editor>
            </div>
            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;">答案解析:</span>
                <quill-editor style="display:inline-block;width: 600px;vertical-align: top" ref="myQuillEditor" :content="question.answer_parse" :options = "editorOption" @change="onEditorChange($event)"></quill-editor>
            </div>
            <!--<div class="search_item">-->
                <!--<span class="pre_info" style="font-size: 14px;vertical-align: top">描述:</span>-->
                <!--<el-input style="width: 300px" placeholder="内容..." v-model="content" type="textarea" :rows="2" >-->

                <!--</el-input>-->
            <!--</div>-->



            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">录入</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {question_edit,question_info} from '@/api/getDataEarth'
    import  { quillEditor,Quill } from 'vue-quill-editor'
    import { ImageDrop } from 'quill-image-drop-module'
    import ImageResize from 'quill-image-resize-module'
    Quill.register('modules/imageDrop', ImageDrop)
    Quill.register('modules/imageResize', ImageResize)
    export default {
        data(){
            return {
                id:0,
                question:{
                    type:"1",
                    title:"",
                    content:"",
                    answer:"A",
                    answer_parse:"",
                    answer_options:[{label:'A',text:''},{label:'B',text:''},{label:'C',text:''}],
                    answer_options_2:[{label:'A',text:''},{label:'B',text:''}],
                    label:[],
                    hard_level:1,
                    year:'2018',
                    grade:'2'


                },
                years:[],
                loading:false,
                editorOption:{
                    modules:{
                        imageDrop: true,
                        imageResize: {
                            displayStyles: {
                                backgroundColor: 'black',
                                border: 'none',
                                color: 'white'
                            },
                            modules: [ 'Resize']
                        },
                        toolbar:[
                            ['bold','code-block', 'italic', { 'color': [] }, { 'background': [] },'underline',{ 'script': 'sub'}, { 'script': 'super' }, { 'list': 'ordered'}, { 'list': 'bullet' },'strike',{ 'align': [] },'image']        // toggled buttons
//                            ['blockquote', 'code-block','align']
                                ]
                    }
                },
                upload_url:this.$store.state.constant.upload_url,
                editor:1,
                toolbars:{subfield: true},
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
            handleImgSuccess(e, file, fileList){
                this.fullscreenLoading = false
                let vm = this
                let url = ''
                if (this.uploadType === 'image') { // 获得文件上传后的URL地址
                    url = e.data[0]
                } else if (this.uploadType === 'video') {
                    url = e.data[0]
                }
                if (url != null && url.length > 0) { // 将文件上传后的URL地址插入到编辑器文本中
                    let value = url
                    // API: https://segmentfault.com/q/1010000008951906
                    // this.$refs.myTextEditor.quillEditor.getSelection();
                    // 获取光标位置对象，里面有两个属性，一个是index 还有 一个length，这里要用range.index，即当前光标之前的内容长度，然后再利用 insertEmbed(length, 'image', imageUrl)，插入图片即可。
                    vm.addRange = vm.$refs.myQuillEditor.quill.getSelection()
                    value = value.indexOf('http') !== -1 ? value : 'http:' + value
                    vm.$refs.myQuillEditor.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER) // 调用编辑器的 insertEmbed 方法，插入URL
                } else {
                    this.$message.error(`${vm.uploadType}插入失败`)
                }
                this.$refs['upload'].clearFiles() // 插入成功后清除input的内容
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

            onEditorChange({ editor, html, text }) {//富文本编辑器  文本改变时 设置字段值
                this.content = html
            },

            init() {
                this.loading = false;

                this.title = '';

                this.content='';

            },

            get_info() {
                question_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {

                        this.title = res.data.title;
                        this.content = res.data.content;

                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            submit: function () {

//                if (!this.title) {
//                    var error_msg = '请填写标题';
//                }
//console.log(this.question);return;

                this.loading = true;
                question_edit({
                    id:this.id,
                    title:this.title,
                    desc:this.content
                }).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.$router.push({path:'question',query:{}});
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));

            },
            add_option(){

                var option_labels = ['A','B','C','D','E','F','G'];
                if (option_labels.length < (this.question.answer_options.length+1)) {
                    this.$message({
                        message: '对不起,最多只支持7个选项',
                        type: 'warning'
                    });
                    return ;
                }

                var option = {
                    label:'A',
                    text:''
                }

                this.question.answer_options.push(option);
                this.gen_options();
            },
            del_option(index){
                if (this.question.answer_options.length<1) {
                    if (option_labels.length < (this.question.answer_options.length+1)) {
                        this.$message({
                            message: '对不起,至少含有一个选项',
                            type: 'warning'
                        });
                        return ;
                    }
                }
                this.question.answer_options.splice(index,1);
                this.gen_options();
            },

            gen_options(){
                var option_labels = ['A','B','C','D','E','F','G'];
                if (option_labels.length < this.question.answer_options.length) {
                    this.$message({
                        message: '对不起,最多只支持7个选项',
                        type: 'warning'
                    });
                    return ;
                }
                this.question.answer_options.forEach(function(val,index){
                    val.label = option_labels[index];
                })


            },
            change_type(){
                if (this.question.type==1 || this.question.type==2) {
                    this.question.answer = 'A';
                } else {
                    this.question.answer = '';
                }
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
        min-height: 100px;
    }
    .pre_info{
        display:inline-block ;
        width: 120px;
    }
    .option{
        margin-bottom: 10px;
    }
</style>
