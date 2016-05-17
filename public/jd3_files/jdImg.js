
;(function($){
    $.fn.jdImg = function (config) {
        return this.each(function(){
            var _slider = $(this);//容器对象
            var _sliderImg=_slider.find(".changeImg");
            var _sliderImgW=0;//img的宽度
            var _sliderItemW=0;//li的宽度
            var _sliderItemH=0;//li的高度
            var supportsOrientationChange = "onorientationchange" in window;
            var resize = supportsOrientationChange ? "orientationchange" : "resize";

            //缺省配置
            var _config = $.extend({
               _iScore:1/3,//li 所占比例
               _iPadding:3,//容器底部padding
               _isBorder:false//img是否有边框
            }, config);
            var setItems = function(){
               // _sliderItemW=_slider.parent("ul").width()*_config._iScore;
                _sliderItemW=parseInt(_slider.width());
                //_sliderItemW=Math.floor(_sliderItemW);
               // _slider.css({"width":_sliderItemW});
                if(_config._isBorder){
                    _sliderImgW=_sliderItemW-2-_config._iPadding*2;
                }else{
                    _sliderImgW=_sliderItemW-_config._iPadding*2;
                };

                _sliderImg.css({"width":_sliderImgW,"height":_sliderImgW,"lineHeight":_sliderImgW+"px","display":"block"});
            };


            window.addEventListener(resize, function(){
                clearTimeout(setResizeTimer);
                var setResizeTimer = setTimeout(function(){
                    setItems();
                },200);
                // initSlider();
                //sliding(0);//屏幕翻转后重置滑块位置
            });
           return setItems();
        });

    }
})(Zepto);