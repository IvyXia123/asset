var proBasicInfo = {
	wrap: $('#proBasicInfo-m-flex'),
	arr : {
		0:[
			{'field':'loan_id','title':'序号'},
			{'field':'资产编号','title':'资产编号'},
			{'field':'项目类型','title':'项目类型'},
			{'field':'企业名称','title':'企业名称'},
			{'field':'资产成本(%)','title':'资产成本（%）'},
			{'field':'交易结构','title':'交易结构'},
			{'field':'计息方式','title':'计息方式'},
			{'field':'资产类型','title':'资产类型'},
			{'field':'路径名','title':'路径名'},
			{'field':'总规模','title':'总规模'},
			{'field':'资产通道机构名','title':'资产通道机构名'},
			{'field':'资产年天数','title':'资产年天数'},
			{'field':'资管份额名','title':'资管份额名'},
			{'field':'资管份额规模','title':'资管份额规模'},
			{'field':'通道费率','title':'通道费率（%）'},
			{'field':'募集起始日','title':'募集起始日'},
			{'field':'募集月份','title':'募集月份'},
			{'field':'募集结束日','title':'募集结束日'},
			{'field':'基础产品名','title':'基础产品名'},
			{'field':'基础产品规模','title':'基础产品规模'},
			{'field':'基础产品已募集规模','title':'基础产品已募集规模'},
			{'field':'app显示年化收益','title':'app显示年化收益（%）'},
			{'field':'营销贴息','title':'营销贴息'},
			{'field':'实际年化利率','title':'实际年化利率（%）'},
			{'field':'产品成立日','title':'产品成立日'},
			{'field':'产品到期日','title':'产品到期日'},
			{'field':'产品期限','title':'产品期限（天）'},
			{'field':'产品年天数','title':'产品年天数'},
			{'field':'期限(月)','title':'期限（月）'},
			{'field':'产品类别','title':'产品类别'},
			{'field':'现金券成本','title':'现金券成本'},
			{'field':'加息成本','title':'加息成本'},
			{'field':'营销贴息金额','title':'营销贴息金额'},
			{'field':'定融税费率','title':'定融税费率'},
			{'field':'底层资产投资收益(审计)','title':'底层资产投资收益（审计）'},
			{'field':'底层资产投资收益','title':'底层资产投资收益'},
			{'field':'产品投资收益','title':'产品投资收益'},
			{'field':'砍头息利率','title':'砍头息利率（%）'},
			{'field':'财顾费率','title':'财顾费率（%）'},
			{'field':'资管费率','title':'资管费率（%）'},
			{'field':'交易所费率','title':'交易所费率（%）'},
			{'field':'托管费率','title':'托管费率（%）'},
			{'field':'委贷行手续费率','title':'委贷行手续费率（%）'},
			{'field':'砍头息','title':'砍头息'},
			{'field':'财顾费','title':'财顾费'},
			{'field':'资管管理费','title':'资管管理费'},
			{'field':'交易所费','title':'交易所费'},
			{'field':'托管费','title':'托管费'},
			{'field':'委贷行手续费','title':'委贷行手续费'},
    		{'field':'通道费','title':'通道费'},
    		{'field':'定融税费','title':'定融税费'},
			{'field':'产品担息金额','title':'产品担息金额'},
			{'field':'资产收入','title':'资产收入'}
		]
	},
	// 审计导出字段
	needMethodIndex : [
		"序号","资产编号","项目类型","企业名称","资产成本","交易结构","资产通道机构名","通道费率","募集起始日","募集月份","募集结束日","基础产品名","基础产品规模"
		,"基础产品已募集规模","app显示年化收益","营销贴息","实际年化利率","产品成立日","产品到期日","产品期限","产品年天数","产品类别","现金券成本","加息成本"
		,"营销贴息金额","定融税费率","底层资产投资收益","产品投资收益","通道费","定融税费"
	]
};
proBasicInfo.init = function(parames){
	var str = p.navModule.auditDemo.replace('needMethodIndexVal',String(proBasicInfo.needMethodIndex)); // 审计字段替换
	//  加载 tab 外层模块
	proBasicInfo.wrap.append(p.tabModule(4));
	proBasicInfo.wrap.find('.flexTab-u-nav').append(str);
	p.currentPageDataChangeLogic(p.details(parames));
};
$(document).ready(function(){
	// 初始化页面
	var lastWeekTime = p.lastWeekTime(); 
	// 当前页面存在两个完全不同的url，所以需要将整个url作为参数传入
	proBasicInfo.init({
		wrap: proBasicInfo.wrap,
		url	: p.dataUrl.proBasicInfo.outerTable+'&start='+lastWeekTime.start+'&end='+lastWeekTime.end,     //产品基础信息url
		arr : proBasicInfo.arr[0],
		//"keyword"	:['%'],
		"rate": ['通道费率','实际年化利率','砍头息利率','财顾费率','资管费率','交易所费率','托管费率','委贷行手续费率'],
		"Date"		:['募集起始日','募集结束日','产品成立日','产品到期日','募集月份'],
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
})
	
