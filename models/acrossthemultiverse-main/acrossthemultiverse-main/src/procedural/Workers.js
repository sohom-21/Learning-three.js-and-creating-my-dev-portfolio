export default class Workers {
  constructor (grid) {
    /**
    * Web worker used for heavy work on background. Critical to not block the event loop.
    */
    if (!window.Worker) {
      throw new Error('You browser is shit. Do something about it.')
    }

    this.grid = grid
    this.workersDistribution = []

    this._setWorkers()
    this._setWorkersListener()
    this._setWorkersDistribution()
  }

  _setWorkers () {
    this.openStarfieldWorker = {
      type: 'Starfield',
      subtype: 'Open',
      source: new Worker(new URL('./starfield/OpenStarfieldWorker.js', import.meta.url))
    }

    this.globularStarfieldWorker = {
      type: 'Starfield',
      subtype: 'Globular',
      source: new Worker(new URL('./starfield/GlobularStarfieldWorker.js', import.meta.url))
    }

    this.emissionNebulaWorker = {
      type: 'Nebula',
      subtype: 'Emission',
      source: new Worker(new URL('./nebula/EmissionNebulaWorker.js', import.meta.url))
    }

    this.supernovaRemnantsNebulaWorker = {
      type: 'Nebula',
      subtype: 'Remnant',
      source: new Worker(new URL('./nebula/SupernovaRemnantsNebulaWorker.js', import.meta.url))
    }

    this.gargantuaNebulaWorker = {
      type: 'Nebula',
      subtype: 'Gargantua',
      source: new Worker(new URL('./nebula/GargantuaNebulaWorker.js', import.meta.url))
    }

    this.spiralGalaxyWorker = {
      type: 'Galaxy',
      subtype: 'Spiral',
      source: new Worker(new URL('./galaxy/SpiralGalaxyWorker.js', import.meta.url))
    }

    this.sombreroGalaxyWorker = {
      type: 'Galaxy',
      subtype: 'Sombrero',
      source: new Worker(new URL('./galaxy/SombreroGalaxyWorker.js', import.meta.url))
    }

    this.irregularGalaxyWorker = {
      type: 'Galaxy',
      subtype: 'Irregular',
      source: new Worker(new URL('./galaxy/IrregularGalaxyWorker.js', import.meta.url))
    }

    this.sunGiantWorker = {
      type: 'Giant',
      subtype: 'Sun',
      source: new Worker(new URL('./giant/SunGiantWorker.js', import.meta.url))
    }

    this.whiteDwarfGiantWorker = {
      type: 'Giant',
      subtype: 'WhiteDwarf',
      source: new Worker(new URL('./giant/WhiteDwarfGiantWorker.js', import.meta.url))
    }

    this.starGiantWorker = {
      type: 'Giant',
      subtype: 'Star',
      source: new Worker(new URL('./giant/StarGiantWorker.js', import.meta.url))
    }

    this.blackholeWorker = {
      type: 'Singularity',
      subtype: 'Blackhole',
      source: new Worker(new URL('./singularity/BlackHoleSingularityWorker.js', import.meta.url))
    }

    this.spaceshipNormandyWorker = {
      type: 'Spaceship',
      subtype: 'Normandy',
      source: new Worker(new URL('./spaceship/SpaceshipWorker.js', import.meta.url))
    }

    this.spaceshipStationWorker = {
      type: 'Spaceship',
      subtype: 'Station',
      source: new Worker(new URL('./spaceship/SpaceshipWorker.js', import.meta.url))
    }

    this.cyclicStrangerThingsWorker = {
      type: 'StrangerThings',
      subtype: 'Cyclic',
      source: new Worker(new URL('./strangerthings/CyclicWorker.js', import.meta.url))
    }

    this.spearStrangerThingsWorker = {
      type: 'StrangerThings',
      subtype: 'Spear',
      source: new Worker(new URL('./strangerthings/SpearWorker.js', import.meta.url))
    }
  }

  _setWorkersListener () {
    this.openStarfieldWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'starfield',
      'open'
    )

    this.globularStarfieldWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'starfield',
      'globular'
    )

    this.emissionNebulaWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'nebula',
      'emission'
    )

    this.supernovaRemnantsNebulaWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'nebula',
      'remnant'
    )

    this.gargantuaNebulaWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'nebula',
      'gargantua'
    )

    this.spiralGalaxyWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'galaxy',
      'spiral'
    )

    this.sombreroGalaxyWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'galaxy',
      'sombrero'
    )

    this.irregularGalaxyWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'galaxy',
      'irregular'
    )

    this.sunGiantWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'giant',
      'sun'
    )

    this.whiteDwarfGiantWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'giant',
      'whitedwarf'
    )

    this.starGiantWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'giant',
      'star'
    )

    this.blackholeWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'singularity',
      'blackhole'
    )

    this.spaceshipNormandyWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'spaceship',
      'normandy'
    )

    this.spaceshipStationWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'spaceship',
      'station'
    )

    this.cyclicStrangerThingsWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'strangerthings',
      'cyclic'
    )

    this.spearStrangerThingsWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'strangerthings',
      'spear'
    )
  }

  _getWorkerByTypeAndSubtype(type, subtype) {
    switch (type) {
      case "Starfield":
        if(subtype === "Globular") {
          return this.globularStarfieldWorker.source
        }

        return this.openStarfieldWorker.source

      case "Nebula":
        if(subtype === "Emission") {
          return this.emissionNebulaWorker.source
        }

        if(subtype === "Gargantua") {
          return this.gargantuaNebulaWorker.source
        }

        return this.supernovaRemnantsNebulaWorker.source

      case "Galaxy":
        if(subtype === "Spiral") {
          return this.spiralGalaxyWorker.source
        }

        if(subtype === "Sombrero") {
          return this.sombreroGalaxyWorker.source
        }

        return this.irregularGalaxyWorker.source

      case "Giant":
        if(subtype === "Sun") {
          return this.sunGiantWorker.source
        }

        if(subtype === "WhiteDwarf") {
          return this.whiteDwarfGiantWorker.source
        }

        return this.starGiantWorker.source

      case "Singularity":
        return this.blackholeWorker.source

      case "Spaceship":
        if(subtype === "Normandy") {
          return this.spaceshipNormandyWorker.source
        }

        return this.spaceshipStationWorker.source

      case "StrangerThings":
        if(subtype === "Cyclic") {
          return this.cyclicStrangerThingsWorker.source
        }

        return this.spearStrangerThingsWorker.source

      default:
        console.error('Getting worker type with unandled type.')
        return this.openStarfieldWorker.source
    }
  }

  _setWorkersDistribution () {
    this.workersDistribution = window.currentUniverse.workersDistribution
  }

  getWorkerDistributed (clusterToPopulate) {
    if (clusterToPopulate === '0,0,0') {
      return this.openStarfieldWorker.source
    }

    let currentProbability = 0
    const pourcentage = Math.random() * 100

    for (const workerDistributed of this.workersDistribution) {
      currentProbability += workerDistributed.chances

      if (pourcentage < currentProbability) {
        if (!this.isClusterEligibleForSpecialEvent(clusterToPopulate, workerDistributed))
          return this.openStarfieldWorker.source

        return this._getWorkerByTypeAndSubtype(workerDistributed.type, workerDistributed.subtype)
      }
    }
  }

  isClusterEligibleForSpecialEvent(clusterToPopulate, workerDistributed) {
    if((workerDistributed.subtype != 'Blackhole') && workerDistributed.type != 'Spaceship' && workerDistributed.type != 'Giant')
       return true

    const coordinates = clusterToPopulate.split(',')

    for(let coordinate of coordinates) {
      coordinate = Number(coordinate)

      if(coordinate > 2 || coordinate < -2) {
        return true
      }
    }

    return false
  }
}
