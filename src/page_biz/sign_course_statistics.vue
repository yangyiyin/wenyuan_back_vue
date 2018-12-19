<template>
    <div>
        <head-top></head-top>
        <v-chart :options="polar"/>
    </div>

</template>

<script>
    import headTop from '../components/headTop'
    import {config_list} from '@/api/getDataEarth'
    import ECharts from 'vue-echarts'
    // import 'echarts/lib/chart/line'
    export default {
        data(){
            return {
                polar:{
                    title: {
                        text: '报班统计'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一','周二','周三','周四','周五','周六','周日']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'邮件营销',
                            type:'line',
                            stack: '总量',
                            data:[120, 132, 101, 134, 90, 230, 210]
                        },
                    ]
                }

            }

        },
        components: {
            headTop,
            'v-chart': ECharts
        },
        created(){

        },
        mounted(){

            //console.log(this.$route.query);
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
               // vm.init();

        })
        },

        methods: {
            init() {

            },


        }
    }
</script>

<style lang="less">
    @import '../style/mixin';

</style>
