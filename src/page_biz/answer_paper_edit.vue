<template>
    <div class="fillcontain" style="position: relative" >
        <!--<head-top></head-top>-->
        <div id="preview" class="content">
            <div style="position: relative;height: 1199px; width: 879px;border: 1px solid #000;margin-bottom:60px;left: 13px;top:13px;">
                <div style="position: absolute;left: -13px;top:-13px; background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>
                <div style="position: absolute;right: -13px;top:-13px;background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>
                <div style="position: absolute;left: -13px;bottom:-13px;background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>
                <div style="position: absolute;right: -13px;bottom:-13px;background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>

                <vue-draggable-resizable v-if="paperData.title.enable" :draggable="false" :resizable="false" :x="paperData.title.x" :y="paperData.title.y" :w="paperData.title.w" :h="paperData.title.h" :parent="true">
                    <div style="font-size: 28px;text-align:center;font-weight: bolder">{{paperData.title.value}}</div>
                </vue-draggable-resizable>

                <vue-draggable-resizable v-if="paperData.qrcode.enable" :draggable="false" :resizable="false" :x="paperData.qrcode.x" :y="paperData.qrcode.y" :w="paperData.qrcode.w" :h="paperData.qrcode.h" :parent="true">
                    <div :style="'border:1px dashed #000;width: 100%;height:100%;text-align: center;line-height:'+paperData.qrcode.h + 'px'">二维码黏贴处</div>
                </vue-draggable-resizable>

                <vue-draggable-resizable v-if="paperData.xuhao.enable" :draggable="false" :resizable="false" :x="paperData.xuhao.x" :y="paperData.xuhao.y" :w="paperData.xuhao.w" :h="paperData.xuhao.h" :parent="true">
                    <div style="background: #000;width: 100%;height: 100%"></div>
                </vue-draggable-resizable>


                <div :style="'width: 100%;height: 1px;top:'+header_height+'px;position: absolute;background: #333'">

                </div>

                <vue-draggable-resizable v-for="(element, i) in elements" :x="element.x" :y="element.y" :w="element.w" :h="element.h" @dragging="(x,y) => {onDrag(x,y,element)}" @resizing="(x,y,w,h) => {onResize(x,y,w,h,element)}" :parent="true">
                    <div>{{element.value}}</div>
                </vue-draggable-resizable>
                <!--<vue-draggable-resizable :w="aa.w" :h="aa.h" @resizing="(x,y,w,h) => {aa.w=w;aa.h=h}" :style="'width:'+aa.w+'px;height:'+aa.h+'px;border: 1px solid red;'" :parent="true">-->
                <!--</vue-draggable-resizable>-->
            </div>

        </div>
        <div style="position: fixed;bottom:10px">
            <el-button size="mini" type="primary" @click="addElement"><i class="iconfont">&#xe602;</i>涂抹题</el-button>
            <el-button size="mini" type="primary" @click="addElement"><i class="iconfont">&#xe631;</i>输入框</el-button>
            <el-button size="mini" type="primary" @click="addElement"><i class="iconfont">&#xe621;</i>多小题</el-button>
            <el-button size="mini" type="primary" @click="addElement"><i class="iconfont">&#xe630;</i>作文题</el-button>
            <el-button size="small" type="success" @click="print">预览并保存</el-button>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import VueDraggableResizable from 'vue-draggable-resizable'
    import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

    import '@/assets/js/jquery-1.4.4.min';
    import '@/assets/js/jquery.jqprint-0.3';
    export default {
        data: function () {
            return {
                xuhao:1,
                header_height:130,
                elements:[],
                paperData:{
                    title:{
                        enable:true,
                        x:10,
                        y:10,
                        w:400,
                        h:100,
                        value:'文远教育2019秋二年级数学晋级考答题卡'
                    },
                    qrcode:{
                        enable:true,
                        x:450,
                        y:10,
                        w:300,
                        h:100,
                        value:''
                    },
                    xuhao:{
                        enable:true,
                        x:805,
                        y:20,
                        w:22,
                        h:10,
                        value:''
                    },
                }
            }
        },
        methods: {
            onResize: function (x, y, width, height, obj) {
                obj.x = x
                obj.y = y
                obj.w = width
                obj.h = height
            },
            onDrag: function (x, y, obj) {
                obj.x = x
                obj.y = y
            },
            addElement(){
                var top = $('.content').offset().top * -1;
                top = top < this.header_height ? this.header_height : top;
                this.elements.push({x:0,y:top,w:100,h:100,value:'内容'});
            },
            print() {
                setTimeout(()=>{
                    $("#preview").jqprint();
                })
            },
        }
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
