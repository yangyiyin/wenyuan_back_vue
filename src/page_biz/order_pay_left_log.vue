<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <div style="margin-bottom: 10px">
                <el-date-picker
                        v-model="start_time"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="开始时间">
                </el-date-picker>

                <el-date-picker
                        v-model="end_time"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="结束时间">
                </el-date-picker>
            </div>
            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="订单编号"
                    v-model="order_no"
                    clearable>
            </el-input>

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="操作员"
                    v-model="opt_name"
                    clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button  @click="dialogFormVisibleDaochu = true;">导出</el-button>
        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">

                <el-table-column label="订单编号" prop="order_no"></el-table-column>
                <el-table-column label="余款收账金额" prop="remark"></el-table-column>
                <el-table-column label="备忘" prop="bak"></el-table-column>
                <el-table-column label="操作员" prop="opt_name"></el-table-column>
                <el-table-column label="时间" prop="create_time" width="180"></el-table-column>

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
        <!--<el-dialog title="修改排序" :visible.sync="dialogFormVisible" width="30%">-->
            <!--<el-form :model="current">-->
                <!--<el-form-item label="排序值(越大越靠前)">-->
                    <!--<el-input v-model="current.sort" auto-complete="off"></el-input>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
            <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
                <!--<el-button type="primary" @click="sort">确 定</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->

        <el-dialog title="导出" :visible.sync="dialogFormVisibleDaochu" width="30%">
            <p>
                您即将导出订单数据,条件为:[时间:{{start_time?start_time:'无限制'}}至{{end_time?end_time:'无限制'}}][订单编号:{{order_no?order_no:'无限制'}}][操作员:{{opt_name?opt_name:'无限制'}}]。
            </p>
            <p>
                特别说明:如果报名数据比较多,则导出速度会相应的慢一些哦~
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDaochu = false">取 消</el-button>
                <el-button type="primary" @click="daochu" :loading="loadingBtn == 'daochu'">开始导出</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {order_pay_left_log_list} from '@/api/getDataEarth'
    import {getStore} from '@/config/mUtils'
    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                dialogFormVisibleDaochu:false,
                current:{},
                opt_name:'',
                order_no:'',
                goods_title:'',
                start_time:'',
                end_time:'',
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
                order_pay_left_log_list({page:this.currentPage,page_size:this.limit,opt_name:this.opt_name,order_no:this.order_no,start_time:this.start_time,end_time:this.end_time}).then(function(res){
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
                window.open(this.$store.state.constant.order_pay_left_log_excel_out + '?opt_name='+this.opt_name+'&order_no=' + this.order_no+'&start_time=' + this.start_time+'&end_time=' + this.end_time+'&token=' + (getStore('token') ? getStore('token') : ''));
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
