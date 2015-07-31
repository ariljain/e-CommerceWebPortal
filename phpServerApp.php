<?php
    if(isset($_GET['keywords'])){
        error_reporting(E_ALL);  // turn on all errors, warnings and notices for easier debugging
        $results = ''; //this will hold html for search results

        $endpoint = 'http://svcs.ebay.com/services/search/FindingService/v1';  // URL to call
            $responseEncoding = 'XML';   // Format of the response
            $safeQuery = urlencode (utf8_encode($_GET['keywords']));  //convert keywords to url safe
            $site = "EBAY-US";
            $resultsPerPage = $_GET['resultsperpage']; //get the number of results to be shown per page
            $sortOrder = $_GET['sortby']; //get the preference for order in which the results must be sorted
                        
            //building ebay api url with mandatory parameters
			//use your own eBay API credentials instead of XXXXXX
            $apicall = "$endpoint?OPERATION-NAME=findItemsAdvanced"
                        . "&SERVICE-VERSION=1.0.0"
                        . "&GLOBAL-ID=$site"
                        . "&SECURITY-APPNAME=XXXXXX"
                        . "&keywords=$safeQuery"
                        . "&paginationInput.entriesPerPage=$resultsPerPage"
                        . "&sortOrder=$sortOrder";
            
            //build api based on filters
            $numFilter = 0; //keep track of the filter number
            
            
            //appending to api url based on input : Shipping
            if(isset($_GET['freeshipping'])){
				//apply filter for showing items with free shipping
                $apicall .= "&itemFilter($numFilter).name=FreeShippingOnly";
                $apicall .= "&itemFilter($numFilter).value=true";
                $numFilter += 1;
            }
            
            if(isset($_GET['expshipping'])){
				//apply filter for showing items with expedited shipping available
                $apicall .= "&itemFilter($numFilter).name=ExpeditedShippingType";
                $apicall .= "&itemFilter($numFilter).value=Expedited";
                $numFilter += 1;
            }
            
            if(isset($_GET['handlingtime']) && $_GET['handlingtime']!=""){
				//apply filter for showing items with handling time as specified by end-user
                $apicall .= "&itemFilter($numFilter).name=MaxHandlingTime";
                $apicall .= "&itemFilter($numFilter).value=".$_GET['handlingtime'];
                $numFilter += 1;
            }
            
            
            //appending to api url based on input : Price Range
            if(isset($_GET['prange_start']) && $_GET['prange_start']!=""){
				//set the lower end of the price range
                $apicall .= "&itemFilter($numFilter).name=MinPrice";
                $apicall .= "&itemFilter($numFilter).value=".$_GET['prange_start'];
                $numFilter += 1;
            }
            
            if(isset($_GET['prange_end']) && $_GET['prange_end']!=""){
				//set the upper end of the price range
                $apicall .= "&itemFilter($numFilter).name=MaxPrice";
                $apicall .= "&itemFilter($numFilter).value=".$_GET['prange_end'];
                $numFilter += 1;
            }
            
            //appending to api url based on input : Condition of item
            if(!empty($_GET['condition'])){ 
                $conditionArray = $_GET['condition']; //get the list of acceptable conditions of the items
                $apicall .= "&itemFilter($numFilter).name=Condition";
                
                $numValues = count($conditionArray); //number of conditions specified by the end-user
                for($i=0;$i<$numValues;$i++){
					//add filter value for each condition specified
                    $apicall .= "&itemFilter($numFilter).value($i)=".$conditionArray[$i];
                }
                
                $numFilter += 1;
                $numValues = 0;
            }
            
            //appending to api url based on input : Buying Format
            if(!empty($_GET['buyFormat'])){
				//apply filter for showing items with acceptable listing type
                $buyFormatArray = $_GET['buyFormat'];
                $apicall .= "&itemFilter($numFilter).name=ListingType";
                
                $numValues = count($buyFormatArray);
                for($i=0;$i<$numValues;$i++){
					//add filter value for each listing type selected by end-user
                    $apicall .= "&itemFilter($numFilter).value($i)=".$buyFormatArray[$i];
                }
                
                $numFilter += 1;
                $numValues = 0;
            }
            
            //appending to api url based on input : Seller
            if(isset($_GET['seller'])){
				//apply filter for showing items where seller accepts returns
                $apicall .= "&itemFilter($numFilter).name=ReturnsAcceptedOnly";
                $apicall .= "&itemFilter($numFilter).value=".$_GET['seller'];
                $numFilter += 1;
                
            }
            
            //To get the query response in XML format
            $apicall .= "&RESPONSE-DATA-FORMAT=$responseEncoding";

            //output selectors for the call

            //preparing an array for all the output selectors
            $output_selectors = [0 => "SellerInfo", 1 => "PictureURLSuperSize", 2 => "StoreInfo"];
            
            foreach ($output_selectors as $key => $value) {
              $apicall .= "&outputSelector($key)=$value";
            }

            //adding pagination
            $pageNum = 1;
            if(isset($_GET['pageNum'])){
                $pageNum = $_GET['pageNum'];    
            }
            $apicall .= "&paginationInput.pageNumber=$pageNum"; //get results on specified page number

            //echo $apicall;

            //getting xml response from eBay
            $results = simplexml_load_file($apicall) or die("Error: Cannot create object");

            //extracting information from xml response
            $ack            = (string) $results->ack;
            $resultCount    = (int) $results->paginationOutput->totalEntries;
            $pageNumber     = (int) $results->paginationOutput->pageNumber;
            $itemCount      = (int) $results->paginationOutput->entriesPerPage;

            $jasonData = array();
            $jasonData["ack"]   = $ack;
            

            if($resultCount > 0){
				//if there search return more than zero results
				//prepare the json response
				
                $jasonData["resultCount"]   = $resultCount;
                $jasonData["pageNumber"]    = $pageNumber;
                $jasonData["itemCount"]     = $itemCount;
            
                $Items = $results->searchResult->children();

                $itemNum = 0;

                foreach($Items as $currItem){

                    //collect basic information
                    $basicInfo = array();
                    $basicInfo['title']                  = (string) $currItem->title;
                    $basicInfo['viewItemURL']            = (string) $currItem->viewItemURL;
                    $basicInfo['galleryURL']             = (string) $currItem->galleryURL;
                    $basicInfo['pictureURLSuperSize']    = (string) $currItem->pictureURLSuperSize;
                    $basicInfo['convertedCurrentPrice']  = (string) $currItem->sellingStatus->convertedCurrentPrice; 
                    $basicInfo['shippingServiceCost']    = (string) $currItem->shippingInfo->shippingServiceCost;
                    $basicInfo['conditionDisplayName']   = (string) $currItem->condition->conditionDisplayName;
                    $basicInfo['listingType']            = (string) $currItem->listingInfo->listingType;
                    $basicInfo['location']               = (string) $currItem->location;
                    $basicInfo['categoryName']           = (string) $currItem->primaryCategory->categoryName;
                    $basicInfo['topRatedListing']        = (string) $currItem->topRatedListing;

                    //collect seller information
                    $sellerInfo = array();
                    $sellerInfo['sellerUserName']           = (string) $currItem->sellerInfo->sellerUserName;
                    $sellerInfo['feedbackScore']            = (int) $currItem->sellerInfo->feedbackScore;
                    $sellerInfo['positiveFeedbackPercent']  = floatval((string)$currItem->sellerInfo->positiveFeedbackPercent);
                    $sellerInfo['feedbackRatingStar']       = (string) $currItem->sellerInfo->feedbackRatingStar;
                    $sellerInfo['topRatedSeller']           = (string) $currItem->sellerInfo->topRatedSeller;
                    $sellerInfo['storeName']                = (string) $currItem->sellerInfo->storeName;
                    $sellerInfo['storeURL']                 = (string) $currItem->sellerInfo->storeURL;
                    
                    //collect shipping information
                    $shippingInfo = array();
                    $shippingInfo['shippingType']               = (string) $currItem->shippingInfo->shippingType;
                    $shippingInfo['expeditedShipping']          = (string) $currItem->shippingInfo->expeditedShipping;
                    $shippingInfo['oneDayShippingAvailable']    = (string) $currItem->shippingInfo->oneDayShippingAvailable;
                    $shippingInfo['returnsAccepted']            = (string) $currItem->returnsAccepted;
                    $shippingInfo['handlingTime']               = (int) $currItem->shippingInfo->handlingTime;

                    $tempArray = array();
                    foreach($currItem->shippingInfo->shipToLocations as $loc){
                        $tempArray[] = (string) $loc;
                    }
                    $shippingInfo['shipToLocations'] = implode(', ', $tempArray);


                    $jasonData["item{$itemNum}"] = array(
                                                    "basicInfo" => $basicInfo,
                                                    "sellerInfo" => $sellerInfo,
                                                    "shippingInfo" => $shippingInfo
                                                    );

                    $itemNum += 1;
                }
            }
            else{
				//if search return zero results
                $jasonData["ack"] = "No Results Found";
            }
            //print_r($jasonData);
            print_r(json_encode($jasonData,JSON_UNESCAPED_SLASHES));
    }
?>