//
//  BNRMapPoint.h
//  Whereami
//
//  Created by pelegrin on 7/27/12.
//  Copyright (c) 2012 pelegrin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <MapKit/MapKit.h>

@interface BNRMapPoint : NSObject <MKAnnotation>

-(id)initWithCooridnate:(CLLocationCoordinate2D)coordinate title:(NSString *)title;
@property (nonatomic, readonly) CLLocationCoordinate2D coordinate;
@property (nonatomic, copy) NSString *title;

@end
