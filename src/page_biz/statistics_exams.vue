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
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column label="学号" prop="student_id" align="center"></el-table-column>
                <el-table-column label="姓名" prop="student_name" align="center"></el-table-column>
                <el-table-column label="综合排名" prop="overall_rank" align="center"></el-table-column>
                <template v-for="col in tableData">
                    <el-table-column label="考试信息" v-for="item in col.exam_info" align="center">
                        <el-table-column label="考试科目" prop="item.exam_name" align="center">
                        </el-table-column>
                        <el-table-column label="考试分数" prop="item.score" align="center">
                        </el-table-column>
                        <el-table-column label="考试排名" prop="item.sort" align="center">
                        </el-table-column>
                    </el-table-column label='考试信息'>
                </template>
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
    import {get_statistics_student_examinations} from '@/api/getDatastudent_examine_result'
    export default {
        data(){
            return {
                tableData: [],
                examsArr: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                current:{},
                student_id:'',
                name:'',
                overall_rank:'',
                exam_name:'',
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
        computed: {
        },
        methods: {
            list() {
                get_statistics_student_examinations({page:this.currentPage,page_size:this.limit,name:this.name}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        const hash = {};
                        const arr = [];
                        Object.values(res.data.data).forEach(item => {
                            const info = [];
                            const student = res.data.students.filter(el => el.id === item.student_id)
                            item.name = student[0].title || student[0].name
                            const exam = res.data.examinations.filter(el => el.id === item.examination_id)
                            item.exam_name = exam[0].name
                            info.push({examination_id: item.examination_id, exam_name: item.exam_name, score: item.score, sort: item.sort})
                            const identifier = item.student_id;
                            if(!hash[identifier]) {
                                hash[identifier] = {
                                    student_id: item.student_id,
                                    student_name: item.name,
                                    exam_info: info
                                }
                            } else {
                                hash[identifier].exam_info.push(info)
                            }
                        })
                        this.tableData = Object.values(hash);
                        this.tableData.forEach(e => arr.push(e.exam_info))
                        this.examsArr = arr;
                        this.count = parseInt(res.data.students.count);
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
