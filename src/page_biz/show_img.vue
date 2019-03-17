<template>
    <div class="fillcontain">
        <head-top></head-top>
        <p v-for="(item, index) in path">
            <img :src="item.url"/>
        </p>
        <p v-for="(item, index) in mp3_path">
            <audio :src="item.url" controls="controls"></audio>
        </p>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {homework_list,homework_del,homework_verify,homework_sort} from '@/api/getDatahomework'
    export default {
        data(){
            return {
                path:[],
                mp3_path:[]
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
                vm.path = to.query.path ? to.query.path : [];
                vm.mp3_path = to.query.mp3_path ? to.query.mp3_path : [];
        })
        },
        methods: {

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
