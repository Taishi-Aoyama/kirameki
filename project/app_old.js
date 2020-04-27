import UIKit
import CoreBluetooth

final class ViewController: UIViewController {

    let kServiceUUIDHeartRate = "e9bac282-61bf-4432-b94d-316b31cca64e"
    let kCharacteristicUUIDHeartRateMeasurement = "e9bac282-61bf-4432-b94d-316b31cca64e"
    
    //@IBOutlet var advertiseBtn: UIButton!
    //@IBOutlet var valueLabel: UILabel!
    //@IBOutlet var strLabel: UILabel!
    
    var peripheralManager: CBPeripheralManager!
    var serviceUUID: CBUUID!
    var characteristic: CBMutableCharacteristic!
    
    var data:NSData!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
    }

    private func setup() {
        peripheralManager = CBPheripheralManager(delegate: self, queue: nil, options: nil)
        serviceUUID = CBUUID(string: kServiceUUIDHeartRate)
        characteristicUUID = CBUUID(string: kCharacteristicUUIDHeartRateMeasurement)
    }
}

extension ViewController: CBPheripheralManagerDelegate {
    func pheripheralManagerDidUpdateState(_ pheripheral: CBPheripheralManager) {
    
switch central.state {

        //電源ONを待って、スキャンする
        case CBManagerState.poweredOn:
            let services: [CBUUID] = [serviceUUID]
            centralManager?.scanForPeripherals(withServices: services,
                                               options: nil)
        default:
            break
        }
    }

    /// ペリフェラルを発見すると呼ばれる
    func centralManager(_ central: CBCentralManager,
                        didDiscover peripheral: CBPeripheral,
                        advertisementData: [String : Any],
                        rssi RSSI: NSNumber) {

        self.peripheral = peripheral
        centralManager?.stopScan()

        //接続開始
        central.connect(peripheral, options: nil)
    }

    /// 接続されると呼ばれる
    func centralManager(_ central: CBCentralManager,
                        didConnect peripheral: CBPeripheral) {

        peripheral.delegate = self
        peripheral.discoverServices([serviceUUID])
    }
}

//MARK : - CBPeripheralDelegate
extension ViewController: CBPeripheralDelegate {

    /// サービス発見時に呼ばれる
    func peripheral(_ peripheral: CBPeripheral,
                    didDiscoverServices error: Error?) {

        if error != nil {
            print(error.debugDescription)
            return
        }

        //キャリアクタリスティク探索開始
        peripheral.discoverCharacteristics([charcteristicUUID],
                                           for: (peripheral.services?.first)!)
    }

    /// キャリアクタリスティク発見時に呼ばれる
    func peripheral(_ peripheral: CBPeripheral,
                    didDiscoverCharacteristicsFor service: CBService,
                    error: Error?) {

        if error != nil {
            print(error.debugDescription)
            return
        }

        peripheral.setNotifyValue(true,
                                  for: (service.characteristics?.first)!)
    }

    /// データ更新時に呼ばれる
    func peripheral(_ peripheral: CBPeripheral,
                    didUpdateValueFor characteristic: CBCharacteristic,
                    error: Error?) {

        if error != nil {
            print(error.debugDescription)
            return
        }

        updateWithData(data: characteristic.value!)
    }

    private func updateWithData(data : Data) {
        print(#function)

        let reportData = data.withUnsafeBytes {
            [UInt8](UnsafeBufferPointer(start: $0, count: data.count))
        }

        /// Format Bitが0 or 1
        if (reportData.first != nil) && 0x01 == 0 {
            print("BPM: \(reportData.last!)")
        } else {
            print("BPM : \(CFSwapInt16LittleToHost(UInt16(reportData.last!)))")
        }
    }
}
