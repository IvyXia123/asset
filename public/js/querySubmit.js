// Search bar state
function searchBarState(event){
	// query Button
	var $queryButton = $(event); 
	var $queryBox = $('#date-query');
	var $Form = $queryBox.children();
	// 当前显示页面的ID
	var pageName = $queryButton.parents('.m-flex').attr('id');
	// 显示搜索框
    if ($queryButton.hasClass('flexTab-change')) {
        $queryButton.parent().css('line-height', '70px');
        $queryBox.show();
        $Form.children().show();
	 	$Form.children().show();
        $Form.children('.u-datails').eq(1).find('.datails').children('input').attr('placeholder', '请输入成立日期');
        $Form.children(':first').find('.datails').children('input:eq(0)').attr('placeholder', '请输入查询信息');
        $Form.children(':first').find('h6').html('<i style="margin-right:2px">*</i>此项为模糊搜索');
        // 不同页面显示不同搜索
        switch(pageName){
        	// 资产基础信息
        	case 'basic-m-flex':
        		$Form.children(':not(:first)').hide();
        		break;
        	// 放款统计	
        	case 'makeLoans-m-flex':
        		$Form.children(':not(:first)').hide();
	        	$Form.children('hr:first').show();
	        	$Form.children('.u-datails').eq(2).show().find('input').attr('placeholder', '请输入资产放款日');
        		break;
    		// 资产后期费用
        	case 'laterPeriodCosts-m-flex':
	        	$Form.children(':nth-child(1n+3)').hide();
	            $Form.children(':nth-child(5n)').show();
	            $Form.children(':nth-child(5n)').find('.datails').children('input:eq(0)').attr('placeholder', '请输入募集开始日期');
	            $Form.children(':nth-child(5n)').find('.datails').children('input:eq(1)').attr('placeholder', '请输入募集结束日期');
        		break;
        	//资产募集数据
			case 'collectData-m-flex':
                $Form.children(':first').hide();
                $Form.children('hr:first').hide();
                $Form.children(':nth-child(1n+3)').hide();
                $Form.children(':nth-child(5n)').show();
                $Form.children(':nth-child(5n)').find('.datails').children('input:eq(0)').attr('placeholder', '请输入募集开始日期');
                $Form.children(':nth-child(5n)').find('.datails').children('input:eq(1)').attr('placeholder', '请输入募集结束日期');
                break;
			//产品基础信息
            case 'proBasicInfo-m-flex':
                $Form.children(':first').show();
                $Form.children(':first').find('.datails').children('input:eq(0)').attr('placeholder', '请输入资产编号');
                $Form.children(':first').find('h6').html('<i style="margin-right:2px">*</i>请输入资产编号');
                $Form.children('hr:first').show();
                $Form.children(':nth-child(1n+3)').hide();
                $Form.children(':nth-child(5n)').show();
                $Form.children(':nth-child(5n)').find('.datails').children('input:eq(0)').attr('placeholder', '请输入募集开始日期');
                $Form.children(':nth-child(5n)').find('.datails').children('input:eq(1)').attr('placeholder', '请输入募集结束日期');
                break;
        	default:
        		$Form.children('.u-datails').not(':first').show();
        }
       	// submit buttons
        $Form.children('.submit').show();
    }
    // 隐藏搜索
    if ($queryButton.attr('id') == 'date-query') {
        $queryButton.hide();
    }
}

// query condition
function querySubmit(event){
	var queryBox = $(event).parents('#date-query');
	var flex = $('.m-flex');
	var queryConditionNumber = queryBox.find('.date-datails').children('input'); // 当前选中查询条件 需要的查询条件量。 
	var Collect = queryBox.find('.u-datails:eq(2)').find('.datails').children('input:eq(0)').val();
	if( flex.is(':hidden')) return;
	// 只存在一条查询条件 （请输入查询信息 || 请输入成立日）
	if(queryConditionNumber.attr('placeholder').indexOf('请输入查询信息') > -1 || queryConditionNumber.attr('placeholder').indexOf('请输入成立日') > -1){
		var val  = [],
        	Checked = $('.date-datails').children('input'), // 选中的搜索框
            Placeholder = $(Checked).eq(0).attr('placeholder');// 搜索框提示信息 
        for (var i = 0; i < Checked.length; i++) {
            // val = [当前搜索框提示信息第4位开始：当前搜索框value];
            if ($(Checked[i]).val() == "") {
                val.push($(Checked[i]).attr("placeholder").substring(3) + ':null');
            } else {
                val.push($(Checked[i]).attr("placeholder").substring(3) + ':' + $(Checked[i]).val());
            }
        }
    	// 搜索条件为 "";
        if (val[0].split(':')[1] == "null") {
            alert('"' + Placeholder + '"不能为空！');
            $(Checked[0]).focus();
        } else {
        	// 资产售卖进度存在小表，查询时删除小表
        	if($('#flex2').length > 0){
        		$('#flex2').remove();
        		$('.bgStyle').removeClass('bgStyle');
        	};
            var obj = [],
                index1,
                index2,
                $this,
                listText = [];// 复制用数据
            // 用新的变量 obj 接收修改过的数组 val
            for (var i = 0; i < val.length; i++) {
                if (val[i].split(':')[0] == "成立日期")
                    val[i] = '成立日:' + val[i].split(':')[1];
                if (val[i].split(':')[1] != 'null') {
                    obj.push(val[i])
                }
            }
            // 根据查询值，找寻对应tabHead>th,并获取其下标；
            for (var i = 0; i < obj.length; i++) {
                // 定位对应搜索区域，并获取相应table表头索引号;
                if (!$('.m-flex').is(':hidden')) {
                    $this = $('.m-flex').children(':first');
                    var thList = $this.find('th');
                    for (var n = 0; n < thList.length; n++) {
                    	// 判断查询条件有几条
                        if (i == 0) {
                            if ($(thList[n]).text().indexOf(obj[i].split(':')[0]) > -1)
                                index1 = $(thList[n]).index();
                        } else {
                            if ($(thList[n]).text().indexOf(obj[i].split(':')[0]) > -1)
                                index2 = $(thList[n]).index();
                        }
                    }
                }
            }
	    	/* 根据获取到的th下标对比td值；
	         * $this.parent() = xxx.html; 当前加载页面
	         */
            var listTr = $this.find('td').parent();//tr
			var count = 0;
			var condition1 = obj[0].split(':');
			var condition2 = (obj[1] == undefined ? undefined : obj[1].split(':'));
			for (var i = 0; i < listTr.length; i++) {
				var $tr = $(listTr[i]);
				/*// 判断当前显示页面是否有多个子模块，正常只有一个;
			    if ($this.parent().children().length > 1) {
			        $this.next().remove();
			        $this.css('width', '100%');
			    }*/
			   // 开始&结束时间只要有一个包含判断条件就显示；
			   	if(condition1[0] == '募集开始时间'){
			   		var start = $tr.children().eq(index1).text();
		   			var end   = $tr.children().eq(index1).next().text();
		   			// 只存在募集开始条件
		   			if(condition2 == undefined){
		   				if(start >= condition1[1]|| end >= condition1[1]){
				   			$tr.show();
				   			//steTableSize($tr);
				   			count++
				   		}else{
				        	$tr.hide();
				        }
	   				}else{
   					// 募集开始&结束条件都存在
	   					if(start >= condition1[1]|| end >= condition1[1]){
	   						// 当前 tab 募集结束时间为空？ 开始时间 <= 募集结束条件 ： 开始||结束< = 募集时间 ;
	   						if($.trim(end).length < 1){
	   							if(start <= condition2[1]){
					   				$tr.show();
					   				//steTableSize($tr);
						            count++
					   			}else{
						        	$tr.hide();
						        }
	   						}else{
	   							if(start <= condition2[1] || end <= condition2[1]){
					   				$tr.show();
					   				//steTableSize($tr);
						            count++;
					   			}else{
						        	$tr.hide();
						        }
	   						}
				   		}else{
				   			$tr.hide();
				   		}
		   			}
			   	}else{
			   		// 只有一个条件 
			   		if(condition2 == undefined){
			   			// condition that "查询信息"
				        if (condition1[0] == '查询信息') {
				            if($tr.text().indexOf(condition1[1]) < 0) {
				                $tr.hide();
				            }else{
				            	$tr.show();
				            	var newText = '<i style="color:#eca313;">'+condition1[1]+'</i>';
				            	// 高亮显示
				            	$tr.find('td').each(function(){
				            		if($(this).text().indexOf(condition1[1]) >= 0 ){
				            			// 这里，利用 JS 的 RegExp 对象，将 g 参数单拿了出来，同时，正则的内容可以用变量来代替了！
				            			$(this).html($(this).text().replace(new RegExp(condition1[1],'g'),newText))
				            		}
				            	});
				            	//steTableSize($tr);
				                count++;
				            }
				        // condition that "XX日期"
				        }else{
				            if($tr.children().eq(index1).text() >= condition1[1]) {
				                $tr.show();
				                count++
				            }else{
				                $tr.hide();
				            }
				        }
			        // 存在两个条件
			   		}else{
			   			if($tr.children().eq(index1).text() >= condition1 && $tr.children().eq(index2).text() <= condition2[1]) {
				            $tr.show();
				            count++;
				        }else{
				            $tr.hide();
				        }
			   		}
			   	};
			   	if(i == 0){
		   			steTableSize($this);
			   	}
			}
			p.bottomStatusBarInformation({
		    	'show':true,
		    	'TypeHidden':true,
    			'tipVisible':true,
		    	'size':count
		    });
        }
	}else{
		// 当前显示页面为‘售卖进度’
		if(flex.attr('id') == 'flexTab-m-flex'){
			// 售卖进度 ==》 售卖时间查询
			sellingTime($('.date-datails'));
		};
		// 当前显示页面为 ‘资产后期费用’ & 募集日正确
		if( flex.attr('id') == 'laterPeriodCosts-m-flex' && Collect.replace(/\s+/g,"").length == 10){
		   /*   
	        *   1.清除text，
	        *   2.发送请求日期，重新加载数据
	        * */
	        var mydate = new Date();
	       	var str = "" + mydate.getFullYear() + "-";
			   	str += (mydate.getMonth()+1) > 9? (mydate.getMonth()+1) + "-" : '0'+(mydate.getMonth()+1) + "-";
			   	str += mydate.getDate() > 9? mydate.getDate() : '0'+mydate.getDate();
	       	var endTime = queryBox.find('.u-datails:eq(2)').find('.datails').children('input:eq(1)').val();
	       	if(Collect > str)return alert('开始日期不能大于当前日期！');
	       	if(endTime.replace(/\s+/g,"").length == 0)endTime = str;
	   		if(endTime.replace(/\s+/g,"").length == 10){
	   			if(endTime < Collect)return alert('开始日期不能大于结束日期！');
	   			//  日期效验正确，请求数据
	   			$('#laterPeriodCosts-m-flex').empty();
		        costs.init({
		        	wrap: costs.wrap,
					url	: p.dataUrl.anaphaseExpense+'&start_date='+Collect+'&end_date='+endTime,     //资产后期费用url
					arr	: costs.arr[0],
		        	laterName: 'later',
		        	"keyword"	:['%'],
					"Date"		:['min_trans_time','max_trans_time','inception_date','due_date'],
					"thousandSeparator":{
						"two"	:['total_amount','assets_scale','base_prod_scale','fund_trans_amount','deduction_amt','add_rate_amt'],
						"three" :['marketing_extra_yield']
					},
					"align"			: {		
						"left" 	:['assets_no'],
						"right"	:['total_amount','assets_scale','base_prod_scale','fund_trans_amount','deduction_amt','add_rate_amt','marketing_extra_yield']
					}
		        });
		        queryBox.hide();
	   		}
		}else 
		// 当前显示页面为 ‘资产募集数据’
		if(flex.attr('id') == 'collectData-m-flex'){
	        $('#collectData-m-flex').empty();
	        var startDate=$(".u-datails:eq(2)").children('div').find('input').eq(0).val();
	        var endDate=$(".u-datails:eq(2)").children('div').find('input').eq(1).val();
	        var startDateString=Date.parse(new Date(startDate));
	        var endDateString=Date.parse(new Date(endDate));
	        if(startDateString>endDateString){
	            alert("结束日期不能小于开始日期!");
	            return;
	        }
	        collectData.init({
	        	wrap: collectData.wrap,
				url	: p.dataUrl.raise+'&end='+endDate+'&start='+startDate,     //资产募集数据url
				arr	: collectData.arr[0],
				"thousandSeparator":{
					"two"	:['投资金额']
				},
				"align"			: {		
					"left" 	:['资产编号'],
					"right"	:['投资金额']
				}
	        });
	        queryBox.hide();
	    }else 
	    // 当前显示页面为 ‘产品基础信息’
	    if(flex.attr('id') == 'proBasicInfo-m-flex'){
	    	$('#proBasicInfo-m-flex').empty();
	        if(queryBox.find('.date-datails').children('input').length < 2){
	            var val  = queryBox.find('.date-datails').children('input').val();
	            if(val.length<=0){
	                alert('"请输入查询信息"不能为空！');
	                return;
	            }
	            proBasicInfo.init({
	            	wrap: proBasicInfo.wrap,
					url	: p.dataUrl.proBasicInfo.queryTable+'&assets_no='+val,     //产品基础信息url
					arr : proBasicInfo.arr[0],
					"Date"		:['募集起始日','募集结束日','产品成立日','产品到期日'],
					"thousandSeparator":{
						"two"	:['总规模','资管份额规模','基础产品规模','基础产品已募集规模','加息成本','现金券成本','底层资产投资收益(审计)','底层资产投资收益','产品投资收益'],
						"three" :['营销贴息金额','砍头息','财顾费','资管管理费','交易所费','托管费','委贷行手续费','通道费','资产收入']
					},
					"align"			: {		
						"left" 	:['资产编号'],
						"right"	:['总规模','资管份额规模','基础产品规模','基础产品已募集规模','加息成本','现金券成本','底层资产投资收益(审计)','底层资产投资收益','产品投资收益'
							,'营销贴息金额','砍头息','财顾费','资管管理费','交易所费','托管费','委贷行手续费','通道费','资产收入'
						]
					}
	            });
			}else{
	            var startDate=$(".u-datails:eq(2)").children('div').find('input').eq(0).val();
	            var endDate=$(".u-datails:eq(2)").children('div').find('input').eq(1).val();
	            var startDateString=Date.parse(new Date(startDate));
	            var endDateString=Date.parse(new Date(endDate));
	            if(startDateString>endDateString){
	                alert("结束日期不能小于开始日期!");
	                return;
	            }
	            proBasicInfo.init({
	            	wrap: proBasicInfo.wrap,
					url	: p.dataUrl.proBasicInfo.outerTable+'&start='+startDate+'&end='+endDate,     //产品基础信息url
					arr : proBasicInfo.arr[0],
					"Date"		:['募集起始日','募集结束日','产品成立日','产品到期日'],
					"thousandSeparator":{
						"two"	:['总规模','资管份额规模','基础产品规模','基础产品已募集规模','加息成本','现金券成本','底层资产投资收益(审计)','底层资产投资收益','产品投资收益'],
						"three" :['营销贴息金额','砍头息','财顾费','资管管理费','交易所费','托管费','委贷行手续费','通道费','资产收入']
					},
					"align"			: {		
						"left" 	:['资产编号'],
						"right"	:['总规模','资管份额规模','基础产品规模','基础产品已募集规模','加息成本','现金券成本','底层资产投资收益(审计)','底层资产投资收益','产品投资收益'
							,'营销贴息金额','砍头息','财顾费','资管管理费','交易所费','托管费','委贷行手续费','通道费','资产收入'
						]
					}
	            });
			};
			queryBox.hide();
	    }else
	    // 当前显示页面为 ‘放款统计’ & 资产放款日正确
	    if( flex.attr('id') == 'makeLoans-m-flex'){
	    	var initData = p.database.initialData;
		   /*   
	        *   1.清除text，
	        *   2.前端筛选日期，重新加载数据;
	        * 	3.当前页面存在合并行，所以筛选备用数据。用筛选过后的数据替换原有数据;
	        * */
	        var $tbody = $('#makeLoans-m-flex').find('#randomTa').find('tbody');
	        $tbody.empty();
			$('#makeLoans-m-flex').find('.footer').remove();
			var arr = ["loan_id","assets_name","","total_amount","assets_no","amount","amount","assets_cost",
						"inception_date","due_date","product_limit","per_year_date","profit","profit","project_name",
						"","","","","","","","","","","","","no_loan_amount","no_loan_amount"];
			var amount = 0,
	            profit = 0,
	            count = 0,
	            makeLoanCombine=[];
	            makeLoanCombined=[];
	        var startDate=$(".u-datails:eq(2)").children('div').find('input').eq(0);
	        var endDate=$(".u-datails:eq(2)").children('div').find('input').eq(1);
	        for (var i = 0; i < initData.length; i++) {
	        	// 查询信息
		       	if(queryBox.find('.date-datails').children('input').length < 2){
		       		var val  = queryBox.find('.date-datails').children('input').val();
	                if(val.length<=0){
	                    alert('"请输入查询信息"不能为空！');
	                    return;
	                }
	                if(JSON.stringify(initData[i]).indexOf(val) >= 0){
	                    $('#makeLoans-m-flex').find('tr').remove();
	                    makeLoanCombine.push(initData[i]);
		                count++;
		       		}
	
				}else{
					// 资产放款日
	                $('#makeLoans-m-flex').find('tr').remove();
					var startDateString=Date.parse(new Date(startDate.val()));
					var endDateString=Date.parse(new Date(endDate.val()));
					if(startDateString>endDateString){
						alert("结束日期不能小于开始日期!");
						return;
					}
					if((startDateString>=initData[i]['资产放款日'] && startDateString<=initData[i]['资产还款日'])||(endDateString>=initData[i]['资产放款日']&&endDateString<=initData[i]['资产还款日'])){
						makeLoanCombined.push(initData[i]);
	                    count++;
					}
				}
			};
	        if(queryBox.find('.date-datails').children('input').length < 2){
	        	p.dataFormatting({
	        		wrap			: makeLoans.wrap,
	        		arr				: makeLoans.arr[0],
	        		dataSet			: makeLoanCombine,
	        		twoLevelTab		: true, // 当前状态不会改变初始数据
	        		repeatedLoading : true,
	        		"Date":['资产放款日','资产还款日'],
					"thousandSeparator":{
						"two"	:['资产规模','底层资产投资金额','投资金额合计','底层资产投资收益','资产投资收益合计','资管管理费','交易所费','托管费','委贷行手续费','通道费和委贷行手续费小计'
							,'财顾费用','未放款金额'
						]
					},
					"align"			: {		
						"left" :['资产编号'],
						"right":['资产规模','底层资产投资金额','投资金额合计','底层资产投资收益','资产投资收益合计','资管管理费','交易所费','托管费','委贷行手续费','通道费和委贷行手续费小计'
							,'财顾费用','未放款金额']
					}
	        	});
			}else{
				p.dataFormatting({
	        		wrap			: makeLoans.wrap,
	        		arr				: makeLoans.arr[0],
	        		dataSet			: makeLoanCombined,
	        		twoLevelTab		: true, // 当前状态不会改变初始数据
	        		repeatedLoading : true,
	        		"Date":['资产放款日','资产还款日'],
					"thousandSeparator":{
						"two"	:['资产规模','底层资产投资金额','投资金额合计','底层资产投资收益','资产投资收益合计','资管管理费','交易所费','托管费','委贷行手续费','通道费和委贷行手续费小计'
							,'财顾费用','未放款金额'
						]
					},
					"align"			: {		
						"left" :['资产编号'],
						"right":['资产规模','底层资产投资金额','投资金额合计','底层资产投资收益','资产投资收益合计','资管管理费','交易所费','托管费','委贷行手续费','通道费和委贷行手续费小计'
							,'财顾费用','未放款金额']
					}
	        	});
			}
			queryBox.hide();
	
	        p.steTableSize($('#flexTab-u-flex4'));
	        p.bottomStatusBarInformation({
		    	'show':true,
		    	'TypeHidden':true,
		    	'tipVisible':true,
		    	'size':count
		    });
		}
	};
}

// Selling time ------------------------------------------------------------
function sellingTime(e){
	var searchVal = {},
        today     = p.lastWeekTime(true,true).start,
    	selectSearchList = $('.date-datails input'),// 选中的搜索框
    	promptMessage    = $(selectSearchList[0]).attr('placeholder');// 搜索框提示信息 
    // 过滤所有空格
    var startTime = ($(selectSearchList[0]).val()).replace(/\s+/g,"");
    // 日期&时间之间不存在空格，拼接空格进去
    if(startTime.length == 12) $(selectSearchList[0]).val(startTime.substring(0,10)+' '+startTime.substring(10,13));
    // 售卖开始时间有误
    if(startTime.length == ""){
    	alert(promptMessage.substring(3)+'不能为空！');
    }else if(startTime.length == 11 || startTime.length > 12){
    	alert('售卖开始时间格式不正确！');
    }else if(today < $(selectSearchList[0]).val()){
    	alert(promptMessage.substring(3)+'不能大于当前时间！');
    }else{
    // 售卖条件成立
    var endTime   = ($(selectSearchList[1]).val()).replace(/\s+/g,"");
    	// 开始时间：字节有误，重新拆分拼接；
    	if($(selectSearchList[0]).val().length > 13){
    		searchVal[0] = startTime.substring(0,10)+' '+startTime.substring(10,13);
    	}else if(startTime.length == 10 ){
    		searchVal[0] = $(selectSearchList[0]).val()+' 00';
    	}else{
    		searchVal[0] = $(selectSearchList[0]).val();
    	}
        // 结束时间：字节有误，重新拆分拼接；
        // 日期&时间之间不存在空格，拼接空格进去
    	if(endTime.length == 12) $(selectSearchList[1]).val(endTime.substring(0,10)+' '+endTime.substring(10,13));
    	// 当前为null
    	/*if(endTime.length == ""){
    		searchVal[1] = today;
    	}else */
    	if(endTime.length == 12 && $(selectSearchList[1]).val().length > 13){
    		searchVal[1] = endTime.substring(0,10)+' '+endTime.substring(10,13);
    	}else if(endTime.length > 12){
    		alert('售卖结束时间格式不正确！');
    	}else if(endTime < startTime){
    		alert('售卖结束时间不能小于售卖开始时间！');
    	}else{ 
    		if(endTime.length == 10 ){
    			searchVal[1] = $(selectSearchList[1]).val()+' 00';
			}else{
				searchVal[1] = $(selectSearchList[1]).val();
			}
    		flexSellTime = searchVal;
    		$('#flexTab-m-flex').empty();
	        
	        flex.init({
	        	wrap: flex.wrap,
				url : p.dataUrl.flexTab.queryTable+'&start_time='+searchVal[0]+'&end_time='+searchVal[1],
				arr : flex.arr['2'],
				status:true,
				"keyword"  : ['%'],
				"thousandSeparator":{
					"two"	:['total_amount_2','assets_cost','outQuery_fund_amount','fund_amount','totalAmount','finish_percent','loan_amount','surplus_amount']
				},
				"assets"		: {			
					"arr"	:['assets_no'],
					"className":'pointer flexTab-create-sell'
				},
				"align"			: {		
					"left" :['assets_no'],
					"right":['total_amount_2','assets_cost','outQuery_fund_amount','fund_amount','totalAmount','finish_percent','loan_amount','surplus_amount']
				},
				"privateFormattingConditions":{
					arr : ['totalAmount','outQuery_fund_amount'],
					fn  : flex.privateFormattingConditions
				}
			});
	        $('#date-query').hide();
    	}
    }
}

// td & th 宽度一致， 每次查询执行一次
function steTableSize(dom){
	var headTh = dom.find('.head-tab').find('th');
	headTh.each(function(){
		var index = $(this).index(),
			width = $(this).outerWidth();
		dom.find('.body-tab').find('th').eq(index).css({'min-width':width+'px','max-width':width+'px'});	
	});
}

