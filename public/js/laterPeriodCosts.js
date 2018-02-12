var costs = {
	wrap: $('#laterPeriodCosts-m-flex'),
    arr : {
		0:[
			{'field':'loan_id','title':'序号'},
			{'field':'assets_no','title':'资产编号'},
			{'field':'project_type','title':'交易结构'},
			{'field':'trans_name','title':'企业名称'},
			{'field':'project_name','title':'项目名称'},
			{'field':'int_pay_mode','title':'计息方式'},
			{'field':'zichan_type','title':'资产类型'},
			{'field':'total_amount','title':'总规模'},
			{'field':'assets_cost','title':'资产成本（%）'},
			{'field':'assert_manager_name','title':'资产通道机构名'},
			{'field':'assert_manager_bank_account','title':'资产通道开户名'},
			{'field':'asset_manager_bank_acct','title':'资产银行账号'},
			{'field':'prod_issuer_bank_acct','title':'SPV银行账号'},
			{'field':'assert_issuer_bank_account','title':'SPV开户行'},
			{'field':'assert_issuer_bank_holder','title':'SPV开户名'},
			{'field':'assets_name','title':'资管份额名'},
			{'field':'assets_scale','title':'资管份额规模'},
			{'field':'min_trans_time','title':'募集起始日'},
			{'field':'max_trans_time','title':'募集结束日'},
			{'field':'base_prod_name','title':'基础产品名'},
			{'field':'base_prod_scale','title':'基础产品规模'},
			{'field':'fund_trans_amount','title':'基础产品已募集规模'},
			{'field':'display_rate','title':'app显示年化收益（%）'},
			{'field':'marketing_extra_yield_rate','title':'营销贴息'},
			{'field':'real_rate','title':'实际年化利率'},
			{'field':'inception_date','title':'产品成立日'},
			{'field':'due_date','title':'产品到期日'},
			{'field':'product_limit','title':'产品期限（天）'},
			{'field':'per_year_date','title':'产品年天数'},
			{'field':'category_name','title':'产品期限月'},
			{'field':'deduction_amt','title':'现金券成本'},
			{'field':'add_rate_amt','title':'加息成本'},
			{'field':'marketing_extra_yield','title':'营销贴息成本'}
		]
	}
};
costs.init = function(parames){
	costs.wrap.append(p.tabModule(4));
	costs.wrap.find('.flexTab-u-nav').append(p.navModule.queryDemo);
	p.currentPageDataChangeLogic(p.details(parames));
};

$(document).ready(function(){
		//  初始化
		var lastWeekTime = p.lastWeekTime(); 
		costs.init({
			wrap: costs.wrap,
			url	: p.dataUrl.anaphaseExpense+'&start_date='+lastWeekTime.start+'&end_date='+lastWeekTime.end,     //资产后期费用url
			arr	: costs.arr[0],
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
	})
	
