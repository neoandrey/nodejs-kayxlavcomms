class SliderFrame {
	constructor() {
		this.elementID = 0;
		this.elementName = '';
		this.elementImage = '';
		this.elelemntMainText = '';
		this.elementSubText = '';
		this.elementIcon = '';
		this.getObjectName = function () {
			return "SliderFrames";
		};
	}
}
class MessageBox {
	constructor() {
		this.elementID   = 0;
		this.elementName = '';
		this.elementText = '';
		this.elementBttn = '';
		this.getObjectName = function () {
			return "MessageBoxes";
		};
	}
}
class Post {
	constructor() {
		this.elementID = 0;
		this.elementName = '';
		this.elementImage = '';
		this.elementHeaderText = '';
		this.elementSubHeaderText = '';
		this.elelemntMainText = '';
		this.getObjectName = function () {
			return "Posts";
		};
	}
}
class Slider {
	constructor() {
		this.sliderID = 0;
		this.sliderName = '';
		this.sliderImage = '';
		this.sliderAnimation = '';
		this.getObjectName = function () {
			return "Sliders";
		};
	}
}
class Product {
	constructor() {
		this.productID = 0;
		this.productName = '';
		this.productImage = '';
		this.productText = '';
		this.creationDate = Date.now;
		this.getObjectName = function () {
			return "Products";
		};
	}
}
class GalleryItem {
	constructor() {
		this.galleryItemID = 0;
		this.galleryItemName = '';
		this.gallertItemImage = '';
		this.galleryItemText = '';
		this.getObjectName = function () {
			return "GalleryItems";
		};
	}
}
class AuditTrailEntry {
	constructor() {
		this.trailID = 0;
		this.description = '';
		this.oldData = '';
		this.newData = '';
		this.affectedTable = '';
		this.changeTime = '';
		this.changeType = '';
		this.userName = '';
		this.userID = '';
		this.rowIdentifier = '';
		this.getObjectName = function () {
			return "AuditTrail";
		};
	}
}

class User {
	constructor() {
		this.userID = 0;
		this.firstName = '';
		this.surname = '';
		this.roleID = 0;
		this.userName = '';
		this.creationDatetime = Date.now;
		this.isLocked = false;
		this.password = '';
		this.teamID = '';
		this.connectionStatus = '';
		this.isDisabled = '';
		this.loginCount = '';
		this.lastAccessTime = Date.now;
		this.passwordHistory = '';
		this.resetFlag = '';
		this.lastModifiedTime = Date.now;
		this.email = '';
		this.getObjectName = function () {
			return 'Users';
		};
	}
}

class Roles {
	constructor() {
		this.roleID = 0;
		this.roleName = '';
		this.roleDescription = '';
		this.getObjectName = function () {
			return "Roles";
		};
	}
}

class PageSection {
	constructor() {
		this.sectionID = 0;
		this.sectionName = '';
		this.sectionText = '';
		this.creationDate = Date.now;
		this.getObjectName = function () {
			return "PageSections";
		};
	}
}


class PageSectionItem {
	constructor() {
		this.categoryID = 0;
		this.name = '';
		this.description = '';
		this.creationDate = Date.now;
		this.iconClass = '';
		this.class = '';
		this.configSectionID = 0;
		this.subCategoryList= [];
		this.getObjectName = function () {
			return 'PageSectionItems';
		};
	}
}

class Page {
	constructor() {
		this.navID          = 0;
		this.name           = '';
		this.description    = '';
		this.subPageList    = [];
		this.parentPageID   =  '';
		this.isMainPage     = false;
		this.creationDate   = Date.now;
		this.pageurl        = '';
		this.pageCategoryID = 0;
		this.getObjectName = function () {
			return 'Pages';
		};
	}
}

class Banner {
	constructor() {
		this.bannerID 		     = 0;
		this.bannerName 	     = '';
		this.bannerImageName	 = '';
		this.imageID    		 =  0;
		this.creationDatetime    = Date.now;
		this.bannerAnimation     = '';
		this.getObjectName 	     = function () {
			return "Banners";
		};
	}
}

class Toggler {
     constructor(){
		this.togglerID		  	=  0;
		this.togglerName	    =  '';
		this.togglerPosition	=  1;
		this.togglerMessage		=  '';
		this.creationDatetime   =  Date.now;
		this.getObjectName = function () {
			 return "Togglers";
		 };

	 }

}



class Client {
	constructor() {
		this.clientID		   		   = 0;
		this.firstName 		  		   = '';
		this.middleName		  		   = '';
		this.surname 		  		   = '';
		this.address		  		   = '';
		this.preferredDeliveryLocation = '';
		this.imageID        		   = 0;
		this.lastModifiedTime  		   = Date.now;
		this.creationDatetime  		   = Date.now;
		this.email			   		   = '';
		this.phoneNumber			   = '';
		this.dateOfBirth			   = '';
		this.gender					   = '';
		this.street					   = '';
		this.city					   = '';
		this.state					   = '';
		this.country			       = '';
		this.favorites				   = '';
		this.moreInformation		   =  '';

		this.getObjectName     		   = function () {
			return 'Clients';
		};
	}
}


class MailProfile {
	 constructor(){
	    this.profileID	 	 = '';
	    this.profileName 	 = '';
		this.status      	 = 0;
		this.host	     	 = '';
		this.port	         = 0;
		this.userName    	 = '';
		this.password	 	 = '';
		this.debug		 	 =  0;
   		this.authentication  = '';
		this.security		 = '';
		this.replyTo		 = '';
		this.sender			 = '';
		this.senderAddress	 = '';
		this.creationDate	 = Date.now; 
		 this.getObjectName = function () {
			 return 'Clients';
		 };

	 }
}

class Invoice {
	constructor() {
		this.invoiceID	         =  0;
		this.invoiceDescription  = '';
		this.invoiceTime		 =  Date.now;
		this.clientID			 =  1;
	    this.totalItemCount		 =  0;
		this.totalAmountDue		 =  0.0;
		this.invoiceCurrency	 =  '';
		this.invoiceItems		 =  '';
		this.orderID			 =  0;
		this.creationDatetime	 =  Date.now;
		this.getObjectName	     = function () {
			return 'Invoices';
		};
	}
}

class  Order {
	constructor() {
		this.orderID 	              = 0;
		this.orderItems 		     = '';
		this.orderDate	             = Date.now;
		this.orderDescription        = '';
		this.clientID 		         = 0;
		this.totalItemCount          = 0;
		this.totalAmountDue 	     = 0.0;
		this.orderCurrency 	         = '';
		this.this.creationDatetime   = Date.now;
		this.status			         = 0;
		this.mailDelivered	         = false;
		this.getObjectName 			 = function () {
			return 'Orders';
		};
	}
}

class MailTemplate {
	constructor() {
		  templateID        = 0;
		  profileID		    = 0;
		  alias  			= '';
		  subject		    = '';
		  body              = '';
		  attachments		= '';
		  embeddedImages	= '';
		  description		=  '';
		  creationDatetime	= Date.now;
		 this.getObjectName = function () {
			return 'MailTemplates';
		 };
	}
}

class EmailHistory {
	constructor() {
		this.historyID	    	=   0;
		this.status	        	=   0;
		this.body	        	=   '';
		this.subject        	=   '';
		this.attachments    	=   '';
		this.embeddedImages 	=   '';
		this.description    	=   '';
		this.sender				=   '';
		this.receiverList		=    '';
		this.creationDatetime	= Date.now;
		this.dateSent			= Date.now;
		this.errorMessage		= '';
		this.lastModifiedTime   = Date.now;
		this.getObjectName 		= function () {
			return 'EmailHistory';
		};
	}
}

class  Image{
	 constructor(){
		  imageID	  =  0;
		  name		  =  '';
		  fileUrl	  =  '';
		  fileSize	  =   0;
		  format	  =  '';
		  dimension	  =  '';
		  sourceUrl   =  '';
		 this.getObjectName = function () {
			 return 'Images';
		 };
	 }



}


module.exports.PageSection 	     = PageSection;
module.exports.SliderFrame 	     = SliderFrame;
module.exports.MessageBox 		 = MessageBox;
module.exports.Slider			 = Slider;
module.exports.Product		     = Product;
module.exports.GalleryItem 	     = GalleryItem;
module.exports.AuditTrailEntry   = AuditTrailEntry;
module.exports.User  		     = User;
module.exports.Roles		     = Roles;
module.exports.Page              = Page;
module.exports.Post				 = Post;
module.exports.PageSectionItem   = PageSectionItem;
module.exports.Banner 		     = Banner;
module.exports.Toggler 			 = Toggler;
module.exports.Client            = Client;
module.exports.MailProfile       = MailProfile;
module.exports.Invoice			 = Invoice;
module.exports.Order			 = Order;
module.exports.MailTemplate      = MailTemplate;
module.exports.EmailHistory      = EmailHistory;
module.exports.Image 			 = Image;