basic.forever(function () {
    if (A4ControleAcces.cardDetectedOn(A4ControleAcces.PortPn.P1)) {
        basic.showString(A4ControleAcces.lastReceivedCode())
    }
    basic.pause(50)
})
