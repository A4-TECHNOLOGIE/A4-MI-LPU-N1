basic.forever(function () {
    const temperature = A4TemHumSHT31.lireMesure(A4TemHumSHT31.MesureSHT31.Temperature)
    const humidite = A4TemHumSHT31.lireMesure(A4TemHumSHT31.MesureSHT31.Humidity)

    serial.writeLine("Temperature: " + temperature)
    serial.writeLine("Humidite: " + humidite)
    basic.pause(1000)
})
