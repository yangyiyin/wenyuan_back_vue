<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="视频标题"
                    v-model="search_data.title"
                    clearable>
            </el-input>

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="视频id"
                    v-model="search_data.id"
                    clearable>
            </el-input>

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="用户手机号"
                    v-model="search_data.phone"
                    clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column label="视频id" prop="id"></el-table-column>
                <el-table-column label="用户手机号" prop="phone"></el-table-column>
                <el-table-column label="名称" prop="title_short"></el-table-column>
                <el-table-column label="图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.img" width="60" height="30"/>
                    </template>
                </el-table-column>

                <el-table-column label="价格" prop="price"></el-table-column>
                <el-table-column label="支付单号" prop="pay_no"></el-table-column>
                <el-table-column label="支付时间" prop="pay_time"></el-table-column>
                <el-table-column label="创建时间" prop="buy_time"></el-table-column>
                <!--<el-table-column label="操作" width="300">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button size="mini" @click="goto_edit_video(scope.row.id)">编辑</el-button>-->
                        <!--<el-button size="mini" v-if="scope.row.status == 1" @click="verify(scope, 0)" :loading="loadingBtn == scope.$index">下架</el-button>-->
                        <!--<el-button size="mini" v-if="scope.row.status == 0" @click="verify(scope, 1)" :loading="loadingBtn == scope.$index">上架</el-button>-->
                        <!--<el-button size="mini" @click="del(scope.row, scope.$index)">删除</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
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
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {user_video_list} from '@/api/getDatavideo'
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
                search_data:{
                    id:'',
                    title:'',
                    phone:'',
                },
                loadingBtn:-1
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
                vm.list();
        })
        },
        methods: {
            list() {
                user_video_list({page:this.currentPage,page_size:this.limit,...this.search_data}).then(function(res){
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
            search() {
                this.currentPage = 1;
                this.list();
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
