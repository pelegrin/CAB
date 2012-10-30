//
//  WhereamiViewController.h
//  Whereami
//
//  Created by pelegrin on 7/6/12.
//  Copyright (c) 2012 pelegrin. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>
#import <MapKit/MapKit.h>
#import "BNRMapPoint.h"

@interface WhereamiViewController : UIViewController <CLLocationManagerDelegate, MKMapViewDelegate, UITextFieldDelegate>

@property (weak, nonatomic) IBOutlet MKMapView *world;
@property (weak, nonatomic) IBOutlet UIBarButtonItem *backButton;
@property (weak, nonatomic) IBOutlet UIActivityIndicatorView *activityIndicator;

-(void)foundLocation:(CLLocation *)loc;
-(IBAction)switchMap:(id)sender;
-(IBAction)returnFromNative;

@end
