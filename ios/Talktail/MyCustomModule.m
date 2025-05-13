#import "MyCustomModule.h"
#import <React/RCTLog.h>

@implementation MyCustomModule

RCT_EXPORT_MODULE(); // 꼭 있어야 React Native에서 인식됨

- (instancetype)init {
  self = [super init];
  if (self) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onDeviceRotate)
                                                 name:UIDeviceOrientationDidChangeNotification
                                               object:nil];
  }
  return self;
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)onDeviceRotate {
  // 회전 감지 시 JavaScript로 이벤트 보냄
  [self sendEventWithName:@"onRotate" body:@{@"orientation": @"changed"}];
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onRotate"];
}

@end
