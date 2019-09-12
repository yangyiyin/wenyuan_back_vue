<template>

    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <div style="display: inline-block;width: 80%">

                <el-select v-model="type" placeholder="类型" clearable>
                    <el-option
                            v-for="(item, index) in [{label:'单选题',value:1},{label:'判断题',value:2},{label:'填空题',value:3},{label:'简答题',value:4},{label:'其他题',value:5},{label:'阅读题',value:6},{label:'计算题',value:7},{label:'作文题',value:8}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

                <el-select v-model="grade" placeholder="年级" clearable @change="get_knowledge_points()">
                    <el-option
                            v-for="item in grades"
                            :key="item.value"
                            :label="item.label"
                            :value="item">
                    </el-option>
                </el-select>

                <el-select v-model="entity" placeholder="科目" clearable @change="get_knowledge_points()">
                    <el-option
                            v-for="item in [{label:'语文',value:1},{label:'数学',value:2},{label:'英语',value:3}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

                <el-select v-model="knowledge_point_ids" placeholder="知识点" multiple clearable>
                    <el-option
                            v-for="item in knowledge_points"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>

                <el-select v-model="label_ids" placeholder="标签" multiple clearable>
                    <el-option
                            v-for="item in labels"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>

                <el-input
                        style="display: inline-block;width: 250px;"
                        placeholder="题干关键词"
                        v-model="title"
                        clearable>
                </el-input>

                <el-select v-model="useway_ids" placeholder="绝密等级" multiple clearable>
                    <el-option
                            v-for="item in [{label:'等级一',value:1},{label:'等级二',value:2},{label:'等级三',value:3},{label:'等级四',value:4}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

                <el-input
                        style="display: inline-block;width: 100px;"
                        type="number"
                        placeholder="难度"
                        v-model="hard_level"
                        clearable>
                </el-input>

                <el-select v-model="author_id" placeholder="录入者" clearable>
                    <el-option
                            v-for="item in authors"
                            :key="item.id"
                            :label="item.show_name"
                            :value="item.id">
                    </el-option>
                </el-select>

                <el-select v-model="checker_id" placeholder="检查者" clearable>
                    <el-option
                            v-for="item in checkers"
                            :key="item.id"
                            :label="item.show_name"
                            :value="item.id">
                    </el-option>
                </el-select>

                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <div style="float: right; width: 20%;text-align: right;">
                <el-button style="margin: 5px;" type="primary" @click="goto_edit(0)">新增试题</el-button>
                <el-button style="margin: 5px;" type="primary" @click="dialogFormVisibleDaoru=true">批量导入</el-button>
            </div>
        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <!--<el-table-column label="图片">-->
                <!--<template slot-scope="scope">-->
                <!--<img :src="scope.row.img" width="60" height="30"/>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="题干" style="width: 100%">
                                <span>{{ props.row.title}}</span>
                            </el-form-item>
                        </el-form>
                        <el-form v-if="props.row.type==1" label-position="left" inline class="demo-table-expand">
                            <el-form-item label="答案选项" style="width: 100%">
                                <template v-for="(item, index) in props.row.question_answer.answer_options">
                                    <p style="display: inline-block;margin-left: 20px;"><el-tag size="mini">{{item.label}}:</el-tag>{{item.text}}</p>
                                </template>

                            </el-form-item>
                        </el-form>
                        <el-form v-if="props.row.type==2" label-position="left" inline class="demo-table-expand">
                            <el-form-item label="答案选项" style="width: 100%">
                                <template v-for="(item, index) in props.row.question_answer.answer_options">
                                    <p style="display: inline-block;margin-left: 20px;"><el-tag size="mini">{{item.label}}:</el-tag>{{item.text}}</p>
                                </template>
                            </el-form-item>
                        </el-form>
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="答案" v-if="props.row.type != 3">

                                <span v-html="props.row.question_answer.answer"></span>

                            </el-form-item>
                            <el-form-item label="答案" v-if="props.row.type == 3">
                                <template v-for="(item, index) in props.row.question_answer.answer">
                                    <p style="display: inline-block;margin-left: 20px;"><el-tag size="mini">{{index+1}}处:</el-tag>{{item.text}}</p>
                                </template>
                            </el-form-item>
                            <el-form-item label="答案解析" >
                                <span v-html="props.row.question_answer.answer_parse"></span>
                            </el-form-item>
                        </el-form>

                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="分值" >
                                <span>{{ props.row.score}}</span>
                            </el-form-item>
                            <el-form-item label="难度" >
                                <span>{{ props.row.hard_level}}</span>
                            </el-form-item>
                        </el-form>
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="绝密性" >
                                <el-tag size="mini" v-for="name in props.row.question_useway_names">{{ name}}</el-tag>
                            </el-form-item>
                            <el-form-item label="年级" >
                                <span v-for="(item) in props.row.grade">{{item.label}};</span>
                            </el-form-item>
                        </el-form>
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="知识点" >
                                <el-tag size="mini" v-for="name in props.row.question_knowledge_point_names">{{ name}}</el-tag>
                            </el-form-item>
                            <el-form-item label="标签" >
                                <el-tag size="mini" v-for="name in props.row.question_label_names">{{ name}}</el-tag>
                            </el-form-item>
                        </el-form>
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="录入者" >
                                <span v-for="(inputer) in props.row.inputer">{{inputer.show_name}};</span>
                            </el-form-item>
                            <el-form-item label="年份" >
                                <span>{{ props.row.year}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="题目id" prop="id"></el-table-column>
                <el-table-column label="科目" prop="entity_desc"></el-table-column>
                <el-table-column label="类型" prop="type_desc"></el-table-column>
                <el-table-column label="题干" prop="title_short"></el-table-column>
                <el-table-column label="录入者" prop="allInputer"></el-table-column>
                <el-table-column label="检查者" prop="allChecker"></el-table-column>
                <!--<el-table-column label="简介" prop="desc_pre"></el-table-column>-->
                <el-table-column label="创建时间" prop="create_time"></el-table-column>
                <!--<el-table-column label="评语" width="300">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button size="mini" @click="handleDaoru(scope.row)">导入</el-button>-->
                        <!--<el-button size="mini" @click="handleDaochu(scope.row)">导出</el-button>-->
                        <!--<el-button size="mini"  type="primary" @click="goto_words_content(scope.row.id)">查看</el-button>-->

                    <!--</template>-->
                <!--</el-table-column>-->

                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="goto_edit(scope.row.id)">编辑</el-button>
                        <el-button size="mini"   @click="del(scope.row, scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="limit"
                        layout="total, prev, pager, next"
                        :total="count"
                        background>
                </el-pagination>
            </div>
        </div>
        <el-dialog title="导入" :visible.sync="dialogFormVisibleDaoru" width="30%">
            <p>
                批量导入试题数据
            </p>
            <p>
                特别说明:导入的excel将作为新的试题录入到系统,请确保每一题设置正确,严格参照<span style="color: green">模板</span>进行设置。导入后如出现个别题目错误,可单独编辑进行修改。
                <a style="text-decoration: underline;color: green" href="http://api.yixsu.com/static/uploads/question_template.xlsx">点击下载模板</a>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDaoru = false">取 消</el-button>
                <!--<el-button type="primary" @click="daoru">开始导入</el-button>-->
                <el-upload

                        class=""
                        :action="upload_url+'?id='+current.id"
                        :data="upload_data"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                        :before-upload="beforeUpload"
                        style="display: inline-block;">
                    <!--<img v-if="img" :src="img" class="avatar">-->
                    <el-button type="primary" :loading="loadingBtn == 'daoru'">开始导入</el-button>
                </el-upload>
            </div>
        </el-dialog>


        <!--<el-dialog title="导出" :visible.sync="dialogFormVisibleDaochu" width="30%">-->
            <!--<p>-->
                <!--您即将导出教师评语数据:【{{current.title}}】。-->
            <!--</p>-->
            <!--<p>-->
                <!--特别说明:如果报名数据比较多,则导出速度会相应的慢一些哦~-->
            <!--</p>-->
            <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button @click="dialogFormVisibleDaochu = false">取 消</el-button>-->
                <!--<el-button type="primary" @click="daochu" :loading="loadingBtn == 'daochu'">开始导出</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import {question_list,question_del,get_grades, label_all_list, admin_user_all_list} from '@/api/getDataEarth'
    import {knowledge_point_all_list} from '@/api/getDataknowledge_point'
    import {getStore,deepCopy} from '@/config/mUtils'
    export default {
        data(){
            return {
                id:0,
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                entity:'',
                type:'',
                tag:'',
                title:'',
                grade:{},
                grades:[],
                author_id:'',
                authors:[],
                checker_id:'',
                checkers:[],
                hard_level:'',
                useway_ids:[],
                knowledge_point_ids:[],
                knowledge_points:[],
                label_ids:[],
                labels:[],
                dialogFormVisible:false,
                dialogFormVisibleDaoru:false,
                dialogFormVisibleDaochu:false,

                current:{},
                loadingBtn:-1,
                upload_url:this.$store.state.constant.question_daoru_excel_url,
                upload_data:{token:getStore('token') ? getStore('token') : ''}
            }
        },
        components: {
            headTop,
        },
        created(){
            //this.list();
        },
        mounted(){

        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.id = to.query.id ? to.query.id : 0;
            vm.init_grades().then(function(){
                vm.get_knowledge_points();
                vm.get_labels();
                vm.list();
            })

        })
        },
        methods: {
            init_grades(){
                return new Promise(function(resolve,reject){
                    this.loading_info = true;
                    get_grades({}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.grades = res.data;

                            admin_user_all_list({'is_question_author':1}).then(function (res) {
                                if (res.code == this.$store.state.constant.status_success) {
                                    this.authors = res.data;
                                    this.checkers = deepCopy(res.data);
                                    //console.log(this.checkers)
                                    this.checkers.push({id:'none',show_name:'无检查者'});
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
            list() {
                question_list({id:this.id,page:this.currentPage,page_size:this.limit,entity:this.entity,title:this.title,
                    type:this.type,tag:this.tag,hard_level:this.hard_level,grade:this.grade,useway_ids:this.useway_ids,
                    knowledge_point_ids:this.knowledge_point_ids,author_id:this.author_id,checker_id:this.checker_id,
                    label_ids:this.label_ids,
                }).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        res.data.list.map(el => el.checker? el.allChecker = el.checker.map(val => val.show_name).join(', ') : '');
                        res.data.list.map(el => el.inputer? el.allInputer = el.inputer.map(val => val.show_name).join(', ') : '');
                        console.log(res.data.list)
                        this.tableData = res.data.list;
                        this.count = parseInt(res.data.count);
                    }
                }.bind(this));
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.list();
            },
            search() {
                this.currentPage = 1;
                this.list();
            },
            goto_edit(id) {
                this.$router.push({path:'question_edit',query:{id:id}});
            },
            del(item, index) {

                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    question_del({id:item.id}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.tableData.splice(index,1);
                            this.count --;
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.msg
                            });
                        }
                    }.bind(this));
                }.bind(this))

            },
            get_knowledge_points() {
                this.knowledge_points = [];
                this.knowledge_point_ids = [];
                var group_subject = parseInt(this.entity) ? {id:this.entity} : '';
                knowledge_point_all_list({group_subject:group_subject,group:this.grade}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
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
                this.labels = [];
                this.label_ids = [];

                label_all_list({}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.labels = res.data;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                }.bind(this));
            },
            beforeUpload(file) {
                this.loadingBtn = 'daoru';
                var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
                const extension = testmsg === 'xls'
                const extension2 = testmsg === 'xlsx'
                const isLt2M = file.size / 1024 / 1024 < 20
                if(!extension && !extension2) {
                    this.$message({
                        message: '上传文件只能是 xls、xlsx格式!',
                        type: 'warning'
                    });
                }
                if(!isLt2M) {
                    this.$message({
                        message: '上传文件大小不能超过 20MB!',
                        type: 'warning'
                    });
                }
                this.upload_loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                return extension || extension2 && isLt2M;
            },
            handleSuccess(res, file) {
                this.loadingBtn = '-1';
                if (this.upload_loading) {
                    this.upload_loading.close();
                }

                if (res.code == this.$store.state.constant.status_success) {
                    this.list();
                    this.dialogFormVisibleDaoru = false;
                    this.$message({
                        type: 'success',
                        message: res.msg
                    });
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.msg
                    });
                }

            },
//            handleDaoru(row){
//                this.dialogFormVisibleDaoru = true;
//                this.current = row;
//            },
//            handleDaochu(row){
//                this.dialogFormVisibleDaochu = true;
//                this.current = row;
//            },
//            daochu() {
//                this.loadingBtn = 'daochu';
//                words_content_excel_out({
//                    id:this.current.id,
//                    is_ajax:true
//                }).then(function(res){
//                    this.loadingBtn = '-1';
//                    if (res.code == this.$store.state.constant.status_success) {
//                        window.open(this.$store.state.constant.words_content_daochu_excel_out + '?id='+this.current.id+'&token=' + (getStore('token') ? getStore('token') : ''));
//                        return;
//                    } else {
//                        this.$message({
//                            showClose: true,
//                            message: res.msg,
//                            type: 'warning'
//                        });
//                        return;
//                    }
//                    this.dialogFormVisibleDaochu = false;
//                }.bind(this));
//            },
        },
    }
</script>

<style lang="less">
    @import '../style/mixin';
    .table_container{
        padding: 20px;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>
