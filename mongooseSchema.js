var  pageSections  		      = {  	sectionID: Number, 
										sectionName: String,
										sectionText: String
									};
var  topSectionElement  	 =  {  
                                 elementID: Number,
								 elementName: String,
								 elementImage: String,
								 elelemntMainText: String,
								 elementSubText:String,
								 elementIcon:String
								};
var  midSectionElement 		    =  {   elementID: Number,
										elementText: String,
										elementBttn: String
									};
var  bottomSectionElement	    = {	 elementID: Number,
										 elementName: String,
										 elementImage: String,
										 elementHeaderText:String,
										 elementSubHeaderText:String,
										 elelemntMainText: String
									};
var slider      		        = {     sliderID: Number,
										 sliderName: String,
										 sliderImage: String,
										 sliderAnimation: String
										
									};
var  product             		 = {  
										productID:   Number,
										productName: String,
										productImage: String,
										productText:  String
			
									};
var  galleryItem         		  = { galleryItemID: Number,
									   galleryItemName: String,
									   gallertItemImage: String,
									   galleryItemText:  String
									};
var  auditTrailEntry      			={
											   trailID:  Number
											  ,description: String
											  ,oldData: String 
											  ,newData: String
											  ,affectedTable: String
											  ,changeTime:  String
											  ,changeType:  String
											  ,userName:    String
											  ,userID:      String
											  ,rowIdentifier: String
										};
										
var users           			       ={
				
											   userID: Number
											  ,firstName: String
											  ,surname: String
											  ,roleID:  Number 
											  ,userName: String 
											  ,creationDatetime: { type: Date, default: Date.now }
											  ,isLocked:	Boolean 
											  ,password: String 
											  ,teamID:  String
											  ,connectionStatus: String
											  ,isDisabled: String
											  ,loginCount: String
											  ,lastAccessTime: { type: Date, default: Date.now }
											  ,passwordHistory: String 
											  ,resetFlag: String
											  ,lastModifiedTime: { type: Date, default: Date.now }
											  ,email: String
									   }
						   
var  roles							 = {
												roleID: Number
											  , roleName: String
											  , roleDescription: String
										}
						
module.exports.pageSections 	       = pageSections;
module.exports.topSectionElement       = topSectionElement;
module.exports.midSectionElement       = midSectionElement;
module.exports.slider  				   = slider;
module.exports.product  			   = product;
module.exports.galleryItem  		   = galleryItem;
module.exports.auditTrailEntry		   = auditTrailEntry;
module.exports.users				   = users;
module.exports.roles				   = roles;
