<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="用户名"
                    v-model="opt_name"
                    clearable>
            </el-input>
            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="动作"
                    v-model="action_name"
                    clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <!--<el-button style="float: right" type="primary" @click="goto_edit_admin_user(0)">新增用户</el-button>-->

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <p style="width: 100%;overflow: auto;word-break: normal">{{ props.row.params }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="动作" prop="action_name"></el-table-column>
                <el-table-column label="动作参数" prop="params">
                    <template slot-scope="scope">
                        {{scope.row.params.substring(0, 10)}}...
                    </template>
                </el-table-column>
                <el-table-column label="操作员" prop="opt_name"></el-table-column>
                <el-table-column label="操作员(显示名)" prop="opt_show_name"></el-table-column>
                <el-table-column label="日期" prop="create_time"></el-table-column>
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
    import {admin_log_list} from '@/api/getDataEarth'
    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                current:{},
                user_name:'',
                opt_name:'',
                action_name:'',
                loadingBtn:-1
            }
        },
        components: {
            headTop,
        },
        created(){

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
                admin_log_list({page:this.currentPage,page_size:this.limit, opt_name:this.opt_name,action_name:this.action_name}).then(function(res){
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

        },
    }
</script>

<style scoped lang="less">
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
