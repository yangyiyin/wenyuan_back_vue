<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="名称"
                    v-model="title"
                    clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button style="float: right" type="primary" @click="goto_edit_goods(0)">新增精品课</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="" >
                                <div style="border: 1px dashed #ddd;margin: 5px; padding: 5px" v-for="(option, index) in props.row.detail.all_options">
                                    <p>
                                        <span v-for="(item, index2) in option.list">[{{item.name ? item.name : item.time+'('+item.place+')'}}]</span>
                                    </p>
                                    <p>可预订总数:<span style="color: red">{{ option.stock }}</span>;已预订数:<span style="color: red">{{option.sale_num}}</span></p>
                                    <p> <el-button size="mini" @click="show_orders(option,props.row.title)" type="primary">查看报名情况</el-button></p>
                                </div>
                            </el-form-item>
                            <el-form-item label="授课老师:" >
                                <template v-for="(item, index) in props.row.detail.teacher.infos">
                                    <img :src="item.img" style="width: 50px;height: 50px;border-radius: 50px;">
                                    <div>{{ item.name }}</div>
                                    <div>{{ item.desc }}</div>
                                </template>
                            </el-form-item>

                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column label="图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.img" width="60" height="30"/>
                    </template>
                </el-table-column>

                <el-table-column label="标题" prop="title"></el-table-column>
                <el-table-column label="价格" prop="price"></el-table-column>
                <el-table-column label="排序">
                    <template slot-scope="scope">
                        {{scope.row.sort}}
                        <el-button size="mini" @click="handleSort(scope.row)">设置</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="创建日期" prop="create_time"></el-table-column>

                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="goto_edit_goods(scope.row.id)">编辑</el-button>
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


        <el-dialog :title="current_option.title+'('+(current_option.sub_title)+')报名情况'" :visible.sync="dialog_order_visible" width="80%">

            <div class="table_container">

                <!--<div style="margin-bottom: 10px">-->
                    <!--<el-date-picker-->
                            <!--v-model="order_dialog.start_time"-->
                            <!--type="datetime"-->
                            <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                            <!--placeholder="开始时间">-->
                    <!--</el-date-picker>-->

                    <!--<el-date-picker-->
                            <!--v-model="order_dialog.end_time"-->
                            <!--type="datetime"-->
                            <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                            <!--placeholder="结束时间">-->
                    <!--</el-date-picker>-->
                <!--</div>-->
                <!--<el-input-->
                        <!--style="display: inline-block;width: 250px;"-->
                        <!--placeholder="订单编号"-->
                        <!--v-model="order_dialog.order_no"-->
                        <!--clearable>-->
                <!--</el-input>-->

                <!--<el-input-->
                        <!--style="display: inline-block;width: 250px;"-->
                        <!--placeholder="手机号"-->
                        <!--v-model="order_dialog.tel"-->
                        <!--clearable>-->
                <!--</el-input>-->
                <el-select v-model="order_dialog.status" placeholder="状态">
                    <el-option
                            v-for="item in order_dialog.status_options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="search_order">搜索</el-button>

            </div>
            <div class="table_container">
                <el-table
                        :data="order_dialog.tableData"
                        style="width: 100%">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="属性:" >
                                    <p>
                                        <span v-for="(item, index) in props.row.order_sub.goods.option.list">[{{item.name ? item.name : item.time+'('+item.place+')'}}]</span>
                                    </p>
                                </el-form-item>
                                <!--<el-form-item label="授课老师:" >-->
                                    <!--<img :src="props.row.order_sub.goods.img" style="width: 50px;height: 50px;border-radius: 50px;">-->
                                    <!--<div>{{ props.row.order_sub.goods.teacher }}</div>-->
                                <!--</el-form-item>-->
                                <el-form-item label="学生信息:" >
                                    <p>照片:  <img :src="props.row.extra_data.avatar" style="width: 50px;height: 50px;border-radius: 50px;"></p>
                                    <p>姓名:{{ props.row.extra_data.name }}</p>
                                    <p>学校:{{ props.row.extra_data.school }}</p>
                                    <p>年级:{{ props.row.extra_data.grade }}</p>
                                </el-form-item>
                                <el-form-item label="备注:" >

                                    {{ props.row.remark }}
                                </el-form-item>

                            </el-form>
                        </template>
                    </el-table-column>


                    <el-table-column label="订单编号" prop="order_no"></el-table-column>
                    <el-table-column label="手机号" prop="tel"></el-table-column>
                    <el-table-column label="价格" prop="price"></el-table-column>
                    <el-table-column label="已付金额" prop="payed_money"></el-table-column>
                    <el-table-column label="状态" prop="status_desc"></el-table-column>
                    <el-table-column label="学生姓名" prop="extra_data.name"></el-table-column>
                    <el-table-column label="备注" prop="remark_less"></el-table-column>
                    <el-table-column label="创建日期" prop="create_time"></el-table-column>

                    <el-table-column label="操作" width="300">
                        <template slot-scope="scope">

                            <el-button v-if="scope.row.status==1||scope.row.status==2" size="mini" @click="cancel_force(scope)" :loading="order_dialog.loadingBtn == scope.$index">取消订单</el-button>
                            <el-button type="warning" v-if="(scope.row.status==2||scope.row.status==3 ||scope.row.status==4) && scope.row.price_type==1 && parseInt(scope.row.payed_money) < parseInt(scope.row.price)" size="mini" @click="pay_left_money(scope)" :loading="order_dialog.loadingBtn == scope.$index">补缴余款</el-button>

                        </template>
                    </el-table-column>
                </el-table>
                <div class="Pagination" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                            @current-change="handleCurrentChange_order"
                            :current-page="order_dialog.currentPage"
                            :page-size="limit"
                            layout="total, prev, pager, next"
                            :total="order_dialog.count"
                            background>
                    </el-pagination>
                </div>
            </div>

        </el-dialog>


    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {goods_list,goods_del,goods_verify,goods_sort,order_list,cancel_order_force,pay_left_money} from '@/api/getDataEarth'
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
                title:'',
                loadingBtn:-1,
                dialog_order_visible:false,
                current_option:{},


                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                current:{},
//                remark:'',
//                choose_categories:[],
//                categories:[],
                order_dialog:{
                    tableData: [],
                    limit: 10,
                    count: 0,
                    currentPage: 1,
                    dialogFormVisible:false,
                    current:{},
                    tel:'',
                    order_no:'',
                    status:-1,
                    start_time:'',
                    end_time:'',
                    status_options:[
                        {label:'全部',value:-1},
                        {label:'待付款',value:1},
                        {label:'已付款,待签到',value:2},
                        {label:'已完成,待评价',value:3},
                        {label:'已完成',value:4},
                        {label:'已关闭',value:9}
                    ],
                    loadingBtn:-1
                }

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
                goods_list({page:this.currentPage,page_size:this.limit,title:this.title}).then(function(res){
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
            goto_edit_goods(id) {
                this.$router.push({path:'add_goods',query:{id:id}});
            },
            goto_order(id) {
                this.$router.push({path:'order',query:{id:id}});
            },
            verify(scope, status) {

                this.$confirm('确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.loadingBtn = scope.$index;
                    goods_verify({id:item.id,status:status}).then(function(res){
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
                    goods_del({id:item.id}).then(function(res){
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
            show_orders(option,title){
                option.title = title;
                option.sub_title = '';
                option.list.forEach(function(val){
                    if (val.name) {
                        option.sub_title += '['+val.name+']';
                    } else if(val.time && val.place){
                        option.sub_title += '['+val.time+'('+val.place+')]';
                    } else {
                        option.sub_title += '[未知]';
                    }
                });
                this.dialog_order_visible= true;
                this.current_option = option;
                this.list_order();
            },
            sort() {
                goods_sort({
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

            list_order() {
                order_list({goods_stock_id:this.current_option.id,page:this.order_dialog.currentPage,page_size:this.order_dialog.limit,tel:this.order_dialog.tel,order_no:this.order_dialog.order_no,status:this.order_dialog.status,start_time:this.order_dialog.start_time,end_time:this.order_dialog.end_time}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.order_dialog.tableData = res.data.list;
                        this.order_dialog.count = parseInt(res.data.count);
                    }
                }.bind(this));

            },
            handleCurrentChange_order(val){
                this.order_dialog.currentPage = val;
                this.list_order();
            },

            search_order() {
                this.order_dialog.currentPage = 1;
                this.list_order();
            },
            cancel_force(scope) {

                this.$confirm('确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.order_dialog.loadingBtn = scope.$index;
                    cancel_order_force({id:item.id}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            item.status = 9;
                            item.status_desc = '已关闭';
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
                        this.order_dialog.loadingBtn = -1;
                    }.bind(this));
                }.bind(this));



            },

            pay_left_money(scope) {

                this.$confirm('补缴余款金额:¥'+(scope.row.price - scope.row.payed_money)+',确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.order_dialog.loadingBtn = scope.$index;
                    pay_left_money({id:item.id}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {

                            this.list_order();
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
                        this.order_dialog.loadingBtn = -1;
                    }.bind(this));
                }.bind(this));



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
