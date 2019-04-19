<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="标题"
                    v-model="name"
                    clearable>
            </el-input>

            <el-select v-model="grade" placeholder="年级" clearable >
                <el-option
                        v-for="item in grades"
                        :key="item.value"
                        :label="item.label"
                        :value="item">
                </el-option>
            </el-select>

            <el-select v-model="entity" placeholder="科目" clearable >
                <el-option
                        v-for="item in [{label:'语文',value:1},{label:'数学',value:2},{label:'英语',value:3}]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>


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

            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button style="float: right" type="primary" @click="goto_edit_examine_paper(0)">新增试卷</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="标题" >
                                <span>{{ props.row.title }}</span>
                            </el-form-item>
                            <el-form-item label="考试时间" >
                                <span>{{ props.row.time_limit_min }}</span>
                            </el-form-item>
                            <el-form-item label="总分" >
                                <span>{{ props.row.total_score }}</span>
                            </el-form-item>
                            <el-form-item label="备注" >
                                <span>{{ props.row.remark }}</span>
                            </el-form-item>
                            <el-form-item label="录入者" >
                                <span v-for="(author,index) in props.row.inputer">{{ author.show_name }};</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>

                <!--<el-table-column label="id" prop="id"></el-table-column>-->
                <el-table-column label="标题" prop="title_short"></el-table-column>
                <el-table-column label="学科" prop="entity_desc"></el-table-column>
                <el-table-column label="年级" >
                    <template slot-scope="scope">
                        <span v-for="(grade, index) in scope.row.grade">{{grade.label}};</span>
                    </template>
                </el-table-column>
                <el-table-column label="难度" prop="hard_level"></el-table-column>
                <el-table-column label="绝密等级" >
                    <template slot-scope="scope">
                        <span v-for="(name, index) in scope.row.examine_paper_useway_names">{{name}};</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建日期" prop="create_time"></el-table-column>
                <el-table-column label="操作" width="400">
                    <template slot-scope="scope">
                        <el-button type="danger" v-if="!scope.row.questions.length" size="mini" @click="set_question(scope.row)">!添加题目</el-button>
                        <el-button v-if="scope.row.questions.length" size="mini" @click="set_question(scope.row)">设置题目</el-button>
                        <el-button v-if="scope.row.questions.length" size="mini" @click="dialogFormVisiblePreview=true;current=scope.row">预览</el-button>
                        <el-button size="mini" @click="goto_edit_examine_paper(scope.row.id)">编辑</el-button>
                        <el-button size="mini" v-if="scope.row.status == 1" @click="verify(scope, 0)" :loading="loadingBtn == scope.$index">下架</el-button>
                        <el-button size="mini" v-if="scope.row.status == 0" @click="verify(scope, 1)" :loading="loadingBtn == scope.$index">上架</el-button>
                        <el-button size="mini" @click="del(scope.row, scope.$index)">删除</el-button>
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
        <el-dialog title="修改排序" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="current">
                <el-form-item label="排序值(越大越靠前)">
                    <el-input v-model="current.sort" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sort">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="预览" :visible.sync="dialogFormVisiblePreview" width="80%">
            <div style="display: none">
                <div id="preview" style="width: 794px;">
                    <div class="question_block" style="height:1123px;" v-for="(aa,index) in count_test">
                        <template v-for="(item,index) in current.questions">

                            <div class="question_item">
                                {{index+1}}.{{item.title}}
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div class="question_block" style="height:1123px;width: 794px;margin: 0 auto;border: 1px solid #ddd; " >
                <template v-for="(item,index) in current.questions">

                    <div class="question_item">
                        {{index+1}}.{{item.title}}
                    </div>
                </template>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="print()">打 印</el-button>
                <el-button @click="dialogFormVisiblePreview = false">关 闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {get_grades} from '@/api/getDataEarth'
    import {examine_paper_list,examine_paper_del,examine_paper_verify,examine_paper_sort} from '@/api/getDataexamine_paper'

    import '@/assets/js/jquery-1.4.4.min';
    import '@/assets/js/jquery.jqprint-0.3';

    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                dialogFormVisiblePreview:false,
                current:{},
//                remark:'',
//                choose_categories:[],
//                categories:[],
                name:'',
                loadingBtn:-1,
                grade:{},
                grades:[],
                hard_level:'',
                useway_ids:[],
                entity:'',
                count_test:[1]
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
                vm.init_grades().then(function(){vm.list();});
        })
        },
        methods: {
            list() {
                examine_paper_list({page:this.currentPage,page_size:this.limit,name:this.name,entity:this.entity,
                    hard_level:this.hard_level,grade:this.grade,useway_ids:this.useway_ids}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.tableData = res.data.list;
                        this.count = parseInt(res.data.count);
                    }
                }.bind(this));

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
            handleCurrentChange(val){
                this.currentPage = val;
                this.list();
            },
            handleEdit(row){
                this.dialogFormVisible = true;
                if (row) {
                    this.current_entity = row;
                } else {
                    this.current_entity = {};
                }

            },
            search() {
                this.currentPage = 1;
                this.list();
            },
            goto_edit_examine_paper(id) {
                this.$router.push({path:'add_examine_paper',query:{id:id}});
            },
            verify(scope, status) {

                this.$confirm('确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.loadingBtn = scope.$index;
                    examine_paper_verify({id:item.id,status:status}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            item.status = status;
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
                    }.bind(this)).finally(function(){
                        this.loadingBtn = -1;
                    }.bind(this));
                }.bind(this));



            },
            del(item, index) {

                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    examine_paper_del({id:item.id}).then(function(res){
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
            handleSort(row){
                this.dialogFormVisible = true;
                this.current = row;
            },
            sort() {
                examine_paper_sort({
                    id:this.current.id,
                    sort:this.current.sort

                }).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.dialogFormVisible = false;
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                }.bind(this));
                this.dialogFormVisible = false;
            },
            set_question(item){
                this.$router.push({path:'examine_paper_set_questions',query:{id:item.id}});
            },
            print() {
                setTimeout(()=>{
                    $("#preview").jqprint();
                })

            },
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
