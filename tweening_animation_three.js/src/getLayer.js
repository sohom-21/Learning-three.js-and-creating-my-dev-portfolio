import * as THREE from "three";

const loader = new THREE.TextureLoader();

function getSprite({ color, opacity, pos, size }) {
  const spriteMat = new THREE.SpriteMaterial({
    color,
    map: loader.load("./rad-grad.png"),
    transparent: true,
    opacity,
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.position.set(pos.x, -pos.y, pos.z);
  size += Math.random() - 0.5;
  sprite.scale.set(size, size, size);
  sprite.material.rotation = 0;
  return sprite;
}

function getLayer({
  hex = 0xffffff,
  numSprites = 10,
  opacity = 1,
  radius = 1,
  size = 1,
  z = 0,
}) {
  const color = new THREE.Color(hex);
  const { h, s, l } = color.getHSL(color);
  const layerGroup = new THREE.Group();
  for (let i = 0; i < numSprites; i += 1) {
    let angle = (i / numSprites) * Math.PI * 2;
    const pos = new THREE.Vector3(
      Math.cos(angle) * Math.random() * radius,
      Math.sin(angle) * Math.random() * radius,
      z + Math.random()
    );
    let color = new THREE.Color().setHSL(h, s, l);
    const sprite = getSprite({ color, opacity, pos, size });
    layerGroup.add(sprite);
  }
  return layerGroup;
}
export default getLayer;