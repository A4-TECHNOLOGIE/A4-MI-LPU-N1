# A4_Tem_Hum_SHT31

Extension MakeCode pour micro:bit permettant de lire le capteur **Grove - Temperature & Humidity Sensor (SHT31)** sur le bus **I2C**.

## Bloc fourni

- `lire (Température/Humidité) sur port I2C` (bloc ovale)
  - `Température` : renvoie la température en °C.
  - `Humidité` : renvoie l'humidité relative en %RH.

## Exemple

```typescript
basic.forever(function () {
    let temperature = A4TemHumSHT31.lireMesure(A4TemHumSHT31.MesureSHT31.Temperature)
    let humidite = A4TemHumSHT31.lireMesure(A4TemHumSHT31.MesureSHT31.Humidity)

    basic.showString("T:" + temperature)
    basic.showString("H:" + humidite)
    basic.pause(1000)
})
```

## Installation dans MakeCode

1. Ouvrir [https://makecode.microbit.org](https://makecode.microbit.org)
2. **Nouveau projet**
3. **Extensions**
4. Importer le dépôt GitHub de l'extension
