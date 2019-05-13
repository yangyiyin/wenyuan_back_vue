<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px" v-loading="loading_info">

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder"><i style="color:red;">*</i>科目:</span>
                <el-radio-group v-model="question.entity" size="small">
                    <el-radio label="1" border>语文</el-radio>
                    <el-radio label="2" border >数学</el-radio>
                    <el-radio label="3" border >英语</el-radio>
                </el-radio-group>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder"><i style="color:red;">*</i>题型:</span>
                <el-radio-group v-model="question.type" size="small" @change="change_type()">
                    <el-radio label="1" border>单选题</el-radio>
                    <el-radio label="2" border >判断题</el-radio>
                    <el-radio label="3" border >填空题</el-radio>
                    <el-radio label="4" border >简答题</el-radio>
                    <el-radio label="5" border >其他题</el-radio>
                    <el-radio label="6" border >阅读题</el-radio>
                    <el-radio label="7" border >计算题</el-radio>
                </el-radio-group>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>题干:</span>
                <!--<quill-editor style="display:inline-block;width: 600px;vertical-align: top" ref="myQuillEditor1" :content="question.content" :options = "editorOption" @change="onEditorChange($event,'content')"></quill-editor>-->
                <div class="editor-container">
                    <script id="editor1" type="text/plain" ></script>
                </div>
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


            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>分值:</span>

                <el-slider style="display: inline-block;width: 300px;vertical-align: middle"
                           v-model="question.score"
                           :step="1"
                           :max="50"
                           show-input
                >
                </el-slider>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder"><i style="color:red;">*</i>绝密等级:</span>
                <el-checkbox-group v-model="question.useway" size="mini" style="display: inline-block">
                    <el-checkbox label="1" border>等级一</el-checkbox>
                    <el-checkbox label="2" border>等级二</el-checkbox>
                    <el-checkbox label="3" border>等级三</el-checkbox>
                    <el-checkbox label="4" border>等级四</el-checkbox>
                </el-checkbox-group>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>知识点:</span>

                <el-select v-model="question.knowledge_group" value-key="id" placeholder="请选择知识点分组" style="width: 120px;" @change="get_knowledge_points()" clearable>
                    <el-option
                            v-for="item in groups"
                            :key="item.id"
                            :label="item.name"
                            :value="item">
                    </el-option>
                </el-select>

                <el-select v-model="question.knowledge_group_subject" value-key="id" placeholder="请选择知识点科目分组" style="width: 120px;" @change="get_knowledge_points()" clearable>
                    <el-option
                            v-for="item in groups_subject"
                            :key="item.id"
                            :label="item.name"
                            :value="item">
                    </el-option>
                </el-select>
                <template v-if="knowledge_points.length > 0">
                    <el-checkbox-group v-model="question.knowledge_point" size="mini" style="display: inline-block">
                        <template v-for="(item, index) in knowledge_points">
                            <el-checkbox :label="item.id" border>{{item.name}}</el-checkbox>
                        </template>
                    </el-checkbox-group>
                </template>
                <template v-else>
                    <span style="color: red">当前分组下无标签</span>
                </template>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;">标签:</span>

                <el-checkbox-group v-model="question.label" size="mini" style="display: inline-block">
                    <template v-for="(item, index) in labels">
                        <el-checkbox :label="item.id" border>{{item.name}}</el-checkbox>
                    </template>
                </el-checkbox-group>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>难度:</span>

                <el-slider style="display: inline-block;width: 300px;vertical-align: middle"
                        v-model="question.hard_level"
                        :step="1"
                           :max="5"
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
                <el-select v-model="question.grade" placeholder="请选择年级" multiple value-key="value">
                    <el-option
                            v-for="item in grades"
                            :key="item.value"
                            :label="item.label"
                            :value="item">
                    </el-option>
                </el-select>
            </div>



            <div v-if="question.type==1" class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>答案:</span>

                <div style="display: inline-block;vertical-align: top">

                    <el-radio-group v-model="question.answer_option" size="small">
                        <template v-for="(item,index) in question.answer_options">
                            <!--<el-input placeholder="选项内容" style="width: 100px" v-model="item.text" ></el-input>-->
                            <p class="option">
                                <el-radio :label="item.label" > {{item.label}}:</el-radio>
                                <el-input placeholder="选项内容" style="width: 100px" v-model="item.text" ></el-input>
                                <el-tag v-if="item.label==question.answer_option" type="success">正解</el-tag>
                                <el-button type="danger" size="mini" style="margin-left: 10px;" v-on:click="del_option(index)" >x</el-button></p>

                        </template>

                    </el-radio-group>

                    <br/>
                    <el-button type="primary" style="margin-bottom: 10px;" v-on:click="add_option()" >增加选项</el-button>
                </div>
            </div>


            <div v-if="question.type==2" class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>答案:</span>

                <div style="display: inline-block;vertical-align: top">

                    <el-radio-group v-model="question.answer_option" size="small">
                        <template v-for="(item,index) in question.answer_options_2">
                            <p class="option">
                                <el-radio :label="item.label" >
                                </el-radio>
                                <el-input placeholder="判断内容" style="width: 100px" v-model="item.text" ></el-input>
                                <el-tag v-if="item.label==question.answer_option" type="success">正解</el-tag>
                            </p>

                        </template>

                    </el-radio-group>



                </div>
            </div>

            <div v-if="question.type==3" class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>答案:</span>

                共<el-select v-model="question.fill_num" placeholder="填空数量" @change="change_fill_num">
                    <el-option
                            v-for="item in [{label:'1处',value:'1'},{label:'2处',value:'2'},{label:'3处',value:'3'},{label:'4处',value:'4'},{label:'5处',value:'5'},{label:'6处',value:'6'},{label:'7处',value:'7'},{label:'8处',value:'8'},{label:'9处',value:'9'},{label:'10处',value:'10'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>填空
                <div style="display: inline-block;vertical-align: top">
                    <template v-for="(item, index) in question.answer_obj">
                        <div style="margin-left: 20px;margin-bottom: 5px;">第{{index+1}}处答案:<el-input  style="width: 300px" placeholder="答案" v-model="item.text" ></el-input></div>
                    </template>
                </div>


            </div>

            <div v-show="question.type==4 || question.type==5 || question.type==7" class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>答案:</span>
                <!--<quill-editor style="display:inline-block;width: 600px;vertical-align: top" ref="myQuillEditor2" :content="question.answer" :options = "editorOption" @change="onEditorChange($event,'answer')"></quill-editor>-->
                <div class="editor-container">
                    <script id="editor2" type="text/plain" ></script>
                </div>
            </div>

            <div v-show="question.type==6" class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>子题:</span>
                <div style="display: inline-block;vertical-align: top">
                <p v-for="(sub, index) in question.answer_subs" style="margin-bottom:10px;border: 1px solid #eee;padding: 10px;padding-right:30px;position: relative">
                    <span style="position: absolute;top: 0;right: 0;background: #f56c6c;cursor:pointer;color: #fff;width: 20px;height: 20px;text-align: center;line-height: 20px" @click="question.answer_subs.splice(index, 1)">x</span>

                    {{index+1}}、<el-input placeholder="题目内容" style="width: 600px" v-model="sub.title" ></el-input>

                    <template>
                        <div style="margin-bottom: 10px;">
                            <el-radio-group style="display: block;margin-top: 10px;float: right" v-model="sub.type" size="small" @change="change_sub_type(sub)">
                                <el-radio label="1" border>单选</el-radio>
                                <el-radio label="3" border >填空</el-radio>

                            </el-radio-group>
                            <div style="clear: both"></div>
                        </div>
                    </template>
                    <template v-if="sub.type == 1">
                        <div style="vertical-align: top;;">

                            <el-radio-group v-model="sub.answer" size="small">
                                <template v-for="(item,index) in sub.answer_options">
                                <p class="option">
                                    <el-radio :label="item.label" > {{item.label}}:</el-radio>
                                    <el-input placeholder="选项内容" style="width: 100px" v-model="item.text" ></el-input>
                                    <el-tag v-if="item.label==sub.answer" type="success">正解</el-tag>
                                    <el-button type="danger" size="mini" style="margin-left: 10px;" v-on:click="del_sub_option(sub.answer_options, index)" >x</el-button></p>

                                </template>

                            </el-radio-group>

                            <br/>
                            <el-button type="primary" style="margin-bottom: 10px;" size="mini" v-on:click="add_sub_option(sub.answer_options)" >增加选项</el-button>
                        </div>
                    </template>
                    <template v-if="sub.type==3">
                        <div>
                            答案:<el-input placeholder="答案" style="width: 600px" v-model="sub.answer" ></el-input>

                        </div>
                    </template>
                    <!--<el-button @click="question.answer_subs.splice(index, 1)">删除</el-button>-->
                </p>
                <p>
                    <el-button @click="add_sub()" type="primary">添加子题</el-button>
                </p>
            </div>
            </div>




            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;">答案解析:</span>
                <!--<quill-editor style="display:inline-block;width: 600px;vertical-align: top" ref="myQuillEditor3" :content="question.answer_parse" :options = "editorOption" @change="onEditorChange($event,'answer_parse')"></quill-editor>-->

                <div class="editor-container">
                    <script id="editor3" type="text/plain" ></script>
                </div>

            </div>
            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>录题者:</span>
                <el-select v-model="question.author" multiple value-key="id" placeholder="请选择">
                    <el-option
                            v-for="item in authors"
                            :key="item.id"
                            :label="item.show_name"
                            :value="item">
                    </el-option>
                </el-select>
            </div>

            <!--<div class="editor-container">-->
                <!--<UE :defaultMsg=defaultMsg :config=config ref="ue"></UE>-->
            <!--</div>-->
            <!--<el-button @click="getUEContent()">获取内容</el-button>-->
            <!--<el-button @click="getUEText()">获取text</el-button>-->
            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">录入</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {question_edit,question_info,get_grades,admin_user_all_list} from '@/api/getDataEarth'
    import {knowledge_point_all_list,get_groups,get_groups_subject} from '@/api/getDataknowledge_point'
    import {label_all_list} from '@/api/getDatalabel'
    import  { quillEditor,Quill } from 'vue-quill-editor'
    import { ImageDrop } from 'quill-image-drop-module'
    import ImageResize from 'quill-image-resize-module'
    Quill.register('modules/imageDrop', ImageDrop)
    Quill.register('modules/imageResize', ImageResize)
//    import UE from '../components/ue.vue';
    export default {
        data(){
            return {
                id:0,
                loading_info:false,
                question:{
                    entity:"1",
                    score:1,
                    useway:[],
                    type:"1",
                    title:"",
                    content:"",
                    answer:"",
                    answer_option:"A",
                    answer_obj:[{text:''}],
                    answer_parse:"",
                    answer_options:[{label:'A',text:''},{label:'B',text:''},{label:'C',text:''}],
                    answer_options_2:[{label:'A',text:'是'},{label:'B',text:'否'}],
                    label:[],
                    knowledge_point:[],
                    hard_level:1,
                    year:'2018',
                    grade:[],
                    author:[],
                    fill_num:'1',
                    knowledge_group_subject:{id:1,name:'语文'},
                    knowledge_group:{id:1,name:'一年级'},
                    answer_subs:[{
                        type:'1',
                        title:'',
                        answer:'A',
                        answer_options:[
                            {label:'A',text:''},
                            {label:'B',text:''},
                            {label:'C',text:''}
                        ]
                    }]

                },
                knowledge_points:[],
                labels:[],
                authors:[],
                //group:{id:1,name:'一年级'},
                groups:[],
                //group_subject:{id:1,name:'语文'},
                groups_subject:[],
                years:[],
                grades:[],
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
                upload_url:this.$store.state.constant.upload_url_local,
                editor:1,
                toolbars:{subfield: true},
                fullscreenLoading:false,
                myQuillEditor_index:1,

                defaultMsg: '',
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 250,
                    initialFrameWidth: 600,
                    toolbars: [[
                        'fullscreen', 'source', '|',
                        'bold', 'italic', 'underline', '|', 'fontsize', 'insertimage', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'kityformula',
                        'preview'
                    ]]
                }
            }

        },
        components: {
            headTop,
            quillEditor,
            UE
        },
        created(){


        },
        mounted(){
            if (this.$refs.myQuillEditor1)  this.$refs.myQuillEditor1.quill.getModule('toolbar').addHandler('image', this.imgHandler1)
            if (this.$refs.myQuillEditor2)  this.$refs.myQuillEditor2.quill.getModule('toolbar').addHandler('image', this.imgHandler2)
            if (this.$refs.myQuillEditor3)  this.$refs.myQuillEditor3.quill.getModule('toolbar').addHandler('image', this.imgHandler3)
        },

        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.id = to.query.id ? to.query.id : 0;

            if (vm.id && vm.id > 0) {
                vm.get_info().then(function(){
                    vm.init_options().then(function () {
                        vm.init_groups().then(function(){
                            vm.init_grades();
                            vm.init_editor();
                        })

                    })
                });
            } else {
                vm.init();
                vm.init_options().then(function () {
                    vm.init_groups().then(function(){
                        vm.init_grades();
                        vm.init_editor();
                    })

                })
            }



            })
        },
        methods: {
            init_editor(){
                var _this = this;
                if (!this.editor1) {
                    UE.delEditor('editor1');
                    this.editor1 = UE.getEditor('editor1', this.config); // 初始化UE
                    this.editor1.addListener("ready", function () {
                        _this.editor1.setContent(_this.question.content); // 确保UE加载完成后，放入内容。
                    });
                } else {
                    _this.editor1.setContent(_this.question.content); // 确保UE加载完成后，放入内容。
                }

                if (!this.editor2) {
                    UE.delEditor('editor2');
                    this.editor2 = UE.getEditor('editor2', this.config); // 初始化UE
                    this.editor2.addListener("ready", function () {
                        _this.editor2.setContent(_this.question.answer); // 确保UE加载完成后，放入内容。
                    });
                } else {
                    _this.editor2.setContent(_this.question.answer); // 确保UE加载完成后，放入内容。
                }

                if (!this.editor3) {
                    UE.delEditor('editor3');
                    this.editor3 = UE.getEditor('editor3', this.config); // 初始化UE
                    this.editor3.addListener("ready", function () {
                        _this.editor3.setContent(_this.question.answer_parse); // 确保UE加载完成后，放入内容。
                    });
                } else {
                    _this.editor3.setContent(_this.question.answer_parse); // 确保UE加载完成后，放入内容。
                }
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
            init_options(){
                return new Promise(function(resolve,reject){
                    this.loading_info = true;
                    knowledge_point_all_list({group:this.question.knowledge_group, group_subject:this.question.knowledge_group_subject}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.knowledge_points = res.data;
                            label_all_list({}).then(function (res) {
                                if (res.code == this.$store.state.constant.status_success) {
                                    this.labels = res.data;

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
            // 点击图片ICON触发事件
            imgHandler1(state){
                this.imgHandler(state, 1);
            },
            imgHandler2(state){
                this.imgHandler(state, 2);
            },
            imgHandler3(state){
                this.imgHandler(state, 3);
            },

            imgHandler(state, index) {
                this.addRange = this.$refs['myQuillEditor'+index].quill.getSelection()
                if (state) {
                    let fileInput = document.getElementById('imgInput')
                    fileInput.click() // 加一个触发事件
                }
                this.uploadType = 'image'
                this.myQuillEditor_index = index;
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
                    vm.addRange = vm.$refs['myQuillEditor'+vm.myQuillEditor_index].quill.getSelection()
                    value = value.indexOf('http') !== -1 ? value : 'http:' + value
                    vm.$refs['myQuillEditor'+vm.myQuillEditor_index].quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER) // 调用编辑器的 insertEmbed 方法，插入URL
                } else {
                    this.$message.error(`${vm.uploadType}插入失败`)
                }
                this.$refs['upload'].clearFiles() // 插入成功后清除input的内容
            },
            beforeAvatarUpload(file) {
                this.fullscreenLoading = true
                const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
                const isLt2M = file.size / 1024  < 200;

                if (!isJPG) {
                    this.fullscreenLoading = false
                    this.$message.error('图片格式只支持jpg和png!');
                }
                if (!isLt2M) {
                    this.fullscreenLoading = false
                    this.$message.error('图片大小不能超过 200k!');
                }
                return  isLt2M && isJPG;
            },

            onEditorChange({ editor, html, text },field) {//富文本编辑器  文本改变时 设置字段值
                this.question[field] = html
                if (field == 'content') {
                    this.question.title = text
                }
            },
            init() {
                this.loading = false;
                this.question = {
                    entity:"1",
                    score:1,
                    useway:[],
                    type:"1",
                    title:"",
                    content:"",
                    answer:"",
                    answer_option:"A",
                    answer_obj:[{text:''}],
                    answer_parse:"",
                    answer_options:[{label:'A',text:''},{label:'B',text:''},{label:'C',text:''}],
                    answer_options_2:[{label:'A',text:'是'},{label:'B',text:'否'}],
                    label:[],
                    knowledge_point:[],
                    hard_level:1,
                    year:'2018',
                    grade:[],
                    author:[],
                    fill_num:'1',
                    knowledge_group_subject:{id:1,name:'语文'},
                    knowledge_group:{id:1,name:'一年级'},
                    answer_subs:[{
                        type:'1',
                        title:'',
                        answer:'A',
                        answer_options:[
                            {label:'A',text:''},
                            {label:'B',text:''},
                            {label:'C',text:''}
                        ]
                    }]

                }
            },

            get_info() {
                return new Promise((resolve,reject) => {
                    question_info({id: this.id}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {

                            this.question = res.data.question_data;

                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                        this.loading_info = false;
                        resolve();
                    }.bind(this));
                });
            },
            submit(){
                this.editor1.getKfContent((content) => {
                    this.editor2.getKfContent((content) => {
                        this.editor3.getKfContent((content) => {
                            this._submit();
                        });
                    });
                });


            },
            _submit: function () {
                this.question.title = this.editor1.getContentTxt();
                this.question.content = this.editor1.getContent();
                this.question.answer = this.editor2.getContent();
                this.question.answer_parse = this.editor3.getContent();

//                console.log(this.question.content)
//                return ;
                var error = this.submit_check();
                if (error.length) {
                    this.$message({
                        message: error.join(';'),
                        type: 'warning'
                    });
                    return ;
                }
                this.loading = true;
                question_edit({
                    id:this.id,
                    question:this.question
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
                    this.loading = false;
                }.bind(this));

            },
            submit_check(){
                var error = [];
                if (!this.question.title) {
                    error.push('请输入题干');
                }
                return error;
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
                if (this.question.answer_options.length<=1) {

                    this.$message({
                        message: '对不起,至少含有一个选项',
                        type: 'warning'
                    });
                    return ;

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

            add_sub_option(options){

                var option_labels = ['A','B','C','D','E','F','G'];
                if (option_labels.length < (options.length+1)) {
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

                options.push(option);
                this.gen_sub_options(options);
            },
            del_sub_option(options, index){
                if (options.length<=1) {

                    this.$message({
                        message: '对不起,至少含有一个选项',
                        type: 'warning'
                    });
                    return ;

                }
                options.splice(index,1);
                this.gen_sub_options(options);
            },

            gen_sub_options(options){
                var option_labels = ['A','B','C','D','E','F','G'];
                if (option_labels.length < options.length) {
                    this.$message({
                        message: '对不起,最多只支持7个选项',
                        type: 'warning'
                    });
                    return ;
                }
                options.forEach(function(val,index){
                    val.label = option_labels[index];
                })


            },

            change_sub_type(sub){
                if (sub.type==1 ) {
                    sub.answer = 'A';
                } else {
                    sub.answer = '';
                }
            },
            change_type(){
                if (this.question.type==1 || this.question.type==2) {
                    this.question.answer_option = 'A';
                } else {
                    this.question.answer_option = '';
                }
            },
            change_fill_num(num){
                var arr = [];
                for(var i=0;i<10;i++) {
                    if (i<num) {
                        if (this.question.answer_obj[i]) {
                            arr.push({text:this.question.answer_obj[i].text});
                        } else {
                            arr.push({text:''});
                        }
                    }
                }
                this.question.answer_obj = arr;
            },
            get_knowledge_points() {
                knowledge_point_all_list({group:this.question.knowledge_group,group_subject:this.question.knowledge_group_subject}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.question.knowledge_point = [];
                        this.knowledge_points = res.data;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                }.bind(this));
            },
            add_sub(){
                this.question.answer_subs.push({
                    type:'1',
                    title:'',
                    answer:'A',
                    answer_options:[
                        {label:'A',text:''},
                        {label:'B',text:''},
                        {label:'C',text:''}
                    ]
                });
            }
//            getUEContent() {
//                let content = this.editor1.getContent();
//                console.log(content)
//            },
//            getUEText() {
//                let content = this.editor1.getContentTxt();
//                console.log(content)
//            }

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
        width: 150px;
    }
    .option{
        margin-bottom: 10px;
    }
    .editor-container{
        display: inline-block;vertical-align: top;
    }
</style>
