function getFullFetchData (obj){
	var $this  = obj.main;
		Array  = obj.Array,
		$thead = $this.find('.head-tab').children(),
		$tbody = $this.find('.body-tab').children(),
		$load  = $('<article id="loading"></article>');
	$.ajax({
		type:"post",
		url:obj.Url,
		async:true,
		beforeSend:function(){
			$.ajax({
		    		type:"get",
		    		url:"/pages/loading",
		    		async:true,
		    		success:function(text){
		    			$load.html(text);
		    			$this.append($load);
		    		}
		    	});
		},
		success:function(data){
			alert(1)
			// formatting data
			data = data.replace(/null/g,'""').replace(/N\/A/g," ");
		    data = JSON.parse(data);
            var details = data.details.loan_amout_list.values,
				colgroupHtml = "",
				$theadTr   = $('<tr></tr>'),
				amount = 0,
				profit = 0,
				useObj ="";
				
		    // each data
		    for(var i = 0; i < details.length; i++){
				var	$tbodyTr   = $('<tr></tr>'),
					listText = [];// 复制用数据
				// each thead,The tbody content and thead consistent sequence
				for(var n = 0;n < Array.length; n ++){
					var field = Array[n].field,
		    			col   = '<col style="width:'+(100/(Array.length)).toFixed(2)+'%;"></col>',
		    		 	th    = '<th>'+Array[n].title+'</th>',
    		 			td    = '<td>'+details[i][field]+'</td>';
	    		 	// 资产编号 手型&可跳转;
	    		 	if(field == 'profit'){
	    		 		profit += Number(details[i][field]);
	    		 	}
	    		 	// <col> ready once
	    		 	if( i == 0 ) {
		    			colgroupHtml += col;
		    			$theadTr.append(th);
		    		}
	    		 	// 投资金额合计
	    		 	if(field == 'amount'){
	    		 		amount += Number(details[i][field]);
	    		 	}
	    		 	$tbodyTr.append(td);
	    		 	// copy
	    		 	listText.push(details[i][field]);
		    	}
				// formatting copy
				useObj += listText.join('\t')+"\n";
                $tbody.children('tbody').append($tbodyTr);
			}
		    // 投资金额合计
		    makeLoans.total.amount = amount;
		    // 投资收益合计
			makeLoans.total.profit = profit;
			var colgroup = $('<colgroup>'+colgroupHtml+'</colgroup>');
			// 因为对象只有一个，只能加载到一个对象里;
			var colgroup1 = colgroup.clone();
	    	$thead.children('tbody').append($theadTr).before(colgroup);
	    	$tbody.children('tbody').before(colgroup1);
	    	// tab style
	    	Pages.steTableSize($this);
	    	makeLoans.wrap.append(makeLoans.footer(makeLoans.total));
	    	makeLoans.merge($tbody);
		},
		complete:function(){
			$('#loading').remove();
		}
	});
}

var details = {
		Url:'/get/loanAmount',
		Array:makeLoans.arr[0],
		main:makeLoans.wrap.children(':first'),
	}
	getFullFetchData (details);