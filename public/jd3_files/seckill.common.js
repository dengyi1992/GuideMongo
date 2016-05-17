$(function(){
	window.onload = function(){
		var seckillCommon = new SeckillCommon();
		seckillCommon.initByType();
	};
});

var SeckillCommon = function(){
	this.init();
};

SeckillCommon.prototype = {
	init : function() {
		this.resourceType = global_resourceType;
		this.resourceValue = global_resourceValue;
	},
	
	streamHideHead : function() {
		this.hideBack();
		this.hideMenu();
	},
	
	hideBack : function() {
		$('#m_common_header_goback').hide();
	},
	
	hideMenu : function() {
		$('#m_common_header_jdkey').hide();
	},
	
	combUrl : function(params) {
		$('a').attr('href',function(i, attr) {
			if(attr) {
				if(params) {
					var href = attr;
        			if(attr.indexOf("?") != -1 && attr.indexOf("#") != -1) {
       					href = attr.substring(0, attr.indexOf("#")) + "&" + params + attr.substring(attr.indexOf("#"));
        			} else if(attr.indexOf("?") != -1) {
    					href = attr + "&" + params;
        			} else if(attr.indexOf("#") != -1) {
       					href = attr.substring(0, attr.indexOf("#")) + "?" + params + attr.substring(attr.indexOf("#"));
        			} else {
       					href = attr + "?" + params;
        			}
    				return href;
				} else {
					return attr;
				}
			} else {
				return attr;
			}
        });
	},
	
	streamCombA : function() {
		var href = window.location.href, params = "";
		if(href && href.indexOf("?") != -1) {
			params = href.substring(href.indexOf("?") + 1);
		}
		this.combUrl(params);
	},
	
	spreadScanCodeCombA : function() {
		var paramAry = [];
		if(this.resourceType) {
			paramAry.push("resourceType=" + this.resourceType);
		}
		if(this.resourceValue) {
			paramAry.push("resourceValue=" + this.resourceValue);
		}
		this.combUrl(paramAry.join("&"));
	},
	
	initByType : function() {
		var userAgent = navigator.userAgent;
    	if(userAgent.indexOf("Html5Plus") > 0) {
    		this.streamHideHead();
//    		this.streamCombA();
    	} else if(userAgent.indexOf("jdmsxh") != -1 || userAgent.indexOf("jdmsxh2") != -1) {
    		this.hideBack();
    	} else {
    		this.spreadScanCodeCombA();
    	}
	}
};