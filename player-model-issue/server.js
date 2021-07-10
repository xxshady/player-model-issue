import * as alt from 'alt-server'

const playerModels = [
  alt.hash('mp_m_freemode_01'),
  alt.hash('mp_f_freemode_01'),
]

alt.on('playerConnect', (player) => {
  player.model = playerModels[0]
  player.spawn(0, 0, 72)
})

alt.onClient('player:swapModel', (player) => {
  const selectModel = player.model === playerModels[0] ? playerModels[1] : playerModels[0]
  alt.logWarning('set player model:', selectModel)
  player.model = selectModel
  alt.emitClient(player, 'player:swappedModel')
})
