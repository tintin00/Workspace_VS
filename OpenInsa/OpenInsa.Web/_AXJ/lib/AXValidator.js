﻿var AXValidator =  Class.create(AXJ, {
    version: "AXValidator V1.0",
    author: "tom@axisj.com, hwshin@collabra.com",
	logs: [
		"2013-07-18 오전 12:05:00",
		"2013-07-18 오후 12:31:04 - tom",
	    "2013-07-19 오후 19:37:04 - shin : message[validateKey], errElement 추가",
	    "2013-07-24 오후 19:24:00 - shin : displayFormatter 추가 keyup event phone '-' add"
	],
	initialize: function ($super) {
		$super();
		this.Observer = null;
	    this.form = null;
		this.elements = [];
	    this.errElements = [];
	    this.errMessagePattern = "[{label}] {message}";
	    this.config = {
	        targetID: null,
	        clazz: "av-"
	    };
	},
    init:function(){
		var cfg = this.config;
		if (Object.isUndefined(cfg.targetFormName)) {
			trace("need targetID - setConfig({targetFormName:''})");
			return;
		}
        
		if (!document[cfg.targetFormName]) {
        	// 엘리먼트가 존재 하지 않는 경우 예외 처리
        	trace("not found form element");
			return;
        }
        
		this.form = $(document[cfg.targetFormName]);
        this.findElement();
    },
    findElement:function(){
		var cfg = this.config;
		var allElements = this.form.serializeObject();
		var _elements = this.elements;
        var checkClass = this.validateCheckClass;
		$.each(allElements, function (eidx, Elem) {
		    try {
		        var config = {};
		        var isValidate = false;
		        $.each(checkClass, function(k, v) {
		            if (Elem.id) {
		                if ($("#" + Elem.id).hasClass(cfg.clazz + k)) {
		                    config[k] = v;
		                    isValidate = true;
		                }
		            } else if (Elem.name) {
		                if ($(document[cfg.targetFormName][Elem.name]).hasClass(cfg.clazz + k)) {
		                    config[k] = v;
		                    isValidate = true;
		                }
		            }
		        });
		        if (isValidate) {
		            delete Elem.value;
		            Elem.config = config;
		            _elements.push(Elem);
		        }
		    } catch(e) {
		        
		    }
		});

		this.elements = _elements;

        //trace(this.elements);
    },
	add: function(addObj){
		var cfg = this.config;
		var addedObject;
	    var addElement = this.addElement.bind(this);
	    var getElement = this.getElement.bind(this);
	    var isActiveFormControl = this.isActiveFormControl.bind(this);
	    var element = getElement(addObj);
	    if (!isActiveFormControl(element)) return false;

	    if (addObj.id) {
			var findIndex = null;
			$.each(this.elements, function (eidx, elem) {
				if (this.id == addObj.id) {
					findIndex = eidx;
					return false;
				}
			});
			if (findIndex != null) {
			    addElement(addObj, findIndex);
				addedObject = this.elements[findIndex];
			} else {
				addObj.name = $("#" + addObj.id).attr("name");
				this.elements.push(addObj);
				addedObject = this.elements.last();
			}
		} else if (addObj.name) {
			var findIndex = null;
			$.each(this.elements, function (eidx, elem) {
				if (this.name == addObj.name) {
					findIndex = eidx;
					return false;
				}
			});
			if (findIndex != null) {
				addElement(addObj, findIndex);
				addedObject = this.elements[findIndex];
			} else {
				addObj.id = $(document[cfg.targetFormName][addObj.name]).attr("id");
				this.elements.push(addObj);
				addedObject = this.elements.last();
			}

		}

	    var raiseError = this.raiseError.bind(this);
	    var validateFormatter = this.validateFormatter.bind(this);
	    var targetElem;
	    var targetElemForSelect;

	    if (addedObject.id) {
	    	targetElem = $("#" + addedObject.id);
	    	targetElemForSelect = $M(addedObject.id);
	    } else if (this.name) {
	    	targetElem = $(document[cfg.targetFormName][addedObject.name]);
	    	targetElemForSelect = document[cfg.targetFormName][addedObject.name];
	    }
	    var Elem = addedObject;
	    var displayFormatter = this.displayFormatter.bind(this);

		// realtime 지원 함수 구문 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		if (addedObject.realtime) {		    
			//Elem.realtime.validate = Elem.config;

			Elem.needRealtimeCheck = false;
			Elem.realtimeCheck = {};

			$.each(Elem.config, function (k, v) {
				if (k == "maxlength") {
					Elem.needRealtimeCheck = true;
					Elem.realtimeCheck[k] = v;
				}
			});

			if (Elem.needRealtimeCheck) {
				targetElem.unbind("keydown.validate");
				targetElem.bind("keydown.validate", function (e) {
					var event = window.event || e;
					if (!event.keyCode || event.keyCode == 9 || event.keyCode == 16) return;
					var _val = this.value;
					var returnObject = null;

					var eventBlock = true;

					if (document.selection && document.selection.createRange) {
						var range = document.selection.createRange();
						if (range.text != "") eventBlock = false;
					} else if (window.getSelection) {

						if (AXUtil.browser.name == "mozilla") {
							//trace({ maxlength: Elem.realtimeCheck.maxlength, selectionStart: targetElemForSelect.selectionStart });
							if (Elem.realtimeCheck.maxlength > targetElemForSelect.selectionStart) {
								eventBlock = false;
							}
						} else {
							selectedText = window.getSelection().toString();
							if (selectedText != "") eventBlock = false;
						}
					}
					

					$.each(Elem.realtimeCheck, function (k, v) {
						var val = targetElem.val() + "A";
						if (!validateFormatter(Elem, val, k, v, "realtime")) { // 값 검증 처리
							returnObject = raiseError(Elem, val, k, v);
							return false;
						}
					});
				    
					var responseResult = true;
					if (returnObject == null) {
						Elem.realtime.response.call({ result: true });
					} else {
						returnObject.result = false;
						responseResult = Elem.realtime.response.call(returnObject);
					}

					if (responseResult == false) {
						if (eventBlock) {
							if (event.keyCode != AXUtil.Event.KEY_DELETE
								&& event.keyCode != AXUtil.Event.KEY_BACKSPACE
								&& event.keyCode != AXUtil.Event.KEY_LEFT
								&& event.keyCode != AXUtil.Event.KEY_RIGHT) {

								if (event.preventDefault) event.preventDefault();
								if (event.stopPropagation) event.stopPropagation();
								event.cancelBubble = true;
								return false;
							}
						}
					}

				});
			}



			//trace(Elem.config);

			targetElem.unbind("keyup.validate").bind("keyup.validate", function (e) { 
			    var event = window.event || e;
			    // ignore tab & shift key 스킵
			    if (!event.keyCode || event.keyCode == 9 || event.keyCode == 16) return;
			    
			    var _val = this.value;
				var returnObject = null;
			    var vKey;
			    $.each(Elem.config, function (k, v) {

			    	//trace(k);

				    vKey = k;
					var val = targetElem.val();
					if (!validateFormatter(Elem, val, k, v, "realtime")) { // 값 검증 처리
					    returnObject = raiseError(Elem, val, k, v);					    
						return false;
					}
				});			    
                
				var responseResult = true;
				if (returnObject == null) {
				    Elem.__prevValue = _val;
					Elem.realtime.response.call({ result: true });
				} else {
					returnObject.result = false;
					responseResult = Elem.realtime.response.call(returnObject);
				}
			    
				

				if (responseResult == false) {
					if (event.keyCode != AXUtil.Event.KEY_DELETE
						&& event.keyCode != AXUtil.Event.KEY_BACKSPACE
						&& event.keyCode != AXUtil.Event.KEY_LEFT
						&& event.keyCode != AXUtil.Event.KEY_RIGHT
						) {

						if ((Elem.__prevValue || "").length > _val.length) {
							this.value = "";
						} else {
						    if(displayFormatter((Elem.__prevValue || ""), vKey) != "") this.value = displayFormatter((Elem.__prevValue || ""), vKey);
						}

						if (event.preventDefault) event.preventDefault();
						if (event.stopPropagation) event.stopPropagation();
						event.cancelBubble = true;
						return false;
					}
				} else {
				    //realtime에서 체크시 백시켜서 오류
				    if(displayFormatter(this.value, vKey) != "") this.value = displayFormatter(this.value, vKey);
				}

			});

		}
		// realtime 지원 함수 구문 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


		//trace(addedObject);

		// blur 지원
		if (addedObject.onblur) {
			targetElem.unbind("blur.validate").bind("blur.validate", function (e) {
				var returnObject = null;

				$.each(Elem.config, function (k, v) {
					var val = targetElem.val();

					if (!validateFormatter(Elem, val, k, v, "")) {						
					    returnObject = raiseError(Elem, val, k, v);
					    returnObject.result = false;
					} else {
					    returnObject = raiseError(Elem, val, k, v);
					    returnObject.result = true;
					}
				});
				var responseResult = Elem.onblur.call(returnObject);

			});
		}

	},
    addElement:function(addObj, findIndex) {
    	AXUtil.overwriteObject(this.elements[findIndex].config, addObj.config, true);
    	if (addObj.onblur) this.elements[findIndex].onblur = addObj.onblur;
		if (addObj.realtime) this.elements[findIndex].realtime = addObj.realtime;
		if (addObj.message) this.elements[findIndex].message = addObj.message;
		if (addObj.label) this.elements[findIndex].label = addObj.label;
    },
	validate: function () {
		var cfg = this.config;
	    var raiseError = this.raiseError.bind(this);
		var validateFormatter = this.validateFormatter.bind(this);

		var returnObject = null;
		$.each(this.elements, function (eidx, Elem) {

			var targetElem;
			if (Elem.id) {
				targetElem = $("#" + Elem.id);
			} else if (this.name) {
				targetElem = $(document[cfg.targetFormName][Elem.name]);
			}

			if(targetElem){
				var val = targetElem.val();
			    var _end = false;
				$.each(Elem.config, function (k, v) {
					if (!validateFormatter(Elem, val, k, v, "")) { // 값 검증 처리
						returnObject = raiseError(Elem, val, k, v);
					    _end = true;
					    return false;
					}
				});
			    if (_end) return false;
			}
		});

		if (returnObject == null) {		    
		    if (this.errElements.length > 0) {
		        this.errElements.splice(0, this.errElements.length);
		    }
            return true;
		} else {
            return false;
		}

	}, 
	raiseError: function (elem, elemVal, validateKey, validateVal) {
	    var messageConvert = this.messageConvert.bind(this);
	    var message = messageConvert(elem, validateKey, validateVal);
        var returnObject = {
            element: elem,
            value: elemVal,
            validateKey: validateKey,
            validateVal: validateVal,
            message: message
        };
	    this.errElements.push(returnObject);
        return returnObject;
    },
    messageConvert:function(elementObj, validateKey, validateVal) {
        var validateErrMessage = this.validateErrMessage;
        var vKey = "exception";
        var vVal = "";
        if (validateKey != undefined) vKey = validateKey;
        if (validateVal != undefined) vVal = validateVal;
        
        var element = elementObj;
        if (!element) {
            return null;
        }
        if (element.label) {
            var label = element.label.length > 0 ? element.label : (element.id || element.name);
        } else {
            var label = (element.id || element.name);
        }

        var errMessage = validateErrMessage[vKey];
        if (element.message == undefined) {
            var typeMessage = errMessage;
        } else {
            var typeMessage = (element.message[vKey] || errMessage);
        }
        var message = typeMessage.replace(/{label}/, label);
        message = message.replace("{" + vKey + "}", vVal);
        return message;        
    },
    //-------------------- validate check - formatter - message Set [S] ----------------------
    validateErrMessage: {
        /* for element */
        required: "[{label}](은)는 필수입력 사항입니다.",
        requiredstring: "반드시 {required}(으)로 입력하셔야 하는 사항입니다.",
        match: "[{label}](은)는 입력된 내용이 일치하지 않습니다.",
        invalid: "[{label}](은)는 입력된 내용이 올바르지 않습니다.",
        min: "[{label}](은)는 {min} 이상의 값을 입력해주세요.",
        max: "[{label}](은)는 {max} 이하의 값을 입력해주세요.",
        minbyte: "[{label}]의 입력된 내용의 길이가 {minbyte}Byte 이상이어야 합니다.",
        maxbyte: "[{label}]의 입력된 내용의 길이가 {maxbyte}Byte를 초과할 수 없습니다.",
        minlength: "[{label}]의 입력된 내용의 length가 {minlength} 이상이어야 합니다.",
        maxlength: "[{label}]의 입력된 내용의 length가 {maxlength}을 초과할 수 없습니다.",        

        /* for format */
        number: "숫자로만 입력하셔야 합니다.",        
        email: "이메일 형식이 올바르지 않습니다.",
        hangul: "한글로만 입력하셔야 합니다.",
        engonly: "영문으로만 입력하셔야 합니다.",
        residentno: "주민등록번호 형식이 올바르지 않습니다.",
        foreignerno: "외국인등록번호 형식이 올바르지 않습니다.",
        bizno: "사업자등록번호 형식이 올바르지 않습니다.",
        phone: "전화번호 형식이 올바르지 않습니다.",
        isdate: "날짜 형식이 올바르지 않습니다.",
        zip: "우편번호 형식이 올바르지 않습니다.",
        
        money: "화폐형식으로만 입력하셔야 합니다.",
        
        exception:"not found errmessage"
    },
    validateCheckClass: {
        // element에서 클래스 검사 항목
		required: true,     //필수
		number:true,        //숫자 형식
		email:true,         //이메일 형식
		hangul:true,        //한글 형식
		engonly:true,       //영문 형식
		residentno:true,    //주민등록 번호 형식
		foreignerno:true,   //외국인 번호 형식
		bizno:true,         //사업자 등록 형식
		phone:true,         //전화번호 형식
		isdate:true,        //날짜 형식
		zip:true,           //우편번호 형식
		money:true          //',' 포함한 숫자
    },
	validateFormatter: function (Elem, ElemValue, validateKey, validateValue, realtime) {
		var cfg = this.config;
		var result = true;
		var lenMargin = 1; // 최소 최대 비교시 하나 커야 함.
		if (realtime == "realtime") lenMargin = 0; // realtime 실행 시는 마진 없음.

        try {
            /* for element */
            if (validateKey == "required") {
                result = (ElemValue.trim() != "");
            } else if (ElemValue != "" && validateKey == "min") {
                result = (ElemValue.number() + lenMargin > validateValue);
            } else if (ElemValue != "" && validateKey == "max") {
                result = (ElemValue.number() - lenMargin <= validateValue);
            } else if (ElemValue != "" && validateKey == "minbyte") {
                result = (ElemValue.getByte().number() + lenMargin > validateValue);
            } else if (ElemValue != "" && validateKey == "maxbyte") {
                result = (ElemValue.getByte().number() - lenMargin <= validateValue);
            } else if (ElemValue != "" && validateKey == "minlength") {
                result = (ElemValue.length.number() + lenMargin > validateValue);
            } else if (ElemValue != "" && validateKey == "maxlength") {
                result = (ElemValue.length.number() - lenMargin <= validateValue);
            /* for format */
            } else if (ElemValue != "" && validateKey == "number") {
                //var pattern = /^[0-9]+$/;
                result = $.isNumeric(ElemValue.trim());   
            } else if (ElemValue != "" && validateKey == "email") {
                var pattern = /^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
                result = pattern.test(ElemValue);
            } else if (ElemValue != "" && validateKey == "hangul") {
                var pattern = /^[가-힣0-9]+$/;
                result = pattern.test(ElemValue);                
            } else if (ElemValue != "" && validateKey == "engonly") {
                var pattern = /^[a-zA-Z0-9]+$/;
                result = pattern.test(ElemValue);                
            } else if (ElemValue != "" && validateKey == "residentno") {
                var pattern = /^(\d{6})-?(\d{5}(\d{1})\d{1})$/;
                var num = ElemValue;
                if (!pattern.test(num)) return "invalid";
                num = RegExp.$1 + RegExp.$2;
                if (RegExp.$3 == 7 || RegExp.$3 == 8 || RegExp.$4 == 9)
                    if ((num[7] * 10 + num[8]) % 2) return "residentno";

                var sum = 0;
                var last = num.charCodeAt(12) - 0x30;
                var bases = "234567892345";
                for (var i = 0; i < 12; i++) {
                    if (isNaN(num.substring(i, i + 1))) return "residentno";
                    sum += (num.charCodeAt(i) - 0x30) * (bases.charCodeAt(i) - 0x30);
                };
                var mod = sum % 11;
                if (RegExp.$3 == 7 || RegExp.$3 == 8 || RegExp.$4 == 9)
                    result = (11 - mod + 2) % 10 == last ? true : false;
                else
                    result = (11 - mod) % 10 == last ? true : false;
                
            } else if (ElemValue != "" && validateKey == "foreignerno") {
                var pattern = /^(\d{6})-?(\d{5}[7-9]\d{1})$/;
                var num = ElemValue;
                if (!pattern.test(num)) return "foreignerno";
                num = RegExp.$1 + RegExp.$2;
                if ((num[7] * 10 + num[8]) % 2) return "foreignerno";

                var sum = 0;
                var last = num.charCodeAt(12) - 0x30;
                var bases = "234567892345";
                for (var i = 0; i < 12; i++) {
                    if (isNaN(num.substring(i, i + 1))) return "foreignerno";
                    sum += (num.charCodeAt(i) - 0x30) * (bases.charCodeAt(i) - 0x30);
                };
                var mod = sum % 11;
                result = (11 - mod + 2) % 10 == last ? true : false;
                
            } else if (ElemValue != "" && validateKey == "bizno") {
                var pattern = /([0-9]{3})-?([0-9]{2})-?([0-9]{5})/;
                var num = ElemValue;
                if (!pattern.test(num)) return "bizno";
                num = RegExp.$1 + RegExp.$2 + RegExp.$3;
                var cVal = 0;
                for (var i = 0; i < 8; i++) {
                    var cKeyNum = parseInt(((_tmp = i % 3) == 0) ? 1 : (_tmp == 1) ? 3 : 7);
                    cVal += (parseFloat(num.substring(i, i + 1)) * cKeyNum) % 10;
                };
                var li_temp = parseFloat(num.substring(i, i + 1)) * 5 + "0";
                cVal += parseFloat(li_temp.substring(0, 1)) + parseFloat(li_temp.substring(1, 2));
                result = parseInt(num.substring(9, 10)) == 10 - (cVal % 10) % 10 ? true : false;

            } else if (ElemValue != "" && validateKey == "phone") {
            	if (realtime == "realtime") {
            		var pattern = /[\D]+/;
            		var num = ElemValue.replace(/\-/g, "");
            		result = pattern.test(num) ? false : true;
            	} else {
            		var pattern = /^(0[2-8][0-5]?|01[01346-9])-?([1-9]{1}[0-9]{2,3})-?([0-9]{4})$/;
            		var pattern15xx = /^(1544|1566|1577|1588|1644|1688)-?([0-9]{4})$/;
            		var patternHand = /^(01[01346-9])-?([1-9]{1}[0-9]{2,3})-?([0-9]{4})$/;
            		var num = ElemValue;
            		result = pattern.test(num) || pattern15xx.test(num) || patternHand.test(num) ? true : false;
            	}
            } else if (ElemValue != "" && validateKey == "isdate") {
                result = true;
                var iDate = ElemValue.replace(/-/g, "");
                if (iDate.length != 8) {
                    return result = false;
                }

                var oDate = new Date();
                oDate.setFullYear(parseInt(iDate.substr(0, 4), 10));
                oDate.setMonth(parseInt(iDate.substr(4, 2), 10) - 1);
                oDate.setDate(parseInt(iDate.substr(6, 2), 10));

                if (oDate.getFullYear() != parseInt(iDate.substr(0, 4), 10)
                    || oDate.getMonth() + 1 != parseInt(iDate.substr(4, 2), 10)
                    || oDate.getDate() != parseInt(iDate.substr(6, 2), 10)) {

                    return result = false;
                }
            } else if (ElemValue != "" && validateKey == "zip") {
                var pattern = /^[0-9]{3}\-[0-9]{3}$/;
                result = pattern.test(ElemValue);
            } else if(ElemValue != "" && validateKey == "money") {
                var value = ElemValue.replace(",").replace(".");
                //실제 money형식
                var pattern = /^\$?[0-9]+(,[0-9]{3})*(\.[0-9]*)?$/;
                //var pattern = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
                //result = pattern.test(ElemValue);
            } else {
                if ($.isFunction(validateValue)) {
                    result = validateValue.call({
                        Elem: Elem,
                        ElemValue: ElemValue,
                        validateKey: validateKey
                    });
                }
            }
        } catch(e) {
            result = false;
        }

		return result;
	},
	//-------------------- validate check - formatter - message Set [E] ----------------------
    //-------------------- validate static 지원 함수 Set [S] ---------------------------------
    getErrorMessage:function(errorMessagePattern) {    
        if (!this.errElements) {
            return null;
        }
        if (this.errElements.length == 0) {
            return "Err 메세지가 없습니다.";
        }
        var errObj = this.errElements.last();
        var errElement = errObj.element;
        var messageConvert = this.messageConvert.bind(this);       
        var message = messageConvert(errElement, errObj.validateKey, errObj.validateVal);
        
        return message;
    },
    getErrorElement:function() {
        var cfg = this.config;
        if (!this.errElements) {
            return null;
        }
        if (this.errElements.length == 0) {
            return null;
        }        
        var errObj = this.errElements.last();
        var errElement = errObj.element;
        return $("#" + errElement.id).length > 0 ? $("#" + errElement.id) : $(document[cfg.targetFormName][errElement.name]);
    },   
    getElement:function(elementObj) {
        var cfg = this.config;
        var element;
        try {
            if (elementObj.id) {
	            element = $M(elementObj.id);
	        } else {
	            element = document[cfg.targetFormName][elementObj.name];
	        }           
        } catch(e) {
            return false;
        }
        if (element == null) {
            AXUtil.alert((elementObj.id || elementObj.name) + " 객체를 확인하세요");
            return null;
        } else {
            return element;
        }
    },
    isActiveFormControl:function(element) {
	    if (!element) return false;
	    if (!(rinput.test(element.type) || rselectTextarea.test(element.type))  || element.disabled) return false;        
        return true;
    },
    displayFormatter:function(elemValue, validateKey) {
        if( elemValue == "" || elemValue == null ) return ""; 
        
        var value = elemValue;
        var dataFormat = "";

        if (value != "") {
            if (validateKey == "phone") {
                var pattern = /[^0-9]/g;
                var parintPattern = "";
                value = value.replace(pattern,"");
            
                //문자열 길이에 따른 값 처리
                if( value.length < 4 ) return value;  
                if( value.length > 3 && value.length < 7 ) {
                    dataFormat = "$1-$2"; 
                    parintPattern = /([0-9]{3})([0-9]+)/; 
                } else if(value.length == 7 ) {
                    dataFormat = "$1-$2"; 
                    parintPattern = /([0-9]{3})([0-9]{4})/; 
                } else if(value.length == 9 ) {
                    dataFormat = "$1-$2-$3"; 
                    parintPattern = /([0-9]{2})([0-9]{3})([0-9]+)/; 
                } 
                else if(value.length == 10){
                    if(value.substring(0,2)=="02"){
                        dataFormat = "$1-$2-$3"; 
                        parintPattern = /([0-9]{2})([0-9]{4})([0-9]+)/; 
                    }else{
                        dataFormat = "$1-$2-$3"; 
                        parintPattern = /([0-9]{3})([0-9]{3})([0-9]+)/;
                    }
                } else if(value.length > 10){ 
                    dataFormat = "$1-$2-$3"; 
                    parintPattern = /([0-9]{3})([0-9]{4})([0-9]+)/; 
                }
                value = value.replace(parintPattern, dataFormat);

            } else if (validateKey == "isdate") {
                var pattern = /[^0-9]/g;
                var parintPattern = "";

                value = value.replace(pattern, "");
                if (value.length < 4) return value;
                if (value.length > 4 && value.length < 7) {
                    dataFormat = "$1-$2";
                    parintPattern = /([0-9]{4})([0-9]+)/;
                } else if (value.length == 8) {
                    dataFormat = "$1-$2-$3";
                    parintPattern = /([0-9]{4})([0-9]{2})([0-9]+)/;
                }
                value = value.replace(parintPattern, dataFormat);
            }
            else {
                return "";
            }
        }

        return value;
    }
    //-------------------- validate static 지원 함수 Set [E] ---------------------------------
});