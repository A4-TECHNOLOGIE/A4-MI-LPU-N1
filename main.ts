/**
 * A4_Tem_Hum_SHT31
 * Extension MakeCode pour Grove - Temperature & Humidity Sensor (SHT31).
 */

namespace A4TemHumSHT31 {
    const SHT31_ADDRESS = 0x44
    const CMD_MEASURE_HIGH_REP_STRETCH_DISABLED = 0x2400

    /**
     * Valeur à mesurer sur le capteur SHT31.
     */
    export enum MesureSHT31 {
        //% block="Température"
        Temperature = 0,
        //% block="Humidité"
        Humidity = 1
    }

    function crc8(data: Buffer, offset: number): number {
        let crc = 0xFF
        for (let i = 0; i < 2; i++) {
            crc ^= data[offset + i]
            for (let b = 0; b < 8; b++) {
                if ((crc & 0x80) != 0) {
                    crc = ((crc << 1) ^ 0x31) & 0xFF
                } else {
                    crc = (crc << 1) & 0xFF
                }
            }
        }
        return crc
    }

    function readRawMeasurement(): Buffer {
        const command = pins.createBuffer(2)
        command[0] = (CMD_MEASURE_HIGH_REP_STRETCH_DISABLED >> 8) & 0xFF
        command[1] = CMD_MEASURE_HIGH_REP_STRETCH_DISABLED & 0xFF

        pins.i2cWriteBuffer(SHT31_ADDRESS, command, false)
        basic.pause(20)

        const response = pins.i2cReadBuffer(SHT31_ADDRESS, 6, false)

        const tempCrcOk = response.length >= 3 && crc8(response, 0) == response[2]
        const humCrcOk = response.length >= 6 && crc8(response, 3) == response[5]
        if (!tempCrcOk || !humCrcOk) {
            return pins.createBuffer(0)
        }

        return response
    }

    /**
     * Lit la température ou l'humidité du capteur SHT31 connecté en I2C.
     */
    //% block="lire %mesure sur port I2C"
    //% blockId=a4_tem_hum_sht31_read
    //% group="SHT31"
    //% mesure.defl=MesureSHT31.Temperature
    export function lireMesure(mesure: MesureSHT31): number {
        const data = readRawMeasurement()
        if (data.length < 6) {
            return 0
        }

        const rawTemp = (data[0] << 8) | data[1]
        const rawHum = (data[3] << 8) | data[4]

        if (mesure == MesureSHT31.Temperature) {
            return -45 + (175 * rawTemp) / 65535
        }

        return (100 * rawHum) / 65535
    }
}
