//
//  WhereamiViewController.m
//  Whereami
//
//  Created by pelegrin on 7/6/12.
//  Copyright (c) 2012 pelegrin. All rights reserved.
//

#import "WhereamiViewController.h"
#import "NativePage.h"
#import "CDVAppDelegate.h"

@interface WhereamiViewController ()
@property (nonatomic, strong) CLLocationManager *locationManager;

@end

@implementation WhereamiViewController
@synthesize world = _world;
@synthesize backButton = _backButton;
@synthesize activityIndicator = _activityIndicator;

-(id) initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        self.locationManager = [[CLLocationManager alloc]init];
        self.locationManager.delegate = self;
        [self.locationManager setDesiredAccuracy:kCLLocationAccuracyNearestTenMeters];
        [self.locationManager setDistanceFilter:50];
    }
    return self;
}

-(void)viewDidLoad
{
    [self.world setShowsUserLocation:YES];
    self.world.mapType = MKMapTypeStandard;
}

-(void)locationManager:(CLLocationManager *)manager didUpdateToLocation:(CLLocation *)newLocation fromLocation:(CLLocation *)oldLocation
{
    NSTimeInterval timeInterval = [[newLocation timestamp]timeIntervalSinceNow];
    if (timeInterval < -180) {
        return;
    }
    [self foundLocation:newLocation];
}

-(void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error
{
    NSLog(@"Could not find location: %@", error);
}

-(void)locationManager:(CLLocationManager *)manager didUpdateHeading:(CLHeading *)newHeading
{
    NSLog(@"Compass value:%@",newHeading);
}


-(void)mapView:(MKMapView *)mapView didUpdateUserLocation:(MKUserLocation *)userLocation
{
    [self.world setRegion:MKCoordinateRegionMakeWithDistance(userLocation.coordinate, 250, 250) animated:YES];
}


-(void)foundLocation:(CLLocation *)loc
{
    CLLocationCoordinate2D location = [loc coordinate];
    BNRMapPoint *mp = [[BNRMapPoint alloc] initWithCooridnate:location title:@"Here is kid"];
    [self.world addAnnotation:mp];
    [self.world setRegion:MKCoordinateRegionMakeWithDistance(location, 250, 250) animated:YES];
    [self.activityIndicator stopAnimating];
    [self.locationManager stopUpdatingLocation];
}

-(IBAction)switchMap:(id)sender
{
    NSInteger selectedSegment = [(UISegmentedControl *)sender selectedSegmentIndex];
    switch (selectedSegment) {
        case 0:
            self.world.mapType = MKMapTypeStandard;
            break;
        case 1:
            self.world.mapType = MKMapTypeSatellite;
            break;
        case 2:
            self.world.mapType = MKMapTypeHybrid;
            break;
        default:
            self.world.mapType = MKMapTypeStandard;
            break;
    }
}

-(IBAction)returnFromNative {
        // Animate transition with a flip effect
    CDVAppDelegate *cordovaAppDelegate = (CDVAppDelegate
                                          *)[[UIApplication sharedApplication] delegate];
    [UIView beginAnimations:nil context:NULL];
    [UIView setAnimationDuration:0.5];
    [UIView setAnimationTransition:UIViewAnimationTransitionFlipFromLeft
                           forView:[cordovaAppDelegate window] cache:YES];
    [UIView commitAnimations];
    [NativePage showWebView:nil];
}

- (void)viewDidUnload {
    [self setWorld:nil];
    [self setActivityIndicator:nil];
    [super viewDidUnload];
}

-(void)onBeforeShow
{
    CDVAppDelegate *cordovaAppDelegate = (CDVAppDelegate  *)[[UIApplication sharedApplication] delegate];
    [UIView beginAnimations:nil context:NULL];
    [UIView setAnimationDuration:0.5];
    [UIView setAnimationTransition:UIViewAnimationTransitionFlipFromRight forView:[cordovaAppDelegate window] cache:YES];
}

-(void)onAfterShow {
    [UIView commitAnimations];
}

@end

