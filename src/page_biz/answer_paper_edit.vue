<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div style="height: 842px; width: 595px; border: 1px solid red; position: relative;margin-left: 50px;margin-top: 20px;">
            <vue-draggable-resizable v-for="(element, i) in elements" :w="100" :h="100" @dragging="(x,y) => {onDrag(x,y,element)}" @resizing="(x,y,w,h) => {onResize(x,y,w,h,element)}" :parent="true">
                <p>Hello! I'm a flexible component. You can drag me around and you can resize me.<br>
                    X: {{ element.x }} / Y: {{ element.y }} - Width: {{ element.w }} / Height: {{ element.h }}</p>
            </vue-draggable-resizable>
        </div>
        <el-button type="primary" @click="addElement">添加</el-button>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import VueDraggableResizable from 'vue-draggable-resizable'
    import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
    export default {
        data: function () {
            return {
                width: 0,
                height: 0,
                x: 0,
                y: 0,
                elements:[{x:0,y:0,w:0,h:0}]
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
                this.elements.push({x:0,y:0,w:0,h:0});
            }
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
