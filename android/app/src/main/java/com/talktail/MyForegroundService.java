package com.talktail;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

public class MyForegroundService extends Service {
    private static final String CHANNEL_ID = "foreground_service_channel";
    private static final String ACTION_STOP_SERVICE = "com.talktail.ACTION_STOP_SERVICE";
    private static final String ACTION_RESTART_SERVICE = "com.talktail.ACTION_RESTART_SERVICE";

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // ✅ 종료 처리
        if (intent != null && ACTION_STOP_SERVICE.equals(intent.getAction())) {
            stopSelf();
            return START_NOT_STICKY;
        }

        // ✅ 재시작 처리
        if (intent != null && ACTION_RESTART_SERVICE.equals(intent.getAction())) {
            stopSelf();
            // 재시작 시 1초 뒤 자동 실행 예시 (간단한 재시작)
            Intent restartIntent = new Intent(this, MyForegroundService.class);
            PendingIntent pendingIntent = PendingIntent.getService(this, 1, restartIntent, PendingIntent.FLAG_IMMUTABLE);
            try {
                pendingIntent.send();  // 서비스 재시작
            } catch (PendingIntent.CanceledException e) {
                e.printStackTrace();
            }
            return START_NOT_STICKY;
        }

        createNotificationChannel();
        showForegroundNotification();
        return START_STICKY;
    }

    private void showForegroundNotification() {
        // 종료 버튼
        Intent stopIntent = new Intent(this, MyForegroundService.class);
        stopIntent.setAction(ACTION_STOP_SERVICE);
        PendingIntent stopPendingIntent = PendingIntent.getService(
                this, 0, stopIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        // 재시작 버튼
        Intent restartIntent = new Intent(this, MyForegroundService.class);
        restartIntent.setAction(ACTION_RESTART_SERVICE);
        PendingIntent restartPendingIntent = PendingIntent.getService(
                this, 1, restartIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        // 앱 열기 버튼
        Intent openAppIntent = new Intent(this, MainActivity.class);  // MainActivity로 이동
        openAppIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent openAppPendingIntent = PendingIntent.getActivity(
                this, 2, openAppIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("앱 실행 중")
                .setContentText("서비스가 백그라운드에서 실행 중입니다.")
                .setSmallIcon(R.mipmap.ic_launcher)
                .addAction(0, "앱 열기", openAppPendingIntent)
                .addAction(0, "재시작", restartPendingIntent)
                .addAction(0, "종료", stopPendingIntent)
                .build();

        startForeground(1, notification);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Foreground Service Channel",
                    NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }
    }
}
