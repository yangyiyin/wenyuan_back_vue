<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="名称"
                    v-model="name"
                    clearable>
            </el-input>
            <el-select v-model="group" value-key="id" placeholder="请选择知识点分组" clearable>
                <el-option
                        v-for="item in groups"
                        :key="item.id"
                        :label="item.name"
                        :value="item">
                </el-option>
            </el-select>
            <el-select v-model="group_subject" value-key="id" placeholder="请选择知识点科目分组" clearable>
                <el-option
                        v-for="item in groups_subject"
                        :key="item.id"
                        :label="item.name"
                        :value="item">
                </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button style="float: right" type="primary" @click="goto_edit_knowledge_point(0)">新增知识点</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="年级分组" prop="group_name"></el-table-column>
                <el-table-column label="科目分组" prop="group_name_subject"></el-table-column>
                <el-table-column label="排序">
                    <template slot-scope="scope">
                        {{scope.row.sort}}
                        <el-button size="mini" @click="handleSort(scope.row)">设置</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="创建日期" prop="create_time"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="goto_edit_knowledge_point(scope.row.id)">编辑</el-button>
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
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {knowledge_point_list,knowledge_point_del,knowledge_point_verify,knowledge_point_sort,get_groups,get_groups_subject} from '@/api/getDataknowledge_point'
    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                current:{},
//                remark:'',
//                choose_categories:[],
//                categories:[],
                name:'',
                loadingBtn:-1,
                group:{},
                groups:[],
                group_subject:{},
                groups_subject:[],
            }
        },
        components: {
            headTop,
        },
        created(){
            this.list();
        },
        mounted(){

        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.init_options().then(function () {
                    vm.list();
                })

            })
        },
        methods: {
            init_options(){
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
            list() {
                knowledge_point_list({page:this.currentPage,page_size:this.limit,name:this.name,group:this.group,group_subject:this.group_subject}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.tableData = res.data.list;
                        this.count = parseInt(res.data.count);
                    }
                }.bind(this));

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
            goto_edit_knowledge_point(id) {
                this.$router.push({path:'add_knowledge_point',query:{id:id}});
            },
            verify(scope, status) {

                this.$confirm('确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.loadingBtn = scope.$index;
                    knowledge_point_verify({id:item.id,status:status}).then(function(res){
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
                    knowledge_point_del({id:item.id}).then(function(res){
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
                knowledge_point_sort({
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
            }
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
