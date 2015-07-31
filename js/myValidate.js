$(document).ready(function(){
	//verify price IF specified are in currency format
    $.validator.addMethod("currencyFormat", function (value, element) {
        return this.optional(element) || /^\-?(\d*)(\.\d{1,2})?$/.test(value);
    }, "Price should be a valid number");

	//verify price IF specified is greater than zero
    $.validator.addMethod("minPrice", function (value, element) {
        return this.optional(element) || value >= 0;
    }, "Price cannot be below zero");

	//verify value of handling days IF specified is greater than zero
    $.validator.addMethod("minMaxHandleTime", function (value, element) {
        return this.optional(element) || value > 0;
    }, "Maximum handling time cannot be less than 1");

	//verify the prices meet the range check criteria
	//min price cannot to more than max price
    $.validator.addMethod("rangeMinCheck", function (value, element) {
        return this.optional(element) || isNaN(parseFloat($('#prange_start').val())) || parseFloat($('#prange_start').val()) < parseFloat($('#prange_end').val());
    }, "Maximum price cannot be less than or equal to minimum price");

    $.validator.addMethod("rangeMaxCheck", function (value, element) {
        return this.optional(element) || isNaN(parseFloat($('#prange_end').val())) || parseFloat($('#prange_start').val()) < parseFloat($('#prange_end').val());
    }, "Minimum price cannot be more than or equal to maximum price");

	//verify value of handling time IF specified is an integer
    $.validator.addMethod("nofloat", function (value, element) {
        return this.optional(element) || parseInt(value) == parseFloat(value);
    }, "Maximum handling time should be an integer");

	//apply the defined validators to respective fields
    $("#myform").validate({
        errorClass : "has-error",
        rules :{
            "keywords" : {
                required : true
            },
            "prange_start" : {
                currencyFormat : true,
                minPrice : true,
                rangeMaxCheck : true,
            },
            "prange_end" : {
                currencyFormat : true,
                minPrice : true,
                rangeMinCheck : true,
            },
            "handlingtime" : {
                minMaxHandleTime : true,
                nofloat : true,
            }

        },
        messages :{
            "keywords" : {
                required : 'Please enter a key word'
            }
        },
        
        submitHandler: function(myform){
                pNum = 1;
				//set the page number in pagination bar
				//this is the first time query is made so pagination range will be from 1 to 5
                $("#startPage").val(1);
                $("#endPage").val(5);

                var i =0;
                for(i=1; i<=5; i++){
                    $("#page"+i).removeClass("active");
                    $("#page"+i).css("display","");
                }

                for(var j=1; j<6; j++){
                    $("#"+j).html(j);
                }
				
				//call the function that displays the results
                renderResults(myform, pNum);            
        }

    });

    $(document).on('click','button[id="clrbtn"]',function() {
        $("#resultsContainer").html("");
        $("#paginationDiv").css("display","none");
    });

    $(document).on('click','button[id^="showDetails"]',function() {
        var selector = $(this).data("toggle");  // get corresponding element
        $('#'+selector).toggle();
    });

    $(document).on('click', 'li[id^="page"]', function (event) {

        for(var i=1; i<6; i++){
            $("#page"+i).removeClass("active");
        }

        var pgId = parseInt(event.target.id);
        $("#page"+pgId).addClass("active");
        $("#activePg").val(pgId);
        var pNum = parseInt($("#"+pgId).text());
        
        renderResults("#myform", pNum);

        $("#rangeOfItems").get(0).scrollIntoView();
    });

    $(document).on('click', 'li[id^="prev"]', function (event) {
        var currPg = parseInt($("#currPage").val());
        var fstPg = parseInt($("#startPage").val());
        var lstPg = parseInt($("#endPage").val());
        var actPg = parseInt($("#activePg").val());

        if(currPg <= 1){
            if(!($("prev").hasClass("disabled")))
                $("prev").addClass("disabled");
        }
        else if(fstPg == 1 || (fstPg > 1 && actPg>1)){
            $("#page"+actPg).removeClass("active");
            actPg = actPg - 1;
            $("#activePg").val(actPg);
            $("#page"+actPg).addClass("active");
            var pNum = parseInt($("#"+actPg).text());
                
            renderResults("#myform", pNum);

            $("#rangeOfItems").get(0).scrollIntoView();
        }
        else if(fstPg > 1 && actPg==1){

            fstPg = fstPg - 2;

            for(var i=1; i<=5; i++){
                $("#"+i).html(fstPg+i);
            }

            fstPg = fstPg + 1;

            $("#startPage").val(fstPg);
            $("#endPage").val(fstPg+4);

            renderResults("#myform", fstPg);

            $("#rangeOfItems").get(0).scrollIntoView();
        }
        else{
            //Do nothing
        }

    });

    $(document).on('click', 'li[id^="nxt"]', function (event) {
        var currPg = parseInt($("#currPage").val());
        var fstPg = parseInt($("#startPage").val());
        var lstPg = parseInt($("#endPage").val());
        var actPg = parseInt($("#activePg").val());

        if(actPg < 5){
            $("#page"+actPg).removeClass("active");
            actPg = actPg + 1;
            $("#activePg").val(actPg);
            $("#page"+actPg).addClass("active");
            var pNum = parseInt($("#"+actPg).text());
                
            renderResults("#myform", pNum);

            $("#rangeOfItems").get(0).scrollIntoView();
        }
        else if(actPg==5){
            
            for(var i=1; i<=5; i++){
                $("#"+i).html(fstPg+i);
            }

            fstPg = fstPg + 1;

            $("#startPage").val(fstPg);
            $("#endPage").val(fstPg+4);

            renderResults("#myform", fstPg+4);

            $("#rangeOfItems").get(0).scrollIntoView();
        }
        else{
            //Do nothing
        }

    });    

    function renderResults(myform, pNum){
            var url = 'phpServerApp.php',
                type = 'GET',
                data = $(myform).serialize();
                data += "&pageNum="+pNum;

            $.ajax({
                url : url,
                type : type,
                data : data,
                dataType : "json",
                success: function(results){
                    console.log(results);

                    $('#resultsContainer').html("");

                    $('#resultsContainer').append('<div id="rangeOfItems" class="col-xs-12"></div>');

                    if(results.ack==="No Results Found"){
                        var rangeOfItems = "No Results found for <b>" + $('#keywords').val(); + "</b>"
                        $('#rangeOfItems').append(rangeOfItems);    
                    }
                    else if (results.ack==="Success"){

                        $("#paginationDiv").show();

                        var currPage = results.pageNumber,
                            resultCount = results.resultCount,
                            itemCount = results.itemCount,
                            maxResult = resultCount<(currPage*itemCount)?resultCount:(currPage*itemCount),
                            minResult = (currPage*itemCount) - (itemCount - 1);

                        //Setting up pagination
                        var totalPages = parseInt(resultCount/itemCount)+1;

                        if(totalPages < 5){
                            for (var z = 0; z < (5 - totalPages); z++) {
                                var y = 5 - z;
                                $("#page"+y).css("display","none");
                            };

                            for(var a=1; a<= totalPages; a++){
                                $("#page"+a).css("display","");
                            };    
                        } 

                        $("#currPage").val(currPage);

                        if(currPage==1){
                            $("#prev").addClass("disabled");
                            $("#page1").addClass("active");
                            $("#activePg").val(1);
                        }

                        if(totalPages < 5 && currPage==totalPages){
                            $("#nxt").addClass("disabled");
                            $("#page"+currPage).addClass("active");
                        }
                        else if(totalPages >= 5 && currPage==totalPages){
                            $("#nxt").addClass("disabled");
                            $("#page5").addClass("active");
                        }
                        else{
                            //Do nothing
                        }

                        if(currPage!=1){ 
                            if($("#prev").hasClass("disabled"))
                                $("#prev").removeClass("disabled");
                        }

                        if(currPage!=totalPages){
                            if($("#nxt").hasClass("disabled"))
                                $("#nxt").removeClass("disabled");
                        }

                        //displaying results
                        var rangeOfItems = '<h3>Showing '+minResult+' - '+maxResult+' items out of '+resultCount+'</3>'
                        $('#rangeOfItems').append(rangeOfItems);

                        //populate the results
                        maxIter = maxResult - minResult + 1;
                        for (var iter = 0; iter < maxIter; iter++) {
                            var divId = "item"+iter;
                            $('#resultsContainer').append('<div id="'+divId+'" class="col-xs-12"></div>');

                            var currDiv = $('#item'+iter)

                            var currImg = '<img id="thumbnail" class="img-responsive" data-toggle="modal" data-target="#modal_box_'+iter+'" ';
                                currImg += 'alt="image not available" src="'+results[divId].basicInfo.galleryURL+'" style="cursor: pointer;">';

                            var mImg = (results[divId].basicInfo.pictureURLSuperSize=="")?results[divId].basicInfo.galleryURL:results[divId].basicInfo.pictureURLSuperSize;

                            var modal_box = '<div class="modal fade" id="modal_box_'+iter+'" tabindex="-1"';
                                modal_box += ' role="dialog" aria-labelledby="modal_box_'+iter+'_Label" aria-hidden="true">';
                                modal_box += '<div class="modal-dialog"> <div class="modal-content"> <div class="modal-header">'; 
                                modal_box += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
                                modal_box += '<span aria-hidden="true">&times;</span></button>';
                                modal_box += '<h5 class="modal-title" id="modal_box_'+iter+'_Label"><b>';
                                modal_box += results[divId].basicInfo.title+'</b></h5></div><div class="modal-body">';
                                modal_box += '<img id="modal-img-'+iter+'" class="img-responsive" alt="Modal picture not available" src="';
                                modal_box += mImg+'">';
                                modal_box += '</div></div></div></div>';

                            currDiv.append('<div class="col-xs-3 col-sm-2 col-md-2 imgHolder">'+currImg+modal_box+'</div>');

                            var currTitle = "<a class='itemTitle' href='"+results[divId].basicInfo.viewItemURL+"'>"+results[divId].basicInfo.title+"</a>";
                            var currInfoHolder = "infoHolder"+iter;

                            currDiv.append('<div id="'+currInfoHolder+'" class="col-xs-9"><div class="row"><div class="col-xs-12 col-sm-12">'+currTitle+'</div></div></div>');

                            var currInfoDiv = $("#infoHolder"+iter);
                            var price = "<b>Price: $"+results[divId].basicInfo.convertedCurrentPrice+"</b>&nbsp;&nbsp;";

                            var shipType = results[divId].shippingInfo.shippingType;
                            var freeShip = results[divId].basicInfo.shippingServiceCost;

                            var isFree = "(Shipping not free)";
                            if(shipType=="Free"|| freeShip == "" || freeShip=="0.0"){
                                isFree = " (FREE Shipping)";
                            }
                            else{
                                isFree = " (+ $ "+ freeShip + " shipping)";
                            }

                            var location = "<i>Location: "+results[divId].basicInfo.location+"</i>";

                            var fbPostBtn = "<img id='share_button"+iter+"' class='img-responsive img-rounded' src='fb.png'";
                                fbPostBtn += " alt='Post on Facebook' style='float: right; width: 8%; height: 8%; cursor: pointer;'>";

                            var viewDetails = '<button type="button" class="btn btn-link btn-xs" id="showDetails'+iter+'"'
                                viewDetails +='data-toggle="parentDiv'+iter+'" style="float: right">View Details</button>';

                            var topRatedImg = '<img id="topRatedImg'+iter+'" class="img-responsive" src="itemTopRated.jpg"';
                                topRatedImg += " alt='Top Rated Item' style='float: right; width: 10%; height: 10%; margin-right: 1vw'>"

                            var topRated = (results[divId].basicInfo.topRatedListing=="true")?topRatedImg:"";

                            var info = '<div class="col-xs-12 col-sm-6 col-md-4">' + price + isFree + '</div>';
                                info += '<div class="col-xs-12 col-sm-6 col-md-6">' + location + topRated + '</div>';
                                info += '<div class="col-xs-9 col-sm-9 col-md-1">' + viewDetails + '</div>';
                                info +=  fbPostBtn;

                            currInfoDiv.append('<div class="row">'+info+'</div>');

                            var desc = "Price: $"+results[divId].basicInfo.convertedCurrentPrice+"&nbsp;"+isFree+",  Location: "+results[divId].basicInfo.location;
                            currInfoDiv.append("<input type='hidden' id='name"+iter+"' value='"+results[divId].basicInfo.title+"'>");
                            currInfoDiv.append('<input type="hidden" id="link'+iter+'" value="'+results[divId].basicInfo.viewItemURL+'">');
                            currInfoDiv.append('<input type="hidden" id="desc'+iter+'" value="'+desc+'">');
                            currInfoDiv.append('<input type="hidden" id="pict'+iter+'" value="'+results[divId].basicInfo.galleryURL+'">');


                            //putting tabs
                            var tabList =  '<br/><div id="parentDiv'+iter+'" aria-multiselectable="true" style="display: none;">';
                                tabList +=  '<ul class="nav nav-tabs" role="tablist">';
                            var basicTab = '<li role="presentation" class="active">';
                                basicTab += '<a href="#basicInfo'+iter+'" aria-controls="basicInfo'+iter;
                                basicTab += '" role="tab" data-toggle="tab">Basic Info</a></li>';
                            var sellerTab = '<li role="presentation">';
                                sellerTab += '<a href="#sellerInfo'+iter+'" aria-controls="sellerInfo'+iter;
                                sellerTab += '" role="tab" data-toggle="tab">Seller Info</a></li>';
                            var shippingTab = '<li role="presentation">';
                                shippingTab += '<a href="#shippingInfo'+iter+'" aria-controls="shippingInfo'+iter;
                                shippingTab += '" role="tab" data-toggle="tab">Shipping Info</a></li>';

                            tabList += (basicTab + sellerTab + shippingTab + "</ul></div>");//closing parentDiv div

                            currInfoDiv.append(tabList);

                            $('#parentDiv'+iter).append('<div class="tab-content" id="tab-content-'+iter+'"></div>');

                            var lt = results[divId].basicInfo.listingType;
                            if(lt.length > 0){
                                if(lt === "FixedPrice" || lt ==="StoreInventory")
                                    lt = "Buy It Now";
                                else if(lt === "Classified")
                                    lt = "Classified Ad";
                                else if((lt.match(/auction/i)).length > 0)
                                    lt = lt.match(/auction/i);
                                else
                                    lt += "";
                            }
                            else{
                                lt = "N.A."
                            }

                            var labelClasses = "col-xs-12 col-sm-4 col-md-3";
                            var contentClasses = "col-xs-12 col-sm-8 col-md-9";

                            var basicContent = '<div class="' + labelClasses + '"><b>Catagory Name</b></div><div class="' + contentClasses + '">';
                                basicContent += (results[divId].basicInfo.categoryName!=="")?results[divId].basicInfo.categoryName:"N.A.";
                                basicContent += '</div>';
                                basicContent += '<div class="' + labelClasses + '"><b>Condition</b></div><div class="' + contentClasses + '">';
                                basicContent += (results[divId].basicInfo.conditionDisplayName!=="")?results[divId].basicInfo.conditionDisplayName:"N.A.";
                                basicContent += '</div>';
                                basicContent += '<div class="' + labelClasses + '"><b>Buying Format</b></div><div class="' + contentClasses + '">';
                                basicContent += lt;
                                basicContent += '</div>';

                            var st = results[divId].sellerInfo.storeName;
                            
                            if(st.length > 0){
                                var ur = results[divId].sellerInfo.storeURL;
                                if(ur.length > 0){
                                    st = '<a id="storeURL" href="'+ur+'">'+st+'</a>';
                                }

                            }
                            else{
                                st = "N.A.";
                            }

                            //Function to return a glyph based on true/false
                            function glyph(inp){
                                if(inp !== ""){
                                    if(inp=="true"){
                                        inp = '<span class="glyphicon glyphicon-ok" aria-hidden="true" style="color: green;"></span>';
                                    }
                                    else{
                                        inp = '<span class="glyphicon glyphicon-remove" aria-hidden="true" style="color: red;"></span>';
                                    }
                                }
                                else{
                                    inp = "N.A.";
                                }
                                return inp;
                            } //end of glyph function

                            var ratingStar = (results[divId].sellerInfo.feedbackRatingStar!=="")?results[divId].sellerInfo.feedbackRatingStar:"N.A.";
                                ratingStar = ratingStar.replace(/([a-z])([A-Z])/g, "$1 $2");

                            var sellerContent = '<div class="' + labelClasses + '"><b>User Name</b></div><div class="' + contentClasses + '">';
                                sellerContent += (results[divId].sellerInfo.sellerUserName!=="")?results[divId].sellerInfo.sellerUserName:"N.A.";
                                sellerContent += '</div>';
                                sellerContent += '<div class="' + labelClasses + '"><b>Feedback Score</b></div><div class="' + contentClasses + '">';
                                sellerContent += (results[divId].sellerInfo.feedbackScore!=="")?results[divId].sellerInfo.feedbackScore:"N.A.";
                                sellerContent += '</div>';
                                sellerContent += '<div class="' + labelClasses + '"><b>Positive Feedback</b></div><div class="' + contentClasses + '">';
                                sellerContent += (results[divId].sellerInfo.positiveFeedbackPercent!=="")?results[divId].sellerInfo.positiveFeedbackPercent+"%":"N.A.";
                                sellerContent += '</div>';
                                sellerContent += '<div class="' + labelClasses + '"><b>Feedback Rating</b></div><div class="' + contentClasses + '">';
                                sellerContent += ratingStar;
                                sellerContent += '</div>';
                                sellerContent += '<div class="' + labelClasses + '"><b>Top Rated</b></div><div class="' + contentClasses + '">';
                                sellerContent += glyph(results[divId].sellerInfo.topRatedSeller);
                                sellerContent += '</div>';
                                sellerContent += '<div class="' + labelClasses + '"><b>Store</b></div><div class="' + contentClasses + '">';
                                sellerContent += st;
                                sellerContent += '</div>';

                            var shType = (results[divId].shippingInfo.shippingType!=="")?results[divId].shippingInfo.shippingType:"N.A.";
                                shType = shType.replace(/([a-z])([A-Z])/g, "$1 $2");

                            var shippingContent = '<div class="' + labelClasses + '"><b>Shipping Type</b></div><div class="' + contentClasses + '">';
                                shippingContent += shType;
                                shippingContent += '</div>';
                                shippingContent += '<div class="' + labelClasses + '"><b>Handling Type</b></div><div class="' + contentClasses + '">';
                                shippingContent += (results[divId].shippingInfo.handlingTime!=="")?results[divId].shippingInfo.handlingTime+" day(s)":"N.A.";
                                shippingContent += '</div>';
                                shippingContent += '<div class="' + labelClasses + '"><b>Shipping Locations</b></div><div class="' + contentClasses + '">';
                                shippingContent += (results[divId].shippingInfo.shipToLocations!=="")?results[divId].shippingInfo.shipToLocations:"N.A.";
                                shippingContent += '</div>';
                                shippingContent += '<div class="' + labelClasses + '"><b>Expedited Shipping</b></div><div class="' + contentClasses + '">';
                                shippingContent += glyph(results[divId].shippingInfo.expeditedShipping);
                                shippingContent += '</div>';
                                shippingContent += '<div class="' + labelClasses + '"><b>One day Shipping</b></div><div class="' + contentClasses + '">';
                                shippingContent += glyph(results[divId].shippingInfo.oneDayShippingAvailable);
                                shippingContent += '</div>';
                                shippingContent += '<div class="' + labelClasses + '"><b>Returns accepted</b></div><div class="' + contentClasses + '">';
                                shippingContent += glyph(results[divId].shippingInfo.returnsAccepted);
                                shippingContent += '</div>';

                            $('#tab-content-'+iter).append('<div role="tabpanel" class="tab-pane active" id="basicInfo'+iter+'">'+basicContent+'</div>');
                            $('#tab-content-'+iter).append('<div role="tabpanel" class="tab-pane" id="sellerInfo'+iter+'">'+sellerContent+'</div>');
                            $('#tab-content-'+iter).append('<div role="tabpanel" class="tab-pane" id="shippingInfo'+iter+'">'+shippingContent+'</div>');
                            $('#tab-content-'+iter).append('</div>');                          

                        };
                    }
                    else{
                        var rangeOfItems = "Failed to retrive results for <b>" + $('#keywords').val(); + "</b>"
                        $('#rangeOfItems').append(rangeOfItems);   
                    }
                },
                error: function(){
                    alert("An error occured while fetching your request!");
                }
            }); //end of ajax call
    } //end of function render results

	//function to handle the click on facebook share button for a particular result
    $(document).on('click','img[id^="share_button"]',function(e){
        e.preventDefault();
        var name = "",
            link = "",
            picture = "",
            caption = "Search information from eBay.com",
            description = "",
            message = "";

        var itm = $(this).attr("id");
            itm = itm.charAt(itm.length-1);

        name = $("#name"+itm).val();
        link = $("#link"+itm).val();
        picture = $("#pict"+itm).val();
        description = $("#desc"+itm).val();

        //console.log('{name: '+name+'};{link: '+link+'};{pict: '+picture+'};{desc: '+description+'};');

        shareFb(name, link, picture, caption, description, message);
    });

    function shareFb(name, link, picture, caption, description, message){
        FB.ui(
        {
            method: 'feed',
            name: name,
            link: link,
            picture: picture,
            caption: caption,
            description: description, 
            message: message
        },
        function(fbResp) {
            if (fbResp && !fbResp.error_code) {
              alert('Posted Successfully');
            } else {
              alert('Not Posted');
            }
        });
    }

}); //end of document-ready