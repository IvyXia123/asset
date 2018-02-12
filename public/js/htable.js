// table
var Htable = {
    createFootTable: function (id) {
        //alert(this.create());
    },
    create: function (id, hack) {
        if (!id) {
            console.error("id is empty");
            return;
        }
        var t = {};
        t.id = id;
        t.data = [];
        t.fixColumns = [];
        t.scrollColumns = [];
        t.floatScrollTableTitlePanel;
        t.floatTitle;
        t.scrolleft = 0;
        t.scrollingLeft = false;
        t.floatScrollingLeft = false;
        t.additionHeight = 0;
        t.orderBy = undefined;//desc asc undefined
        t.maxHeight = 0;
        t.maxWidth = 0;
        t.afterRender = [];

        t.setMaxHeight = function (max) {
            t.maxHeight = max;
        };

        t.setMaxWidth = function (max) {
            t.maxWidth = max;
        };

        var root = $("#" + id);//render to
        t.root = root;

        if (root.css("position") === "static")
            root.css("position", "relative");
        //root.css("border-top", "1px solid #666");
        //root.css("border-bottom", "1px solid #ccddff");
        //root.css("border", "1px solid red");

        t.setAdditionHeight = function (height) {
            t.additionHeight = height;
        };

        t.scrollbarWidth = function () {
            var oP = document.createElement('p'),
                    styles = {
                        width: '100px',
                        height: '100px',
                        overflowY: 'scroll'
                    }, i, scrollbarWidth;
            for (i in styles)
                oP.style[i] = styles[i];
            document.body.appendChild(oP);
            scrollbarWidth = oP.offsetWidth - oP.clientWidth;
            oP.remove();
            return scrollbarWidth;
        };

        t.loadData = function (data) {
            t.data = data;
            t.render();
            return t;
        };

        t.bornFrame = function () {

            t.grandfather = $("<div></div>").appendTo(root);//table grandfather
            t.father = $("<div></div>").appendTo(t.grandfather);//table father
            t.grandfather.addClass("jout");

            t.fixTable = $("<table style='table-layout:auto'></table>");
            t.scrollTable = $("<table></table>");

            t.father.css({
                position: 'relative',
                margin: 0,
                overflowY: 'hidden',
            });

            $("<div class='tab'></div>").append(t.fixTable).appendTo(t.father);
            $("<div class='tab' style='overflow-x:scroll;-webkit-overflow-scrolling:touch'></div>").append(t.scrollTable).appendTo(t.father);

        };

        t.reLoadData = function (data) {

            t.data = data;
            t.refreshTable();
        };

        t.render = function () {

            t.root.children().remove();
            t.scrollbarWidth();
            t.bornFrame();
            t.setScrollColumnsHtml(t.scolumns);
            //alert(t.fcolumns);
            if (t.fcolumns) {
                t.setFixcolumnsHtml(t.fcolumns);
            }
            //t.father.find("tbody").remove();
            t.refreshTable();

            var fixPanel = t.fixTable.parent();
            var scrollPanel = t.scrollTable.parent();

            //console.debug(t.scrollTable.height());
            if (Object.getOwnPropertyNames(t.fixColumns).length === 0)
                fixPanel = null;


            var fixPanelHeight;
            var fixPanelWidth;
            //alert(t.data.length );
            //alert(t.scrollTable.find("thead:first").height());
            var scrollPanelHeight = (t.data.length) * 35;

            //var scrollPanelHeight = t.scrollTable.find("tbody:first").height() + t.scrollTable.find("thead:first").height();
            //var scrollPanelWidth = scrollPanel.width();

            if (!fixPanel) {
                fixPanelWidth = 0;
                fixPanelHeight = 0;
                t.fixTable.parent().remove();
            } else {
                fixPanelWidth = t.fixTable.width();
                fixPanel.css({
                    top: 0,
                    left: 0,
                });
            }

            if (t.maxHeight === 0)
                t.maxHeight = t.scrollTable.height();
            root.height(t.maxHeight);

            var tableWidth = root.width(); //> t.maxWidth ? t.maxWidth : root.width();

            scrollPanel.css({
                top: 0,
                left: fixPanelWidth,
                width: tableWidth - fixPanelWidth,
                padding: 0,
                margin: 0,
            });

            t.repairHeight();

            if (scrollPanelHeight < t.scrollTable.height()) {
                scrollPanelHeight = t.scrollTable.height();
            }

            var tableHeight;
            if (root.height() > scrollPanelHeight) {

                tableHeight = scrollPanelHeight;
                root.height(scrollPanelHeight);

            } else {
                tableHeight = root.height();
            }

            if (scrollPanel.width() >= t.scrollTable.width()) {
                t.scrollTable.width(scrollPanel.width());
                scrollPanel.css("overflow", "hidden");
            }

            t.father.width(tableWidth);
            t.father.height(scrollPanelHeight);

            if ((scrollPanelHeight + t.additionHeight) <= root.height()) {
                t.grandfather.height(tableHeight);
            } else {
                t.grandfather.height(t.maxHeight - t.additionHeight);
            }

            t.grandfather.width(tableWidth + t.scrollbarWidth);

            scrollPanel.scroll(function () {

                var target = $(this);
                var sl = target.scrollLeft();
                t.scrolleft = sl;

                t.floatScrollTableTitlePanel.scrollLeft(sl);
                if (t.footTable)
                    t.footTable.scrollTable.parent().scrollLeft(sl);
            });

            t.grandfather.scroll(function () {
                var st = $(this).scrollTop();
                if (st > 0) {
                    t.floatTitle.css("opacity", "1");
                    //t.floatTitle.css("backgroundColor","#fff");
                    t.floatTitle.css("border-bottom", "1px solid #44ccff");
                } else {
                    t.floatTitle.css("border-bottom", "none");
                    //t.floatTitle.css("zIndex", "1");
                }
                //t.scrolleft = st;
            });

            t.floatScrollTableTitlePanel = scrollPanel.clone();
            t.floatScrollTableTitlePanel.find("tbody:first").hide();

            t.floatScrollTableTitlePanel.bind("touchstart", function () {
                //event.preventDefault();
            });

            scrollPanel.bind("touchstart", function () {
                //t.floatTitle.css("z-index", -1);
            });

//            t.floatScrollTableTitlePanel.scroll(function () {
//                scrollPanel.scrollLeft($(this).scrollLeft());
//            });

            if (t.floatTitle)
                t.floatTitle.remove();
            t.floatTitle = $("<div class='float-title'></div>");

            if (fixPanel) {
                t.floatFixTableTitlePanel = fixPanel.clone();
                t.floatFixTableTitlePanel.find("tbody:first").hide();
                t.floatTitle.append(t.floatFixTableTitlePanel);
            }
            t.floatTitle.append(t.floatScrollTableTitlePanel);
            t.floatTitle.css({
                width: tableWidth,
                height: scrollPanel.find("thead:first").height(),
            });
            t.floatTitle.width(tableWidth).height(scrollPanel.find("thead:first").height());

            root.append(t.floatTitle);

            if (t.data.length === 1) {
                t.scrollTable.find("tr:last-child td").each(function () {
                    $(this).css("border-bottom", "2px solid #ccddff");
                });
                if (fixPanel) {
                    t.fixTable.find("tr:last-child td").each(function () {
                        $(this).css("border-bottom", "2px solid #ccddff");
                    });
                }
            }

            $(".sort-triangle-th").click(function () {
                $.showIndicator();
                var tt = $(this);
                window.setTimeout(function () {
                    t.sort(tt.attr("data-field"));
                    $.hideIndicator();

                }, 200);

            });
            t.floatTitle.find("thead:first").css("visibility", "visible");
            t.scrollTable.find("thead").css("visibility", "collapse");
            t.fixTable.find("thead").css("visibility", "collapse");
//            
//            if (g.terminal === "pc") {
//                
//            }else if (g.terminal === "phone"){
//                
//            }

        };

        t.setFullVeil = function () {
            var veilFloat = $("<div class='veil-float'></div>");
            veilFloat.appendTo(root);
            veilFloat.width(root.width()).height(root.height());
        };

        t.setFootTable = function (foot) {
            t.footTable = foot;
            foot.root.find("tr").css("background-color", "#96D4DF");
            var footHead = foot.root.find("thead:first");
            t.grandfather.height(t.root.height());

            return t;
        };

        t.hideThead = function () {
            root.find("thead").hide();
            root.find(".float-title").hide();
            return t;
        };

        t.initBottomTable = function (data) {

            var tds1 = t.fixTable.children("thead:first").children("tr:first").html();
            var tds2 = t.scrollTable.children("thead:first").children("tr:first").html();
            var bt = $("<table class='bottom-table'><thead><tr>" + tds1 + tds2 + "</tr></thead></table>").appendTo(root);
            //console.debug(data.length);
            for (var i = 0; i < data.length; i++) {
                var tr = $("<tr></tr>");
                for (var column in data[i]) {
                    if (!(column in t.fixColumns) && !(column in t.scrollColumns)) {
                        continue;
                    }
                    var fieldOption = t.scrollColumns[column] ? t.scrollColumns[column] : t.fixColumns[column];

                    if ("width" in fieldOption)
                        tr.append("<td width=" + fieldOption["width"] + ">" + data[i][column] + "</td>");
                    else
                        tr.append("<td>" + data[i][column] + "</td>");
                }
                tr.appendTo(bt);
            }

            t.footTable = bt;
        };

        t.repairHeight = function () {

            if (Object.getOwnPropertyNames(t.fixColumns).length === 0)
                return;

            var fixThead = t.fixTable.find("thead:first");
            var scrollThead = t.scrollTable.find("thead:first");

            var realHeight = fixThead.height() < scrollThead.height() ? scrollThead.height() : fixThead.height();
            var heighter = fixThead.height() < scrollThead.height() ? scrollThead : fixThead;
            var lower = fixThead.height() > scrollThead.height() ? scrollThead : fixThead;

            var lowerTRHeight = realHeight / lower.find("tr").length;
            lower.find("tr").each(function () {
                $(this).height(lowerTRHeight);
            });

            var fixTrs = t.fixTable.find("tbody:first").children();
            var scrollTrs = t.scrollTable.find("tbody:first").children();
            for (var i = 0; i < fixTrs.length; i++) {
                var h1 = $(fixTrs[i]).height();
                var h2 = $(scrollTrs[i]).height();
                //alert(h1 + "-" + h2);
                if (h1 > h2) {
                    $(scrollTrs[i]).height(h1)
                } else if (h1 < h2) {
                    $(fixTrs[i]).height(h2)
                }
            }
            console.debug(t.scrollTable.height());
            window.setTimeout(function () {

            }, 5000);

        };

        t.setFixcolumns = function (columns) {
            t.fcolumns = columns;
            return t;
        };

        t.setFixcolumnsHtml = function (columns) {
            var fix_tr_thead = $("<thead class='thead'></thead>").appendTo(t.fixTable);

            for (var i = 0; i < columns.length; i++) {
                var fix_tr = $("<tr></tr>");
                for (var j = 0; j < columns[i].length; j++) {
                    var fieldOption = columns[i][j];
                    var title = fieldOption.title;
                    var field = fieldOption.field;

                    var th = $("<th></th>");
                    if ("width" in fieldOption || "min-width" in fieldOption) {
                        //var th = $("<th min-width=" + fieldOption.width + "></th>");
                        th.css("min-width", fieldOption.width);
                    } else {
                        //th = $("<th></th>");
                    }

                    if (!title) {
                        title = field;
                    }
                    th.html(title);

                    if (field) {
                        t.fixColumns[field] = fieldOption;
                    }

                    if (fieldOption.rowspan) {
                        th.attr("rowspan", fieldOption.rowspan);
                    }

                    if (fieldOption.colspan) {
                        th.attr("colspan", fieldOption.colspan);
                    }
                    fix_tr.append(th);
                }
                fix_tr.appendTo(fix_tr_thead);
            }
            return t;
        };

        t.editRow = function (_id, record) {
            var old = $("#scroll" + _id);
            if (old.length === 0) {
                console.debug("editRow do not exist...");
                return;
            }
            var scrollTr = $("<tr></tr>").appendTo(t.scrollTable);
            scrollTr.attr("id", "scroll" + record["_id"]);
            for (var column in record) {
                var value = record[column];
                var fieldOption = t.scrollColumns[column] ? t.scrollColumns[column] : t.fixColumns[column];
                if (!fieldOption)//no match field
                    continue;
                if ("formatter" in fieldOption)
                    value = fieldOption.formatter(record, value, 0);
                if (column in t.fixColumns) {

                } else {
                    scrollTr.append("<td>" + value + "</td>");
                }
            }
            old.after(scrollTr);
            old.remove();
        };

        t.getRow = function (_id) {
            return $("#scroll" + _id);
        };

        t.setColumns = function (columns) {
            t.scolumns = columns;
            return t;
        };

        t.setScrollColumnsHtml = function (columns) {
            var scroll_tr_thead = $("<thead class='thead'></thead>").appendTo(t.scrollTable);
            for (var i = 0; i < columns.length; i++) {
                var tr = $("<tr></tr>");
                for (var j = 0; j < columns[i].length; j++) {
                    var fieldOption = columns[i][j];

                    if ("hidden" in fieldOption && fieldOption["hidden"])
                        continue;

                    var title = fieldOption.title;
                    var field = fieldOption.field;
                    var origTitle = title;

                    var th;
                    if ("width" in fieldOption) {
                        th = $("<th width=" + fieldOption.width + "></th>")
                    } else {
                        th = $("<th></th>");
                    }

                    if ("min-width" in fieldOption) {
                        th.css("min-width", fieldOption["min-width"]);
                    }

                    th.attr("data-field", field);
                    if (!title) {
                        title = field;
                    }
                    //titleFormattor
                    if (fieldOption.titleFormattor) {
                        title = fieldOption.titleFormattor(title)
                    }

                    if (fieldOption.sortable && fieldOption.sortable === true) {
                        title = (title + "<div class='sort-triangle'><div class='sort-triangle-up'></div><div class='sort-triangle-down'></div></div>");
                        th.addClass("sort-triangle-th");
                    }


                    th.html(title);

                    if (field) {
                        t.scrollColumns[field] = fieldOption;
                    }

                    if (fieldOption.rowspan) {
                        th.attr("rowspan", fieldOption.rowspan);
                    }

                    if (fieldOption.colspan) {
                        th.attr("colspan", fieldOption.colspan);
                    }
                    tr.append(th);
                }
                tr.appendTo(scroll_tr_thead);
            }

            return t;
        };

        t.sort = function (field) {
            var option = t.scrollColumns[field];
            var data1 = t.data;
            //console.debug(t.data);
            if (t.orderBy === undefined) {
                data1.sort(function (a, b) {
                    if (option["sortby"]) {
                        var a1 = parseInt("1" + String(a[option["sortby"]]).replace(".", ""));
                        var b1 = parseInt("1" + String(b[option["sortby"]]).replace(".", ""));
                        return a1 <= b1 ? -1 : 1;
                    } else {
                        var a1 = parseInt("1" + String(a[field]).replace(".", ""));
                        var b1 = parseInt("1" + String(b[field]).replace(".", ""));
                        return a1 <= b1 ? -1 : 1;
                    }
                });
                t.orderBy = "asc";
            } else if (t.orderBy === "asc") {
                data1.sort(function (a, b) {
                    if (option["sortby"]) {
                        var a1 = parseInt("1" + String(a[option["sortby"]]).replace(".", ""));
                        var b1 = parseInt("1" + String(b[option["sortby"]]).replace(".", ""));
                        return a1 > b1 ? -1 : 1;
                    } else {
                        var a1 = parseInt("1" + String(a[field]).replace(".", ""));
                        var b1 = parseInt("1" + String(b[field]).replace(".", ""));
                        //console.debug(a[field]);
                        if (a[field] === 1.55) {
                            console.debug(a1);
                            console.debug(b1);
                            console.debug(a1 > b1);
                        }
                        return a1 > b1 ? -1 : 1;
                    }
                });
                t.orderBy = "desc";
            } else if (t.orderBy === "desc") {
                data1.sort(function (a, b) {
                    if (option["sortby"]) {
                        var a1 = parseInt("1" + String(a[option["sortby"]]).replace(".", ""));
                        var b1 = parseInt("1" + String(b[option["sortby"]]).replace(".", ""));
                        return a1 <= b1 ? -1 : 1;
                    } else {
                        var a1 = parseInt("1" + String(a[field]).replace(".", ""));
                        var b1 = parseInt("1" + String(b[field]).replace(".", ""));
                        return a1 <= b1 ? -1 : 1;
                    }
                });
                t.orderBy = "asc";
            }
            t.render();
            //t.refreshTable();
            //console.debug(data1);
        };

        t.refreshTable = function () {
            t.fixTable.find("tbody:first").children().remove();
            t.scrollTable.find("tbody:first").children().remove();

            for (var d = 0; d < t.data.length; d++) {
                var record = t.data[d];
                var fixTr = $("<tr></tr>").appendTo(t.fixTable);
                var scrollTr = $("<tr></tr>").appendTo(t.scrollTable);
                if (record["_id"]) {
                    fixTr.attr("id", "fix" + record["_id"]);
                    scrollTr.attr("id", "scroll" + record["_id"]);
                }

                for (var column in t.scrollColumns) {
                    var td = $("<td></td>");
                    var fieldOption = t.scrollColumns[column];
                    if ("hidden" in fieldOption && fieldOption["hidden"])
                        continue;
                    var value = record[column];
                    if (value === undefined)//no match field
                        continue;
                    if ("formatter" in fieldOption)
                        value = fieldOption.formatter(record, value, column);
                    if ("width" in fieldOption) {
                        td.css("width", fieldOption["width"]);
                    }
                    if ("min-width" in fieldOption) {
                        td.css("min-width", fieldOption["min-width"]);
                    }
                    if ("align" in fieldOption) {
                        td.css("text-align", fieldOption["align"]);
                    }
                    td.html(value);
                    scrollTr.append(td);
                }

                for (var column in t.fixColumns) {
                    var td = $("<td></td>");
                    var fieldOption = t.fixColumns[column];
                    if ("hidden" in fieldOption && fieldOption["hidden"])
                        continue;
                    var value = record[column];
                    if (value === undefined)//no match field
                        continue;
                    if ("formatter" in fieldOption)
                        value = fieldOption.formatter(record, value, column);
                    if ("width" in fieldOption) {
                        td.css("max-width", fieldOption["width"]);
                        td.css("min-width", fieldOption["width"]);
                    }
                    if ("align" in fieldOption) {
                        td.css("text-align", fieldOption["align"]);
                    }
                    td.html(value);
                    fixTr.append(td);
                }
            }
        };

        t.refreshTable2 = function () {
            t.fixTable.find("tbody:first").children().remove();
            t.scrollTable.find("tbody:first").children().remove();

            for (var d = 0; d < t.data.length; d++) {
                var record = t.data[d];
                var fixTr = $("<tr></tr>").appendTo(t.fixTable);
                var scrollTr = $("<tr></tr>").appendTo(t.scrollTable);
                if (record["_id"]) {
                    fixTr.attr("id", "fix" + record["_id"]);
                    scrollTr.attr("id", "scroll" + record["_id"]);
                }
                for (var column in record) {
                    var value = record[column];
                    var fieldOption = t.scrollColumns[column] ? t.scrollColumns[column] : t.fixColumns[column];
                    if (!fieldOption)//no match field
                        continue;
                    if ("hidden" in fieldOption && fieldOption["hidden"])
                        continue;

                    if (column in t.fixColumns) {
                        if ("formatter" in fieldOption)
                            value = fieldOption.formatter(record, value, column);
                        var td = $("<td></td>");
                        if ("width" in fieldOption) {
                            td.css("max-width", fieldOption["width"]);//word-break:break-all
                            td.css("min-width", fieldOption["width"]);
                            td.css("word-break", "break-all");
                        }

                        if ("align" in fieldOption) {
                            td.css("text-align", fieldOption["align"]);
                        }
                        td.html(value);
                        fixTr.append(td);
                    } else if (column in t.scrollColumns) {
                        if ("formatter" in fieldOption)
                            value = fieldOption.formatter(record, value, column);
                        if ("width" in fieldOption)
                            scrollTr.append("<td width=" + fieldOption["width"] + ">" + value + "</td>");
                        else
                            scrollTr.append("<td>" + value + "</td>");
                        if ("align" in fieldOption) {
                            scrollTr.css("text-align", fieldOption["align"]);
                        }
                        //console.debug(root + value); 
                    }
                }
                //console.debug(d);
            }
//            console.debug(t.scrollTable.height());
//            t.scrollTable.find("tr").each(function(){
//                console.debug($(this).height());
//            });
//            
        };

        t.sortFunction = function (func) {
            t.sort = func;
        };


        return t;
    }
};
