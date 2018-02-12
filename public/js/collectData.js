var collectData = {
	wrap: $('#collectData-m-flex'),
	arr : {
		0:[
			{'field':'loan_id','title':'序号'},
			{'field':'资产编号','title':'资产编号'},
			{'field':'项目名称','title':'项目名称'},
			{'field':'融资主体','title':'融资主体'},
			{'field':'交易结构','title':'交易结构'},
			{'field':'资产类型','title':'资产类型'},
			{'field':'期限(月)','title':'期限(月)'},
			{'field':'计息天数','title':'计息天数'},
			{'field':'成立日','title':'成立日'},
			{'field':'到期日','title':'到期日'},
			{'field':'投资金额','title':'投资金额'}
		]
	}
};
collectData.init = function(parames){
	collectData.wrap.append(p.tabModule(4));
	collectData.wrap.find('.flexTab-u-nav').append(p.navModule.queryDemo);
	p.currentPageDataChangeLogic(p.details(parames));
};
$(document).ready(function(){
		// 初始化
		var lastWeekTime = p.lastWeekTime(); 
		// 当前页面存在两个完全不同的url，所以需要将整个url作为参数传入
		collectData.init({
			wrap: collectData.wrap,
			url	: p.dataUrl.raise+'&start='+lastWeekTime.start+'&end='+lastWeekTime.end,     //资产募集数据url
			arr	: collectData.arr[0],
			"thousandSeparator":{
				"two"	:['投资金额']
			},
			"align"			: {		
				"left" 	:['资产编号'],
				"right"	:['投资金额']
			}
		});
			
	})
	
