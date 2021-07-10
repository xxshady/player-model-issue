import * as alt from 'alt-client'
import * as native from 'natives'

let tick, altPlayerModel, nativePlayerModel

alt.on('connectionComplete', () => {
  alt.log('connectionComplete load player models..')
  native.requestModel(alt.hash('mp_m_freemode_01'))
  native.requestModel(alt.hash('mp_f_freemode_01'))
})

alt.on('consoleCommand', (cmd, ...args) => {
  if (cmd !== 'model') return

  [altPlayerModel, nativePlayerModel] = getPlayerModel()

  alt.log('')
  alt.log('send server update player model...')

  alt.emitServer('player:swapModel')

  alt.onceServer('player:swappedModel', onServerModelSwapped)
})

function onServerModelSwapped () {
  if (tick != null) alt.clearEveryTick(tick)

  const start = +new Date()

  tick = alt.everyTick(() => {
    const [newAltModel, newNativeModel] = getPlayerModel()

    // for clarity, draw getters values on screen
    drawText(
      `player.model: ${newAltModel}~n~` +
      `native: ${newNativeModel}`
    )

    if (newAltModel !== altPlayerModel) {
      alt.logWarning('delay:', +new Date() - start, 'new player.model:', altPlayerModel, '->', newAltModel)
      altPlayerModel = newAltModel
    }

    if (newNativeModel !== nativePlayerModel) {
      alt.logWarning('delay:', +new Date() - start, 'new native.getEntityModel:', nativePlayerModel, '->', newNativeModel)
      nativePlayerModel = newNativeModel
    }
  })
}

function getPlayerModel () {
  return [
    alt.Player.local.model,
    native.getEntityModel(alt.Player.local.scriptID),
  ]
}

function drawText (
  text,
  x = 0.5,
  y = 0.9,
  scale = 0.5,
  fontType = 0,
  r = 255, g = 255, b = 255, a = 255,
  useOutline = true,
  useDropShadow = true,
) {
  text = text + ''
  native.setTextFont(fontType)
  native.setTextProportional(false)
  native.setTextScale(scale, scale)
  native.setTextColour(r, g, b, a)
  native.setTextEdge(2, 0, 0, 0, 150)
  if (useDropShadow) {
    native.setTextDropshadow(0, 0, 0, 0, 255)
    native.setTextDropShadow()
  }
  if (useOutline) { native.setTextOutline() }

  native.setTextCentre(true)

  native.beginTextCommandDisplayText('CELL_EMAIL_BCON')
  // Split text into pieces of max 99 chars blocks
  text.match(/.{1,99}/g).forEach(textBlock => {
    native.addTextComponentSubstringPlayerName(textBlock)
  })
  native.endTextCommandDisplayText(x, y, 123)
}
