﻿/*!
 * axisJ Javascript Library Version 1.0
 * http://axisJ.com
 * 
 * 아래 소스의 라이선스는 axisJ.com 에서 확인 하실 수 있습니다.
 * http://axisJ.com/license
 * axisJ를 사용하시려면 라이선스 페이지를 확인 및 숙지 후 사용 하시기 바람니다. 무단 사용시 예상치 못한 피해가 발생 하실 수 있습니다.
 */

var AXWaterfall = Class.create(AXJ, {
	version: "AXWaterfall v1.0",
	author: "tom@axisj.com",
	logs: [
		"2012-10-11 오후 1:40:26"
	],
	initialize: function($super) {
		$super();
		this.CT_className = "AXWaterfall";
		this.I_className = "WaterBox";
		this.I_classNameMobile = "WaterBoxMobile";
		this.config.boxWidth = 224;
		this.config.boxMargin = 10;
		this.config.pageSize = 5;
		this.config.mobileSize = 300;
		this.config.autoResize = true;
		this.Observer = null;
		this.player = null;
		this.played = false;
		this.targetWidth = null;
	},
	init: function(){
		var config = this.config;
		if(Object.isUndefined(config.targetID)){
			trace("need targetID - setConfig({targetID:''})");
			return;
		}
		$("#"+config.targetID).addClass(this.CT_className);
		$("#"+config.targetID).find("."+config.fallClassName).addClass(this.I_className);
		
		var bodyWidth = (AXUtil.docTD == "Q") ? document.body.clientWidth : document.documentElement.clientWidth;
		this.targetWidth = bodyWidth;
		$("#"+config.targetID).css({width:"auto", minWidth:"auto", maxWidth:"auto"});
		
		$("#"+config.targetID).find("."+config.fallClassName).hide();
		
		this.waterFall();
		this.bindEvent();
	},
	onresize: function(){
		var config = this.config;
		var bodyWidth = (AXUtil.docTD == "Q") ? document.body.clientWidth : document.documentElement.clientWidth;
		if(this.targetWidth == bodyWidth) return;
		this.targetWidth = bodyWidth;
		
		$("#"+config.targetID).css({width:"auto", minWidth:"auto", maxWidth:"auto"});
		if (this.Observer) clearTimeout(this.Observer); //닫기 명령 제거
		var waterFall = this.waterFall.bind(this);
		this.Observer = setTimeout(function() {
			$("#"+config.targetID).find("."+config.fallClassName).hide();
		   waterFall();
		}, 100);
	},
	waterFall: function(){
		//if(this.played) return;
		
		var config = this.config;
		var CTw = $("#"+config.targetID).innerWidth() - config.boxMargin;
		var CW = config.boxWidth + config.boxMargin + 2;
		this.Clen = parseInt(CTw.div(CW));
		
		//trace({CTw:CTw, CW:CW, Clen:this.Clen, targetWidth:this.targetWidth});		
		var targetWidth = (CW * this.Clen);
		$("#"+config.targetID).css({width:targetWidth+"px"});

		if(this.Clen == 1){
			$("#"+config.targetID).find("."+config.fallClassName).addClass(this.I_classNameMobile);	
		}else{
			$("#"+config.targetID).find("."+config.fallClassName).removeClass(this.I_classNameMobile);	
		}
		this.grid = [];
		this.colsGrid = [];
		for(var a=0;a<this.Clen;a++) this.colsGrid.push(0);
		this.itemLen = $("#"+config.targetID).find("."+config.fallClassName).length;
		
		$("#"+config.targetID).find("."+config.fallClassName).each(function(index, O){
			var boxID = config.targetID+"_AX_"+index;
			$(O).attr("id", boxID);
			//$(O).html(index);
		});
		
		if(this.player) clearTimeout(this.player); //실행 중지
		this.playWaterFall(0);
	},
	
	playWaterFall: function(pageNo){
		var config = this.config;
		var stIndex = pageNo * config.pageSize;
		var edIndex = (pageNo+1) * config.pageSize;
		var l = 0, t = 0, et = 0, c = 0;
		
		for(var a = stIndex;a < edIndex;a++){
			var boxID = config.targetID+"_AX_"+a;
			if(a < this.Clen){
				t = 0;
				l = (a * config.boxWidth) + (config.boxMargin * a);
				c = a;
			}else{
				var minH = null;
				var minC = null;
				$.each(this.colsGrid, function(index, O){
					if(minH == null || minH > O){
						minH = O;
						minC = index;	
						c = index;
						l = (index * config.boxWidth) + (config.boxMargin * index);
					}
				});
				t = minH + config.boxMargin;
			}
			if($M(boxID)){
				var myBox = $("#"+boxID);
				myBox.css({left:l, top:t});
				myBox.show();
				var et = t + myBox.outerHeight();
				this.grid.push({id:boxID, left:l, top:t, et:et, col:c});
				this.colsGrid[c] = et;
				//trace({id:boxID, left:l, top:t, et:et, col:c});
			}else{
				break;	
			}
		}
		
		//trace(pageNo+" == "+(this.itemLen / config.pageSize));
		
		if((pageNo+1) > this.itemLen / config.pageSize){
			//play end
			var maxH = null;
			$.each(this.colsGrid, function(index, O){
				if(maxH == null || maxH < O){
					maxH = O;
				}
			});
			var itemWidth = this.Clen * (config.boxWidth + config.boxMargin) - config.boxMargin;
			var leftPadding = ($("#"+config.targetID).innerWidth() - itemWidth) /2;
			$("#"+config.targetID).css({height:maxH+config.boxMargin});
			this.played = false;
		}else{
			var playWaterFall = this.playWaterFall.bind(this);
			this.player = setTimeout(function(){
				playWaterFall((pageNo+1));
			}, 10);
		}
	},
	
	bindEvent: function(){
		var config = this.config;
		if(this.config.autoResize)
			$(window).resize(this.onresize.bind(this));
	}
});