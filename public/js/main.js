var useObj;
var totalAmount = "";// 售卖进度首页数据
var random;
var nameGroup = {
    wrap: $('.g-container'), // 外层
    header: $('.g-header'), // 顶部
    main: $('.g-content'), // 主体内容
    particular: 'particular', // 单行数据独立显示模块
    nav: 'u-navList', // 导航条
    navSwitch: 'toggle'            // 导航开关
};
$("#fuser").html($.cookie("fuser"));

//
var p = {
	// 每个页面的初始参数
	"details":function(parames){
		var a = parames.align 				|| false, 	// text值对齐方式
			b = parames.boole 				|| false,	// boolean 转中文
			c = parames.className 			|| false,	// 资产售卖进度 => 外层表资产编号可点击
			d = parames.Date 				|| false,	// 日期格式转义
			e = parames.assets 				|| false,	// 指定字段添加类名
			f = parames.twoLevelTab 		|| false,	// 二级小表参数
			g = parames.sellingProgress 	|| false,	// 资产售卖进度外层大表使用参数
			h = parames.thousandSeparator 	|| false,	// 千位分隔并保留小数位 ：2 || 3
			r = parames.rate 				|| false,	// 费率计算  （newVal = 当前值*100）
			k = parames.keyword 			|| false,	// 去掉特殊字符
			s = parames.status 				|| false,	// 资产售卖时间查询使用参数
			n = parames.privateFormattingConditions || false;// 私有字段格式化逻辑
		// 发送请求
		var details = {
			"wrap"				: parames.wrap,
			"url"				: parames.url,   
			"arr"				: parames.arr,
			"sellingProgress"	: g,	
			"status"			: s,	
			"twoLevelTab"		: f, 	
			"keyword"			: k,	
			"rate"				: r,	
			"Date"				: d,	
			"boole"				: b,	
			"thousandSeparator"	: h,	 
			"assets"			: e,	
			"align"				: a,	
			"privateFormattingConditions" : n  
		};
		return parames;
	},
	// 储蓄当前页面最新一次的请求（请求参数 , 返回数据）
	"database":{
		"flexTab-m-flex":{ // 资产售卖进度
			"requiredParameter":false,
			"data":"",
			"initialData":""
		},
		"basic-m-flex":{ // 资产基础信息
			"requiredParameter":false,
			"data":""
		},
		"makeLoans-m-flex":{ // 放款统计
			"requiredParameter":false,
			"data":""
		},
		"laterPeriodCosts-m-flex":{// 资产后期费用
			"requiredParameter":false,
			"data":""
		},
		"collectData-m-flex":{// 资产募集数据
			"requiredParameter":false,
			"data":""
		},
		"proBasicInfo-m-flex":{//产品基础信息
			"requiredParameter":false,
			"data":""
		}
	},
	// url数据请求路径
	"dataUrl":{
	    "flexTab":{
	        outerTable:"http://ds.idc.xiwanglife.com/dataservice/getconfig.do?id=63",  	//资产售卖进度外层大表
	        innerTable:"http://ds.idc.xiwanglife.com/dataservice/getconfig.do?id=64&assets_id=",   //资产售卖进度二级表
	        queryTable:"http://ds.idc.xiwanglife.com/dataservice/getconfig.do?id=88",    //资产售卖进度 = >募集开始时间||售卖开始时间
	        SellingTimeTwoLevelTab:'http://ds.idc.xiwanglife.com/dataservice/getconfig.do?id=89&start_time='// 资产售卖进度 -- 按产品 的二级表
	    },
	    "proBasicInfo":{
	        outerTable:"http://ds.idc.xiwanglife.com/dataservice/getconfig.do?id=198",  //产品基础信息表
	        queryTable:"http://ds.idc.xiwanglife.com/dataservice/getconfig.do?id=199"   //产品基础信息按资产编号查询表
	    },
	    "raise"				: "http://ds.idc.xiwanglife.com/dataservice/getconfig.do?id=191",	//资产募集数据表
	    "anaphaseExpense"	: "http://ds.idc.xiwanglife.com/dataservice/getconfig.do?id=95",	//资产后期费用表
	    "basic"				: "http://ds.idc.xiwanglife.com/dataservice/getconfig.do?id=67",	//资产基础信息表
	    "makeLoans"			: "http://ds.idc.xiwanglife.com/dataservice/getconfig.do?id=182"    //放款统计表
	},
	// 查询 按钮   & 导出 按钮
	"navModule":{
		queryDemo : '<a href="javascript:;" class="flexTab-change">查询</a>',
		auditDemo : '<a href="javascript:;" class="flexTab-change">查询</a>'+
			'<a href="javascript:;" style="font-size:12px;" data-needMethodIndex="needMethodIndexVal" class="pre-copy" id="pre-copy21"onclick="method1(randomTa,true)">审计导出</a>'
	},
	// loading 动画模块
	loadingModule:function(){
		var html = '<article id="loading">'
			        +'<div class="loader">'
			        +'<section>'
			        +'<span></span>'
			        +'<span></span>'
			        +'<span></span>'
			        +'<span></span>'
			        +'<span></span>'
			        +'<span></span>'
			        +'<span></span>'
			        +'<span></span>'
			        +'<span></span>'
			        +'</section>'
			        +'</div>'
		        +'</article>';
        return html;
	},
	// 创建 tab 父辈框架节点
	tabModule:function (count) {
	    var html     = "",
	        flexbox  = "",
	        copyNode = "",
	        tbody    = "";
	    if(Number(count) > 1){
	        copyNode = '<a href="javascript:;" class="pre-copy" id="pre-copy2"onclick="javascript:method1(randomTa)">导出</a>';
	        tbody = '<table border="1" cellspacing="0" cellpadding="0" id="randomTa"><tbody></tbody></table>';
	    }else{
	        copyNode ='<a href="javascript:;" class="pre-copy" id="pre-copy' + count + '"onclick="javascript:method1(ta)">导出</a>';
	        tbody = '<table border="1" cellspacing="0" cellpadding="0" id="ta"><tbody></tbody></table>';
	    }
	    html = '<div class="relative">'
	        + '<p class="flexTab-u-nav">'
	        + copyNode
	        + '</p>'
	        + '<a href="javascript:;" class="flexTab-unfold"><i class="Auto unfold">展开</i></a>'
	        + '<section class="flexTab-u-tab u-tab"><div>'
	        + '<div class="head-tab">'
	        + '<table><tbody></tbody></table>'
	        + '</div>'
	        + '<div class="body-tab">'
	        + tbody
	        + '</div></div>'
	        + '</section>'
	        + '</div>';
	    if(Number(count) > 1){
	        flexbox = '<article class="flexTab-u-flex random" id="' + count + '">'+ html +'</article>';
	    }else{
	        flexbox = $('<article class="flexTab-u-flex" id="flexTab-u-flex' + count + '">'+ html +'</article>');
	    }
	    return flexbox;
	},
	// 前一周时间
	lastWeekTime:function(current,getHours){ 
		var lastWeekTime = {};
		var myDate= new Date(),
		 	date  = !current ? new Date(myDate.getTime() - 7 * 24 * 3600 * 1000) : myDate;
		 	month = (date.getMonth()+1) < 10 ? '0'+(date.getMonth()+1) : (date.getMonth()+1),
		 	myDay = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
		 	
		lastWeekTime.start = !getHours? myDate.getFullYear() +'-'+ month +'-'+ myDay :myDate.getFullYear() +'-'+ month +'-'+ myDay+' '+myDate.getHours();
		lastWeekTime.end = "" + myDate.getFullYear() + "-";
	   	lastWeekTime.end += (myDate.getMonth()+1) > 9? (myDate.getMonth()+1) + "-" : '0'+(myDate.getMonth()+1) + "-";
	   	lastWeekTime.end += myDate.getDate() > 9? myDate.getDate() : '0'+myDate.getDate();
	   	return lastWeekTime;
	},
	// content 高度
	resize:function () {
	    var hg = nameGroup.wrap.height() - nameGroup.header.height();
	    nameGroup.main.css('height', hg);
	},
	// 页面切换请求
	pageSwitching:function (ID) {
		this.bottomStatusBarInformation();
	    $(".navs li a[data-page="+ID+"]").css("background","#336699").parent().siblings().children().css("background","");
	    $("#formName").attr("tableName",$(".navs li a[data-page="+ID+"]").text());
	    var URL = String(document.location).split('#')[0];
	    $.ajax({
	        type: "get",
	        url: "pages/" + ID,
	        async: true,
	        success: function (text) {
	            nameGroup.main.empty();
	            nameGroup.main.html(text);
	            document.location = URL + '#' + ID;
	        }
	    });
	},
	// 页面切换后改变数据操作
	currentPageDataChangeLogic:function(parames){
		parames.wrap.append(this.loadingModule());// 加载loading动画
		//  database中存在 当前页面要请求数据的条件相同？  使用database中的数据
		if(!parames.twoLevelTab && p.database[parames.wrap.attr('id')].requiredParameter && p.database[parames.wrap.attr('id')].requiredParameter.indexOf( parames.url ) > -1){
			parames.dataSet = p.database[parames.wrap.attr('id')].data;
			parames.repeatedLoading = true; 
			// 清空已存在的数据
			parames.wrap.children(':first').children(':first').find('tr,colgroup').remove();
			this.dataFormatting(parames);
		}else{ // database中不存在？ 发送请求！
			parames.repeatedLoading = false;
			this.ajaxReq(parames);
		};
	},
	// Ajax请求
	ajaxReq:function(parames){
		var self = this;
		$.ajax({
	        type: "post",
	        url: parames.url,
	        async: true,
	        dataType: 'text',
	        timeout: 1000 * 60*50,
	        success: function(data) {
	        	if(!data)return;
	            // formatting data
	            data = data.replace(/null/g, '""').replace(/N\/A/g, " ").replace(/NA/g, " ");
	             // 1. 过滤掉特殊字符
			    if(parames.keyword){
			    	for(var i = 0; i < parames.keyword.length; i++){
			    		var a = parames.keyword[i];
			    		data = data.replace(new RegExp(a,'g'),"");
			    	}
			    };
	            data = JSON.parse(data);
	            // Object.getOwnPropertyNames( 返回对象自己的属性的名称。)
	            var details = data.details[Object.getOwnPropertyNames(data.details)].values;
	            if(details == "" || !details){return alert('暂时没有数据！');};
	            
	            // 将当前数据 & 请求条件暂存到 database 中,以便下次重复使用
	            if(!parames.twoLevelTab){// 首页二级小表不记录数据
	            	p.database[parames.wrap.attr('id')].data = details;
	            	p.database[parames.wrap.attr('id')].requiredParameter = parames.url;
	            }
	            //数据返回时当前页面已经切换？
	            if(parames.wrap.is(':hidden')){return console.log("页面已切换,数据暂存。");}
            	parames.dataSet = details;
	            self.dataFormatting(parames);
	        },
	        complete: function () {
	            $('#loading').remove();
	        }
	    });
	},
	// 格式化数据
	dataFormatting:function(parames){
		var $this 		= parames.wrap.children(':first').children(':first'), 	// 当前页面外层 <article>盒子
    	arr 		= parames.arr,					// 当前页面对应数据字段名（数据展示顺序按照字段名来排列）
    	data		= parames.dataSet,					// ajax返回的数据
        sp 			= parames.sellingProgress,			// 资产售卖进度 （区分当前是： 售卖进度外层大表，默认页）
        sta   		= parames.status,					// 资产售卖进度 （区分当前是： 售卖时间查询）
        laterName 	= parames.laterName,				// 资产后期费用 （区分当前是： 募集日查询）
        $thead 		= $this.find('.head-tab').children(),//当前页面  headTable 模块
        $tbody 		= $this.find('.body-tab').children(),//当前页面  bodyTable 模块
        colgroupHtml= "",								// <colgroup> 标签,平等划分table
        $theadTr 	= $('<tr></tr>'),					// tr
        amount 		= 0,								// 底层资产投资金额合计值（放款统计页）
        profit 		= 0,								// 底层资产投资收益合计值（放款统计页）
        count 		= 0,								// 序列号
        self 		= this;								// => p
	    // 售卖进度首页数据备份，用于售卖开始时间查询后的筛选
	    if(!parames.twoLevelTab && !sta){
	    	self.database.initialData = data; 
	    };
	    
	    // 遍历数据
	    for(var i = 0; i < data.length; i++){
	    	var tbodyTr = '<tr>';
	    	count++;
	    	// each thead,The tbody content and thead consistent sequence
	    	for(var j = 0; j < arr.length; j++){
	    		var f  = arr[j].field; 	// 与请求到数据对应的字段名
	    		var td = "<td"; 			// <td> 
	    		var newValue 	= null;
	    		var CV	= String(f ? (data[i][f] || "") : ""); // 当前数值
	            // <col> & <th> 标签只在第一组数据循环时创建 
	            if (i == 0) {
	                // 过滤字段名中特殊字符, "data-field" 属性用于根据字段名导出时的筛选工作
	                var data_title = arr[j].title;
	    			if(arr[j].title.indexOf('（') > 0){
	    				data_title = arr[j].title.substring(0,arr[j].title.indexOf('（'));
		           	};
	            	var th = '<th data-field = "'+ data_title +'">' + arr[j].title + '</th>';
	                $theadTr.append(th);
	            };
	            
	            // 序列号（当前字段是空值，所以要最先执行。不然会被后面判断长度处理掉）
	            if (f == 'loan_id') {
	                CV = count;
	            }
	            // 合计运算放在“千位分隔符”之前
	            // 投资收益合计;
	            if (f == '底层资产投资收益') {
	                profit += Number(CV);
	            }
	            // 投资金额合计
	            if (f == '底层资产投资金额') {
	                amount += Number(CV);
	            }
	            // 2. 其他固定的特殊计算 (可能计算过后还需要处理当前值的格式，所以优先执行)
	            if(parames.privateFormattingConditions){
	            	for(var n = 0;n < parames.privateFormattingConditions.arr.length; n++){
	            		if(parames.privateFormattingConditions.arr[n] == f){
	            			CV = parames.privateFormattingConditions.fn(data[i] , f); // 传入当前整条数据 & key
	            			CV = CV == 0? '0.00':CV; 
	            			break;
	            		}
	            	}
	            };
	            // 5. 日期格式处理
        		if(parames.Date){
        			for(var n = 0; n < parames.Date.length; n++){
        				// 存在对应的字段名，格式化当前值 CV
        				if(parames.Date[n] == f){
        					if(CV.indexOf('-') < 0){
        						CV = Number(CV);
        					}
        					var time = "";
		            		var newTime = new Date(CV);
		            		// 不是一个完整的日期？ 那就只取月份
		            		if(CV.length < 10){
		                		time =  (newTime.getMonth()+1) > 9? (newTime.getMonth()+1) : '0'+(newTime.getMonth()+1);
		            		}else{
		            			time 	= "" + newTime.getFullYear() + "-";
		                		time 	+= (newTime.getMonth()+1) > 9? (newTime.getMonth()+1) + "-" : '0'+(newTime.getMonth()+1) + "-";
		                		time 	+= newTime.getDate() >  9? newTime.getDate() : '0'+newTime.getDate();
		            		}
        					CV = time;
        					break;
        				}
        			}
	            };
	            // 当前值可转为数值型，并且大于0
	            if(!isNaN(Number(CV))){
	            	// 4. 费率格式处理
		            if(parames.rate && CV != 0){
	        			for(var n = 0; n < parames.rate.length; n++){
	        				// 存在对应的字段名，格式化当前值 CV
	        				if(parames.rate[n] == f){
	        					CV = (parseFloat(CV)*100).toFixed(3);
	        					break;
	        				}
	        			}
		            };
		           
	            	// 3. 千位分隔符处理 （当前值必须可以转为数值型）
		            if(parames.thousandSeparator && CV.length > 1){
		            	// 保留两位的分割
		            	if(parames.thousandSeparator.two){
		        			for(var n = 0; n < parames.thousandSeparator.two.length; n++){
		        				// 存在对应的字段名，格式化当前值 CV
		        				if(parames.thousandSeparator.two[n] == f){
		        					CV = thousandSeparator(CV,2);
		        					break;
		        				}
		        			}
		            	};
		            	if(parames.thousandSeparator.three){
		        		// 保留三位的分割
		        			for(var n = 0; n < parames.thousandSeparator.three.length; n++){
		        				// 存在对应的字段名，格式化当前值 CV
		        				if(parames.thousandSeparator.three[n] == f){
		        					CV = thousandSeparator(CV,3);
		        					break;
		        				}
		        			}
		            	};
		            };
		            
	            }else
	            // 过滤空值
	        	if(CV && CV.replace(/\ +/g,"").length > 0){
	        		// 6. boolean值转中文
	        		if(parames.boole){
	        			for(var n = 0; n < parames.boole.length; n++){
	        				// 存在对应的字段名，格式化当前值 CV
	        				if(parames.boole[n] == f){
	        					CV = CV? '是' : '否';
	        					break;
	        				}
	        			}
	        		}
	        	}else{
	        		CV = "";
	        	};
	            // 7. td 资产编号 个别页面特殊定义  assets={arr:[’资产编号‘]，className:'pointer flexTab-create-sell'}
	            if(parames.assets){
	            	for(var n = 0; n < parames.assets.arr.length; n++){
	            		if(parames.assets.arr[n] == f){
	            			td += ' class="'+ parames.assets.className +'"';
	            			break;
	            		}
	            	}
	            }
	            
	            // 8. td 样式设置  text-align
	            if(parames.align){
	            	//左对齐
	            	if(parames.align.left){
	            		for(var n = 0; n < parames.align.left.length; n++){
		            		if(parames.align.left[n] == f){
		            			td += ' align="left"';
		            			break;
		            		}
		            	}
	            	}
	            	if(parames.align.right){
	            	// 右对齐
		            	for(var n = 0; n < parames.align.right.length; n++){
		            		if(parames.align.right[n] == f){
		            			td += ' align="right"';
		            			break;
		            		}
		            	}
	            	}
	            };
	            
	            if(CV == 'undefined')CV = "";
	            td += '>'+CV+'</td>';
	            tbodyTr += td;
	    	}
	    	tbodyTr += '</tr>';
			$tbody.children('tbody').append(tbodyTr);
	    };
	        
	    // 因为对象只有一个，只能加载到一个对象里。所以这里需要完全克隆一个新的对象。
	    var th = $theadTr.clone();
	    $thead.children('tbody').append($theadTr);
	    $tbody.find('tbody').before(th);
		// 放款统计 => 底部合计信息
	    if ($('.flexTab-u-flex').parent().attr('id') == 'makeLoans-m-flex') {
	        // 投资金额合计
	        makeLoans.total.amount = (amount/2);
	        // 投资收益合计
	        makeLoans.total.profit = (profit/2);
	        makeLoans.wrap.append(makeLoans.footer(makeLoans.total));
	        makeLoans.merge($tbody);
	    };
	    this.bottomStatusBarInformation({
	    	'show':true,
	    	'size':data.length,
	    	'TypeHidden':laterName
	    });
	    // tab style
	    this.steTableSize(parames.wrap);
	    // 当前页面是否重复加载？
	    if(parames.repeatedLoading){
			setTimeout(function(){ // 定时器是为了保证loading会存在一段时间
				$('#loading').remove();
			},500);
	    };
	    
	    //  回到顶部按钮
	     goTop();
	},
	// 底部状态栏信息
	bottomStatusBarInformation:function(statusBarParames){
		var $statusBar = $('#data-item');
		
		// 底部状态栏 => 显示 or 隐藏。
		if(!statusBarParames){
			// 状态栏不显示？退出方法
			$statusBar.hide();
			return;
		}else{
			$statusBar.show().children().show();
		};
	    // 资产后期费用 => 底部状态栏信息改变
	    if($('.flexTab-u-flex').parent().attr('id') == 'laterPeriodCosts-m-flex'){
	    	$statusBar.children('.bsb-dataType').html('最近七天数据');
	    }else{
	    	$statusBar.children('.bsb-dataType').html('全量数据');
	    };
	    // 状态显示信息改变
	    if(statusBarParames.status){
	    	$statusBar.children('.bsb-status').html(statusBarParames.status);
	    };
	    // 数据量改变
	    if(statusBarParames.size){
	    	$statusBar.children('.bsb-dataSize').html(statusBarParames.size);
	    };
	    // 数据类型不显示
	    if(statusBarParames.TypeHidden){
	    	$statusBar.children('.bsb-unit').nextAll().hide();
	    };
	    // 当前数据量弹窗提示！
	    if(statusBarParames.tipVisible){
	    	$('#currentDataVolumePrompt').text('符合当前条件数据 共 '+statusBarParames.size+' 条').show();
	    	// 只显示 1sec
	        setTimeout(function () {
	            $('#currentDataVolumePrompt').hide();
	        }, 1000);
	    };
	    
	},
	// 表格尺寸设置
	steTableSize:function(dom){
		// dom  当前显示页面外层盒子
		var $tbodyBox 	= dom.find('.body-tab'), // 内容table的父级盒子
			$tbodyWidth = $tbodyBox.children('table').outerWidth();
		$tbodyBox.css('width',$tbodyWidth+20); // +18 是为了隐藏 内容区table父级的滚动条
		$tbodyBox.prev('.head-tab').css('width', $tbodyWidth); // 表头table父级不存在滚动条
		$tbodyBox.parent().css({'overflow-y': 'hidden','overflow-x': 'scroll'});
		// 获取第一行每一个td的宽度，将其赋给对应th。使其宽度一致
		$tbodyBox.find('th').each(function(){
			var index = $(this).index(),
				width = $(this).outerWidth();
			$tbodyBox.prev().find('th').eq(index).css({'min-width':width+'px','max-width':width+'px'});
		})
	},
	// 页面重载
	ready:function () {
	    var url = String(document.location).split('#')[1];
	    if (!url || url.length < 0 || url == undefined) {
	        p.pageSwitching('flexTab');
	    } else {
	        p.pageSwitching(url);
	    };
	},
	// 双击某一行，独立显示
	aloneItmeShow:function(){
	    $(document).dblclick(function (event) {
	
	        if ($(event.target).parents('#flex2').length < 1) {   //没有小表的页面
	            var th = $(event.target).parents('.body-tab').prev().find('tr').clone();
	            $('.' + nameGroup.particular).find('table').append(th);
	            if (event.target.nodeName.toLowerCase() != 'td')
	                return;
	            var size = $(event.target).parents('.body-tab').prev().find('th').length;
	            // 解决合并之后 td 列错位
	            if ($(event.target).parent().children('td:last').prev().attr('rowspan') == undefined && $(event.target).parent().children().length < size) {
	                var $this = undefined;
	                var td = $(event.target).parent().children();
	                var $thisSize = $(event.target).parent().prev('.rows').children('td').length;
	                var tr = $('<tr></tr>');
	                var index = $(event.target).parent().index();  //大表tbody里每行tr的index
	                for (var n = index; n >= 0; n--) {
	                    if ($(event.target).parents('table').find('tr').eq(n).children().length == size && $this == undefined) {
	                        $this = $(event.target).parents('table').find('tr').eq(n);
	                    }
	                }
	                // td 是当前点击对象父级TR的所有子级的集合;
	                for (var i = 0; i < td.length; i++) {
	                    if (i == 0) {// 当前下标对象为 “序号”
	                        tr.append($(td).eq(i).clone());
	                        tr.append($this.children().eq(i+1).clone()); // 第一个合并列 “项目名称”;
	                        tr.append($this.children().eq(i+2).clone());// 第二个合并列 “融资主体”
	                        tr.append($this.children().eq(i+3).clone());// 第三个合并列 “资产规模”
	                        tr.append($this.children().eq(i+4).clone());// 第四个合并列 “资产编号”
	                    }else if(i == 1){// 当前下标对象为 “底层资产投资金额”
	                        tr.append($(td).eq(i).clone());             // “底层资产投资金额”
	                        tr.append($this.children().eq(6).clone());  // 第五个合并列 “投资金额合计”
	                    }
	                    else if(i == 7){// 当前下标对象为 “底层资产投资收益”
	                        tr.append($(td).eq(i).clone());             // “底层资产投资收益”
	                        tr.append($this.children().eq(13).clone()); // 第六个合并列 “资产投资收益合计”
	                    }else if(i == 21){   // 当前下标对象为 “通道费和委贷行手续费小计”
	                        tr.append($(td).eq(i).clone());             // “通道费和委贷行手续费小计”
	                        tr.append($this.children().eq(28).clone()); // 第七个合并列 “资产通道费和委贷行手续费合计”
	                    }else if (i == 22){ // 当前下标对象为 “财顾费用”
	                        tr.append($(td).eq(i).clone());             // “财顾费用”
	                        tr.append($this.children().eq(30).clone()); // 第八个合并列 “财顾费小计”
	                        tr.append($this.children().eq(31).clone()); // 第九个合并列 “未放款金额”
	                    } else {
	                        tr.append($(td).eq(i).clone());
	                    }
	                }
	                $('.' + nameGroup.particular).find('table').append(tr);
	            } else {
	                var td = $(event.target).parent().clone();
	                $('.' + nameGroup.particular).find('table').append(td);
	            }
	        } else {     //有小表的页面
	            var th = $(event.target).parents('#flex2').find('.body-tab').prev().find('tr').clone();
	            $('.' + nameGroup.particular).find('table').append(th);
	            if (event.target.nodeName.toLowerCase() != 'td')
	                return;
	            var size = $(event.target).parents('#flex2').find('.body-tab').prev().find('th').length;
	            // 解决合并之后 td 列错位
	            if ($(event.target).parent().children('td:last').prev().attr('rowspan') == undefined && $(event.target).parent().children().length < size) {
	                var $this = undefined;
	                var td = $(event.target).parent().children();
	                var $thisSize = $(event.target).parent().prev('.rows').children('td').length;
	                var tr = $('<tr></tr>');
	                var index = $(event.target).parent().index();
	                for (var n = index; n >= 0; n--) {
	                    if ($(event.target).parent().parent('table').find('tr').eq(n).children().length == size && $this == undefined) {
	                        $this = $(event.target).parent().parent('table').find('tr').eq(n);
	                    }
	                }
	
	                // td 是当前点击对象父级TR的所有子级的集合;
	                for (var i = 0; i < td.length; i++) {
	                    if (i == 0) {// 当前下标对象为 “序号”
	                        tr.append($(td).eq(i).clone());
	                        tr.append($this.children().eq(i+1).clone()); // 第一个合并列 “项目名称”;
	                        tr.append($this.children().eq(i+2).clone());// 第二个合并列 “融资主体”
	                        tr.append($this.children().eq(i+3).clone());// 第三个合并列 “资产规模”
	                        tr.append($this.children().eq(i+4).clone());// 第四个合并列 “资产编号”
	                    }else if(i == 1){// 当前下标对象为 “底层资产投资金额”
	                        tr.append($(td).eq(i).clone());             // “底层资产投资金额”
	                        tr.append($this.children().eq(6).clone());  // 第五个合并列 “投资金额合计”
	                    }
	                    else if(i == 7){// 当前下标对象为 “底层资产投资收益”
	                        tr.append($(td).eq(i).clone());             // “底层资产投资收益”
	                        tr.append($this.children().eq(13).clone()); // 第六个合并列 “资产投资收益合计”
	                    }else if(i == 21){   // 当前下标对象为 “通道费和委贷行手续费小计”
	                        tr.append($(td).eq(i).clone());             // “通道费和委贷行手续费小计”
	                        tr.append($this.children().eq(28).clone()); // 第七个合并列 “资产通道费和委贷行手续费合计”
	                    }else if (i == 22){ // 当前下标对象为 “财顾费用”
	                        tr.append($(td).eq(i).clone());             // “财顾费用”
	                        tr.append($this.children().eq(30).clone()); // 第八个合并列 “财顾费小计”
	                        tr.append($this.children().eq(31).clone()); // 第九个合并列 “未放款金额”
	                    } else {
	                        tr.append($(td).eq(i).clone());
	                    }
	                }
	                $('.' + nameGroup.particular).find('table').append(tr);
	            } else {
	                var td = $(event.target).parent().clone();
	                $('.' + nameGroup.particular).find('table').append(td);
	            }
	        }
	
	        $('.' + nameGroup.particular).show();
	
	        var th=$('.' + nameGroup.particular).find('table').find("th");
	        var td=$('.' + nameGroup.particular).find('table').find("td");
	        for(var i = 0;i < th.length; i++){
	            var tr=$("<tr></tr>").append($(th[i]).attr('rowspan',"0")).append($(td[i]).attr('rowspan',"0"));
	            $('.' + nameGroup.particular).find('table').append(tr);
	        }
	    })
	}
}

//=======================================================================================
$(function(){
	p.resize();
	p.aloneItmeShow();
    $.getScript("js/calendar.js");
    $('.queryDate').on('focus',function(){
        createDate($(this));
    })
})

$(window).resize(function(){
	p.resize()
	p.steTableSize($('.m-flex:visible'));
})
$(window).ready(function () {
    p.ready();
	//对选择的选项加背景颜色
    $(".navBox>.navs li a").click(function(){
        $(this).css("background","#336699").parent().siblings().children().css("background","");
    })

});

// 回车键
$(document).keypress(function (event) {
    // 回车键事件 
    if (event.which == 13) {
        $('.submit').trigger('click')
    }
});
// 退出清除cookie
function exit() {
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = 'pp' + "=" + null + "; expires=" + date.toGMTString();
    document.cookie = 'user' + "=" + null + "; expires=" + date.toGMTString();
    document.cookie = 'userName' + "=a; expires=" + date.toGMTString();
    location.href='/login';
}

//   Date 插件   start
function createDate(event) {
    $("<div id='da'></div>").calendar({
        trigger: $(event),
        zIndex: 999,
        format: 'yyyy-mm-dd'
    }).appendTo($("body"));
}
// 售卖进度 =》 售卖时间页 =》 募集运算
function collect(total,has,name){
    for(x in total){
        if(total[x].assets_no == has){
            return total[x][name];
        }
    }
}
// 数值千位分隔符
function thousandSeparator (numeric,size){
	numeric = parseFloat(numeric).toFixed(size);
	var str = numeric.split('.')[1];
	var l = str.length;
	
	if(size > 2){
		if(numeric.indexOf('.000') > -1){
			l = false;
		};
		if(str.charAt(2) == '0'){
			l --;
		}
		if(str.charAt(1) == '0' && str.charAt(2) == '0'){
			l --;
		}
		// 小数点后数字补全
		switch(l){
			case 1:
				numeric = parseFloat(numeric).toLocaleString()+'00';
				break;
			case 2:
				numeric = parseFloat(numeric).toLocaleString()+'0';
				break;
			case 3:
				numeric = parseFloat(numeric).toLocaleString();
				break;
			default:
				numeric = parseFloat(numeric).toLocaleString()+'.000';
		};
	}else{
		if(numeric.indexOf('.00') > -1){
			l = false;
		};
		if(str.charAt(1) == '0'){
			l --;
		}
		// 小数点后数字补全
		switch(l){
			case 1:
				numeric = parseFloat(numeric).toLocaleString()+'0';
				break;
			case 2:
				numeric = parseFloat(numeric).toLocaleString();
				break;
			default:
				numeric = parseFloat(numeric).toLocaleString()+'.00';
		};
	}
	return numeric;
}
// 保留三位小数
function threeDecimalPlaces(numeric){
	return parseFloat(numeric).toFixed(3)
}
function goTop(){
	$('.m-flex:visible').find('.body-tab').scroll(function(){
		if($(this).scrollTop() > 600){
			var self = $(this);
			$('#goTop').show().click(function(){
				self.stop().animate({
					"scrollTop":0
				},200);
			})
			
		}else{
			$('#goTop').hide();
		}
	})
}
