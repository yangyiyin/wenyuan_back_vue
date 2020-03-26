<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;"></span>
                <div style="font-size: 12px;color: #333;display: inline-block">
                    <p>路径举例:<span style="color: red">page=/pages/examine_detail/index&id=1</span>表示考试id为1的详情页</p>
                    <div style="border: 1px solid #ddd;padding: 10px;">
                        <p>目前支持的路径如下:</p>
                        <p>考试详情页:page=/pages/examine_detail/index&id=$id 其中$id使用具体的id值代替</p>
                        <p>精品课详情页:page=/pages/course_detail/index&id=$id 其中$id使用具体的id值代替</p>
                        <p>选课线下报名须知协议:page=/pages/sign_course_agreement/index&stage_id=$id 其中$id使用具体的选课id值代替</p>
                        <p>小视频首页:page=/pages/video/index</p>
                    </div>
                </div>
            </div>
            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>路径:</span>
                <el-input placeholder="" v-model="page_url"  style="width: 650px"></el-input>
            </div>


            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" >生成二维码</el-button>

            <div class="search_item" v-if="qrcode_url">

                <img :src="qrcode_url"/>

            </div>

        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {upload_avatar} from '@/api/getDataEarth'

    export default {
        data(){
            return {
                id:0,
                page_url:'',
                qrcode_url:'',

            }

        },
        components: {
            headTop
        },
        created(){

        },
        mounted(){
        },

        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.init();

            })
        },
        methods: {


            init() {

                this.page_url = '';
                this.qrcode_url = '';
            },

            submit: function () {
                if (this.page_url) {
                    var page_url = 'http://api.yixsu.com/minipro/index_pre?' + this.page_url;
                    console.log(encodeURIComponent(page_url));
                    this.qrcode_url = 'http://api.yixsu.com/index.php/waibao/common/qrcode?text='+encodeURIComponent(page_url)
                }


            },

        }
    }
</script>

<style scoped lang="less">
    @import '../style/mixin';
    .search_item{

        margin-top: 10px;

    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader-round .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 100px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }
    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
    .ql-editor{
        min-height: 100px;
    }
    .pre_info{
        display:inline-block ;
        width: 140px;
    }
</style>
