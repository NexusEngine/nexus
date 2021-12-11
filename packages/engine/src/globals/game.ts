import { hooks } from '../game/symbols'
import { registerGlobal } from '../utility/global'

const game: Nexus.Game = {
  register: hooks.register,
}

registerGlobal('Game', game)
