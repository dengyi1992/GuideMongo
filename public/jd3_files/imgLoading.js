/**
 * Created by xiangshoulai on 2016/1/5.
 * V1.1
 * 新增图片动画出现
 * lazy load
 *
 */
;(function(){
    'use strict';
    $.fn.imglazyLoad=function(opts){
        return new LazyLoad(opts);
    };
    var LazyLoad=(function(){
        /*
         * _src 图片请求路径
         * duration 定时器加载时间
         * container 指定容器内的img，如果没有表示针对全部页面的
         * rangeH上下范围边限
         * animationName 动画名称
         * showDelay动画执行的时间
         * */
        var imgLoad=function(opts){
            this.duration=opts.duration?opts.duration:this.duration;
            this.container=opts.container?opts.container:this.container;
            this._src=opts._src?opts._src:this._src;
            this.rangeH=opts.rangeH?opts.rangeH:this.rangeH;
            this.animationName=opts.animationName?opts.animationName:this.animationName;
            this.showDelay=opts.showDelay?opts.showDelay:this.showDelay;
            this.styleContianer=opts.styleContianer?opts.styleContianer:this.styleContianer;
            this.init();
        };
        imgLoad.prototype={
            refreshTimer:null,
            duration:300,
            _src:'_src',
            container:'imgContainer',
            rangeH:0,
            animationName:'fade',
            showDelay:'400ms',
            styleContianer:'styleID',
            /*距上的范围*/
            belowthefold:function(element){
                return $(window).scrollTop()-this.rangeH <= $(element).offset().top;
            },
            /*距下的范围*/
            abovethetop:function(element){
                return  $(element).offset().top<= $(window).scrollTop() + document.documentElement.clientHeight+this.rangeH;
            },
            /*
             *判断元素是否出现在viewport中 依赖于上两个扩展方法
             */
            inViewport:function(element){
                return this.belowthefold(element) && this.abovethetop(element);
            },
            setStyle: function(obj, json) {
                for (var i in json) {
                    obj.style[i] = json[i];
                }
            },
            addStyle:function(){
                var styleDiv=document.getElementById(this.styleContianer);
                if(styleDiv){
                    styleDiv.innerHTML += '<style>' +
                        ' @-webkit-keyframes fade {' +
                        ' 0%   { opacity: 0; }' +
                        ' 100% { opacity: 1; } ' +
                        '}' +
                        ' @keyframes fade { ' +
                        ' 0%   { opacity: 0; } ' +
                        ' 100% { opacity: 1; } ' +
                        '}' +
                        '</style>';
                }
            },
            loading:function(){
                var self=this;
                var list=[];
                var container=document.getElementById(self.container);
                if(container){
                    list=$(container).find('img['+self._src+']')
                }else{
                    list=$('img['+self._src+']');
                }
                list.each(function (i) {
                    var img = list.eq(i);
                    if (self.inViewport(img)) {
                        self.changSrc(img);
                    }
                });
            },
            changSrc:function(img){
                var self=this,p;
                var src = img.attr(''+self._src+'');
                img.attr('src', src).removeAttr(''+self._src+'');
                //p=img.parent();
                self.setStyle(img[0], {
                    animation:self.animationName+' '+self.showDelay+' 0s',
                    webkitAnimation:self.animationName+' '+self.showDelay+' 0s'
                });
            },
            init:function(){
                var self=this;
                self.addStyle();
                if (self.refreshTimer) {
                    clearTimeout(self.refreshTimer);
                    self.refreshTimer = null;
                }
                self.refreshTimer = setTimeout(function(){
                    self.loading();
                },10);
                /*
                 *滚动结束 屏幕静止一秒后检测哪些图片出现在viewport中
                 *和PC端不同 由于无线速度限制 和手机运算能力的差异 1秒钟的延迟对手机端的用户来说可以忍受
                 */
                $(window).on('scroll', function () {
                    if (self.refreshTimer) {
                        clearTimeout(self.refreshTimer);
                        self.refreshTimer = null;
                    }
                    self.refreshTimer = setTimeout(function(){
                        self.loading();
                    }, self.duration);
                });
            }
        };
        return imgLoad;
    })();
    $.loadImg={
        lazyLoad:function(opts){
            /*
             * 懒加载
             * */
            $(document.body).imglazyLoad(opts);
        },
        preLoad:function(){
            /*
             * 预加载
             * */
        }
    };
})($);