/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  AppDelegate.h
//  CordovaCleanApp
//
//  Created by Oded Regev on 3/12/12.
//

#import <UIKit/UIKit.h>

#ifdef CORDOVA_FRAMEWORK
    #import <Cordova/CDVViewController.h>
#else
    #import "CDVViewController.h"
#endif

@interface CDVAppDelegate : NSObject < UIApplicationDelegate > {

}

extern NSString * const START_PAGE_LAUNCH_OPTION;

// invoke string is passed to your app on launch, this is only valid if you 
// edit FooBar.plist to add a protocol
// a simple tutorial can be found here : 
// http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html

@property (nonatomic, retain) IBOutlet UIWindow* window;
@property (nonatomic, retain) IBOutlet CDVViewController* viewController;

@end

