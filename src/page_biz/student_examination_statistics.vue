<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="学号"
                    v-model="studentid"
                    clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-search" :loading="loadingBtn == 'daochu'" @click="daochu">导出</el-button>
            <el-button icon="el-icon-search" :loading="loadingBtn == 'statistics'" @click="statistics">刷新统计</el-button>

        </div>
        <div class="table_container">
            <el-table
                    height="250"
                    width="100"
                    :data="tableData"
                    style="width: 100%">
                <el-table-column :fixed="index2==0" v-for="(item, index2) in tableData[0]" :key="index2">
                    <template slot="header" slot-scope="scope">
                        {{scope.row[index2]}}
                    </template>
                    <template slot-scope="scope">
                        {{scope.row[index2]}}
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
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {statistics_student_examinations,statistics_student_examinations_export} from '@/api/getDataEarth'
    import {getStore} from '@/config/mUtils'
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
                studentid:'',
                groups: '',
                group_id:'',
                loadingBtn:-1
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
                vm.list();
            })
        },
        methods: {
            list() {
                statistics_student_examinations({page:this.currentPage,page_size:this.limit,studentid:this.studentid}).then(function(res){
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
            daochu() {
                this.loadingBtn = 'daochu';
                statistics_student_examinations_export({
                    studentid:this.studentid,
                    is_ajax:true
                }).then(function(res){
                    this.loadingBtn = '-1';
                    if (res.code == this.$store.state.constant.status_success) {
                        window.open(this.$store.state.constant.statistics_student_examinations_export + '?studentid='+this.studentid+'&token=' + (getStore('token') ? getStore('token') : ''));
                        return;
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'warning'
                        });
                        return;
                    }
                }.bind(this));
            },
            statistics() {
                this.loadingBtn = 'statistics';
                window.open(this.$store.state.constant.statistics_student_examinations);
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
