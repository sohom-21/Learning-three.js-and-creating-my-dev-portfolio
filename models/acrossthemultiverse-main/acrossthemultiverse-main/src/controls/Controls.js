import { PointerLockControls } from './PointerLockControls.js'
import * as THREE from 'three'

export default class Controls {
  constructor (camera, parameters, sequencer, library) {
    this.parameters = parameters
    this.camera = camera
    this.sequencer = sequencer
    this.library = library

    this.pointerLockControls = new PointerLockControls(this.camera, document.body)

    this.velocity = new THREE.Vector3()
    this.direction = new THREE.Vector3()

    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false

    this.uiVisible = true
    this.toggleUiInProgress = false

    this.creditsVisible = false
    this.toggleCreditsInProgress = false

    this.soundMuted = false
    this.toggleSoundInProgress = false
  }

  onKeyDown (event) {
    if (this.pointerLockControls.isLocked) {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
        case 'KeyZ':
          this.moveForward = true
          break
        case 'ArrowLeft':
        case 'KeyA':
        case 'KeyQ':
          this.moveLeft = true
          break
        case 'ArrowDown':
        case 'KeyS':
          this.moveBackward = true
          break
        case 'ArrowRight':
        case 'KeyD':
          this.moveRight = true
          break
        case 'KeyF':
          this.sequencer.wormholeSequence()
          break
        case 'KeyH':
          this.toggleUi()
          break
        case 'KeyC':
          this.toggleCredits()
          break
      }
    }

    // sound control should be free or people will freak out
    if(event.code === 'KeyM') this.toggleSound()
  }

  onKeyUp (event) {
    if (this.pointerLockControls.isLocked) {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
        case 'KeyZ':
          this.moveForward = false
          break
        case 'ArrowLeft':
        case 'KeyA':
        case 'KeyQ':
          this.moveLeft = false
          break
        case 'ArrowDown':
        case 'KeyS':
          this.moveBackward = false
          break
        case 'ArrowRight':
        case 'KeyD':
          this.moveRight = false
          break
      }
    }
  }


  handleMovements (timePerf, prevTimePerf) {
    if (window.sequencer.active) return

    const delta = timePerf - prevTimePerf

    this.direction.z = Number(this.moveForward) - Number(this.moveBackward)
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft)

    if (this.moveForward || this.moveBackward) {
      if ((this.moveForward && this.parameters.controls.speedLimit.down < this.velocity.z) || (this.moveBackward && this.parameters.controls.speedLimit.up > this.velocity.z)) {
        this.velocity.z -= this.direction.z * this.parameters.controls.velocity * delta
      }
    }

    if (this.moveLeft || this.moveRight) {
      if ((this.moveLeft && this.parameters.controls.speedLimit.up > this.velocity.x) || (this.moveRight && this.parameters.controls.speedLimit.down < this.velocity.x)) {
        this.velocity.x -= this.direction.x * this.parameters.controls.velocity * delta
      }
    }

    this.pointerLockControls.moveRight(-this.velocity.x * delta)
    this.pointerLockControls.moveForward(-this.velocity.z * delta)
  }

  async toggleUi() {
    if (this.toggleUiInProgress || window.sequencer.active) return

    this.toggleUiInProgress = true

    if (this.uiVisible) {
      await this.sequencer.fadeOutById('#nav', 0.3, 'Power0.easeNone')
      this.uiVisible = false
    } else {
      await this.sequencer.fadeInById('#nav', 0.3, 'Power0.easeNone')
      this.uiVisible = true
    }

    this.toggleUiInProgress = false
  }

  async toggleCredits() {
    if (this.toggleCreditsInProgress || window.sequencer.active) return

    this.toggleCreditsInProgress = true

    if (this.creditsVisible) {
      await this.sequencer.fadeOutById('#credits', 0.3, 'Power0.easeNone')
      this.creditsVisible = false
    } else {
      await this.sequencer.fadeInById('#credits', 0.3, 'Power0.easeNone')
      this.creditsVisible = true
    }

    this.toggleCreditsInProgress = false
  }

  async toggleSound() {
    if (this.toggleSoundInProgress) return

    this.toggleSoundInProgress = true

    if (this.soundMuted) {
      Object.keys(this.library.audio).forEach(key => this.library.audio[key].mute(false))
      this.soundMuted = false
    } else {
      Object.keys(this.library.audio).forEach(key => this.library.audio[key].mute(true))
      this.soundMuted = true
    }

    this.toggleSoundInProgress = false
  }
}
