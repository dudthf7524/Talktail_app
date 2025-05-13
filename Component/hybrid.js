class IRDataManager {
  constructor(options = {}) {
    this.bufferSize = options.bufferSize || 1000;
    this.flushInterval = options.flushInterval || 5000;
    this.buffer = [];
    this.currentFilePath = null;
    this.isCollecting = false;
  }

  startCollection(deviceCode) {
    this.isCollecting = true;
    this.createNewFile(deviceCode);
    this.startPeriodicFlush();
  }

  createNewFile(deviceCode) {
    const date = new Date();
    const fileName = `${deviceCode}_${date.toISOString().split('T')[0]}.csv`;
    this.currentFilePath = `./data/ir/${fileName}`;
    
    // CSV 파일 생성 및 헤더 작성
    fs.writeFileSync(this.currentFilePath, 'timestamp,ir_value\n');
  }

  async addData(irValue) {
    if (!this.isCollecting) return;

    const timestamp = new Date();
    this.buffer.push(`${timestamp.toISOString()},${irValue}\n`);

    // 버퍼가 가득 차면 파일에 저장
    if (this.buffer.length >= this.bufferSize) {
      await this.flush();
    }
  }

  async flush() {
    if (this.buffer.length === 0) return;

    try {
      await fs.appendFile(this.currentFilePath, this.buffer.join(''));
      this.buffer = [];
    } catch (error) {
      console.error('버퍼 저장 실패:', error);
      // 에러 발생 시 버퍼 유지
    }
  }

  startPeriodicFlush() {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  async stopCollection() {
    this.isCollecting = false;
    await this.flush(); // 마지막 데이터 저장

    // 파일 메타데이터를 DB에 저장
    const fileStats = await fs.stat(this.currentFilePath);
    await IRDataFile.create({
      device_code: this.deviceCode,
      file_name: path.basename(this.currentFilePath),
      file_path: this.currentFilePath,
      start_time: this.startTime,
      end_time: new Date(),
      data_count: this.totalDataCount,
      file_size: fileStats.size
    });
  }
}

// 사용 예시
const irManager = new IRDataManager({
  bufferSize: 1000,    // 1000개 데이터마다 저장
  flushInterval: 5000  // 5초마다 주기적 저장
});

// BLE 데이터 수신 시
ble.on('data', (irValue) => {
  irManager.addData(irValue);
});