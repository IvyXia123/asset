function DataFormatting(parames){
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
    
    // 1. 过滤掉特殊字符
    if(parames.keyword){
    	for(var i = 0; i < parames.keyword.length; i++){
    		var a = parames.keyword[i];
    		data = data.replace(new RegExp(a,'g'),"");
    	}
    }
    
    // 遍历数据
    for(var i = 0; i < data.length; i++){
    	var tbodyTr = '<tr>';
    	count++;
    	// each thead,The tbody content and thead consistent sequence
    	for(var j = 0; j < arr.length; j++){
    		var f  = arr[j].field; 	// 与请求到数据对应的字段名
    		var td = "<td"; 			// <td> 
    		var newValue 	= null;
    		var CV	= String(data[i][f]) || " "; // 当前数值
    		
            // <col> & <th> 标签只在第一组数据循环时创建 
            if (i == 0) {
                // 过滤字段名中特殊字符, "data-field" 属性用于根据字段名导出时的筛选工作
    			if(arr[j].title.indexOf('(') > 0){
	            	arr[j].title = arr[j].title.substring(0,arr[j].title.indexOf('('));
	           	};
            	var th = '<th data-field = "'+ arr[j].title +'">' + arr[j].title + '</th>';
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
            // 当前值可转为数值型，并且大于0
            if(!isNaN(Number(CV)) && Number(CV) > 0){
            	
            	// 2. 千位分隔符处理 （当前值必须可以转为数值型）
	            if(parames.thousandSeparator){
	            	// 保留两位的分割
	            	if(parames.thousandSeparator.tayste){
	        			for(var n = 0; n < parames.thousandSeparator.two.length; n++){
	        				// 存在对应的字段名，格式化当前值 CV
	        				if(parames.thousandSeparator.two[n] == f){
	        					CV = thousandSeparator(CV,2);
	        				}
	        			}
	            	}else{
	        		// 保留三位的分割
	        			for(var n = 0; n < parames.thousandSeparator.three.length; n++){
	        				// 存在对应的字段名，格式化当前值 CV
	        				if(parames.thousandSeparator.three[n] == f){
	        					CV = thousandSeparator(CV,3);
	        				}
	        			}
	            	}
	            };
	            
	            // 3. 费率格式处理
	            if(parames.rate){
        			for(var n = 0; n < parames.rate.length; n++){
        				// 存在对应的字段名，格式化当前值 CV
        				if(parames.rate[n] == f){
        					CV = (parseFloat(CV)*100).toFixed(3);
        				}
        			}
	            };
            }else
            // 过滤空值
        	if(CV.replace(/\ +/g,"").length > 0){
        		
        		// 4. 日期格式处理
        		if(parames.Date){
        			for(var n = 0; n < parames.Date.length; n++){
        				// 存在对应的字段名，格式化当前值 CV
        				if(parames.Date[n] == f){
        					var time = "";
		            		var newTime = new Date(CV);
		                		time 	= "" + newTime.getFullYear() + "-";
		                		time 	+= (newTime.getMonth()+1) > 9? (newTime.getMonth()+1) + "-" : '0'+(newTime.getMonth()+1) + "-";
		                		time 	+= newTime.getDate() >  9? newTime.getDate() : '0'+newTime.getDate();
        					CV = time;
        				}
        			}
	            };
	            
        		// 5. boolean值转中文
        		if(parames.boole){
        			for(var n = 0; n < parames.boole.length; n++){
        				// 存在对应的字段名，格式化当前值 CV
        				if(parames.boole[n] == f){
        					CV = CV? '是' : '否';
        				}
        			}
        		}
        	}else{
        		CV = " ";
        	};
            // 6. td 资产编号 个别页面特殊定义  assets={arr:[’资产编号‘]，className:'pointer flexTab-create-sell'}
            if(parames.assets){
            	for(var n = 0; n < parames.assets.arr.length; n++){
            		if(parames.assets.arr[n] == f){
            			td += ' class="'+ parames.assets.className +'"';
            			break;
            		}
            	}
            }
            
            // 7. 其他固定的特殊计算
            if(parames.privateFormattingConditions){
            	CV = parames.privateFormattingConditions(data[i],f);
            };
            
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
            	}else{
            	// 右对齐
	            	for(var n = 0; n < parames.align.right.length; n++){
	            		if(parames.align.right[n] == f){
	            			td += ' align="right"';
	            			break;
	            		}
	            	}
            	}
            };
            td += '>'+CV+'</td>';
            tbodyTr += td;
    	}
    	tbodyTr += '</tr>';
		$tbody.children('tbody').append(tbodyTr);
    };
        
    var colgroup = $('<colgroup>' + colgroupHtml + '</colgroup>');
    // 因为对象只有一个，只能加载到一个对象里。所以这里需要完全克隆一个新的对象。
    var colgroup1 = colgroup.clone();
    var th = $theadTr.clone();
    $thead.children('tbody').append($theadTr)/*.before(colgroup)*/;
    $tbody.find('tbody').before(th);
    //$tbody.children('tbody').before(colgroup1);
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
    this.steTableSize($('.flexTab-u-flex'));
    // 当前页面是否重复加载？
    if(parames.repeatedLoading){
		setTimeout(function(){ // 定时器是为了保证loading会存在一段时间
			$('#loading').remove();
		},500);
    };
}
// 数值千位分隔符
function thousandSeparator (numeric,size){
	numeric = parseFloat(numeric).toFixed(size);
	// 保留两位小数
	if(numeric.indexOf(".") > -1){
		numeric = parseFloat(numeric).toLocaleString();
	}else{
		if(size > 2){
			numeric = parseFloat(numeric).toLocaleString()+'.000';
		}else{
			numeric = parseFloat(numeric).toLocaleString()+'.00';
		}
		
	};
	return numeric;
}
