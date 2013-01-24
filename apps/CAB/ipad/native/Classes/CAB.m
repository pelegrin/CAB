//
//  MyAppDelegate.m
//  CAB
//
//

#import "CAB.h"


@implementation MyAppDelegate

- (id) init
{	
	/*
	* If you need to do any extra app-specific initialization, you can do it here.
	**/
    return [super init];
}

/**
 * This is main kick off after the app inits, the views and Settings are setup here.
 */
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions 
{
    BOOL ret = [super application:application didFinishLaunchingWithOptions:launchOptions];
    
    // The following code can be uncommented for use on iOS6 to prompt for access to Contacts
    // !! Note that the caller is responsible for releasing AddressBook !!
//    ABAddressBookRef addressBook;
//    if (&ABAddressBookCreateWithOptions != NULL) {
//        CFErrorRef error = nil;
//        // CFIndex status = ABAddressBookGetAuthorizationStatus();
//        // NSLog(@"addressBook access: %lu", status);
//        addressBook = ABAddressBookCreateWithOptions(NULL, &error);
//        ABAddressBookRequestAccessWithCompletion(addressBook, ^(bool granted, CFErrorRef error) {
//            // callback can occur in background, address book must be accessed on thread it was created on
//            dispatch_sync (dispatch_get_main_queue (), ^{
//                if (error) {
//                    NSLog(@"Error getting address book");
//                } else if (!granted) {
//                    NSLog(@"Not allowed to get address book");
//                } else {
//                    NSLog(@"Got address book");
//                }
//            });
//        });
//    }
   
    /*
     * If you need to do any extra app-specific initialization, you can do it here.
     **/
    
    return ret;
}

/**
* These functions handle moving to background and foreground and invoke the appropriate JavaScript functions in the UIWebView.
*/

- (void)applicationDidEnterBackground:(UIApplication *)application
{
	NSString *result = [super.viewController.webView stringByEvaluatingJavaScriptFromString:@"WL.App.BackgroundHandler.onAppEnteringBackground();"]; 
	if([result isEqualToString:@"hideView"]){
		[[self.viewController view] setHidden:YES];
	}
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
	NSString *result = [super.viewController.webView stringByEvaluatingJavaScriptFromString:@"WL.App.BackgroundHandler.onAppEnteringForeground();"];
	if([result isEqualToString:@"hideViewToForeground"]){
		[[self.viewController view] setHidden:NO];
	}
}

- (void)applicationDidBecomeActive:(UIApplication *)application 
{
	[super applicationDidBecomeActive:application];
    /*
     * If you need to do any extra app-specific stuff, you can do it here.
     **/
}

- (void)dealloc
{
	[ super dealloc ];
}

@end
