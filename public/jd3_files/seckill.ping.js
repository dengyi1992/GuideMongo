// 埋点 - 商品位
var seckillMPingCommoddity = function(page, wareId) {
	var curLi = document.querySelector('.tap-list>li.cur');
	var tag = curLi.children[3].innerHTML;
//	seckillMPing("MHandSecKill_Commodity", tag + "_" + wareId, "", "")
	setTimeout(seckillMPing("MHandSecKill_Commodity", tag + "_" + wareId, "", "", "2"), 1);
	setTimeout(function() {
		location.href = page;
	}, 100);
	return false;
};
// 埋点 - TAG位
var seckillMPingTag = function(page, tag, tagId) {
	seckillMPing("MHandSecKill_Tag", tag + "_" + tagId, "", "");
};
// 埋点 - 更多特价
var seckillMPingMorespecialslae = function(page) {
//	seckillMPing("MHandSecKill_Morespecialslae", "", "", "");
	setTimeout(seckillMPing("MHandSecKill_Morespecialslae", "", "", "", "2"), 1);
	setTimeout(function() {
		location.href = page;
	}, 100);
	return false;
};
// 埋点 - 全店优惠
var seckillMPingPreferential = function(page) {
//	seckillMPing("MHandSecKill_Preferential", "", "", "");
	setTimeout(seckillMPing("MHandSecKill_Preferential", "", "", "", "2"), 1);
	setTimeout(function() {
		location.href = page;
	}, 100);
	return false;
};
// 埋点 - Banner
var seckillMPingBanner = function(page) {
//	seckillMPing("MHandSecKill_Banner", "", "", "");
	setTimeout(seckillMPing("MHandSecKill_Banner", "", "", "", "2"), 1);
	setTimeout(function() {
		location.href = page;
	}, 100);
	return false;
};
// 埋点 - 品牌秒杀广告位
var seckillMPingBrand = function(page) {
	setTimeout(seckillMPing("MHandSecKill_Brand", page, "", "", "2"), 1);
	setTimeout(function() {
		location.href = page;
	}, 100);
	return false;
}
// 埋点 - 京品秒杀TAG
var seckillMPingJDSeckill = function(page) {
	setTimeout(seckillMPing("MHandSecKill_JDSecKill", "", "", ""), 1);
	setTimeout(function() {
		location.href = page;
	}, 100);
	return false;
}
//埋点 - 品牌秒杀TAG
var seckillMPingBrandSecKill = function(page) {
	setTimeout(seckillMPing("MHandSecKill_BrandSecKill", "", "", ""), 1);
	setTimeout(function() {
		location.href = page;
	}, 100);
	return false;
}
// 埋点 - 品牌秒杀聚合页各品牌Banner
var seckillMPingBrandBanner = function(page) {
	setTimeout(seckillMPing("MHandSecKill_BrandBanner", page, "", ""), 1);
	setTimeout(function() {
		location.href = page;
	}, 100);
	return false;
}
// 埋点 - 品牌秒杀聚合页商品位
var seckillMPingBrandProduct = function(page, sku) {
	setTimeout(seckillMPing("MHandSecKill_BrandProduct", sku, "", "", "4"), 1);
	setTimeout(function() {
		location.href = page;
	}, 100);
	return false;
}
// 埋点 - 品牌秒杀内页 - 点击优惠券
var seckillMPingCoupon = function(page) {
	setTimeout(seckillMPing("MHandSecKill_Coupon", "", "", ""), 1);
	setTimeout(function() {
		location.href = page;
	}, 100);
	return false;
}
// 埋点 - 品牌秒杀内页 - 领券成功
var seckillMPingCouponSuccess = function(page) {
	setTimeout(seckillMPing("MHandSecKill_CouponSuccess", "", "", ""), 1);
	setTimeout(function() {
		location.href = page;
	}, 100);
	return false;
}
// 埋点 - 品牌秒杀内页 - 聚合页入口位
var seckillMPingBrandEntrance = function(page) {
	setTimeout(seckillMPing("MHandSecKill_BrandEntrance", "", "", ""), 1);
	setTimeout(function() {
		location.href = page;
	}, 100);
	return false;
}
// 埋点 - 品牌秒杀内页 - 商品位
var seckillMPingBrandDetailProduct = function(page, sku) {
	setTimeout(seckillMPing("MHandSecKill_BrandDetailProduct", sku, "", "", "4"), 1);
	setTimeout(function() {
		location.href = page;
	}, 100);
	return false;
}
var seckillMPing = function(event_id, event_param, page_name, page_param, event_level) {
    try{
         var click = new MPing.inputs.Click(event_id);
         click.event_param = event_param;
//         click.page_name = page_name;
         click.page_param = page_param;
         if(event_level != null && event_level != undefined && event_level != "") {
        	 click.event_level = event_level;
         }
         click.updateEventSeries();
         var mping = new MPing();
         mping.send(click);
         MPing.inputs.Click.attachEvent();
    }catch (e) {
    }
};