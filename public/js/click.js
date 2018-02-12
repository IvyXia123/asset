$(document).click(function (event) {
    // 单条数据独立展示模块 hide
    if ($(event.target).hasClass(nameGroup.particular)) {
        $(event.target).find('table').empty();
        $(event.target).hide();
    }
    // 点击导航页面跳转
    if ($(event.target).attr('data-page') != undefined) {
        $(event.target).parent().children().removeClass('bg');
        $(event.target).toggleClass('bg');
        p.pageSwitching($(event.target).attr('data-page'));
        $('#formName').html($(event.target).html());
        $('#date-query').hide();
    }
    // 展开收起 顶部导航栏
    if ($(event.target).hasClass(nameGroup.navSwitch)) {
        $('#date-query').hide();
        navAnimate($(event.target));
    }
    // 单选选中style
    if ($(event.target).hasClass('query')) {
        $(event.target).find("input").focus();
        $(event.target).next().addClass('date-datails')
                .children('input').removeAttr('disabled');
        if ($(event.target).parent().siblings('.u-datails').children().hasClass('date-datails'))
            $(event.target).parent().siblings('.u-datails').children().removeClass('date-datails');
        $(event.target).parent().siblings('.u-datails').children().children('input').attr('disabled', true);
    }
    // 关闭售卖进度时间 内 查询小表
    if ($(event.target).parent('#flex2').length > 0) {
        $(event.target).parent('#flex2').prev('tr').removeClass('bgStyle');
        $(event.target).parent('#flex2').remove();
    }
	// 提交
	if ($(event.target).hasClass('submit')) {
			querySubmit(event.target);
	}
    // Search bar state
    if ($(event.target).hasClass('flexTab-change') || $(event.target).attr('id') == 'date-query'){
    	searchBarState(event.target);
    }
})
