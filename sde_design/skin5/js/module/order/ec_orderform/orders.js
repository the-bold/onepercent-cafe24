/* File start */
$(document).ready(function(){

    if (EC_MOBILE_DEVICE == true) {
        //실시간 계좌이체, 에스크로 결제 수단 제외 처리
        $('#addr_paymethod').find("option[value='tcash']").remove();
        $('#addr_paymethod').find("option[value='esc_vcash']").remove();
        $('#payment_input_tcash').hide();
        $('#payment_input_esc_vcash').hide();
    }

    // 청약 철회 방침에 동의
    $('#subscription').click(function() {
        if ($(this).attr('checked') === true) {
            $('#subscription_agreement0').attr('checked', true);
        } else {
            $('#subscription_agreement1').attr('checked', true);
        }
    });

    var fixLayerPriceRest = function() {
        $('#checked_order_count, #checked_order_price').html('').css('padding-bottom','0');
    };

    // 고정영역 빈값세팅
    fixLayerPriceRest();

    // 고정영역에 상품정보 세팅
    var fixedLayerPriceSet = function() {
        var iSumPrice = 0;
        var iCheckPrdCnt = 0;
        $('[id^="chk_order_cancel_list"]').each(function(){
            if ($(this).attr('checked') == true) {
                var sCheckId = $(this).attr('id');
                var aTemp = sCheckId.split('_');
                var iCheckId = aTemp[3].replace(/[^0-9]/g, '');
                var iProductPrice = aBasketProductOrderData[iCheckId].product_sum_price;
                iSumPrice = iSumPrice + iProductPrice;
                iCheckPrdCnt = iCheckPrdCnt + 1;
            }
        });
        if (iCheckPrdCnt > 0) {
            var sTotalPrice = SHOP_PRICE_FORMAT.toShopPrice(iSumPrice);
            $('#checked_order_count').html('<strong>' + sprintf(__('%s'),iCheckPrdCnt) + '</strong>' +'개 상품선택').css('padding-bottom','5px');
            $('#checked_order_price').html('결제예정금액 <strong><em>'+sTotalPrice+'</em></strong>').css('padding-bottom','5px');
        } else {
            fixLayerPriceRest();
        }

        var sPriceRef = SHOP_PRICE_FORMAT.shopPriceToSubPrice(iSumPrice);
        if (sPriceRef != '') $('#checked_order_price').find('strong').append(sPriceRef);
    };

    // 장바구니 체크박스 체크시 상품총합계, 체크한 숫자 구하기
    $('[id^="chk_order_cancel_list"]').click(function(e) {
        fixedLayerPriceSet();
    });

    // fix주문하기 버튼 클릭
    $('#btn_payment_fix').unbind().bind('click', function() {
        $('#btn_payment').trigger('click');
    });

    // 상품리스트 전체선택
    $('#product_select_all').bind('click', function() {
        var _status = $(this).data('status');

        $('[id^="chk_order_cancel_list"]').each(function(){
            var bChecked = $(this).is(":checked");

            if (_status == 'off') {
                if (bChecked === false) $(this).attr('checked', true);
            } else {
                $(this).attr('checked', false);
            }
        });

        $(this).data('status', _status == 'off' ? 'on' : 'off');
        fixedLayerPriceSet();
    });

    // 적립금, 마일리지 전체사용
    $('#all_use_mileage, #all_use_deposit').unbind().bind('click', function() {
        var id = $(this).attr('id');
        var total_mileage = parseInt($('#ori_total_avail_mileage').val());
        var total_deposit = parseInt($('#ori_total_deposit').val());
        if (id == 'all_use_mileage') {
            $('#input_mile').attr('value', total_mileage);
            $('#input_mile').trigger('blur');
        } else {
            $('#input_deposit').attr('value', total_deposit);
            $('#input_deposit').trigger('blur');
        }
    });
});

//정기배송 이용약관 동의
function viewRegularDelivery() {
    window.open('/order/ec_orderform/agreement/regular_delivery.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
}

//쇼핑몰 이용약관 동의
function viewMallAgree() {
    if (EC_MOBILE_DEVICE == true) {
        window.open('/order/ec_orderform/agreement/mallagree.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
    } else {
        window.open('/order/ec_orderform/agreement/mallagree.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'), '', 'width=450,height=350');
    }
}
//비회원 구매시 개인정보수집이용동의
function viewPersonAgree() {
    if (EC_MOBILE_DEVICE == true) {
        window.open('/order/ec_orderform/agreement/personagree.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
    } else {
        window.open('/order/ec_orderform/agreement/personagree.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'), '', 'width=450,height=350');
    }
}
//청약철회방침 보기
function viewSubscription() {
    if (EC_MOBILE_DEVICE == true) {
        window.open('/order/ec_orderform/agreement/subscription.html?basket_type='+$('#basket_type').val());
    } else {
        window.open('/order/ec_orderform/agreement/subscription.html?basket_type='+$('#basket_type').val(), '', 'width=450,height=350');
    }
}
//전자보증보험 보기
function viewInsurance() {
    if (EC_MOBILE_DEVICE == true) {
        window.open('/order/ec_orderform/agreement/insurance.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
    } else {
        window.open('/order/ec_orderform/agreement/insurance.html?basket_type='+$('#basket_type').val() +'&delvtype='+getQueryString('delvtype'), '', 'width=450,height=350');
    }
}
//Daum 비회원 구매 동의 보기
function viewDaum() {
    if (EC_MOBILE_DEVICE == true) {
        window.open('/order/ec_orderform/agreement/daum.html?basket_type='+$('#basket_type').val());
    } else {
        window.open('/order/ec_orderform/agreement/daum.html?basket_type='+$('#basket_type').val(), '', 'width=450,height=350');
    }
}
//배송정보 제공방침 동의
function viewDelivery() {
    if (EC_MOBILE_DEVICE == true) {
        window.open('/order/ec_orderform/agreement/delivery.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
    } else {
        window.open('/order/ec_orderform/agreement/delivery.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'), '', 'width=450,height=350');
    }
}
//고유식별정보수집 동의
function viewIdentification() {
    if (EC_MOBILE_DEVICE == true) {
        window.open('/order/ec_orderform/agreement/identification.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
    } else {
        window.open('/order/ec_orderform/agreement/identification.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'), '', 'width=450,height=350');
    }
}
//개인정보수집 이용동의
function viewMemberJoinAgree() {
    if (EC_MOBILE_DEVICE == true) {
        window.open('/order/ec_orderform/agreement/privacy_agreement.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
    } else {
        window.open('/order/ec_orderform/agreement/privacy_agreement.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'), '', 'width=450,height=350');
    }
}
//개인정보 제3자 제공 동의
function viewInformationAgree() {
    if (EC_MOBILE_DEVICE == true) {
        window.open('/order/ec_orderform/agreement/information_agreement.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
    } else {
        window.open('/order/ec_orderform/agreement/information_agreement.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'), '', 'width=450,height=350');
    }
}
//개인정보취급 위탁 동의
function viewConsignmentAgree() {
    if (EC_MOBILE_DEVICE == true) {
        window.open('/order/ec_orderform/agreement/consignment_agreement.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
    } else {
        window.open('/order/ec_orderform/agreement/consignment_agreement.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'), '', 'width=450,height=350');
    }
}
//크라우드 펀딩 이용 동의
function viewCrowdfunding() {
    if (EC_MOBILE_DEVICE == true) {
        window.open('/order/ec_orderform/agreement/crowdfunding.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
    } else {
        window.open('/order/ec_orderform/agreement/crowdfunding.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'), '', 'width=450,height=350');
    }
}
function viewSafePhone() {
    if (EC_MOBILE_DEVICE == true) {
        window.open('/order/ec_orderform/popup/safePhone.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
    } else {
        window.open('/order/ec_orderform/popup/safePhone.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'), '', 'width=500,height=467');
    }
}

// 결제대행서비스 약관 동의
function viewPaymentAgree() {
    if (EC_MOBILE_DEVICE == true) {
        window.open('/protected/order/payment_agree_financial.html');
    } else {
        window.open('/protected/order/payment_agree_financial.html', '', 'width=450,height=350');
    }
}

//장바구니 선택상품 삭제
function selBasketDel(id) {
    $('[id^="'+BASKET_CHK_ID_PREFIX+'"]').attr('checked', false);
    $('[id="'+id+'"]').attr('checked', true);
    Basket.deleteBasket();
}

// 도움말 툴팁
$('body').delegate('.mTooltip .eTip', 'click', function(e){
    var findSection = $(this).parents('.section:first');
    var findTarget = $($(this).siblings('.tooltip'));
    var findTooltip = $('.tooltip');
    $('.mTooltip').removeClass('show');
    $(this).parents('.mTooltip:first').addClass('show');
    $('.section').css({'zIndex':0, 'position':'static'});
    findSection.css({'zIndex':100, 'position':'relative'});

    findTooltip.hide();
    findTarget.show();
    e.preventDefault();
});
$('body').delegate('.mTooltip .eClose', 'click', function(e){
    var findSection = $(this).parents('.section:first');
    var findTarget = $(this).parents('.tooltip:first');
    $('.mTooltip').removeClass('show');
    findTarget.hide();
    findSection.css({'zIndex':0, 'position':'static'});
    e.preventDefault();
});
/**
 * 원터치주문서 > 레이어 보기
 */
$("body").delegate(".ec-jigsaw-eLayer", "click", function(e){
    var findTarget = $($(this).attr("href"));
    //call dimmed layer position function
    dimmedLayerPosition(findTarget);
    //흰색 투명 배경 생성.
    findTarget.parent().append("<div id='dimmed_"+ findTarget.attr('id') +"' class='dimmed'></div>");
    //흰색 투명 배경이 2개 이상일경우 zindex를 높여서 처리해줌.
    if($(".dimmed").length > 1 ){
        $(".dimmed").addClass("hide");
        var propZIndex = 110 + $(".dimmed").length;
        $(findTarget).css({"zIndex":propZIndex+5});
        $("#dimmed_"+ findTarget.attr("id")).css({ "zIndex" : propZIndex }).removeClass("hide");
    }
    e.preventDefault();
});
/**
 * 원터치주문서 > 회색 레이어 위치
 */
function dimmedLayerPosition(target){
    if(!target.attr("fixed")){
        var findLayer = target,
            propWinWidth = $(window).width(),
            propWinHeight = $(window).height(),
            propWidth = findLayer.outerWidth(),
            propHeight = findLayer.outerHeight(),
            propWinScroll = $(window).scrollTop();
        if(propWinWidth < propWidth){
            findLayer.css({"left":0, "marginLeft":0});
        } else {
            var propLeft = propWidth/2;
            findLayer.css({"left":"50%", "marginLeft":"-"+ propLeft +"px"});
        }
        var propTop = (propWinHeight/2) - (propHeight/2) + propWinScroll;
        findLayer.css({"top":propTop});
        findLayer.show();
    }
}
/* File end */
