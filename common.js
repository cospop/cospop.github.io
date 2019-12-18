var pList;
var productObject={};

$(window).load(function(){
    setGTM();

    var imgSrc = '<img src="/PartnerData/2I/PartnerInfo/2018/12/18/h1a5mmir.rzx.png" style="width:35px; vertical-align:middle; margin-bottom:5px;" />';
    $("nav.category.dev-menuTree div.fix span").html(imgSrc);

    if(typeof productList!='undefined' && productList.length>0){
        getProductList();

        $.each(pList.List,function(index, item){
            if($.inArray(item.Id, productList) != -1){
                item.WishCount = getProductWishCount(item.Id);
                item.NameJp = item.NameJp.replace("　"," ");
                productObject["k"+item.Id] = item;
            }
        });
    }

    $(".productList").each(function(){
        var type = $(this).attr("data-type");
        var codeArr = $(this).attr("data-code").split("|");

        if(type=="main"){
            $(this).html(makemainProductList(codeArr));
        }
    });

    layoutInit();
    categoryInit();
    productDetailInit();
    orderInit();
    orderTotalInit();

    $(document).on("click", ".moncoStyle tbody tr:not(.contentsArea)", function(){
        if($(this).next().hasClass("on")){
            $(this).next().removeClass("on");
        }else{
            $(this).next().addClass("on");
        }
    });

    $(document).on("click", ".moncoStyle2 li", function(e){
        var clickObj = $(this);
        if($(e.target)[0].tagName=="IMG"){
            dataLayer.push({
                'event' : 'mobileImageClick',
                'idx' : clickObj.attr("data-idx"),
                'status' : clickObj.hasClass("active") ? "CLOSE" : "OPEN",
                'status2' : !clickObj.hasClass("active") ? "NONE" : "OPEN",
            });

            return;
        }

        dataLayer.push({
            'event' : 'mobileClick',
            'idx' : clickObj.attr("data-idx"),
            'status' : clickObj.hasClass("active") ? "CLOSE" : "OPEN",
            'status2' : !clickObj.hasClass("active") ? "NONE" : "OPEN",
        });

        $(".moncoStyle2 li").each(function(){
            if(!clickObj.hasClass("active")){
                $(this).removeClass("active");
            }

            $(this).height($(this).attr("data-height"));
            $(this).removeAttr("data-height");
        });

        if(!clickObj.hasClass("active")){
            var imgHeight = 0;
            clickObj.find("img").each(function(){
                imgHeight += $(this).height();
            });

            clickObj.attr("data-height", clickObj.height());
            clickObj.addClass("active");
            clickObj.css("cssText", "height:" + ((clickObj.height()>imgHeight?clickObj.height():imgHeight)+35) + "px !important");
        }else{
            clickObj.removeClass("active");
        }
    });

    // var touchmoved;
    //
    // $(document).on("touchend", ".moncoStyle2 li", function(e){
    //     // e.stopPropagation();
    //     // e.preventDefault();
    //     if(touchmoved != true){
    //         if($(e.target)[0].tagName=="IMG"){
    //             return;
    //         }
    //         var clickObj = $(this);
    //         clickObj.trigger("click");
    //     }
    // }).on('touchmove', function(e){
    //     touchmoved = true;
    // }).on('touchstart', function(){
    //     touchmoved = false;
    // });

    $("body").on('DOMCharacterDataModified', '.modal-dft.active .estimate-write h1', function(e){
        $(this).text("お問い合わせ");
    });

    $("body").on('DOMCharacterDataModified', '.modal-dft.active .estimate-view h1', function(e){
        $(this).text("お問い合わせの編集");
    });

    $("body").on('DOMCharacterDataModified', '.modal-dft.active .delete span', function(e){
        $(this).text("キャンセル");
    });

    $("body").on('DOMCharacterDataModified', '.modal-dft.active .option_notice_msg', function(e){
        $(this).text($(this).text().replace(/お見積もりリスト/gi, '「Q & A'));
    });

    $("body.ctrl-mypage.act-orders").on('DOMCharacterDataModified', '.modal-dft.active .mypage-order-detail .shipping .title', function(e){
        $(this).html($(this).text()+"<br/><span style='font-size:8pt;'>(一部離島・山間部は中継料金が追加されます)</span>");
    });

    $("body").on('DOMCharacterDataModified', '.mypage#skin1-container .estimate ul.list .state-detail.estimate.checking > span', function(e){
        $(this).text($(this).text().replace(/見積中/gi, '質問'));
        $(this).text($(this).text().replace(/見積済/gi, '返答'));
        $(".mypage#skin1-container .estimate .state-detail.estimate.checking > span").css("visibility", "visible");
    });

    $("body").on('DOMCharacterDataModified', '#skin1-header nav.category div > ul > li', function(e){
        var link = $(this).children("a").attr("href");
        $(this).css("visibility", "visible");
        if(link == "/mypage" || link == "/Account" || link == "/Support/OrderProcess"){
            $(this).hide();
        }
    });

    $(document).on("click", ".productDetailTab li", function(e){
        var targetTop = 0;
        var controlTop = $(".productDetailTab").hasClass("topFixed") ? 86 : 0;

        if($(this).attr("id") == "cospopDetail"){
            targetTop = $("section.contents:first").offset().top-150;
        }else if($(this).attr("id") == "cospopReview"){
            targetTop = $("section.contents.reviews").offset().top-190;
        }else if($(this).attr("id") == "cospopQna"){
            location.href = "/NonMemberEstimate";
            return false;
        }

        $('html, body').animate({scrollTop : targetTop+controlTop}, 400);
    });

    $(document).on("click touchend", ".payBtnArea", function(e){
        e.stopPropagation();
        e.preventDefault();
        $(".payBtnArea").addClass("viewOn");
        $(".item-view#skin1-container section.form .option").addClass("viewOn");
    });

    $(document).on("click touchend", ".optionClose", function(e){
        e.stopPropagation();
        e.preventDefault();
        $(".payBtnArea").removeClass("viewOn");
        $(".item-view#skin1-container section.form .option").removeClass("viewOn");
    });

    $(document).on("change", ".item-view#skin1-container section.form .box-select select", function(e){
        if($(".item-view#skin1-container section.form .box-select select option:selected").val() == ""){
            $(this).parents(".item-view#skin1-container section.form").addClass("incomplete");
        }else{
            $(this).parents(".item-view#skin1-container section.form").removeClass("incomplete");
        }
    });

    $(document).on("click touchend", ".item-view#skin1-container section.contents:first-child > .productInfo", function(e){
        e.stopPropagation();
        e.preventDefault();
        if($(this).hasClass("viewOn")){
            $(this).removeClass("viewOn");
            $(".item-view#skin1-container section.contents:first-child > span").removeClass("viewOn");
        }else{
            $(this).addClass("viewOn");
            $(".item-view#skin1-container section.contents:first-child > span").addClass("viewOn");
        }
    });

    $(document).on("click", ".item-view#skin1-container .contents.reviews ul.productReview .foldBtn", function(e){
        if($(this).attr("data-type")=="open"){
            $(this).parents("div").removeClass("small");
        }else{
            $(this).parents("div").addClass("small");
        }

        $(this).parent().find("button.foldBtn.ng-hide").removeClass("ng-hide");
        $(this).addClass("ng-hide");
    });

    $(document).on("click", ".container.order order-shipping-address form fieldset input#OrderShippingAddress-ZipCode", function(e){
        $(".container.order order-shipping-address form fieldset div.zip button").trigger("click");
    });

    $(document).on("click", ".container.order order-price-info .total.detail button.buy2", function(e){
        e.stopPropagation();
        e.preventDefault();

        if($(".container.order order-user-info input#OrderUserInfo-phone").val().length<10){
            $(".container.order order-user-info input#OrderUserInfo-phone").addClass("err");
            $(".container.order order-user-info input#OrderUserInfo-phone").parent("div.box-input").addClass("err");
            $(".container.order order-user-info input#OrderUserInfo-phone").parents("fieldset").children(".box-btn").find("button").addClass("err");
            $(".container.order order-user-info input#OrderUserInfo-phone").parents("fieldset").children(".box-btn").find("button").attr("disabled", true);
            return false;
        }

        if($(".container.order order-shipping-address input#OrderShippingAddress-Phone").val().length<10){
            $(".container.order order-shipping-address input#OrderShippingAddress-Phone").addClass("err");
            $(".container.order order-shipping-address input#OrderShippingAddress-Phone").parent("div.box-input").addClass("err");
            $(".container.order order-shipping-address input#OrderShippingAddress-Phone").parents("fieldset").children(".box-btn").find("button").addClass("err");
            $(".container.order order-shipping-address input#OrderShippingAddress-Phone").parents("fieldset").children(".box-btn").find("button").attr("disabled", true);
            return false;
        }

        $(".container.order order-user-info div:not('d-n') form button[type='submit']").trigger("click");
        $(".container.order order-non-member-join div:not('d-n') form button[type='submit']").trigger("click");
        $(".container.order order-shipping-address form button[type='submit']").trigger("click");
        $(".container.order order-delivery-option button[type='button']").trigger("click");
        $(".container.order order-delivery-option button[type='button']").trigger("click");
        $(".container.order order-payment button[type='submit']").trigger("click");
        if((!$(".container.order order-non-member-join div.buying-guest").hasClass("d-n") && $(".container.order order-non-member-join form button[type='submit']").hasClass("err")) || $(".container.order order-user-info form button[type='submit']").hasClass("err") || $(".container.order order-shipping-address form button[type='submit']").hasClass("err") || $(".container.order order-payment form button[type='submit']").hasClass("err")){
            orderMenuOn();
            if($(".container.order order-payment form button[type='submit']").hasClass("err")){
                $("#newPayMethod").addClass("err");
            }
        }else{
            $(".container.order order-user-info div:not('d-n') form button[type='submit']").trigger("click");
            $(".container.order order-non-member-join div:not('d-n') form button[type='submit']").trigger("click");
            $(".container.order order-shipping-address form button[type='submit']").trigger("click");
            $(".container.order order-delivery-option button[type='button']").trigger("click");
            $(".container.order order-delivery-option button[type='button']").trigger("click");
            $(".container.order order-payment button[type='submit']").trigger("click");

            var loadCount=0;
            var loopCount=0;

            var countCode = setInterval( function() {
                loadCount++;
                if($(".container.order order-price-info .total.detail button.buy").length>0 && $(".container.order order-price-info .total.detail button.buy").attr("disabled", false)){
                    if(loopCount>2){
                        $(".container.order order-price-info .total.detail button.buy").trigger("click");
                        clearInterval(countCode);
                        countCode = "";
                        loadCount=0;
                    }
                    loopCount++;
                }else if(loadCount>20){
                    clearInterval(countCode);
                    countCode = "";
                    loadCount=0;
                }
            },200);
        }
    });

    $(document).on("click", ".container.order.orderFirst order-non-member-join form button[type='submit'] span", function(e){
        if($(".container.order order-non-member-join input[type='password']").val().length<4){
            $(".container.order order-non-member-join input[type='password']").parent().addClass("err");
            $(".container.order order-non-member-join input[type='password']").parents("form").addClass("ng-invalid");
            $(".container.order order-non-member-join input[type='password']").parents("form").removeClass("ng-valid");
            $(this).parents("button").addClass("err");
            $(this).parents("button").attr("disabled", true);
        }

        if($(".container.order order-non-member-join input#OrderNonMemberJoin-tel").val().length<10){
            $(".container.order order-non-member-join input#OrderNonMemberJoin-tel").parent().addClass("err");
            $(".container.order order-non-member-join input#OrderNonMemberJoin-tel").parents("form").addClass("ng-invalid");
            $(".container.order order-non-member-join input#OrderNonMemberJoin-tel").parents("form").removeClass("ng-valid");
            $(this).parents("button").addClass("err");
            $(this).parents("button").attr("disabled", true);
        }
    });

    $(document).on("click", ".container.order order-shipping-address .addressAutoInput button", function(e){
        var orderInfo = {
            "name" : {
                "target" : $(".container.order order-shipping-address input#OrderShippingAddress-ReceiptName"),
                "orig" : $(".container.order order-user-info input#OrderUserInfo-name")
            },
            "tel" : {
                "target" : $(".container.order order-shipping-address input#OrderShippingAddress-Phone"),
                "orig" : $(".container.order order-user-info input#OrderUserInfo-phone")
            }
        };

        for(key in orderInfo) {
            if(orderInfo[key].target.val() == ""){
                orderInfo[key].target.val(orderInfo[key].orig.val());
                orderInfo[key].target.trigger('input');
                orderInfo[key].target.trigger('keyup');
            }
        }
    });

    $(document).on("click", ".mypage#skin1-container .body button.question", function(e){
        $("html").hide();
        location.href = "/MyPage/Estimate";
    });

    $(document).on("click", ".item-view#skin1-container section.contents.reviews > div .newPaging a", function(e){
        productReviewInit($(this).attr("data-page"));
    });

    $(document).on("keyup", ".container.order order-non-member-join input[type='password']", function(e){
        if($(this).val().length<4){
            $(this).parent().addClass("err");
            $(".container.order.orderFirst order-non-member-join form button[type='submit']").addClass("err");
            $(".container.order.orderFirst order-non-member-join form button[type='submit']").attr("disabled", true);
        }else{
            $(this).parent().removeClass("err");
            $(".container.order.orderFirst order-non-member-join form button[type='submit']").removeClass("err");
            $(".container.order.orderFirst order-non-member-join form button[type='submit']").attr("disabled", false);
        }
    });

    $(document).on("keyup", ".container.order.orderFirst order-non-member-join input[type='email']", function(e){
        var emailVal = $(this).val();
        var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if (emailVal.match(regExp) != null) {
            $(this).parent().removeClass("err");
            $(".container.order.orderFirst order-non-member-join form button[type='submit']").removeClass("err");
            $(".container.order.orderFirst order-non-member-join form button[type='submit']").attr("disabled", false);
        }
    });

    $(document).on("keyup", ".container.order order-non-member-join input#OrderNonMemberJoin-tel", function(e){
        if($(this).val().length<10){
            $(this).parent().addClass("err");
            $(".container.order.orderFirst order-non-member-join form button[type='submit']").addClass("err");
            $(".container.order.orderFirst order-non-member-join form button[type='submit']").attr("disabled", true);
        }else{
            $(this).parent().removeClass("err");
            $(".container.order.orderFirst order-non-member-join form button[type='submit']").removeClass("err");
            $(".container.order.orderFirst order-non-member-join form button[type='submit']").attr("disabled", false);
        }
    });

    $(document).on("keyup", ".container.order order-user-info input#OrderUserInfo-phone", function(e){
        if($(this).val().length<10){
            $(this).addClass("err");
            $(this).parent("div.box-input").addClass("err");
            $(this).parents("fieldset").children(".box-btn").find("button").addClass("err");
            $(this).parents("fieldset").children(".box-btn").find("button").attr("disabled", true);
        }else{
            $(this).removeClass("err");
            $(this).parent("div.box-input").removeClass("err");
            $(this).parents("fieldset").children(".box-btn").find("button").removeClass("err");
            $(this).parents("fieldset").children(".box-btn").find("button").attr("disabled", false);
        }
    });

    $(document).on("keyup", ".container.order order-shipping-address input#OrderShippingAddress-Phone", function(e){
        if($(this).val().length<10){
            $(this).addClass("err");
            $(this).parent("div.box-input").addClass("err");
            $(this).parents("fieldset").children(".box-btn").find("button").addClass("err");
            $(this).parents("fieldset").children(".box-btn").find("button").attr("disabled", true);
        }else{
            $(this).removeClass("err");
            $(this).parent("div.box-input").removeClass("err");
            $(this).parents("fieldset").children(".box-btn").find("button").removeClass("err");
            $(this).parents("fieldset").children(".box-btn").find("button").attr("disabled", false);
        }
    });

    $(document).on("change", "#newPayMethod select", function(e){
        var opt = $("#newPayMethod select option:selected");
        alert(opt.attr("data-alert"));
        if(opt.attr("data-radio")==""){
            $("#newPayMethod select option[data-radio='"+$('input[name="payType"]:checked').attr("id")+"']").prop("selected", true);
        }else{
            $("#newPayMethod").removeClass("err");
            $('order-payment form .box-radio input[name="payType"]').prop('checked', false);
            $("label[for='"+opt.attr("data-radio")+"']").trigger("click");
            $(".container.order order-payment button[type='submit']").trigger("click");
        }
    });

    $("body").on('DOMCharacterDataModified', '#skin1-container form[name="frmGoodsOrder"] .item-option ul li[ng-repeat="item in ctrl.val.desc.options"]', function(e){
        var searchString = $(this).text();
        var pattern = /[(][^)]*[)]/ig;
        // var pattern = new RegExp("[(][^)]*[)]","igs");
        var matchArray;
        var str = pattern.exec(searchString)[0];
        $(this).text(searchString.replace(str, ""));
    });

    $(window).scroll(function() {
        productDetailTabSetting();
    });

    $(window).resize(function(){
        productDetailTabSetting();
    });
});

function productDetailTabSetting(){
    if($(".productDetailTab").length>0){
        var targetTop = 0;
        if($(".productDetailTab")[0].hasAttribute("data-top")){
            targetTop = $(".productDetailTab").attr("data-top");
        }else{
            targetTop = $(".productDetailTab").position().top;
            $(".productDetailTab").attr("data-top", targetTop);
        }

        if($(document).scrollTop() > Number(targetTop)+Number($("#skin1-header")[0].clientHeight)-100){
            $(".productDetailTab").addClass("topFixed");
            $(".productDetailTab").css("top", $("#skin1-header")[0].clientHeight + $("#skin1-header")[0].offsetTop);
            $(".productDetailTab").css("width", $("#skin1-container")[0].clientWidth+1);
            $(".productDetailTab").css("left", $("#skin1-container")[0].offsetLeft-1);
        }else{
            $(".productDetailTab").removeClass("topFixed");
            $(".productDetailTab").css("top", 0);
            $(".productDetailTab").css("left", 0);
            $(".productDetailTab").css("width", "100%");
        }
    }
}

function layoutInit(){
    var loadCount=0;

    var countCode = setInterval( function() {
        loadCount++;
        if($("#skin1-header nav.category > div > ul > li").length>0){
            $(".mypage#skin1-container nav.category>div>ul>li>a[href='/MyPage/Estimate'] span").text("Q & A");
            $(".container.mypage .home .state-mypage .review-area span.span-estimate-headline").text("Q & A");
            $(".mypage#skin1-container .estimate .state>div>div h2").text("Q & A");
            $(".mypage#skin1-container .estimate .state>div>ul>li>a[href='#!/?type=Estimating'] span:first").text("質問");
            $(".mypage#skin1-container .estimate .state>div>ul>li>a[href='#!/?type=Estimated'] span:first").text("返答");
            $(".mypage#skin1-container .estimate .state>div>div .box-btn button[data-viewmodal='estimate-write'] span").text("問い合わせる");
            $(".mypage#skin1-container .estimate .state-detail.estimate.checking > span").each(function(){
                $(this).text($(this).text().replace(/見積中/gi, '質問'));
                $(this).text($(this).text().replace(/見積済/gi, '返答'));
            });

            $('.mypage#skin1-container nav.category>div>ul>li>a[href="/MyPage/Estimate"] span').css("visibility", "visible");
            $(".container.mypage .home .state-mypage .review-area span.span-estimate-headline").css("visibility", "visible");
            $(".mypage#skin1-container .estimate .state>div>div h2").css("visibility", "visible");
            $(".mypage#skin1-container .estimate .state>div>ul>li>a[href='#!/?type=Estimating'] span:first").css("visibility", "visible");
            $(".mypage#skin1-container .estimate .state>div>ul>li>a[href='#!/?type=Estimated'] span:first").css("visibility", "visible");
            $(".mypage#skin1-container .estimate .state>div>div .box-btn button[data-viewmodal='estimate-write'] span").css("visibility", "visible");
            $(".mypage#skin1-container .estimate .state-detail.estimate.checking > span").css("visibility", "visible");

            var link = "";
            $("#skin1-header nav.category div > ul > li").each(function(){
                link = $(this).children("a").attr("href");
                if(link == "/mypage" || link == "/Account" || link == "/Support/OrderProcess"){
                    $(this).hide();
                    if(link == "/Support/OrderProcess"){
                        var myPageMenuHTML = '<div ng-repeat="item in ctrl.val.accountMenuList track by $index" class="ng-scope">';
                        myPageMenuHTML += '<div>';
                        myPageMenuHTML += '<a href="'+link+'"><span class="ng-binding"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">'+$(this).children("a").children("span").text()+'</font></font></span></a>';
                        myPageMenuHTML += '</div>';
                        myPageMenuHTML += '</div>';
                        $(".account > div:nth-child(3)").after(myPageMenuHTML);
                    }
                }
            });
            $("#skin1-header nav.category div > ul > li").css("visibility", "visible");

            if($("nav.snb").length<=0 && $("nav.ng-scope.category").not(".dev-menuTree").length>0){
                var snbHTML = '<nav class="ng-scope snb monco-snb">';
                snbHTML += '<div>';
                snbHTML += '<ul class="ng-pristine ng-untouched ng-valid ng-isolate-scope ng-not-empty">';

                $("nav.ng-scope.category").not(".dev-menuTree").find("ul").not(".include-nav-bottom").find("li a").each(function(){
                    snbHTML += '<li class="ng-scope">';
                    snbHTML += '<a href="'+$(this).attr("href")+'" class="ng-scope Reference '+($(this).hasClass("active") ? "active" : "")+'"><span class="ng-binding">'+$(this).find("span").text()+'</span></a>';
                    snbHTML += '</li>';
                });

                snbHTML += '</ul>';
                snbHTML += '</div>';
                snbHTML += '</nav>';

                $("#skin1-container .body div:first").prepend(snbHTML);
            }

            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }else if(loadCount>20){
            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }
    },200);
}

var initFirst = true;
function categoryInit(){
    var loadCount=0;

    var countCode = setInterval( function() {
        loadCount++;
        if($(".category#skin1-container .style-item-grid li a > span.name").length>0 || $(".category#skin1-container .style-item-list li a > span.price").length>0){
            if(initFirst){
                $(".category#skin1-container .body nav a").click(function(){
                    $(".category#skin1-container .style-item-grid").hide();
                    $(".category#skin1-container .style-item-list").hide();
                    categoryInit();
                });

                $("nav.category a").click(function(){
                    $(".category#skin1-container .style-item-grid").hide();
                    $(".category#skin1-container .style-item-list").hide();
                    categoryInit();
                });
            }
            clearInterval(countCode);
            countCode = "";
            loadCount=0;
            initFirst=false;
            categoryProductSetting();
        }else if(loadCount>20){
            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }
    },200);
}

function productDetailInit(){
    var loadCount2=0;

    var countCode2 = setInterval( function() {
        loadCount2++;
        if($(".dev-goodsImage-display:first-child").attr("src") != undefined){
            var payHTML = '<div class="payBtnArea"><span>ご購入手続き</span></div>';

            $("body").append(payHTML);
            $(".item-view#skin1-container section.form .option").prepend('<button type="button" class="optionClose"><span></span></button>');
            $(".item-view#skin1-container section.form").addClass("incomplete");

            var tabHTML = '<ul class="productDetailTab">';
            tabHTML += '<li id="cospopDetail">商品情報</li>';
            tabHTML += '<li id="cospopReview">レビュー</li>';
            tabHTML += '<li id="cospopQna">Q & A</li>';
            tabHTML += '</ul>';

            $(".item-view#skin1-container .set-layout>.body>div>section.form").after(tabHTML);

            var reviewHTML = $(".moncoStyle").parent();
            var mobileReviewHTML = "";
            if(reviewHTML.length>0){
                $(".container.item-view .taxNfree_include").after($(".moncoStyle").parents(".description").find(".description-text"));
                $(".moncoStyle").parents(".description").remove();
                $("section.contents").not("section.recommend").not("section.reviews").html(reviewHTML.html()+$("section.contents").html());
            }

            $("section.reviews").insertBefore("section.recommend");

            $(".star_point").each(function(){
                var score = $(this).text();
                var scoreHTML = "";
                for(var i=0; i<score; i++){
                    scoreHTML += '<span class="icon-wf-star"><span style="display:none">&nbsp;</span>';
                }
                $(this).html(scoreHTML);
            });

            mobileReviewHTML += '<ul class="moncoStyle2">';
            $(".moncoStyle tr.contentsArea").each(function(){
                mobileReviewHTML += '<li data-idx="'+$(this).attr("data-idx")+'" class="photoSwipeGroup">';
                mobileReviewHTML += '<div class="imgArea">';

                if($(this).find("img").length==0){
                    mobileReviewHTML += '<img src="'+$(".dev-goodsImage-display:first-child").attr("src")+'" />';
                }else{
                    $(this).find("img").each(function(){
                        mobileReviewHTML += '<img src="'+$(this).attr("src")+'" />';
                    });
                }
                mobileReviewHTML += '</div>';
                mobileReviewHTML += '<div class="contentsArea">';
                mobileReviewHTML += $(this).find("td").html();
                mobileReviewHTML += '</div>';
                mobileReviewHTML += '<div class="infoArea">';
                mobileReviewHTML += '評点'; // 평점
                mobileReviewHTML += $(this).prev().find(".score").html();
                mobileReviewHTML += '<span class="writer">' + $(this).prev().find(".writer").text() + '</span>';
                mobileReviewHTML += '</div>';
                mobileReviewHTML += '</li>';
            });
            mobileReviewHTML += '</ul>';

            $(".moncoStyle").before(mobileReviewHTML);
            $(".moncoStyle2 .contentsArea img").each(function(){
                var next = $(this).next();
                if(next[0].nodeName == "BR"){
                    next.remove();
                }
            });
            $(".moncoStyle2 .contentsArea img").remove();
            $(".moncoStyle2 .imgArea img:first-child").each(function(){
                $(this).load(function(){
                    $(this).parents("li").height($(this).parents(".imgArea").width());
                    $(this).parents(".imgArea").height($(this).parents(".imgArea").width());
                    $(this).parents("li").find(".contentsArea:before").css("left", "10px");
                    $(this).parents("li").find(".infoArea").css("left", $(this).width()+15);
                    $(this).parents("li").find(".infoArea").css("width", $(this).parents("li").find(".contentsArea").width());
                });
            });

            $(".item-view#skin1-container section.contents:first-child > span").after("<div class='productInfo'></div>");
            $(".item-view#skin1-container section.form .option form fieldset div .item-option>div.box-quantity").after("<div class='deliveryMsg'><p><span>8,000円以上のご注文で</span><span>&nbsp;基本&nbsp;</span><span>配送料無料！</span></p><p style='font-size: 8pt;color: #adb0b5;'><span>(一部離島・山間部は中継料金が追加されます)</span></p></div>")

            productReviewInit(1);

            clearInterval(countCode2);
            countCode2 = "";
            loadCount2=0;
        }else if(loadCount2>20){
            clearInterval(countCode2);
            countCode2 = "";
            loadCount2=0;
        }
    },200);

    $(".item-view#skin1-container .contents.reviews").addClass("active");
}

function productReviewInit(page){
    var n = $(".item-view#skin1-container .contents.reviews").attr("ng-init").replace(/[^0-9]/g,"");
    var r = new Array;
    var addPage = 0;
    var totalPage = 0;

    $.ajax({
        url: "https://cospop.github.io/review.json",
        type: 'GET',
        async: false,
        success: function(data) {
            if(data[n] != undefined){
                addPage = data[n].length/5;
                totalPage += Number(addPage);
                if(addPage>=page){
                    for(var i=5*(page-1); i<5*page; i++){
                        for(var j=0; j<data[n][i].imageCount; j++){
                            if(j==0){
                                data[n][i].image = new Array;
                            }
                            data[n][i].image[j] = "https://cospop.github.io/image/" + n + "/" + (i+1) + '_' + (j+1) + ".jpg";
                        }
                        r.push(data[n][i]);
                    }
                }
            }
        }
    });

    $.ajax({
        url: "https://www.cospop.jp/Plugins/GoodsReview/GetGoodsReviewList",
        type: 'POST',
        async: false,
        dataType: "json",
        data: {"goodsId":n, "paging":{"PageSize":5, "Page": (page-addPage)}},
        success: function(data) {
            totalPage += Number(data.TotalPage);
            if(r.length <= 0){
                $.each(data.List, function(idx, obj){
                    var temp = {};
                    temp.writer = obj.UserId;
                    temp.contents = obj.Contents;
                    temp.score = obj.StarPoint;
                    if(obj.imgFilePath == ""){
                        temp.imageCount = 0;
                    }else{
                        temp.imageCount = 1;
                        temp.image = new Array;
                        temp.image[0] = "https://www.cospop.jp" + obj.imgFilePath;
                    }
                    r.push(temp);
                });
            }
        }
    });

    if(r.length > 0){
        var productReview = "";
        productReview += '<ul class="productReview">';

        $.each(r, function(idx, obj){
            productReview += '<li>';
            productReview += '<div>';
            productReview += '<span class="rating"><span><span class="star s'+obj.score+'0"><span>star</span></span><span class="base"></span></span></span>';
            productReview += '<div class="small">';
            for(var i=0; i<obj.imageCount; i++){
                productReview += '<img src="' + obj.image[i] + '">';
            }
            productReview += '<p>';
            productReview += '<span>'+obj.contents+'</span>';
            if(obj.imageCount>0 || obj.contents.length>175){
                productReview += '<button type="button" class="foldBtn" data-type="open">もっと見る</button>';
                productReview += '<button type="button" class="foldBtn ng-hide" data-type="close">閉じる</button>';
            }
            productReview += '</p>';
            // productReview += '<span class="info"><span class="name">'+ (obj.writer.length>3 ? obj.writer.replace(/.{3}$/,"****") : "****") +'</span></span>';
            productReview += '<span class="info"><span class="name">'+ (obj.writer.length>3 ? (obj.writer.substring(0,3)+"***") : "******") +'</span></span>';
            productReview += '</div>';
            productReview += '</div>';
            productReview += '</li>';
        });

        productReview += '</ul>';
        productReview += '<div class="paging prev next newPaging"><div>';
        productReview += '<a class="' + (page==1 || totalPage<6 ? "ng-hide" : "") + '" data-page="' + (page-1) + '"></a>';
        productReview += '<a class="' + (page>3 && totalPage>5 ? "" : "ng-hide") + '" data-page="1">1</a>';

        var start = 0;
        var end = 0;

        if(totalPage<6){
            start = 0;
            end = totalPage;
        }else{
            start = page>3 ? page-3 : 0;
            if((start+5)>totalPage){
                start = totalPage-5;
            }
            end = start+5;
        }

        for(var i=start; i<end; i++){
            productReview += '<a class="' + ((i+1)==page ? "active" : "") + '" data-page="' + (i+1) + '">' + (i+1) + '</a>';
        }

        productReview += '<a class="' + (totalPage-page>=3 && totalPage>5 ? "" : "ng-hide") + '" data-page="' + totalPage + '">' + totalPage + '</a>';
        productReview += '<a class="' + (page==totalPage || totalPage<6 ? "ng-hide" : "") + '" data-page="' + (page+1) + '"></a>';
        productReview += '</div></div>';

        $(".item-view#skin1-container section.contents.reviews > div").html("");
        $(".item-view#skin1-container section.contents.reviews > div").append(productReview);
    }
}

function getTextLength(str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            if (escape(str.charAt(i)).length == 6) {
                len++;
            }
            len++;
        }
        return len;
    }

function orderInit(){
    var loadCount3=0;

    var countCode3 = setInterval( function() {
        loadCount3++;
        if($(".container.order").length>0 && $(".container.order order-user-info").length>0 && $(".container.order order-non-member-join").length>0 && $(".container.order order-shipping-address").length>0 && $(".container.order order-delivery-option").length>0 && $(".container.order order-payment").length>0){
            $(".container.order .buying-guest .choice-join").remove();
            $(".container.order .orderer-info .body.sg_v > form fieldset label[for='OrderUserInfo-name2a']").text("英文");
            $(".container.order .buying-guest .body > form fieldset > div > div.ng-scope label[for='OrderNonMemberJoin-name2a']").text("英文");
            $(".container.order order-price-info .total.detail button.button.buy").after("<button type='button' class='button buy2'><span>注文確定</span></button>");
            $(".container.order order-non-member-join label[for='OrderNonMemberJoin-password']").parent("div").after("<div></div>");
            $(".container.order order-non-member-join label[for='OrderNonMemberJoin-name']").parent("div").appendTo($(".container.order order-non-member-join label[for='OrderNonMemberJoin-password']").parent("div").next());
            $(".container.order order-non-member-join label[for='OrderNonMemberJoin-tel']").parent("div").appendTo($(".container.order order-non-member-join label[for='OrderNonMemberJoin-password']").parent("div").next());
            $(".container.order order-non-member-join input#OrderNonMemberJoin-tel").attr("type", "tel");
            $(".container.order order-non-member-join input#OrderNonMemberJoin-tel").attr("placeholder", "数字のみ入力");

            $(".container.order order-user-info label[for='OrderUserInfo-name']").parent("div").after("<div id='infoArea'></div>");
            $(".container.order order-user-info label[for='OrderUserInfo-name']").parent("div").appendTo($(".container.order order-user-info label[for='OrderUserInfo-name']").parent("div").next());
            $(".container.order order-user-info label[for='OrderUserInfo-phone']").parent("div").appendTo($(".container.order order-user-info label[for='OrderUserInfo-name']").parent("div").parent("div"));
            $(".container.order order-user-info input#OrderUserInfo-phone").attr("type", "tel");
            $(".container.order order-user-info input#OrderUserInfo-phone").attr("placeholder", "数字のみ入力");

            $(".container.order order-shipping-address input#OrderShippingAddress-Phone").attr("placeholder", "数字のみ入力");

            $(".container.order order-shipping-address form fieldset input#OrderShippingAddress-ZipCode").attr("readonly",true);

            $(".container.order order-shipping-address .sub-title-page").append('<div class="addressAutoInput"><button type="button"><span>注文者情報と同一</span></button></div>');

            $(".container.order order-shipping-address .addressAutoInput button").trigger("click");

            var payMethodHTML = '';
            payMethodHTML += '<div id="newPayMethod" class="box-select">';
            payMethodHTML += '<select>';
            payMethodHTML += '<option data-radio="" data-alert="お支払い方法を選択してください">決済方法選択</option>';
            payMethodHTML += '<option data-radio="pay_paytype_BANK" data-alert="※ 注文確定後、注文完了ページから決済手続きを進めてください。\n※ 「決済するボタン」をクリックすると、「決済手続き画面」が表示されます。">銀行振込</option>';
            payMethodHTML += '<option data-radio="pay_paytype_TELEGRAM_CARD_REQUEST" data-alert="※ 注文確定後、注文完了ページから決済手続きを進めてください。\n※ 「決済するボタン」をクリックすると、「決済手続き画面」が表示されます。">クレジットカード</option>';
            payMethodHTML += '</select>';
            payMethodHTML += '</div>';

            $(payMethodHTML).insertBefore($(".container.order order-price-info ul.set-total"));

            orderMenuOn();

            $(".container.order order-user-info").css("display", "block");
            $(".container.order order-non-member-join").css("display", "block");
            $(".container.order order-shipping-address").css("display", "block");
            $(".container.order order-delivery-option").css("display", "block");

            clearInterval(countCode3);
            countCode3 = "";
            loadCount3 = 0;
        }else if(loadCount3>20){
            clearInterval(countCode3);
            countCode3 = "";
            loadCount3=0;
        }
    },200);
}

function orderTotalInit(){
    var loadCount1=0;
    var countCode1 = setInterval( function() {
        loadCount1++;
        if($(".container .total.detail .set-total li.shipping .title").length>0){
            var shippingObj = $(".container .total.detail .set-total li.shipping:nth-child(2) .title");
            if(shippingObj.html().match(/送料/)) {
                shippingObj.html("送料&nbsp;<span style='font-size: 7pt;'>(一部離島・山間部は中継料金が追加されます)</span>");
            }
            clearInterval(countCode1);
            countCode1 = "";
            loadCount1=0;
        }else if(loadCount1>20){
            clearInterval(countCode1);
            countCode1 = "";
            loadCount1=0;
        }
    },200);
}

function orderMenuOn(){
    if($(".container.order order-user-login > div").hasClass("on")){
        var loadCount=0;

        var countCode = setInterval( function() {
            loadCount++;
            if($(".container.order order-non-member-join").length>0 && $(".container.order order-user-login").length>0){
                $(".container.order").addClass("orderFirst");
                $(".container.order order-non-member-join").insertAfter($(".container.order order-user-login"));
                $(".container.order order-user-login .sub-title-page > span").text("会員注文");
                $(".container.order order-non-member-join input[type='password']").attr("placeholder", "注文のパスワード(4文字以上)");
                clearInterval(countCode);
                countCode = "";
                loadCount=0;
            }else if(loadCount>20){
                clearInterval(countCode);
                countCode = "";
                loadCount=0;
            }
        },200);
    }else{
        $(".container.order order-user-info .orderer-info").removeClass("select");
        $(".container.order order-user-info .orderer-info").removeClass("off");
        $(".container.order order-user-info .orderer-info").addClass("on");

        $(".container.order order-non-member-join .sub-title-page .box-btn button.edit").trigger("click");
        var loadCount=0;

        var countCode = setInterval( function() {
            loadCount++;
            if($(".container.order order-shipping-address div.shipping-address").length>0 && !$(".container.order order-shipping-address div.shipping-address").hasClass("memberOn") && ($(".container.order order-shipping-address div.shipping-address").hasClass("select") || $(".container.order order-shipping-address div.shipping-address").hasClass("off"))){
                $(".container.order order-shipping-address .sub-title-page .box-btn button.edit").trigger("click");
                clearInterval(countCode);
                countCode = "";
                loadCount=0;
            }else if($(".container.order order-shipping-address #OrderShippingAddress-addrList0").length>0){
                $(".container.order order-shipping-address div.shipping-address").addClass("memberOn");
                $(".container.order order-shipping-address #OrderShippingAddress-addrList0").trigger("click");
                $(".container.order order-shipping-address #OrderShippingAddress-addrList0").parent(".box-radio").find(".box-btn button").trigger("click");
                clearInterval(countCode);
                countCode = "";
                loadCount=0;
            }else if(loadCount>20){
                clearInterval(countCode);
                countCode = "";
                loadCount=0;
            }
            $(".container.order order-payment .sub-title-page .box-btn button.edit").trigger("click");
        },200);

        $(".container.order order-delivery-option .sub-title-page .box-btn button.edit").trigger("click");
    }
}

function categoryProductSetting(){
    $("select.ng-pristine").change(function(){
        $(".category#skin1-container .style-item-grid").hide();
        $(".category#skin1-container .style-item-list").hide();
        categoryInit();
    });

    var obj;
    if($(".category#skin1-container .style-item-grid li a > span.name").length>0){
        obj = $(".category#skin1-container .style-item-grid");
    }else if($(".category#skin1-container .style-item-list li a > span.name").length>0){
        obj = $(".category#skin1-container .style-item-list");
    }

    obj.find("li a > span.name").each(function(){
        $(this).after('<div class="wishCount-grid"><span class="wishIcon"></span><span>' + getProductWishCount($(this).parents("a").attr("href").replace("/Goods/"," ")) + '</span></div>');
    });

    obj.find("li a > span.price").each(function(){
        $(this).after('<div class="wishCount-list"><span class="wishIcon"></span><span>' + getProductWishCount($(this).parents("a").attr("href").replace("/Goods/"," ")) + '</span></div>');
    });

    obj.find("li a > span.price > small.percent").each(function(){
        $(this).siblings("span.default").insertAfter($(this));
    });
    $(".category#skin1-container .style-item-grid").show();
    $(".category#skin1-container .style-item-list").show();
}

function getProductList(){
    $.ajax({
        url: "/Plugins/GoodsList/GetList?PageSize=50",
        type: 'GET',
        async: false,
        success: function(data) {
            pList = data;
        }
    });
}

function getProductWishCount(no){
    var count;
    $.ajax({
        url: "/Plugins/GoodsPriceInfo/GetWishData?goodsId="+no,
        type: 'GET',
        async: false,
        success: function(data) {
            count = data.WishCount;
        }
    });
    return count;
}

function makemainProductList(arr){

    var pHTML = "";

    $.each(arr,function(index, item){
        pHTML += '<div>';
        pHTML += '<div>';
        pHTML += ('<a href="/Goods/' + productObject["k"+item].Id + '">');
        pHTML += ('<img src="' + productObject["k"+item].ThumbnailImage + '" />');
        pHTML += '<div class="infoArea">';
        pHTML += ('<p style="word-break: keep-all;">' + productObject["k"+item].NameJp + '</p>');
        pHTML += ('<p class="priceColor">' + (productObject["k"+item].DiscountAmount>0 ? ('<span>¥ ' + numberWithCommas(productObject["k"+item].DiscountPrice) + '</span><span>('+productObject["k"+item].DiscountAmount+'% off)</span>') : '') + ('<span>¥ ' + numberWithCommas(productObject["k"+item].Price) + '</span></p>'));
        pHTML += '</div>';
        pHTML += '</a>';
        pHTML += '</div>';
        pHTML += '<div>';
        pHTML += '<span class="wishIcon"></span>';
        pHTML += ('<p>' + numberWithCommas(productObject["k"+item].WishCount) + '</p>');
        pHTML += '</div>';
        pHTML += '<div class="clear"></div>';
        pHTML += '</div>';
    });

    return pHTML;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function setGTM(){
    var pageCookie = getCookie("orderPage");
    pageCookie = pageCookie=="" ? 0 : Number(pageCookie)+1;
    var path = window.location.pathname;
    if(path == "/Order"){
        document.cookie = "orderPage="+pageCookie+";expires=0;path=/";
    }

}

function getCookie(cookie_name) {
    var x;
    var val = document.cookie.split(';');
    var rtn = "";

    for (var i = 0; i < val.length; i++) {
        x = val[i].substr(0, val[i].indexOf('='));
        y = val[i].substr(val[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, '');
        if (x == cookie_name) {
            rtn = unescape(y);
        }
    }

    return rtn;
}
