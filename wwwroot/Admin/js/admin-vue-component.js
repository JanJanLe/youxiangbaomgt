/*
 * 
 * 
 * vue 自定义控件
 * 
 * 
 */


// 定义一个名为 UploadFile 的新组件 上传单个文件
Vue.component('UploadFile', {
    //数据
    data: function () {
        return {
            hzy_title: this.title,
            hzy_filed: this.filed,
            hzy_href: this.filed,
            hzy_filedname: this.filedname
        }
    },
    //属性
    props: {
        title: { type: String },
        filedname: { type: String },
        filed: { type: String },
        col: {
            type: String, default() { return "6"; }
        },
        tips: { type: String },
        downloadname: { type: String }
    },
    //加载完成
    mounted: function () {
        //console.log(this);
    },
    //函数集合
    methods: {
        trigger_input: function () {
            $('input[name=' + this.hzy_filedname + ']').click();
        },
        trigger_input_onchange: function (e) {
            console.log(e);
            this.hzy_filed = e.target.files[0].name;
            this.hzy_href = 'javascript:;';
        }
    },
    //监听属性变化
    watch: {
        filed: function (newV, oldV) { // watch监听props里status的变化，然后执行操作
            //console.log(newV, oldV);
            this.hzy_filed = newV;
            this.hzy_href = newV;
        }
    },
    //模板
    template: `
                <div v-bind:class="'col-sm-'+col">
                    <h4 class="example-title">{{hzy_title}}</h4>
                    <div class="hzy-upfile">
                        <div class="hzy-upfile-item">
<div v-if="downloadname">
                            <a target="_blank" v-show="hzy_filed" v-bind:href="hzy_href" v-bind:title="hzy_filed" v-bind:download="downloadname">{{hzy_filed}}</a>
</div>
<div v-else>
                            <a target="_blank" v-show="hzy_filed" v-bind:href="hzy_href" v-bind:title="hzy_filed">{{hzy_filed}}</a>
</div>
                        </div>
                        <div v-on:click="trigger_input" class="hzy-upfile-shade">{{tips}}</div>
                        <input type="file" v-bind:name="hzy_filedname" v-on:change="trigger_input_onchange" class="hide">
                    </div>
                </div>
    `
});

// 定义一个名为 UploadFile 的新组件 上传单个图片
Vue.component('UploadImage', {
    //数据
    data: function () {
        return {
            hzy_title: this.title,
            hzy_filed: this.filed,
            hzy_filedname: this.filedname,
        }
    },
    //属性
    props: {
        title: { type: String },
        filedname: { type: String },
        filed: { type: String },
        col: {
            type: String, default() { return "6"; }
        },
        tips: { type: String },
        isshowupbtn: { type: String }
    },
    //加载完成
    mounted: function () {
        console.log(this);
    },
    //函数集合
    methods: {
        trigger_input: function () {
            $('input[name=' + this.hzy_filedname + ']').click();
        },
        trigger_input_onchange: function (e) {
            console.log(e);
            this.hzy_filed = admin.getObjectUrl(e.target.files[0]);
        }
    },
    //监听属性变化
    watch: {
        filed: function (newV, oldV) { // watch监听props里status的变化，然后执行操作
            //console.log(newV, oldV);
            this.hzy_filed = newV;
            this.hzy_href = newV;
        }
    },
    //模板
    template: `
<div v-bind:class="'col-sm-'+col">
                    <h4 class="example-title">{{hzy_title}}</h4>
                    <div class="hzy-upfile">
                        <div class="hzy-upfile-item" v-bind:style="{height:isshowupbtn=='0'?'200px':''}">
                            <img v-bind:height="isshowupbtn=='0'?186:140" v-show="hzy_filed" v-bind:src="hzy_filed">
                        </div>
                        <div v-on:click="trigger_input" class="hzy-upfile-shade">{{tips}}</div>
                        <input type="file" accept="image/*" v-bind:name="hzy_filedname" v-on:change="trigger_input_onchange" class="hide">
                    </div>
                </div>
    `
});