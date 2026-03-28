/**
 * A4-Contrôle d'accès
 * Extension MakeCode pour lecteur RFID 125 kHz.
 */

namespace A4ControleAcces {
    const BAUD_RATE = 9600
    const MAX_BUFFER_LENGTH = 96

    /**
     * Ports BitMaker V2 disponibles pour le lecteur RFID.
     */
    export enum PortPn {
        //% block="P0"
        P0 = 0,
        //% block="P1"
        P1 = 1,
        //% block="P2"
        P2 = 2,
        //% block="P15"
        P15 = 3,
        //% block="P8"
        P8 = 4
    }

    let currentPort: PortPn = PortPn.P0
    let serialConfigured = false
    let rxBuffer = ""
    let pendingDetected = false
    let _lastCode = ""

    function pinsForPort(port: PortPn): SerialPins {
        switch (port) {
            case PortPn.P0:
                return { tx: SerialPin.P0, rx: SerialPin.P1 }
            case PortPn.P1:
                return { tx: SerialPin.P1, rx: SerialPin.P2 }
            case PortPn.P2:
                return { tx: SerialPin.P2, rx: SerialPin.P12 }
            case PortPn.P15:
                return { tx: SerialPin.P15, rx: SerialPin.P16 }
            case PortPn.P8:
                return { tx: SerialPin.P8, rx: SerialPin.P14 }
            default:
                return { tx: SerialPin.P0, rx: SerialPin.P1 }
        }
    }

    function isHexChar(charCode: number): boolean {
        return (charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 70) || (charCode >= 97 && charCode <= 102)
    }

    function normalizeHex(hex: string): string {
        let result = ""
        for (let i = 0; i < hex.length; i++) {
            const code = hex.charCodeAt(i)
            if (code >= 97 && code <= 102) {
                result += String.fromCharCode(code - 32)
            } else {
                result += hex.charAt(i)
            }
        }
        return result
    }

    function trimBuffer(): void {
        if (rxBuffer.length > MAX_BUFFER_LENGTH) {
            rxBuffer = rxBuffer.substr(rxBuffer.length - MAX_BUFFER_LENGTH)
        }
    }

    function extractTagFromBuffer(): string {
        for (let start = 0; start + 10 <= rxBuffer.length; start++) {
            let allHex = true
            for (let i = 0; i < 10; i++) {
                if (!isHexChar(rxBuffer.charCodeAt(start + i))) {
                    allHex = false
                    break
                }
            }

            if (allHex) {
                const tag = normalizeHex(rxBuffer.substr(start, 10))
                rxBuffer = rxBuffer.substr(start + 10)
                return tag
            }
        }

        if (rxBuffer.length > 10) {
            rxBuffer = rxBuffer.substr(rxBuffer.length - 10)
        }

        return ""
    }

    interface SerialPins {
        tx: SerialPin
        rx: SerialPin
    }

    function configureSerialIfNeeded(port: PortPn): void {
        if (!serialConfigured || currentPort !== port) {
            const pins = pinsForPort(port)
            serial.redirect(pins.tx, pins.rx, BAUD_RATE)
            serial.setRxBufferSize(128)
            currentPort = port
            serialConfigured = true
            rxBuffer = ""
            pendingDetected = false
        }
    }

    function pollTag(port: PortPn): void {
        configureSerialIfNeeded(port)
        const chunk = serial.readString()
        if (chunk.length > 0) {
            rxBuffer += chunk
            trimBuffer()
            const tag = extractTagFromBuffer()
            if (tag.length > 0) {
                _lastCode = tag
                pendingDetected = true
            }
        }
    }

    /**
     * Renvoie vrai lorsqu'une nouvelle carte RFID est détectée sur le port choisi.
     */
    //% block="Carte RFID détectée sur %port"
    //% blockId=a4_ctrl_access_card_detected
    //% group="RFID"
    export function cardDetectedOn(port: PortPn): boolean {
        pollTag(port)
        if (pendingDetected) {
            pendingDetected = false
            return true
        }
        return false
    }

    /**
     * Renvoie le dernier code de badge/carte RFID reçu.
     */
    //% block="Dernier code reçu"
    //% blockId=a4_ctrl_access_last_code
    //% group="RFID"
    export function lastReceivedCode(): string {
        return _lastCode
    }
}
