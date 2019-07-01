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

    var touchmoved;

    $(document).on("touchend", ".moncoStyle2 li", function(e){
        if(touchmoved != true){
            if($(e.target)[0].tagName=="IMG"){
                return;
            }
            var clickObj = $(this);
            clickObj.trigger("click");
        }
    }).on('touchmove', function(e){
        touchmoved = true;
    }).on('touchstart', function(){
        touchmoved = false;
    });

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
            clearInterval(countCode);
            countCode = "";
            loadCount=0;
            categoryInitFirst=false;
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

            clearInterval(countCode2);
            countCode2 = "";
            loadCount2=0;
        }
    },200);
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
