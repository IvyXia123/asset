var makeLoans = {};
	makeLoans.total = {};
    makeLoans.arr = {
    	0:[
	        {'field':'loan_id','title':'序号'},
	        {'field':'项目名称','title':'项目名称'},
	        {'field':'融资主体','title':'融资主体'},
	        {'field':'资产规模','title':'资产规模'},
	        {'field':'资产编号','title':'资产编号'},
	        {'field':'底层资产投资金额','title':'底层资产投资金额'},
	        {'field':'底层资产投资金额','title':'投资金额合计'},
	        {'field':'资产年化收益率','title':'资产年化收益率（%）'},
	        {'field':'资产放款日','title':'资产放款日'},
	        {'field':'资产还款日','title':'资产还款日'},
	        {'field':'投资期限','title':'投资期限（天）'},
	        {'field':'每年期限','title':'每年期限'},
	        {'field':'底层资产投资收益','title':'底层资产投资收益'},
	        {'field':'底层资产投资收益','title':'资产投资收益合计'},
	        {'field':'资管通道','title':'资管通道'},
	        {'field':'资管费率','title':'资管费率（%）'},
	        {'field':'交易所费率','title':'开通/交易所费率（%）'},
	        {'field':'托管费率','title':'托管费率(含存管费)（%）'},
	        {'field':'通道费率小计','title':'通道费率小计（%）'},
	        {'field':'通道每年期限','title':'通道每年期限'},
	        {'field':'通道费小计','title':'通道费小计'},
	        {'field':'资管管理费','title':'资管管理费'},
	        {'field':'交易所费','title':'交易所费'},
	        {'field':'托管费','title':'托管费'},
	        {'field':'委贷行利率','title':'委贷行利率（%）'},
	        {'field':'委贷行计息方式','title':'委贷行计息方式'},
			{'field':'委贷行手续费','title':'委贷行手续费'},
	        {'field':'通道费和委贷行手续费小计','title':'通道费和委贷行手续费小计'},
	        {'field':'资产通道费和委贷行手续费合计','title':'资产通道费和委贷行手续费合计'},
	        {'field':'财顾费用','title':'财顾费用'},
	        {'field':'财顾费用','title':'财顾费小计'},
	        {'field':'未放款金额','title':'未放款金额'}
		]
	};
	makeLoans.wrap = $('#makeLoans-m-flex');
	makeLoans.init = function(parames){
		makeLoans.wrap.append(p.tabModule(4));
		makeLoans.wrap.find('.flexTab-u-nav').append(p.navModule.queryDemo);
		p.currentPageDataChangeLogic(p.details(parames));
	};
	makeLoans.footer  = function(numb){
		var html = '<footer class="footer">'
			+'<table>'
			+'<tr>'
			+'<td>投资金额合计：</td>'
			+'<td>'+ parseFloat(Number(numb.amount).toFixed(2)).toLocaleString() +'（元）</td>'
			+'<td>投资收益合计：</td>'
			+'<td>'+ parseFloat(Number(numb.profit).toFixed(2)).toLocaleString() +'（元）</td>'
			+'</tr>'
			+'</table>'
		+'<footer>';
		return html;
	}
	
	// 合并指定行
    makeLoans.merge = function($bodyTab){
    	// 合并相同行
		function merge1($bodyTab,arr){
			// tr>td.length
			var totalRows = $bodyTab.find("tr").length;
			var headTR = $('#makeLoans-m-flex').find('.head-tab').find('tr').children().length;
			// 倒序对比原因：相同值接点删除掉之后,原有的下标被打乱了
			for ( var i = totalRows-1; i >= 0; i--) {
				for ( var j = arr.length-1; j >=0 ; j--) {
					startCell = $bodyTab.find("tr").eq(i).find("td").eq(arr[j]);
					targetCell = $bodyTab.find("tr").eq(i-1).find("td").eq(arr[j]);
					if (startCell.text() == targetCell.text() && targetCell.html() != "") {
						targetCell.attr("rowspan", (startCell.attr("rowspan")==undefined)?2:(eval(startCell.attr("rowspan"))+1));
						startCell.remove();
					}
				}
			}
		}
		// 计算并合并指定行
		function amountMerge1 ($bodyTab,arr,eqIndex){
			var size = $bodyTab.find("tr").eq(0).children().length;
			$bodyTab.find("tr").each(function(){
				// 没有删过子元素 td 的 TR，获取其第一个子级的 rowspan 属性; 
				var rowspan = $(this).children('td').eq(eqIndex).attr('rowspan');
                // 判断rowspan 是否存在
                if(rowspan == undefined && $(this).children().length == size){
                    if($(this).children("td").eq(4).html()){
                        /* 通道费和委贷行手续费小计和资产通道费和委贷行手续费合计 : 通道费小计+委贷行手续费
                         * $(this).children("td").eq(20):通道费小计
                         * $(this).children("td").eq(26):委贷行手续费
                         * $(this).children("td").eq(27):通道费和委贷行手续费小计
                         * $(this).children("td").eq(28):资产通道费和委贷行手续费合计
                         */
                        //判断获取到的值是否有千分符
                        if($(this).children("td").eq(20).html().indexOf(",") > -1){
                            var tongDaoFei=Number($(this).children("td").eq(20).html().replace(/,/g,""));
                        }else{
                            var tongDaoFei=Number($(this).children("td").eq(20).html());
                        };

                        if($(this).children("td").eq(26).html().indexOf(",") > -1){
                            var weiDaiHang=Number($(this).children("td").eq(26).html().replace(/,/g,""));
                        }else{
                            var weiDaiHang=Number($(this).children("td").eq(26).html());
                        };
                        //通道费和委贷行手续费小计或资产通道费和委贷行手续费合计 = 通道费小计+委贷行手续费
                        var totalAmount= tongDaoFei + weiDaiHang;
                        $(this).children("td").eq(27).html(parseFloat(Number(totalAmount).toFixed(2)).toLocaleString());   //通道费和委贷行手续费小计
                        $(this).children("td").eq(28).html(parseFloat(Number(totalAmount).toFixed(2)).toLocaleString());   //资产通道费和委贷行手续费合计

                        /*
                         *  未放款金额 ：资产规模- 投资金额合计
                         *  $(this).children("td").eq(3).html():资产规模
                         *  $(this).children("td").eq(6).html():投资金额合计
                         *  $(this).children("td").eq(31).html():未放款金额
                         */
                        if($(this).children("td").eq(3).html().indexOf(",") > -1 && $(this).children("td").eq(6).html().indexOf(",") > -1){
                            var balance= Number(($(this).children("td").eq(3).html()).replace(/,/g,""))- Number(($(this).children("td").eq(6).html()).replace(/,/g,""));
                            $(this).children("td").eq(31).html(parseFloat(Number(balance).toFixed(2)).toLocaleString());   //未放款金额
                        }
                    }
                }
				if(rowspan == undefined || $(this).children().length < size) {
                    return true
				}else{//如果有合并则继续执行以下代码
                    // 获取当前第一个tr的索引号;
                    var index = $(this).index();    //tr 合并单元格td的index
                    // 根据 rowspan 值遍历符合当前tr要求的的兄弟;
                    for(var i = 1; i < rowspan; i++){
                        var nextIndex = index+i; // 后面兄弟坐标；依据基准td的rowspan值在循环
                        var $next = $(this).parent().children('tr').eq(nextIndex);// 当前TR的后面兄弟;
                        // 每一行TR要合并的列
                        for(var n in arr){
                            if(arr[n] > 27){
                                var r2 = -(arr[n]-1);   //r2为被合并元素的下标
                            }else{
                                var r2 = -arr[n];
                            }
                            var r1 = -arr[n];    // 合并下标
                            var r2Html = $next.children().eq(r2).attr('class',"removes").html(); //要被合并元素的值
                            // 当前tr 指定的使用rowspan属性的子元素td
                            var thisChild = $(this).children('td').eq(r1);//td, eq()值为负数表示倒序
                            /*
                            * Number(thisChild.parent().children('td').eq(20).html().replace(/,/g, "")): 通道费小计
                            * Number(thisChild.parent().children('td').eq(26).html().replace(/,/g,"")): 委贷行手续费
                            * Number($next.find("td").eq(17).html().replace(/,/g,"")): 通道费小计
                            * Number($next.children("td").eq(23).html().replace(/,/g,"")): 委贷行手续费
                            */
                            var text1 = Number(thisChild.parent().children('td').eq(20).html().replace(/,/g,"")) + Number(thisChild.parent().children('td').eq(26).html().replace(/,/g,"")),
                                text2 = Number($next.find("td").eq(17).html().replace(/,/g,""))+Number($next.children("td").eq(23).html().replace(/,/g,""));
                            if(arr[n] == 1){
                                // html()值替换掉','并转成数值型,相加完成后再次格式化
                                //  未放款金额 = 资产规模 - 投资金额合计
                                var newText = Number((thisChild.parent().children('td').eq(3).html()).replace(/,/g,"")) - Number((thisChild.parent().children('td').eq(6).html()).replace(/,/g,""));
                                // 合并 thisChild 的下一个兄弟；
                                thisChild.html(parseFloat(newText).toLocaleString());
                            }else if(arr[n] == 4){
                                // html()值替换掉','并转成数值型,相加完成后再次格式化
                                //  通道费和委贷行手续费小计 = 通道费小计 + 委贷行手续费
                                thisChild.prev().html(parseFloat(Number(text1).toFixed(2)).toLocaleString());
                                $next.find("td").eq(r1).prev().html(parseFloat(Number(text2).toFixed(2)).toLocaleString());

                                if(i == 1){// 手续费合计开始是没有值的，先把基准行的值放进去
                                    thisChild.html(thisChild.prev().html());
                                }
                                thisChild.html(parseFloat((Number(thisChild.html().replace(/,/g,""))+text2).toFixed(2)).toLocaleString());
                            }else if(arr[n] == 29){    //资产规模列
                                var $thisVal=Number(thisChild.html().replace(/,/g,''));   //合并基准行的值
                                var $nextVal=Number($next.children().eq(r2).html().replace(/,/g,''));   //被合并元素的值
                                if($thisVal<$nextVal){
                                    $thisVal=$nextVal;
                                }
                                thisChild.html(parseFloat($thisVal.toFixed(2)).toLocaleString());
                            } else
                            // html()值替换掉','并转成数值型,相加完成后再次格式化
                            if(thisChild.html()!=" " && thisChild.html()!=undefined && thisChild.html()!=null && $.trim(thisChild.html()).length > 0){
                                if(thisChild.html().indexOf(",") > -1){
                                    var newText = (Number(thisChild.html().replace(/,/g,"")) + Number(r2Html.replace(/,/g,""))).toFixed(2);
                                    // 合并 thisChild 的下一个兄弟；
                                    thisChild.html(parseFloat(Number(newText).toFixed(2)).toLocaleString());
                                }
                                else{
                                    var newText = Number(thisChild.html()) + Number(r2Html);
                                    // 合并 thisChild 的下一个兄弟；
                                    thisChild.html(parseFloat(Number(newText).toFixed(2)).toLocaleString());
                                }
                            }
                            thisChild.attr('rowspan',(thisChild.attr("rowspan")==undefined)?2:(eval(thisChild.attr("rowspan"))+1))
                        }
                        $('.removes').remove();
                    }
				};

			})
		}
		function amountMerge2 ($bodyTab,arr,eqIndex){
			var size = $bodyTab.find("tr").eq(0).children().length;// tr.children().length 初始完整长度
			$bodyTab.find("tr").each(function(){
				if($(this).children().length == size){
					// 没有删过子元素 td 的 TR，获取其第一个子级的 rowspan 属性; 
					var rowspan = $(this).children('td').eq(eqIndex).attr('rowspan');
					// 判断rowspan 是否存在
					if(rowspan == undefined || $(this).children().length < size) return true;
					// 获取当前第一个tr的索引号;
					var index = $(this).index();
					for(var n in arr){
						// 当前tr 指定的子元素
                        var thisChild = $(this).children('td').eq($(this).length - arr[n]);    //当前未合并行的td
						// 根据 rowspan 值遍历符合当前tr要求的的兄弟;
						for(var i = 1; i < rowspan; i++){
							// 当前TR的兄弟;
							var $next = $(this).parent().children('tr').eq(index + i);
							// 合并 thisChild 的下一个兄弟；
							thisChild.attr('rowspan',(thisChild.attr("rowspan")==undefined)?2:(eval(thisChild.attr("rowspan"))+1));
							$next.children('td').eq($(this).length - arr[n]+1).remove();
                        }
					}
				}
			})
		}

		var totalCols = ['4'];    //【'资产编号'】
		merge1($bodyTab,totalCols)
		// 合并行
		var arrIndex2 = ["32",'31'];// 倒序 ;要合并TD的索引号 = 当前td的倒序索引号+1    【'项目名称','融资主体'】
		amountMerge2 ($bodyTab,arrIndex2,totalCols[0]);
		// 需合并&合计的行，索引倒序
        var arrIndex = ["29","26","19","4","2","1"];    //【'资产规模','投资金额合计','投产投资收益合计','资产通道费和委贷行手续费合计','财顾费小计','未放款金额'】
		amountMerge1 ($bodyTab,arrIndex,totalCols[0]);
    }
    
    makeLoans.privateFormattingConditions = function(obj,k){
    	//通道费率小计:
        if(k =='通道费率小计'){
            var assetRatio=(obj['资管费率']?obj['资管费率']:0) + (obj['交易所费率'] ?obj['交易所费率']:0)+(obj['托管费率']?obj['托管费率']:0);
           	return assetRatio;
        }

        //通道费小计
        if(k =='通道费小计'){
            var asset = (obj['资管管理费']?obj['资管管理费']:0.00) + (obj['交易所费']?obj['交易所费']:0.00 )+ (obj['托管费']?obj['托管费']:0.00);
          return thousandSeparator(asset,3);
        }
    }
	$(document).ready(function(){
		// 初始化
		makeLoans.init({
			wrap: makeLoans.wrap,
			url	: p.dataUrl.makeLoans,   //放款统计url
			arr	: makeLoans.arr[0],
			"rate": ['资产年化收益率','资管费率','交易所费率','托管费率','委贷行利率','通道费率小计'],
			"Date":['资产放款日','资产还款日'],
			"thousandSeparator":{
				"two"	:['资产规模','底层资产投资金额','投资金额合计','底层资产投资收益','资产投资收益合计','资管管理费','交易所费','托管费','委贷行手续费','通道费和委贷行手续费小计'
					,'财顾费用','未放款金额'
				],
				"three":['通道费率小计']
			},
			"align"			: {		
				"left" :['资产编号'],
				"right":['资产规模','底层资产投资金额','投资金额合计','底层资产投资收益','资产投资收益合计','资管管理费','交易所费','托管费','通道费率小计','通道费小计','委贷行手续费','通道费和委贷行手续费小计'
					,'财顾费用','未放款金额']
			},
			"privateFormattingConditions":{
				arr : ['通道费率小计','通道费小计'],
				fn  : makeLoans.privateFormattingConditions
			}
		});
	})
	
