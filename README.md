# A4-Contrôle d'accès

Extension MakeCode pour micro:bit permettant de lire un module RFID 125 kHz via un shield BitMaker V2.

## Blocs fournis

- `Carte RFID détectée sur (Pn)` (bloc logique en losange)
  - Ports proposés: `P0`, `P1`, `P2`, `P15`, `P8`.
  - Renvoie `vrai` lorsqu'un nouveau badge/carte est détecté.
- `Dernier code reçu` (bloc ovale)
  - Renvoie le dernier identifiant RFID capturé.

## Correspondance des ports BitMaker V2

- `P0`  → micro:bit `P0` (TX), `P1` (RX)
- `P1`  → micro:bit `P1` (TX), `P2` (RX)
- `P2`  → micro:bit `P2` (TX), `P12` (RX)
- `P15` → micro:bit `P15` (TX), `P16` (RX)
- `P8`  → micro:bit `P8` (TX), `P14` (RX)

## Exemple

```typescript
basic.forever(function () {
    if (A4ControleAcces.cardDetectedOn(A4ControleAcces.PortPn.P1)) {
        basic.showString(A4ControleAcces.lastReceivedCode())
    }
})
```

## Installation dans MakeCode

1. Ouvrir [https://makecode.microbit.org](https://makecode.microbit.org)
2. **Nouveau projet**
3. **Extensions**
4. Importer le dépôt GitHub de l'extension
