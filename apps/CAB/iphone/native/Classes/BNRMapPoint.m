//
//  BNRMapPoint.m
//  Whereami
//
//  Created by pelegrin on 7/27/12.
//  Copyright (c) 2012 pelegrin. All rights reserved.
//

#import "BNRMapPoint.h"

@interface BNRMapPoint ()

@property (nonatomic, readonly) NSDate *creationDate;

@end

@implementation BNRMapPoint

-(id)initWithCooridnate:(CLLocationCoordinate2D)coordinate title:(NSString *)title
{
    self = [super init];
    if (self) {
        _coordinate = coordinate;
        self.title = title;
        _creationDate = [NSDate date];
    }
    return self;
}

-(NSString *)title
{
    NSString *title = [[_title copy] stringByAppendingString:@" "];
    return [title stringByAppendingString:[NSDateFormatter localizedStringFromDate:self.creationDate dateStyle:NSDateFormatterShortStyle timeStyle:NSDateFormatterNoStyle]];
}

-(id)init
{
    return [self initWithCooridnate:CLLocationCoordinate2DMake(43.07, -89.32) title:@"Hometown"];
}

@end
