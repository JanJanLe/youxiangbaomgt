
window.Debug = false;


var helperParams = {

	serverUserApi: window.Debug ? 'https://help-itool.com/' : 'https://help-itool.com/',

	serverImagePath: window.Debug ? 'https://file.help-itool.com/' : 'https://file.help-itool.com/',

	appstoresever: window.Debug ? 'https://app.help-itool.com/' : 'https://app.help-itool.com/',

	// apiItool: window.Debug ? 'http://localhost:59803/' : 'http://debug.itool.store/'
	apiItool: window.Debug ? 'http://localhost:59803/' : window._ApiService

};


var Page = function(p){
    window.onload = function(){
        setTimeout(p,100);
    };
}


var Helper =
{
    PageInit: function () {

		Helper.PageData();

    },

    GetData: function (name) {

        if (!name) return null;


        var value = localStorage.getItem(name);

        if (!value) return null;


        // try {
        //     return JSON.parse(value);
        // } catch (error) {
        //     return value;
        // }

        const source = JSON.parse(value),
            expired = source.expires;

        const now = Date.now();

        if (expired > 0 & now >= expired) {
            localStorage.removeItem(name);
            return;
        }

        return source.row;

    },

    SetData: function (name, data, expired) {

        if (!name) return null;

        // if (typeof (data) == "string") {
        //     localStorage.setItem(name, data);
        // } else {
        //     localStorage.setItem(name, JSON.stringify(data));
        // }

        let source = {
            row: data,
            expires: expired > 0 ? Date.now() + 1000 * 60 * expired : 0
        };

        localStorage.setItem(name, JSON.stringify(source));

        return true;

    },

	// 获取Layui Table 请求Token
	GetLayuiTableHeader: function() {
		return {
			"Itool-Proxy": "true",
			"Itool-TimeSpan": helperParams.crypt.time,
			"Itool-ClientCode": helperParams.crypt.clientCode
		};
	},


    // 获取HashCode
    GetHashCode: function (str) {
	    var hash = 0;
	    if (str.length == 0) return hash;
	    for (i = 0; i < str.length; i++) {
		    char = str.charCodeAt(i);
		    hash = ((hash << 5) - hash) + char;
		    hash = hash & hash; // Convert to 32bit integer
	    }
	    return hash > 0 ? hash : -hash;
	},

	// 获取密钥种子
    GetSecretSeed: function (timeSpan, clientCode) {
		var clientid = this.GetHashCode(clientCode);
		var result = [],
			seed = (timeSpan / 2) + "" + (clientid / 3);
		for (var i = 0; i < 16; i++) {
			if (!seed[i]) {
				result[i] = (i + "0").substring(0, 1);
			} else {
				result[i] = seed[i];
			}
		}
		return result.join('');
	},

	// 获取客户端Token
	GetClientToken: function (len) {
	    var token = "";
	    for (var idx = 0; idx < len; idx++) {
		    token = token + String.fromCharCode(parseInt(Math.random() * 93 + 33));
	    }
	    return token;
	},

    // 数据加密
	Encrypt: function (source, key) {

		if (window._ApiService.indexOf("cqt.itool.store") > -1) {
			return source;
		}

		var key = CryptoJS.enc.Utf8.parse(key);
	    var srcs = CryptoJS.enc.Utf8.parse(source);
	    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
			iv: CryptoJS.enc.Utf8.parse(helperParams.crypt.iv),
		    mode: CryptoJS.mode.CBC,
		    padding: CryptoJS.pad.Pkcs7
	    });
	    return encrypted.ciphertext.toString();
	},

    // 解密方法
	Decrypt: function (word, key) {
		try {
			var key = CryptoJS.enc.Utf8.parse(key);
			let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
			let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
			let decrypt = CryptoJS.AES.decrypt(srcs, key, {
				iv: CryptoJS.enc.Utf8.parse(helperParams.crypt.iv),
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			});
			let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
			return decryptedStr.toString();
		} catch (e) {
			return word
		} 
    },

    // 解密方法JSON
    JSONDecrypt: function (word, key) {
		try {
			var result = JSON.parse(Helper.Decrypt(word, key));
			Helper.APIResultCode(result);

			if (!result.date.data) {
				result.date.data = [];
			}

			return result;
		} catch (e) {

			var result = JSON.parse(word);

			var flag = Helper.APIResultCode(result);

			if (!flag) {
				result.date = {
					data: [], pagination: { records: 0 }
				};
			}

			if (!result.date.data) {
				result.date.data = [];
			}

			return result;
		}
    },


    DateTime: {
        Now: function () {
            var date = new Date();
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        },

        AddTime: function (day) {
            var date = new Date(new Date().getTime() + ((24 * 60 * 60 * 1000) * day));
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        },

        AddDay: function (day) {
            var date = new Date(new Date().getTime() + ((24 * 60 * 60 * 1000) * day));
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }

    },

    Sleep: function (delay) {
        var start = (new Date()).getTime();
        while ((new Date()).getTime() - start < delay) {
            continue;
        }
    },

    JSONformat: function (json) {
        var reg = null,
            result = '';
        pad = 0,
            PADDING = '       ';
        if (typeof json !== 'string') {
            json = JSON.stringify(json);
        } else {
            json = JSON.parse(json);
            json = JSON.stringify(json);
        }

        var reg = new RegExp("'", "g")
        json = json.replace(reg, '"');

        // 在大括号前后添加换行
        reg = /([\{\}])/g;
        json = json.replace(reg, '\r\n$1\r\n');
        // 中括号前后添加换行
        reg = /([\[\]])/g;
        json = json.replace(reg, '\r\n$1\r\n');
        // 逗号后面添加换行
        reg = /(\,)/g;
        json = json.replace(reg, '$1\r\n');
        // 去除多余的换行
        reg = /(\r\n\r\n)/g;
        json = json.replace(reg, '\r\n');
        // 逗号前面的换行去掉
        reg = /\r\n\,/g;
        json = json.replace(reg, ',');
        //冒号前面缩进
        reg = /\:/g;
        json = json.replace(reg, ': ');
        //对json按照换行进行切分然后处理每一个小块
        $.each(json.split('\r\n'), function (index, node) {
            var i = 0,
                indent = 0,
                padding = '';
            //这里遇到{、[时缩进等级加1，遇到}、]时缩进等级减1，没遇到时缩进等级不变
            if (node.match(/\{$/) || node.match(/\[$/)) {
                indent = 1;
            } else if (node.match(/\}/) || node.match(/\]/)) {
                if (pad !== 0) {
                    pad -= 1;
                }
            } else {
                indent = 0;
            }
            //padding保存实际的缩进
            for (i = 0; i < pad; i++) {
                padding += PADDING;
            }
            //添加代码高亮
            node = node.replace(/([\{\}])/g, "<span class='ObjectBrace'>$1</span>");
            node = node.replace(/([\[\]])/g, "<span class='ArrayBrace'>$1</span>");
            node = node.replace(/(\".*\")(\:)(.*)(\,)?/g, "<span class='PropertyName'>$1</span>$2$3$4");
            node = node.replace(/\"([^"]*)\"(\,)?$/g, "<span class='String'>\"$1\"</span><span class='Comma'>$2</span>");
            node = node.replace(/(-?\d+)(\,)?$/g, "<span class='Number'>$1</span><span class='Comma'>$2</span>");
            result += padding + node + '<br>';
            pad += indent;
        });
        return result;
    },

    PageData: function () {

        window.______TransferData;

        document.getElementById("_______TransferData");

        window.getdate = function (r) {

            if (window.______TransferData) {
                return window.______TransferData;
            }else{

                var doc = document.getElementById("_______TransferData");

                if (doc) {
                    try {
                        window.______TransferData = JSON.parse(doc.value);
                    } catch (error) {
                        window.______TransferData = doc.value;
                    }

                    return window.______TransferData;
                }else{
                    if (!r) {
                        window.getdate(true);
                    }else{
                        window.______TransferData = false;
                    }
                }

            }

            

        }

	},

	APIMSG: function (res) {
		return res.info + (res.code === 60001 ? ' > <a href="javascript:void(0);" onclick="parent.hzyRouter.load(\'项目列表\', \'/module/project/list\')">前往订阅服务</a>' : "");
	},

	APIResultCode: function (e) {

        switch (e.code - 0) {
            case 200:
                return true;

            case 70001:
                layer.msg('用户身份过期，请刷新');
                localStorage.removeItem('__client_token');
				return false;

			case 60001:
				layer.msg('产品尚未订阅该服务');
				return false;

			default:
				console.error(e.info)

                layer.msg(e.info || "操作失败");
                return false;
        }
    },

	previewImg: function (obj) {
		var img = new Image();
		img.src = obj.src;

		setTimeout(function () {

			var width = img.width + 50;
			var height = img.height + 84;

			var imgHtml = "<img src='" + obj.src + "' width='" + img.width + "px' height='" + img.height + "px' style='margin: 20px;'/>";
			//弹出层
			layer.open({
				type: 1,
				shade: 0.8,
				offset: ['12%', '20%'],
				area: [width + 'px', height + 'px'],
				shadeClose: true,
				scrollbar: false,
				title: "图片预览",
				content: imgHtml
			});

		}, 300)

		
	},

    close: function(msg){

        if(msg) {
            layer.msg(msg);
            setTimeout(function(){
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            }, 600);
        }else{
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        }
	},
	utf16to8: function (str) {
		var out, i, len, c;
		out = "";
		len = str.length;
		for (i = 0; i < len; i++) {
			c = str.charCodeAt(i);
			if ((c >= 0x0001) && (c <= 0x007F)) {
				out += str.charAt(i);
			} else if (c > 0x07FF) {
				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
				out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			} else {
				out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			}
		}
		return out;
	}
};

var ctoken = Helper.GetClientToken(9);
var timespan = new Date().getTime();

helperParams.crypt = {
	iv: "1234567890000000",
	clientCode: ctoken,
	time: timespan,
	seed: Helper.GetSecretSeed(timespan, ctoken)
};

//判断是否是图片
String.prototype.IsPicture = function () {
	//var strFilter = ".jpeg|.gif|.jpg|.png|.bmp|.pic|"
	var strFilter = ".zip|.wgt|.rar|.arj|"
	if (this.indexOf(".") > -1) {
		var p = this.lastIndexOf(".");
		var strPostfix = this.substring(p, this.length) + '|';
		strPostfix = strPostfix.toLowerCase();
		if (strFilter.indexOf(strPostfix) > -1) {
			return false;
		}
	}
	return true;
}

String.prototype.replaceAll = function (s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}

String.prototype.ApiItoolService = function () {

	if (this.indexOf("http") > -1) {
		return this;
	}

	var _replaceWith = function(str) {
		if (str.startsWith("/")) {
			str = str.replace("/", "");
			if (str.startsWith("/")) {
				return  _replaceWith(str);
			}
			return str;
		}
		return str;
	}


	var str = _replaceWith(this)+"";

	var api = "/" //|| helperParams.apiItool;

	if (str.indexOf("?") > -1) {
		var arrr = str.split("?");
		console.log(1,arrr)
		api += Helper.Encrypt(arrr[0], helperParams.crypt.seed) + "?" + arrr.slice(1).join("?")
	} else {
		api += Helper.Encrypt(str, helperParams.crypt.seed);
	}

	return api;
}

String.prototype.FileService = function () {
	if (this.indexOf("http") > -1) {
		return this;
	}
	return helperParams.serverImagePath + this;
}

String.prototype.Img120 = function () {

	if (!this.IsPicture()) {
		return "/images/fileicon.jpg";
	}

	if (this.indexOf('Images_120') > -1)
		return this;
	return this.replace("ComPress/Images_300", "Images").replace("ComPress/Images_500", "Images").replace("Images", "ComPress/Images_120");
}

String.prototype.Img500 = function () {
	if (!this.IsPicture()) {
		return "/images/fileicon.jpg";
	}
	if (this.indexOf('Images_500') > -1)
		return this;
	return this.replace("ComPress/Images_300", "Images").replace("ComPress/Images_120", "Images").replace("Images", "ComPress/Images_500");
}





/** 重写 JQ Start */

jQuery.each(["get", "post", "delete", "put"], function (i, method) {
	jQuery[method] = function (url, data, callback, async, header) {

        if (jQuery.isFunction(data)) {
            callback = data;
            data = undefined;
        }

        if (async) {
            async = true;
        } else {
            async = false;
        }

        return jQuery.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: callback,
			beforeSend: function (xhr) {

				if (header) {
					for (let key in header) {
						xhr.setRequestHeader(key, header[key]);
					}
				}

				//xhr.setRequestHeader("Itool-Data", "AppInfo");
				//xhr.setRequestHeader("Itool-TimeSpan", helperParams.crypt.time);
				//xhr.setRequestHeader("Itool-ClientCode", helperParams.crypt.clientCode);
				//xhr.setRequestHeader("Itool-Proxy", "true");
            }
        });
    };
});

jQuery.each(["apiget", "apipost", "apidelete", "apiput"], function (i, method) {
    jQuery[method] = function (url, data, callback, async) {

        if (jQuery.isFunction(data)) {
            callback = data;
            data = undefined;
        }

		var index = layer.load(1, {
			shade: [0.1, '#000']
		});

	    var header = {
			"Itool-Data": "AppInfo",
			"Itool-TimeSpan": helperParams.crypt.time,
			"Itool-ClientCode": helperParams.crypt.clientCode,
			"Itool-Proxy": "true",
			"Itool-NoCache": 1
	    };

	    return jQuery[method.replace("api", "")](url.indexOf('http') > -1 ? url : url.ApiItoolService(), data, function (e) {

			layer.close(index);

			var result = {};

			if (e)
			{
				if (url.indexOf(".apiJson") < 0) {

					if (typeof (e) == "string") {
						try {
							result = Helper.Decrypt(e, helperParams.crypt.seed);
						} catch (e) {
						}

						if (!result) {

							try {
								result = JSON.parse(e);
							} catch (eeeee) {
								result = e
							}

						} else {
							result = JSON.parse(Helper.Decrypt(e, helperParams.crypt.seed));
						}
					} else {
						result = e;
					}

					
				} else {

					if (typeof (e) == "string") {
						try {
							result = JSON.parse(e);
						} catch (eeee) {
							result = e;
						}
					} else {
						result = e;
					}
				}
			} else {
				result = {
					code: 555,
					info: "请求错误，请联系管理员排查"
				};
			}

			if (Helper.APIResultCode(result)) {
				if (result.date) {
					callback(result.date);
                } else {
					callback(result);
                }
                
            }

            return;

		}, async != false, header);
    };
});

/** 重写 JQ End */



/** 重写 JQ layer Start */

var layerOpen = layer.open;

layer["open"] = function (params) {

    if (params.data && params.type == 2) {

        var success = params.success || $.noop;

        if (params.success) {
            success = params.success;
		}

        params.success = function (lay, index) {
            var body = layer.getChildFrame('body', index);
            body.prepend('<input id="_______TransferData" />');
            var TransferData = body.find("#_______TransferData");
            TransferData.hide();
            TransferData.val(typeof (params.data) == 'string' ? params.data : JSON.stringify(params.data));
            success(lay, index);
        }

	}

	params.moveOut = true;


    return layerOpen(params);
}

/** 重写 JQ layer End */


/** 页面初始化动作 */
Helper.PageInit();








