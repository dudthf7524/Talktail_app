package com.talktail;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class MyServiceStarterModule extends ReactContextBaseJavaModule {

    MyServiceStarterModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "MyServiceStarter";
    }

    @ReactMethod
    public void startService() {
        Context context = getReactApplicationContext();
        Intent intent = new Intent(context, MyForegroundService.class);
        context.startForegroundService(intent);
    }

    @ReactMethod
    public void stopService() {
        Intent intent = new Intent(getReactApplicationContext(), MyForegroundService.class);
        getReactApplicationContext().stopService(intent);
    }

    // ✅ 서비스 실행 중 여부 확인 메서드
    @ReactMethod
    public void isServiceRunning(Promise promise) {
        ActivityManager manager = (ActivityManager) getReactApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (MyForegroundService.class.getName().equals(service.service.getClassName())) {
                promise.resolve(true);
                return;
            }
        }
        promise.resolve(false);
    }
}
