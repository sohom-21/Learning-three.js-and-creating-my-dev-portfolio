import * as THREE from 'three'
import * as dat from 'dat.gui'
import * as POSTPROCESSING from 'postprocessing'

export default class PostProcessor {
  constructor (camera, scene, parameters, renderer, isDebug = false) {
    this.camera = camera
    this.scene = scene
    this.parameters = parameters
    this.renderer = renderer
    this.isDebug = isDebug

    this.composer = new POSTPROCESSING.EffectComposer(this.renderer)
    this.composer.addPass(new POSTPROCESSING.RenderPass(this.scene, this.camera))
    this.composer.addPass(this.getEffectPass())

    if (this.isDebug) {
      this.gui = new dat.GUI()
    }
  }

  updateProcessingRenderer() {
    this.composer.reset()
    this.renderer.setClearColor(new THREE.Color(window.currentUniverse.matters.global.clearColor))
    this.scene.fog = new THREE.Fog(
      window.currentUniverse.matters.global.fogColor,
      this.parameters.global.camera.near,
      this.parameters.global.camera.far
    )
    this.composer = new POSTPROCESSING.EffectComposer(this.renderer)
    this.composer.addPass(new POSTPROCESSING.RenderPass(this.scene, this.camera))
    this.composer.addPass(this.getEffectPass())
  }

  getEffectPass () {
    this.parameters.postprocessing.bloomEffect.intensity = window.currentUniverse.matters.global.bloomIntensity
    const bloomEffect = new POSTPROCESSING.BloomEffect(this.parameters.postprocessing.bloomEffect)
    bloomEffect.blendMode.opacity.value = this.parameters.postprocessing.bloomEffect.opacity

    const depthOfFieldEffect = new POSTPROCESSING.DepthOfFieldEffect(this.camera, this.parameters.postprocessing.depthOfFieldEffect)

    if (this.isDebug) {
      this._enableDebug(bloomEffect, depthOfFieldEffect)
    }

    const effectPass = new POSTPROCESSING.EffectPass(this.camera, bloomEffect, depthOfFieldEffect)
    effectPass.renderToScreen = true

    return effectPass
  }

  _enableDebug (bloomEffect, depthOfFieldEffect) {
    const folderPostprocessingBloom = this.gui.addFolder('Postprocessing - Bloom')
    folderPostprocessingBloom.add(this.parameters.postprocessing.bloomEffect, 'opacity').onChange(value => { bloomEffect.blendMode.opacity.value = value })

    const folderPostprocessingDepth = this.gui.addFolder('Postprocessing - Depth')
    folderPostprocessingDepth.add(this.parameters.postprocessing.depthOfFieldEffect, 'focusDistance').onChange(value => { depthOfFieldEffect.circleOfConfusionMaterial.uniforms.focusDistance.value = value })
    folderPostprocessingDepth.add(this.parameters.postprocessing.depthOfFieldEffect, 'focalLength').onChange(value => { depthOfFieldEffect.circleOfConfusionMaterial.uniforms.focalLength.value = value })
    folderPostprocessingDepth.add(this.parameters.postprocessing.depthOfFieldEffect, 'bokehScale').onChange(value => { depthOfFieldEffect.bokehScale = value })
    folderPostprocessingDepth.add(this.parameters.postprocessing.depthOfFieldEffect, 'height').onChange(value => { depthOfFieldEffect.resolution.height = value })
  }
}
