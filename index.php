<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>eBay API and Facebook Post</title>

    <link href="css/myStylesheet.css" rel="stylesheet">
    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

  </head>
  <body>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script type="text/javascript" src="js/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery.validate.min.js"></script>
    <script type="text/javascript" src="js/additional-methods.min.js"></script>
    <script type="text/javascript" src="js/jquery.form.js"></script>
    <script type="text/javascript" src="js/myValidate.js"></script>

    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>

    <div name="outerContainer" class="col-xs-12 col-sm-12 col-md-8 col-md-offset-2 container">
      <br/>
      <div name="imageContainer" id="imageContainer" class="col-xs-12 col-sm-12 col-md-12">
        <img alt="eBay Logo" src="ebay.jpg" class="img-responsive" id="eBayLogo"> Shoppping
      </div>
      <div name="formContainer" id="formContainer" class="col-xs-12 col-sm-12 col-md-12">
        <br/>
        <form class="form-horizontal" id="myform" method="GET" action="phpServerApp.php">
          
          <!-- Field for keywords -->
          <div class="form-group row">
            <label for="keywords" class="control-label col-xs-6 col-sm-3 col-md-3">Keywords:<span id="highlight">*</span></label>
            <div class="col-xs-12 col-sm-9 col-md-7">
            <input type="text" class="form-control" id="keywords" name="keywords" placeholder="Enter Keyword">
            </div>
          </div>
          
          <!-- Field for price range -->
          <div class="form-group row">
            <label for="inputPriceRange" class="control-label col-xs-6 col-sm-3 col-md-3">Price Range:</label>
            <div class="col-xs-12 col-sm-4 col-md-3">
            <input type="number" step="0.01" class="form-control" name="prange_start" id="prange_start" placeholder="from ($)">
            </div>
            <div class="col-xs-12 col-sm-4 col-sm-offset-1 col-md-3 col-md-offset-1">
            <input type="number" step="0.01" class="form-control" name="prange_end" id="prange_end" placeholder="to ($)">
            </div>
          </div>
          
          <!-- Field for condition -->
          <div class="form-group row">
            <label for="condition" class="control-label col-xs-6 col-sm-3 col-md-3">Condition:</label>
            <div class="col-xs-12 col-sm-9 col-md-7">
              <div class="row">
                <div class="col-xs-3 col-sm-2 col-md-2">
                  <label class="checkbox-inline"><input type="checkbox" name="condition[]" value="1000"> New</label>
                </div>
                <div class="col-xs-3 col-sm-2 col-md-2">
                  <label class="checkbox-inline"><input type="checkbox" name="condition[]" value="3000"> Used</label>
                </div>
                <div class="col-xs-5 col-sm-3 col-md-3">
                  <label class="checkbox-inline"><input type="checkbox" name="condition[]" value="4000"> Very Good</label>
                </div>
                <div class="col-xs-4 col-sm-2 col-md-2">
                  <label class="checkbox-inline"><input type="checkbox" name="condition[]" value="5000"> Good</label>
                </div>
                <div class="col-xs-4 col-sm-3 col-md-2">
                  <label class="checkbox-inline"><input type="checkbox" name="condition[]" value="6000"> Acceptable</label>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Field for buying format -->
          <div class="form-group row">
            <label for="buyFormat" class="control-label col-xs-6 col-sm-3 col-md-3">Buying formats:</label>
            <div class="col-xs-12 col-sm-9 col-md-7">
              <div class="row">
                <div class="col-xs-5 col-sm-3 col-md-3">
                  <label class="checkbox-inline"><input type="checkbox" name="buyFormat[]" value="FixedPrice"> But It Now</label>
                </div>
                <div class="col-xs-5 col-sm-3 col-md-3">
                  <label class="checkbox-inline"><input type="checkbox" name="buyFormat[]" value="Auction"> Auction</label>
                </div>
                <div class="col-xs-6 col-sm-3 col-md-4">
                  <label class="checkbox-inline"><input type="checkbox" name="buyFormat[]" value="Classified"> Classified Ads</label>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Field for returns/seller -->
          <div class="form-group row">
            <label for="seller" class="control-label col-xs-6 col-sm-3 col-md-3">Seller:</label>
            <div class="col-xs-12 col-sm-9 col-md-7">
            <label class="checkbox-inline"><input type="checkbox" name="seller" value="true"> Return accepted</label>
            </div>
          </div>
          
          <!-- Field for shipping options -->
          <div class="form-group row">
            <label for="shippingOptions" class="control-label col-xs-6 col-sm-3 col-md-3">Shipping:</label>
            <div class="col-xs-12 col-sm-9 col-md-7">
              <div class="row">
                <div class="col-xs-4 col-sm-3 col-md-4">
                  <label class="checkbox-inline"><input type="checkbox" name="freeshipping"  id="freeshipping" value="true"> Free Shipping</label>
                </div>
                <div class="col-xs-6 col-sm-4 col-md-5">
                  <label class="checkbox-inline"><input type="checkbox" name="expshipping"  id="expshipping" value="Expedited"> Expedited Shipping</label>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12">
                  <input type="number" step="1" min="1" class="form-control" name="handlingtime" id="handlingtime" placeholder="Max handling time (days)">
                </div>
              </div>
            </div>
          </div>
          
          <!-- Field for sorting options -->
          <div class="form-group row">
            <label for="sortby" class="control-label col-xs-6 col-sm-3 col-md-3">Sort By:</label>
            <div class="col-xs-12 col-sm-9 col-md-7">
              <select class="form-control" name="sortby" id="sortby">
                <option value="BestMatch" default>Best Match</option>
                <option value="CurrentPriceHighest">Price: Highest first</option>
                <option value="PricePlusShippingHighest">Price + Shipping: Highest first</option>
                <option value="PricePlusShippingLowest">Price+ Shipping: Lowest first</option>
              </select>
            </div>
          </div>
          
          <!-- Field for num results per page -->
          <div class="form-group row">
            <label for="resultsperpage" class="control-label col-xs-8 col-sm-3 col-md-3">Results per Page:</label>
            <div class="col-xs-12 col-sm-9 col-md-7">
              <select class="form-control" name="resultsperpage" id="resultsperpage">
                <option value="5" default>5</option>
                <option value="10">10</option>
              </select>
            </div>
          </div>
          
          <!-- Div for clear and submit buttons -->
          <div class="form-group col-xs-12 col-sm-12 col-md-10">
            &nbsp;&nbsp;&nbsp;
            <button type="submit" class="btn btn-primary b" name="Query">Search</button>
            <button type="reset" class="btn btn-default b" id="clrbtn">Clear</button>

          </div>
        
        </form>
        
        <script>
          $(document).ready(function(){ 
            $("#myform").validate(); 
          });

          $("#keywords").bind('input propertychange', function(){
            $("#myform").validate().element("#keywords");
          });

          $("#prange_start").bind('input propertychange', function(){
            $("#myform").validate().element("#prange_start");
          });

          $("#prange_end").bind('input propertychange', function(){
            $("#myform").validate().element("#prange_end");
          });

          $("#handlingtime").bind('input propertychange', function(){
            $("#myform").validate().element("#handlingtime");
          });
        </script>

      </div>
    </div>
    
    <div id="resultsContainer" class="col-xs-12 col-sm-12 col-md-10 col-md-offset-2 container"> </div>
    
    <div id="paginationDiv" class="col-xs-12 col-sm-12 col-md-8 col-md-offset-2 container" style="display: none;">
      <input type="hidden" id="startPage" name="startPage" value="">
      <input type="hidden" id="currPage" name="currPage" value="">
      <input type="hidden" id="endPage" name="endPage" value="">
      <input type="hidden" id="activePg" name="activePg" value="">
      <nav>
        <ul class="pagination">
          <li id="prev" style="cursor: pointer;"><span aria-hidden="true" id="pr">&laquo;</span></li>
          <li id="page1" style="cursor: pointer;"><span aria-hidden="true" id="1">1</span></li>
          <li id="page2" style="cursor: pointer;"><span aria-hidden="true" id="2">2</span></li>
          <li id="page3" style="cursor: pointer;"><span aria-hidden="true" id="3">3</span></li>
          <li id="page4" style="cursor: pointer;"><span aria-hidden="true" id="4">4</span></li>
          <li id="page5" style="cursor: pointer;"><span aria-hidden="true" id="5">5</span></li>
          <li id="nxt" style="cursor: pointer;"><span aria-hidden="true" id="nt">&raquo;</span></li>
        </ul>
      </nav> 
    </div>

    <div id="fb-root" style="display: none;"></div>
	
	<!-- 
	Script to make async call to Facebook API
	Use you own Facebook API credentials instead of XXXXXX
	-->
    <script>
      window.fbAsyncInit = function() {
        FB.init({
          appId      : 'XXXXXX',
          xfbml      : true,
          version    : 'v2.3'
        });
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
    </script>
  
  <NOSCRIPT>
  </body>
</html>