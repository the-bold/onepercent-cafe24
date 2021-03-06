$(document).ready(function(){
    
    var reviewer = ($.CAFE24_SDK_REVIEWER_UP) ? $.CAFE24_SDK_REVIEWER_UP.skin.shift() : false;
    //console.log($.CAFE24_SDK_REVIEWER_UP, reviewer, 3);
    var rowData = {};
    var modeSet = ["img", "text", "all"];
    
    var gpage = 1;
    var gtotalpage;
    var gpno;
    var glimit;
    var gtype;
    var gdetail;
    var guse_point;
    var config;
    var sort;
    var moreBtn = $(".skin_grid2 .prv_table").next(".skin_grid2 .more");
    var readyFlag = true;
    
    init();
    
    function init()
    {
        if ( reviewer && reviewer.data.length > 0) {
            
            gtotalpage = reviewer.total_page;
            gpno = reviewer.pno;
            glimit = reviewer.cnt;
            gtype = reviewer.type;
            gdetail = reviewer.detail;
            guse_point = reviewer.config.use_point;
            config = reviewer.config;
            sort = reviewer.sort;
            if (moreBtn.length > 0 && gtotalpage > 1) {
                moreBtn.show();
            }
            
            $('.skin_grid2 .prv_table td img[src=""]').hide();
            initData();
            setEvt();
        } else {
			$('.rvArea1').remove();
        }

        $(".skin_grid2 .prv_table tbody").show();
    }

	// 작업 텍스트 자르기후 ... 추가
   function textOverCut(txt, len, lastTxt) {
        if (len == "" || len == null) { // 기본값
            len = 20;
        }
        if (lastTxt == "" || lastTxt == null) { // 기본값
            lastTxt = "...";
        }
        if (txt.length > len) {
            txt = txt.substr(0, len) + lastTxt;
        }
        return txt;
    }
    
    function initData()
    {
        hideElem();
        if (reviewer.data && reviewer.data.length > 0) {
            for (var i=0; i<reviewer.data.length; i++) {
                var row = reviewer.data[i];
                row.index = i;
                
                if (typeof row.rcont == 'string') {
                    row.rcont = "<span class='cont_dtl'>" + row.rcont.replace(/<p[^>]*>/g,'').replace(/<\/p>/g,'<br/>') + "</span>";
					// 작업 45 글자로 자르기
					var byt = 100;
					var cutTxt = textOverCut(row.rcont.replace(/<p[^>]*>/g,'').replace(/(<([^>]+)>)/gi, "").replace(/<\/p>/g,'<br/>'),byt);
                    row.rcont += "<span class='cont_list'>" + cutTxt + "</span>";
                }
                rowData[row.no] = row; 
            }
        }
    }
    
    function setEvt()
    {
        $(document).delegate(".skin_grid2 .rv_btn_close", 'click', function(e){
            e.preventDefault();
            var tr = $(this).parent().parent();
            if (tr.hasClass('selected')) {
                $(".skin_grid2 .prv_table").find("tr").removeClass("selected");
                $(".skin_grid2 .reviewDetail").hide().remove();        
            } else {
                $(".skin_grid2 .prv_table").find("tr").removeClass("selected");
                $(".skin_grid2 .reviewDetail").hide().remove();
                
                var tr = $(this).parent().parent();
                var no = $(this).attr("href");
                var rel_no = $(this).attr("rel");
                if (rel_no) {
                    no = rel_no;
                }
                
                showDetail(tr, no);
                tr.addClass('selected');
                $(".skin_grid2 .reviewDetail").show();
            }
        });
		
        $(document).delegate(".skin_grid2 .preview_detail", 'click', function(e){
            e.preventDefault();
            var tr = $(this).parent().parent();
            if (tr.hasClass('selected')) {
                $(".skin_grid2 .prv_table").find("tr").removeClass("selected");
                $(".skin_grid2 .reviewDetail").hide().remove();        
            } else {
                $(".skin_grid2 .prv_table").find("tr").removeClass("selected");
                $(".skin_grid2 .reviewDetail").hide().remove();
                
                var tr = $(this).parent().parent();
                var no = $(this).attr("href");
                var rel_no = $(this).attr("rel");
                if (rel_no) {
                    no = rel_no;
                }
                
                showDetail(tr, no);
                tr.addClass('selected');
                $(".skin_grid2 .reviewDetail").show();
            }
        });
        
        $(".skin_grid2 .photoreview-outputNumber").change(function(e){
            var val = $(this).val();
            val = parseInt(val, 10);
            if (typeof val == 'number' && val > 0) {
                glimit = val;
                gpage = 1;
                $.CAFE24_SDK_REVIEWER_UP.call_more({act:'getMore',pno:gpno, next:gpage, cnt:glimit, mode:gtype, point:guse_point, config:config, sort:sort}, page_refresh);
            }
        });
        
        $(".skin_grid2 .photoreview-viewMode").change(function(e){
            var val = $(this).val();
            val = (val == 'txt') ? 'text' : val;
            if ($.inArray(val, modeSet) !== -1) {
                gtype = val;
                gpage = 1;
                $.CAFE24_SDK_REVIEWER_UP.call_more({act:'getMore',pno:gpno, next:gpage, cnt:glimit, mode:gtype, point:guse_point, config:config, sort:sort}, page_refresh);
            }
        });
        
        $(document).delegate(".skin_grid2 .photoreview .photoreview-paging a", "click", function(e){
            e.preventDefault();
            var page = $(this).attr("href");
            if (page) {
                page = parseInt(page, 10);
                if (!isNaN(page)) {
                    $.CAFE24_SDK_REVIEWER_UP.call_more({act:'getMore',pno:gpno, next:page, cnt:glimit, mode:gtype, point:guse_point, config:config, sort:sort}, page_refresh);
                }
            }
        });
        
        //support old version
        moreBtn.find('a').click(function(e){
            e.preventDefault();
            if (gpage >= gtotalpage) {
                moreBtn.hide();
                return false;
            }
            
            if (readyFlag == true) {
                readyFlag = false;
                moreBtn.hide();
                $.CAFE24_SDK_REVIEWER_UP.call_more({act:'getMore',pno:gpno, next:gpage+1, cnt:glimit, mode:gtype, point:guse_point, config:config, sort:sort}, page_refresh_old);
            }
            
        });
    }
    
    function page_refresh(list)
    {
        reviewer = list;
        initData();
        
        var data = list.data;
        if (data && data.length > 0) {
            $(".skin_grid2 .prv_table tbody").hide().html('');
            for(var i=0; i<data.length; i++) {
                var cell = makeCell(data[i]);
                if (cell) {
                    $(".skin_grid2 .prv_table tbody").append(cell);
                }
            }
            
            if (typeof list.pagination == "string") {
                $(".skin_grid2 .photoreview .photoreview-paging").html(list.pagination);
            }
            
            hideElem();
            $(".skin_grid2 .prv_table tbody").show();
            
            gpage = reviewer.page;

            if (gpage >= gtotalpage) {
                moreBtn.hide();
            } else {
                moreBtn.show();
            }
            readyFlag = true;
        }
    }
    
    function page_refresh_old(list)
    {
        reviewer = list;
        initData();
        
        var data = list.data;
        if (data && data.length > 0) {
            for(var i=0; i<data.length; i++) {
                var cell = makeCell(data[i]);
                if (cell) {
                    $(".skin_grid2 .prv_table tbody").append(cell);
                }
            }
            
            hideElem();
            $(".skin_grid2 .prv_table tbody").show();
            
            gpage = reviewer.page;
            
            if (gpage >= gtotalpage) {
                moreBtn.hide();
            } else {
                moreBtn.show();
            }
            readyFlag = true;
        }
    }
    
    function showDetail(tr, no)
    {
        if (rowData[no]) {
            var row = rowData[no];
            if (row) {
                var imgs = makeImgTags(row);
                if (typeof imgs == "object" && imgs.length > 0) {
                    for(var i=0; i < imgs.length; i++) {
                        imgs.splice(imgs.indexOf(imgs[i]),1,"<div class='item'>"+imgs[i]+"</div>");
                    }
                    var imgs_html = imgs.join('');
					// 작업 imgs_html 앞에 <div> 추가
                    var detail = '<tr class="reviewArea reviewDetail"><td colspan="8"><a class="rv_btn_close"></a><div class="imgBox"><a href="#none" class="prev"></a><a href="#none" class="next"></a><div>'+imgs_html+'</div></div><div class="contBox"><div class="rv_info"><p class="rate"><img src="/_idio/img/ico_point_'+row.rpoint+'.png"></p><p class="subject">'+row.rsub+'</p><p class="writer"><span class="writer">'+row.rwriter+'</span><span class="date">'+row.rdate+'</span></p><a href="/surl/P/'+row.pno+'"><img src="'+row.pimg_tiny+'" class="prd_tmb"></a></div><div class="rv_content">'+row.rcont+'</div></div></td></tr>';
                } else {
                    var detail = '<tr class="reviewArea reviewDetail"><td colspan="8"><a class="rv_btn_close"></a><div class="contBox"><div class="rv_info"><p class="rate"><img src="/_idio/img/ico_point_'+row.rpoint+'.png"></p><p class="subject">'+row.rsub+'</p><p class="writer"><span class="writer">'+row.rwriter+'</span><span class="date">'+row.rdate+'</span></p><a href="/surl/P/'+row.pno+'"><img src="'+row.pimg_tiny+'" class="prd_tmb"></a></div><div class="rv_content">'+row.rcont+'</div></div></td></tr>';
                }
                
                detail = $(detail);
                tr.after(detail);

                //조회수
                //$.ajax({type:"GET",url:"/apps/photoreview/photodetail.xml?no="+row.rno,success:function(data){}});
                
                _IE8_width_fix(detail);

				
				// 작업 이미지슬라이더 부분
                setTimeout(function() {
                    $(".skin_grid2 .reviewArea .imgBox .item:first").css("opacity","1");
                    $(".skin_grid2 .reviewArea .imgBox .item:first").addClass("active");
                    if($(".skin_grid2 .reviewArea .imgBox .item.active").next().length == 0) $(".skin_grid2 .reviewArea .imgBox .next").hide();
                    if($(".skin_grid2 .reviewArea .imgBox .item.active").prev().length == 0) $(".skin_grid2 .reviewArea .imgBox .prev").hide();
                }, 1);
                setTimeout(function() {
                    $(".skin_grid2 .reviewArea .imgBox .next").click(function (e) {
                         $dom = $(".skin_grid2 .reviewArea .imgBox .item.active").next();
                         $(".skin_grid2 .reviewArea .imgBox .item").removeClass("active");
                         $dom.addClass("active");
                         if($(".skin_grid2 .reviewArea .imgBox .item.active").next().length == 0) $(".skin_grid2 .reviewArea .imgBox .next").hide();
                         if($(".skin_grid2 .reviewArea .imgBox .item.active").prev().length == 0) {
                         	 $(".skin_grid2 .reviewArea .imgBox .prev").hide();   
                         }else {
                         	 $(".skin_grid2 .reviewArea .imgBox .prev").show();    
                         }
                    });
                    $(".skin_grid2 .reviewArea .imgBox .prev").click(function (e) {
                         $dom = $(".skin_grid2 .reviewArea .imgBox .item.active").prev();
                         $(".skin_grid2 .reviewArea .imgBox .item").removeClass("active");
                         $dom.addClass("active");
                         if($(".skin_grid2 .reviewArea .imgBox .item.active").prev().length == 0) $(".skin_grid2 .reviewArea .imgBox .prev").hide();
                         if($(".skin_grid2 .reviewArea .imgBox .item.active").next().length == 0) {
                         	 $(".skin_grid2 .reviewArea .imgBox .next").hide();   
                         }else {
                         	 $(".skin_grid2 .reviewArea .imgBox .next").show();    
                         }                        
                    })
                }, 10);                 
            }
        }
    }
    
    function makeImgTags(row)
    {
        var imgs = [];
        if (row.rhimg && (/^.*\.(jpg|jpeg|png|gif|bmp)$/i).test(row.rhimg)) {
            imgs.push('<img src="'+row.rhimg+'" alt="" />');
        }
        
        if (row.attach && row.attach.length > 0) {
            for (var i=0; i<row.attach.length; i++) {
                var att_img = row.attach[i];
                if (typeof att_img.att_path == "string" && (/^.*\.(jpg|jpeg|png|gif|bmp)$/i).test(att_img.att_path)) {
                    imgs.push('<img src="'+att_img.att_path+'" alt="" />');
                }
            }
        }
        return imgs;
    }
    
    function _IE8_width_fix(tr)
    {
        if ($.browser.msie && $.browser.version == 8) {
            $(tr).find("img").each(function(){
                $tr = $(this).closest("tr");
                $(this).hide().load(function(){
                    if (500 <= $(this).width()) {
                        $(this).css({"max-width":"none", "width":"500px", "height":"auto"});
                    }
                    $(this).show();
                });
            });
        }
    }
    
    function hideElem()
    {
        if (gdetail === true) {
            $('.skin_grid2 .photoreview .is_detail').remove();
        }

        if (guse_point !== true) {
            $('.skin_grid2 .photoreview .is_rating').remove();
        }
    }
    
    function makeCell(c)
    {
        var tmpl = [];
        tmpl.push('<tr id="preview'+c.no+'" class="rv_list">');
        tmpl.push('<td class="rating"><img src="http://shop1.untapped.cafe24.com/img/ico_point_'+c.rpoint+'.png" alt="'+c.rpoint+' Point" /></td>');
        tmpl.push('<td class="subject elp"><a class="preview_detail" href="'+c.no+'">'+c.rsub+'</a></td>');
        tmpl.push('<td class="cont"><a class="preview_detail" href="'+c.no+'">'+c.rcont+'</a></td>');
        tmpl.push('<td class="info"><span class="writer">'+c.rwriter+'</span><span class="date">'+c.rdate+'</span></a></td>');
        tmpl.push('<td class="img" style="background-image:url('+c.rimg+')"><a class="preview_detail" href="'+c.no+'"></a></td>');
        return tmpl.join('');
    }

	$(".skin_grid2 .xans-photoreview-display .prv_table .subject .photoreview.list").each(function(k,v) {
		var writer = $(this).find(".skin_grid2 .writer").html();
		var dat = $(this).find(".skin_grid2 .date").html();
		$(this).find(".skin_grid2 .writer").remove();
		$(this).find(".skin_grid2 .date").remove();
		$(this).html($(this).text());
		$(this).parent().append("<span class='writer'>" + writer + "</span>");
		$(this).parent().append("<span class='date'>" + dat + "</span>");
	});

});

$(document).ready(function(){
    if($(".skin_grid2 .photoreview-outputNumber").length > 0) {
        var count = "4";
        setTimeout(function() {
		    $(".skin_grid2 .photoreview-outputNumber option").eq(0).val(count);
			$(".skin_grid2 .photoreview-outputNumber option").eq(0).attr("selected",true);
        	$(".skin_grid2 .photoreview-outputNumber").change();
		}, 10);
    };
});