import { Howl } from 'howler'

export const beepDown = new Howl({ src: ['/sounds/beep-down.mp3'] })
export const beepUp = new Howl({ src: ['/sounds/beep-up.mp3'] })

let unlocked = false

export function unlockSounds() {
  if (unlocked) return
  unlocked = true

  beepDown.play()
  beepDown.stop()

  beepUp.play()
  beepUp.stop()
}
