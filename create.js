import * as THREE from './three.module.js';
window.THREE = THREE;
import {OrbitControls} from './OrbitControls.js';
import {TransformControls} from './TransformControls.js';
import {BufferGeometryUtils} from './BufferGeometryUtils.js';
import {OutlineEffect} from './OutlineEffect.js';
import {XRControllerModelFactory} from './XRControllerModelFactory.js';
import {Ammo as AmmoLib} from './ammo.wasm.js';
import './gif.js';
import {makePromise} from './util.js';
import contract from './contract.js';
import screenshot from './screenshot.js';

const _load = () => {

console.log('got load');

contract.init();

function parseQuery(queryString) {
  var query = {};
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

const PARCEL_SIZE = 10;
const size = PARCEL_SIZE + 1;
const uiSize = 2048;
const uiWorldSize = 0.2;

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.physicallyCorrectLights = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xEEEEEE);
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.5, 0.5, 2);
renderer.render(scene, camera);

const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
directionalLight.position.set(0.5, 1, 0.5);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 3);
directionalLight2.position.set(-0.5, -0.1, 0.5);
scene.add(directionalLight2);

const orbitControls = new OrbitControls(camera, interfaceDocument.querySelector('.background'), interfaceDocument);
orbitControls.target.copy(camera.position).add(new THREE.Vector3(0, 0, -1.5));
orbitControls.screenSpacePanning = true;
// orbitControls.enabled = !!loginToken;
orbitControls.enableMiddleZoom = false;
orbitControls.update();

const pointerMesh = (() => {
  const targetGeometry = BufferGeometryUtils.mergeBufferGeometries([
    new THREE.BoxBufferGeometry(0.03, 0.2, 0.03)
      .applyMatrix4(new THREE.Matrix4().makeTranslation(0, -0.1, 0)),
    new THREE.BoxBufferGeometry(0.03, 0.2, 0.03)
      .applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 1))))
      .applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.1)),
    new THREE.BoxBufferGeometry(0.03, 0.2, 0.03)
      .applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), new THREE.Vector3(1, 0, 0))))
      .applyMatrix4(new THREE.Matrix4().makeTranslation(0.1, 0, 0)),
  ]);
  const sidesGeometry = BufferGeometryUtils.mergeBufferGeometries([
    targetGeometry.clone()
      .applyMatrix4(new THREE.Matrix4().makeTranslation(-0.5, 0.5, -0.5)),
    targetGeometry.clone()
      .applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, -1, 0))))
      .applyMatrix4(new THREE.Matrix4().makeTranslation(-0.5, -0.5, -0.5)),
    targetGeometry.clone()
      .applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1))))
      .applyMatrix4(new THREE.Matrix4().makeTranslation(-0.5, 0.5, 0.5)),
    targetGeometry.clone()
      .applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0))))
      .applyMatrix4(new THREE.Matrix4().makeTranslation(0.5, 0.5, -0.5)),
    targetGeometry.clone()
      .applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0))))
      .applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1))))
      .applyMatrix4(new THREE.Matrix4().makeTranslation(0.5, 0.5, 0.5)),
    targetGeometry.clone()
      .applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1))))
      .applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, -1, 0))))
      .applyMatrix4(new THREE.Matrix4().makeTranslation(-0.5, -0.5, 0.5)),
    targetGeometry.clone()
      .applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0))))
      .applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0))))
      .applyMatrix4(new THREE.Matrix4().makeTranslation(0.5, -0.5, -0.5)),
    targetGeometry.clone()
      .applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(-1, 1, 0).normalize(), new THREE.Vector3(1, -1, 0).normalize())))
      .applyMatrix4(new THREE.Matrix4().makeTranslation(0.5, -0.5, 0.5)),
  ]).applyMatrix4(new THREE.Matrix4().makeTranslation(0.5, 0.5, 0.5));
  const sidesColors = new Float32Array(sidesGeometry.attributes.position.array.length);
  // sidesColors.fill(0);
  sidesGeometry.setAttribute('color', new THREE.BufferAttribute(sidesColors, 3));
  // const numSidesPositions = sidesGeometry.attributes.position.array.length;
  const dotsGeometries = [];
  const dotGeometry = new THREE.BoxBufferGeometry(0.01, 0.01, 0.01);
  for (let x = 0; x <= PARCEL_SIZE; x++) {
    for (let y = 0; y <= PARCEL_SIZE; y++) {
      for (let z = 0; z <= PARCEL_SIZE; z++) {
        const newDotGeometry = dotGeometry.clone()
          .applyMatrix4(new THREE.Matrix4().makeTranslation(x*0.1, y*0.1, z*0.1));
        dotsGeometries.push(newDotGeometry);
      }
    }
  }
  const dotsGeometry = BufferGeometryUtils.mergeBufferGeometries(dotsGeometries);
  const dotsColors = new Float32Array(dotsGeometry.attributes.position.array.length);
  dotsColors.fill(0.7);
  dotsGeometry.setAttribute('color', new THREE.BufferAttribute(dotsColors, 3));
  // const numDotsPositions = dotsGeometry.attributes.position.array.length;
  const blockGeometry = BufferGeometryUtils.mergeBufferGeometries([sidesGeometry, dotsGeometry]);
  let geometry;
  const targetVsh = `
    uniform vec3 targetPos;
    attribute vec3 color;
    // varying float vZ;
    // varying vec2 vUv;
    varying vec3 vColor;
    varying float highlightDistance;
    float scale = 0.1;
    void main() {
      vec4 p = modelMatrix * vec4(position, 1.);
      vec4 p2 = viewMatrix * p;
      // vZ = -p2.z;
      gl_Position = projectionMatrix * p2;
      vColor = color;
      vec3 tp = targetPos.xyz + 1.0;
      vec3 cp = p.xyz/scale;
      float dx = tp.x - cp.x;
      float dy = tp.y - cp.y;
      float dz = tp.z - cp.z;
      highlightDistance = pow(sqrt(dx*dx + dy*dy + dz*dz), 0.5);
    }
  `;
  const targetFsh = `
    // uniform float uTime;
    uniform vec3 uBrushColor;
    varying vec3 vColor;
    // varying float vZ;
    varying float highlightDistance;
    float dRange = 1.3;
    float dLimit = 0.1;
    void main() {
      if (vColor.r == 0.0 && vColor.g == 0.0 && vColor.b == 0.0) {
        gl_FragColor = vec4(vColor, 1.0);
      } else {
        // gl_FragColor = vec4(highlightDistance, 0, 0, 1.0);
        float d = max(dRange - highlightDistance, dLimit);
        if (d > dLimit) {
          gl_FragColor = vec4(uBrushColor, d);
        } else {
          gl_FragColor = vec4(vec3(vColor), d);
        }
      }
    }
  `;
  const material = new THREE.ShaderMaterial({
    uniforms: {
      targetPos: {
        type: 'v3',
        value: new THREE.Vector3(),
      },
      uBrushColor: {
        type: 'v3',
        value: new THREE.Vector3(),
      },
      uTime: {
        type: 'f',
        value: 0,
      },
    },
    vertexShader: targetVsh,
    fragmentShader: targetFsh,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.resize = (x, y, z) => {
    const geometries = [];
    for (let ay = 0; ay < y; ay++) {
      for (let ax = 0; ax < x; ax++) {
        for (let az = 0; az < z; az++) {
          const newBlockGeometry = blockGeometry.clone()
            .applyMatrix4(new THREE.Matrix4().makeTranslation(ax, ay, az));
          geometries.push(newBlockGeometry);
        }
      }
    }
    mesh.geometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
  };
  mesh.resize(1, 1, 1);
  return mesh;
})();
scene.add(pointerMesh);

const worker = (() => {
  let cbs = [];
  const worker = new Worker('mc-worker.js');
  worker.onmessage = e => {
    const {data} = e;
    const {error, result} = data;
    cbs.shift()(error, result);
  };
  worker.onerror = err => {
    console.warn(err);
  };
  worker.request = (req, transfers) => new Promise((accept, reject) => {
    worker.postMessage(req, transfers);

    cbs.push((err, result) => {
      if (!err) {
        accept(result);
      } else {
        reject(err);
      }
    });
  });
  return worker;
})();
let ammo = null;
(async () => {
  const p = makePromise();
  window.Module = { TOTAL_MEMORY: 100*1024*1024 };
  AmmoLib().then(Ammo => {
    Ammo.then = null;
    p.accept(Ammo);
  });
  const Ammo = await p;

  const localVector = new THREE.Vector3();
  const localQuaternion = new THREE.Quaternion();
  const ammoVector3 = new Ammo.btVector3();
  const ammoQuaternion = new Ammo.btQuaternion();
  const localTransform = new Ammo.btTransform();

  var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
  var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
  var overlappingPairCache = new Ammo.btDbvtBroadphase();
  var solver = new Ammo.btSequentialImpulseConstraintSolver();
  const dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
  dynamicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));

  {
    var groundShape = new Ammo.btBoxShape(new Ammo.btVector3(100, 100, 100));

    var groundTransform = new Ammo.btTransform();
    groundTransform.setIdentity();
    groundTransform.setOrigin(new Ammo.btVector3(0, -100, 0));

    var mass = 0;
    var localInertia = new Ammo.btVector3(0, 0, 0);
    var myMotionState = new Ammo.btDefaultMotionState(groundTransform);
    var rbInfo = new Ammo.btRigidBodyConstructionInfo(0, myMotionState, groundShape, localInertia);
    var body = new Ammo.btRigidBody(rbInfo);

    dynamicsWorld.addRigidBody(body);
  }

  const _makeConvexHullShape = object => {
    const shape = new Ammo.btConvexHullShape();
    // let numPoints = 0;
    object.updateMatrixWorld();
    object.traverse(o => {
      if (o.isMesh) {
        const {geometry} = o;
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          localVector.set(positions[i], positions[i+1], positions[i+2])
            // .applyMatrix4(o.matrixWorld);
          // console.log('point', localVector.x, localVector.y, localVector.z);
          ammoVector3.setValue(localVector.x, localVector.y, localVector.z);
          const lastOne = i >= (positions.length - 3);
          shape.addPoint(ammoVector3, lastOne);
          // numPoints++;
        }
      }
    });
    shape.setMargin(0);
    // console.log('sword points', numPoints);
    return shape;
  };

  let lastTimestamp = 0;
  ammo = {
    bindObjectMeshPhysics(objectMesh) {
      if (!objectMesh.body) {
        const shape = _makeConvexHullShape(objectMesh);

        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(0, 0, 0));

        var mass = 1;
        var localInertia = new Ammo.btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);

        var myMotionState = new Ammo.btDefaultMotionState(transform);
        var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, shape, localInertia);
        var body = new Ammo.btRigidBody(rbInfo);

        dynamicsWorld.addRigidBody(body);

        objectMesh.body = body;
      }
    },
    simulate() {
      const now = Date.now();
      if (lastTimestamp === 0) {
        lastTimestamp = now;
      }
      const timeDiff = now - lastTimestamp;

      dynamicsWorld.stepSimulation(timeDiff/1000, 2);

      lastTimestamp = now;
    },
    updateObjectMesh(mesh) {
      if (mesh.body) {
        mesh.body.getMotionState().getWorldTransform(localTransform);
        const origin = localTransform.getOrigin();
        mesh.position.set(origin.x(), origin.y(), origin.z());
        // console.log('mesh pos', mesh.position.toArray());
        const rotation = localTransform.getRotation();
        mesh.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
      }
    },
  };
})();

/* const cubeMesh = (() => {
  const geometry = new THREE.BoxBufferGeometry(3, 3, 3);
  const material = new THREE.MeshPhongMaterial({
    color: 0xFF0000,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = -3/2;
  mesh.frustumCulled = false;
  return mesh;
})();
scene.add(cubeMesh); */

const miningMeshMaterial = (() => {
  /* const terrainVsh = `
    attribute vec3 color;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    void main() {
      vec4 mvPosition = modelMatrix * vec4( position.xyz, 1.0 );
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position.xyz, 1.0 );
      vColor = color;
      vViewPosition = mvPosition.xyz;
    }
  `;
  const terrainFsh = `
    varying vec3 vColor;
    uniform vec3 uSelect;
    varying vec3 vViewPosition;
    // vec4 color = vec4(${new THREE.Color(0x9ccc65).toArray().map(n => n.toFixed(8)).join(',')}, 1.0);
    // vec4 color2 = vec4(${new THREE.Color(0xec407a).toArray().map(n => n.toFixed(8)).join(',')}, 1.0);
    bool inRange(vec3 pos, vec3 minPos, vec3 maxPos) {
      return pos.x >= minPos.x &&
        pos.y >= minPos.y &&
        pos.z >= minPos.z &&
        pos.x <= maxPos.x &&
        pos.y <= maxPos.y &&
        pos.z <= maxPos.z;
    }
    void main() {
      // vec3 vColor = vec3(1.0, 0, 0);
      vec4 color = vec4(vColor, 1.0);
      vec3 fdx = vec3( dFdx( -vViewPosition.x ), dFdx( -vViewPosition.y ), dFdx( -vViewPosition.z ) );
      vec3 fdy = vec3( dFdy( -vViewPosition.x ), dFdy( -vViewPosition.y ), dFdy( -vViewPosition.z ) );
      vec3 normal = normalize( cross( fdx, fdy ) );
      float dotNL = saturate( dot( normal, normalize(vec3(1.0, 1.0, 1.0))) );

      float range = 1.01;
      // float range = 2.01;
      vec3 minPos = uSelect - range;
      vec3 maxPos = minPos + (range*2.);
      // if (inRange(vViewPosition, minPos, maxPos)) {
        // gl_FragColor = color2;
      // } else {
        gl_FragColor = color;
      // }
      // gl_FragColor.rgb += dotNL * 0.5;
    }
  `;
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uSelect: {
        type: 'v3',
        value: new THREE.Vector3(NaN, NaN, NaN),
      },
    },
    vertexShader: terrainVsh,
    fragmentShader: terrainFsh,
    extensions: {
      derivatives: true,
    },
  }); */
  const material = new THREE.MeshPhongMaterial({
    color: 0xFFFFFF,
    vertexColors: THREE.VertexColors,
  });
  return material;
})();
const _makeMiningMesh = (x, y, z) => {
  const geometry = new THREE.BufferGeometry();
  const material = miningMeshMaterial;
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.visible = false;
  // mesh.token = token;

  const dims = Float32Array.from([size, size, size]);
  const potential = new Float32Array(size*size*size);
  const potentialFillValue = 10;
  potential.fill(potentialFillValue);
  /* for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        if (
          x === 0 || y === 0 || z === 0 ||
          x === (size-1) || y === (size-1) || z === (size-1)
        ) {
          potential[x + y*size + z*size*size] = 0;
        }
      }
    }
  } */
  const brush = new Uint8Array(size*size*size*3);
  const shift = Float32Array.from([x*PARCEL_SIZE, y*PARCEL_SIZE, z*PARCEL_SIZE]);
  const scale = Float32Array.from([0.1, 0.1, 0.1]);

  mesh.x = x;
  mesh.y = y;
  mesh.z = z;
  mesh.potential = potential;
  mesh.brush = brush;
  // mesh.shift = shift;
  // mesh.scale = scale;
  mesh.contains = pos =>
    pos.x >= shift[0] &&
    pos.y >= shift[1] &&
    pos.z >= shift[2] &&
    pos.x < shift[0] + size &&
    pos.y < shift[1] + size &&
    pos.z < shift[2] + size;
  /* mesh.getPotential = pos => {
    const x = pos.x - shift[0];
    const y = pos.y - shift[1];
    const z = pos.z - shift[2];
    return potential[x + y*size*size + z*size];
  }; */
  let dirty = false;
  mesh.set = (value, x, y, z) => {
    x -= mesh.x * PARCEL_SIZE;
    y -= mesh.y * PARCEL_SIZE;
    z -= mesh.z * PARCEL_SIZE;

    const factor = brushSize;
    const factor2 = Math.ceil(brushSize);
    const max = Math.max(Math.sqrt(factor*factor*3), 0.1);
    for (let dx = -factor2; dx <= factor2; dx++) {
      for (let dz = -factor2; dz <= factor2; dz++) {
        for (let dy = -factor2; dy <= factor2; dy++) {
          const ax = x + dx;
          const ay = y + dy;
          const az = z + dz;
          if (
            ax >= 0 &&
            ay >= 0 &&
            az >= 0 &&
            ax <= PARCEL_SIZE &&
            ay <= PARCEL_SIZE &&
            az <= PARCEL_SIZE
          ) {
            const index = ax + ay*size*size + az*size;
            const d = (max - Math.sqrt(dx*dx + dy*dy + dz*dz)) / max;
            potential[index] = value > 0 ? Math.min(potential[index], -d) : Math.max(potential[index], d);
            dirty = true;
          }
        }
      }
    }
    if (value > 0) {
      for (let dx = -factor2; dx <= factor2; dx++) {
        for (let dz = -factor2; dz <= factor2; dz++) {
          for (let dy = -factor2; dy <= factor2; dy++) {
            const ax = x + dx;
            const ay = y + dy;
            const az = z + dz;
            if (ax >= 0 && ax <= PARCEL_SIZE && ay >= 0 && ay <= PARCEL_SIZE && az >= 0 && az <= PARCEL_SIZE) {
              const index2 = ax + ay*size*size + az*size;
              const xi = index2*3;
              const yi = index2*3+1;
              const zi = index2*3+2;
              // if ((dx === 0 && dy === 0 && dz === 0) || (brush[xi] === 0 && brush[yi] === 0 && brush[zi] === 0)) {
                brush[xi] = currentColor.r*255;
                brush[yi] = currentColor.g*255;
                brush[zi] = currentColor.b*255;
                dirty = true;
              // }
            }
          }
        }
      }
    }
  };
  mesh.paint = mesh.set.bind(mesh, 1);
  mesh.erase = mesh.set.bind(mesh, -1);
  mesh.color = (x, y, z, c) => {
    x -= mesh.x * PARCEL_SIZE;
    y -= mesh.y * PARCEL_SIZE;
    z -= mesh.z * PARCEL_SIZE;

    const factor = brushSize;
    const factor2 = Math.ceil(brushSize);
    for (let dx = -factor2; dx <= factor2; dx++) {
      for (let dz = -factor2; dz <= factor2; dz++) {
        for (let dy = -factor2; dy <= factor2; dy++) {
          const ax = x + dx;
          const ay = y + dy;
          const az = z + dz;
          if (ax >= 0 && ax <= PARCEL_SIZE && ay >= 0 && ay <= PARCEL_SIZE && az >= 0 && az <= PARCEL_SIZE) {
            const index2 = ax + ay*size*size + az*size;
            const xi = index2*3;
            const yi = index2*3+1;
            const zi = index2*3+2;
            // if ((dx === 0 && dy === 0 && dz === 0) || (brush[xi] === 0 && brush[yi] === 0 && brush[zi] === 0)) {
              brush[xi] = currentColor.r*255;
              brush[yi] = currentColor.g*255;
              brush[zi] = currentColor.b*255;
              dirty = true;
            // }
          }
        }
      }
    }
  };
  mesh.refresh = () => {
    if (dirty) {
      dirty = false;

      const arrayBuffer = new ArrayBuffer(300*1024);
      return worker.request({
        method: 'march',
        dims,
        potential,
        brush,
        shift,
        scale,
        arrayBuffer
      }, [arrayBuffer]).then(res => () => {
        if (res.positions.length > 0) {
          geometry.setAttribute('position', new THREE.BufferAttribute(res.positions, 3));
          geometry.setAttribute('color', new THREE.BufferAttribute(res.colors, 3));
          // geometry.setAttribute('highlight', new THREE.BufferAttribute(new Float32Array(res.positions.array.length), 3));
          geometry.deleteAttribute('normal');
          geometry.computeVertexNormals();
          mesh.visible = true;
        } else {
          mesh.visible = false;
        }
      });
    } else {
      return Promise.resolve(() => {});
    }
  };
  mesh.collide = () => {
    if (mesh.visible) {
      return worker.request({
        method: 'collide',
        positions: geometry.attributes.position.array,
        origin: localRaycaster.ray.origin.toArray(new Float32Array(3)),
        direction: localRaycaster.ray.direction.toArray(new Float32Array(3))
      }).then(result => () => {
        // console.log('collide', !isNaN(result.collision[0]));
        if (!isNaN(result.collision[0])) {
          collisionMesh.position.fromArray(result.collision);
          collisionMesh.visible = true;

          const oldColorAttribute = geometry.attributes.color.old || geometry.attributes.color;
          const oldColors = oldColorAttribute.array;
          const newColors = Float32Array.from(oldColors);
          for (let i = 0; i < 3; i++) {
            newColors[result.collisionIndex + i*3] = currentColor.r;
            newColors[result.collisionIndex + i*3 + 1] = currentColor.g;
            newColors[result.collisionIndex + i*3 + 2] = currentColor.b;
          }
          geometry.setAttribute('color', new THREE.BufferAttribute(newColors, 3));
          geometry.attributes.color.old = oldColorAttribute;
        } else {
          collisionMesh.visible = false;

          const oldColorAttribute = geometry.attributes.color.old;
          if (oldColorAttribute) {
            geometry.setAttribute('color', oldColorAttribute);
          }
        }
      });
    } else {
      return Promise.resolve(() => {});
    }
  };
  /* mesh.update = () => {
    if (!colliding && geometry.attributes.position) {
      colliding = true;

      const controllerMesh = controllerMeshes[1]; // XXX make this work for all controllers
      worker.request({
        method: 'collide',
        positions: geometry.attributes.position.array,
        indices: geometry.index.array,
        origin: controllerMesh.ray.origin.toArray(new Float32Array(3)),
        direction: controllerMesh.ray.direction.toArray(new Float32Array(3)),
      })
        .then(collision => {
          material.uniforms.uSelect.value.fromArray(collision);
        })
        .catch(err => {
          console.warn(err.stack);
        })
        .finally(() => {
          colliding = false;
        });
    }
  };
  mesh.intersect = ray => {
    if (isFinite(material.uniforms.uSelect.value.x)) {
      const intersectionPoint = material.uniforms.uSelect.value.clone();
      const distance = ray.origin.distanceTo(intersectionPoint);
      return {
        type: 'mine',
        mesh,
        intersectionPoint,
        distance,
      };
    } else {
      return null;
    }
  }; */
  mesh.setDirty = () => {
    dirty = true;
  };
  mesh.reset = () => {
    potential.fill(potentialFillValue);
    brush.fill(0);
    dirty = true;
  };
  mesh.destroy = () => {
    geometry.dispose();
    material.dispose();
  };

  return mesh;
};
let miningMeshes = [];
const _findMiningMeshByIndex = (x, y, z) => miningMeshes.find(miningMesh => miningMesh.x === x && miningMesh.y === y && miningMesh.z === z);
const _findMiningMeshesByContainCoord = (x, y, z) => {
  const result = [];
  const miningMesh = _findMiningMeshByIndex(x, y, z);
  miningMesh && result.push(miningMesh);
  const factor = 1;
  for (let dx = -factor; dx <= factor; dx++) {
    const ax = Math.floor(x + dx*0.5);
    for (let dz = -factor; dz <= factor; dz++) {
      const az = Math.floor(z + dz*0.5);
      for (let dy = -factor; dy <= factor; dy++) {
        const ay = Math.floor(y + dy*0.5);
        const miningMesh = _findMiningMeshByIndex(ax, ay, az);
        miningMesh && !result.includes(miningMesh) && result.push(miningMesh);
      }
    }
  }
  return result;
};
const _resizeMiningMeshes = (x, y, z) => {
  const requiredMap = new Map();
  for (let ay = 0; ay < y; ay++) {
    for (let ax = 0; ax < x; ax++) {
      for (let az = 0; az < z; az++) {
        let miningMesh = _findMiningMeshByIndex(ax, ay, az);
        if (!miningMesh) {
          miningMesh = _makeMiningMesh(ax, ay, az);
          scene.add(miningMesh);
          miningMeshes.push(miningMesh);
        }
        requiredMap.set(miningMesh, true);
      }
    }
  }
  miningMeshes = miningMeshes.filter(miningMesh => {
    if (requiredMap.get(miningMesh)) {
      return true;
    } else {
      scene.remove(miningMesh);
      miningMesh.destroy();
      return false;
    }
  });
};
_resizeMiningMeshes(1, 1, 1);
const _newMiningMeshes = () => {
  for (let i = 0; i < miningMeshes.length; i++) {
    miningMeshes[i].reset();
  }
  _refreshMiningMeshes();
};
const objectMeshes = [];
const _commitMiningMeshes = () => {
  const geometry = BufferGeometryUtils.mergeBufferGeometries(miningMeshes.map(miningMesh => miningMesh.geometry));
  const material = miningMeshMaterial;
  const objectMesh = new THREE.Mesh(geometry, material);
  objectMesh.frustumCulled = false;
  scene.add(objectMesh);
  objectMeshes.push(objectMesh);

  _newMiningMeshes();
};
const _saveMiningMeshes = () => {
  const arrayBuffer = new ArrayBuffer(300*1024);
  let index = 0;

  let maxX = -1;
  let maxY = -1;
  let maxZ = -1;
  const numMiningMeshes = miningMeshes.length;
  for (let i = 0; i < numMiningMeshes; i++) {
    const miningMesh = miningMeshes[i];
    maxX = Math.max(maxX, miningMesh.x);
    maxY = Math.max(maxY, miningMesh.y);
    maxZ = Math.max(maxZ, miningMesh.z);
  }
  maxX++;
  maxY++;
  maxZ++;
  new Uint32Array(arrayBuffer, index, 3).set(Uint32Array.from([maxX, maxY, maxZ]));
  index += 3*Uint32Array.BYTES_PER_ELEMENT;
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      for (let z = 0; z < maxZ; z++) {
        const miningMesh = _findMiningMeshByIndex(x, y, z);
        new Float32Array(arrayBuffer, index, size*size*size).set(miningMesh.potential);
        index += size*size*size*Float32Array.BYTES_PER_ELEMENT;
        new Uint8Array(arrayBuffer, index, size*size*size*3).set(miningMesh.brush);
        index += size*size*size*3*Uint8Array.BYTES_PER_ELEMENT;
        if (index % Float32Array.BYTES_PER_ELEMENT !== 0) {
          index += Float32Array.BYTES_PER_ELEMENT - index % Float32Array.BYTES_PER_ELEMENT;
        }
      }
    }
  }

  return new Uint8Array(arrayBuffer, 0, index);
};
const _screenshotMiningMeshes = async () => {
  const newScene = new THREE.Scene();
  {
    const ambientLight = new THREE.AmbientLight(0x808080);
    newScene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(0.5, 1, 0.5);
    newScene.add(directionalLight);
  }
  for (let i = 0; i < miningMeshes.length; i++) {
    newScene.add(miningMeshes[i]);
  }
  newScene.add(pointerMesh);

  const width = 256;
  const height = width;
  const center = new THREE.Vector3(0.5, 0.5, 0.5);
  const gif = new GIF({
    workers: 2,
    quality: 10,
  });
  for (let i = 0; i < Math.PI*2; i += Math.PI*0.05) {
    const position = new THREE.Vector3(0.5, 1, 0.5).add(new THREE.Vector3(Math.cos(i + Math.PI/2), 0, Math.sin(i + Math.PI/2)));
    const canvas = screenshot(newScene, position, center, {
      width,
      height,
    });
    gif.addFrame(canvas, {delay: 50});
  }
  gif.render();

  for (let i = 0; i < miningMeshes.length; i++) {
    scene.add(miningMeshes[i]);
  }
  scene.add(pointerMesh);

  const blob = await new Promise((accept, reject) => {
    gif.on('finished', accept);
  });
  return blob;
};
const _loadMiningMeshes = uint8Array => {
  const arrayBuffer = uint8Array.buffer;
  let index = uint8Array.byteOffset;

  const miningMeshes = [];
  const [maxX, maxY, maxZ] = new Uint32Array(arrayBuffer, index, 3);
  index += 3*Uint32Array.BYTES_PER_ELEMENT;
  // console.log('load mining meshes', maxX, maxY, maxZ);
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      for (let z = 0; z < maxZ; z++) {
        const miningMesh = _makeMiningMesh(x, y, z);
        miningMesh.potential.set(new Float32Array(arrayBuffer, index, size*size*size));
        index += size*size*size*Float32Array.BYTES_PER_ELEMENT;
        miningMesh.brush.set(new Uint8Array(arrayBuffer, index, size*size*size*3));
        index += size*size*size*3*Uint8Array.BYTES_PER_ELEMENT;
        if (index % Float32Array.BYTES_PER_ELEMENT !== 0) {
          index += Float32Array.BYTES_PER_ELEMENT - index % Float32Array.BYTES_PER_ELEMENT;
        }
        miningMesh.setDirty();
        // console.log('got mining mesh', miningMesh);
        miningMeshes.push(miningMesh);
      }
    }
  }
  objectSizeX.value = maxX;
  objectSizeY.value = maxY;
  objectSizeZ.value = maxZ;
  return miningMeshes;
};
const _paintMiningMeshes = (x, y, z) => {
  const miningMeshes = _findMiningMeshesByContainCoord(x/PARCEL_SIZE, y/PARCEL_SIZE, z/PARCEL_SIZE);
  // console.log('found', miningMeshes.length);
  miningMeshes.forEach(miningMesh => {
    miningMesh.paint(x, y, z);
  });
};
const _eraseMiningMeshes = (x, y, z) => {
  const miningMesh = _findMiningMeshesByContainCoord(x/PARCEL_SIZE, y/PARCEL_SIZE, z/PARCEL_SIZE);
  miningMeshes.forEach(miningMesh => {
    miningMesh.erase(x, y, z);
  });
};
const _colorMiningMeshes = (x, y, z, c) => {
  const miningMesh = _findMiningMeshesByContainCoord(x/PARCEL_SIZE, y/PARCEL_SIZE, z/PARCEL_SIZE);
  miningMeshes.forEach(miningMesh => {
    miningMesh.color(x, y, z, c);
  });
};
let refreshing = false;
let refreshQueued = false;
const _refreshMiningMeshes = async () => {
  if (!refreshing) {
    refreshing = true;

    const fns = await Promise.all(miningMeshes.map(miningMesh => miningMesh.refresh()));
    for (let i = 0; i < fns.length; i++) {
      fns[i]();
    }
    const commitTool = tools[5];
    if (miningMeshes.some(miningMesh => miningMesh.visible)) {
      commitTool.classList.remove('hidden');
    } else {
      commitTool.classList.add('hidden');
    }

    refreshing = false;
    if (refreshQueued) {
      refreshQueued = false;
      _refreshMiningMeshes();
    }
  } else {
    refreshQueued = true;
  }
};
let colliding = false;
let collideQueued = false;
const _collideMiningMeshes = async () => {
  if (!colliding) {
    colliding = true;

    const fns = await Promise.all(miningMeshes.map(miningMesh => miningMesh.collide()));
    for (let i = 0; i < fns.length; i++) {
      fns[i]();
    }

    colliding = false;
    if (collideQueued) {
      collideQueued = false;
      _collideMiningMeshes();
    }
  } else {
    collideQueued = true;
  }
};
const _bindObjectMeshPhysics = async () => {
  for (let i = 0; i < objectMeshes.length; i++) {
    ammo.bindObjectMeshPhysics(objectMeshes[i]);
  }
};

const collisionMesh = (() => {
  const geometry = new THREE.BoxBufferGeometry(0.01, 0.01, 0.01);
  const material = new THREE.MeshPhongMaterial({
    color: 0x0000FF,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false;
  mesh.frustumCulled = false;
  return mesh;
})();
scene.add(collisionMesh);

const hoverOutlineEffect = new OutlineEffect(renderer, {
  defaultThickness: 0.01,
  defaultColor: new THREE.Color(0x42a5f5).toArray(),
  defaultAlpha: 0.5,
  // defaultKeepAlive: false,//true,
});
const selectOutlineEffect = new OutlineEffect(renderer, {
  defaultThickness: 0.01,
  defaultColor: new THREE.Color(0x66bb6a).toArray(),
  defaultAlpha: 0.5,
  // defaultKeepAlive: false,//true,
});
const outlineScene = new THREE.Scene();
let renderingOutline = false;
let hoveredObjectMesh = null;
let selectedObjectMesh = null;
scene.onAfterRender = () => {
  if (renderingOutline) return;
  renderingOutline = true;

  let oldHoverParent;
  if (hoveredObjectMesh) {
    oldHoverParent = hoveredObjectMesh.parent;
    outlineScene.add(hoveredObjectMesh);
  }
  hoverOutlineEffect.renderOutline(outlineScene, camera);
  if (oldHoverParent) {
    scene.add(hoveredObjectMesh);
  }

  let oldSelectedParent;
  if (selectedObjectMesh) {
    oldSelectedParent = selectedObjectMesh.parent;
    outlineScene.add(selectedObjectMesh);
  }
  selectOutlineEffect.renderOutline(outlineScene, camera);
  if (oldSelectedParent) {
    scene.add(selectedObjectMesh);
  }

  renderingOutline = false;
};

window.addEventListener('resize', e => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

interfaceDocument.addEventListener('dragover', e => {
  e.preventDefault();
});
interfaceDocument.addEventListener('drop', e => {
  e.preventDefault();

  if (e.dataTransfer.files.length > 0){
    const [file] = e.dataTransfer.files;
    if (/^image\//.test(file.type)) {
      const objectMesh = (() => {
        // const geometry = new THREE.PlaneBufferGeometry(1, 1);
        const geometry = new THREE.BoxBufferGeometry(1, 1, 0.001);
        for (let i = 0; i < geometry.attributes.position.array.length; i += 3) {
          if (geometry.attributes.position.array[i + 2] < 0) {
            const j = i*2/3;
            geometry.attributes.uv.array[j] = 1 - geometry.attributes.uv.array[j];
          }
        }
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          texture.image = img;
          texture.needsUpdate = true;

          mesh.scale.x = 0.5;
          mesh.scale.y = mesh.scale.x * img.height/img.width;
          mesh.visible = true;
        };
        img.onerror = console.warn;
        const texture = new THREE.Texture();
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.visible = false;
        mesh.frustumCulled = false;
        return mesh;
      })();
      objectMesh.position.copy(camera.position)
        .add(new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion));
      objectMesh.quaternion.copy(camera.quaternion);
      scene.add(objectMesh);
      objectMeshes.push(objectMesh);
    }
  }
});

let transformControlsHovered = false;
const _bindObjectMeshControls = o => {
  const control = new TransformControls(camera, interfaceDocument.querySelector('.background'), interfaceDocument);
  // control.setMode(transformMode);
  control.size = 3;
  // control.visible = toolManager.getSelectedElement() === xrIframe;
  // control.enabled = control.visible;
  /* control.addEventListener('dragging-changed', e => {
    orbitControls.enabled = !e.value;
  }); */
  control.addEventListener('mouseEnter', () => {
    transformControlsHovered = true;
  });
  control.addEventListener('mouseLeave', () => {
    transformControlsHovered = false;
  });
  control.attach(o);
  scene.add(control);
  o.control = control;
};
const _unbindObjectMeshControls = o => {
  scene.remove(o.control);
  o.control.dispose();
  o.control = null;
  transformControlsHovered = false;
};

const localRaycaster = new THREE.Raycaster();
let toolDown = false;
const _updateRaycasterFromMouseEvent = (raycaster, e) => {
  const mouse = new THREE.Vector2(( ( e.clientX ) / window.innerWidth ) * 2 - 1, - ( ( e.clientY ) / window.innerHeight ) * 2 + 1);
  raycaster.setFromCamera(mouse, camera);
  if (selectedTool === 'brush') {
    raycaster.ray.origin.add(raycaster.ray.direction);
  }
};
const _updateRaycasterFromObject = (raycaster, o) => {
  raycaster.ray.origin.copy(o.position);
  raycaster.ray.direction.set(0, 0, -1).applyQuaternion(o.quaternion);
};
const _updateTool = raycaster => {
  if (selectedTool === 'brush' || selectedTool === 'erase') {
    const targetPosition = raycaster.ray.origin;
    pointerMesh.material.uniforms.targetPos.value.set(
      Math.floor(targetPosition.x*10),
      Math.floor(targetPosition.y*10),
      Math.floor(targetPosition.z*10)
    );
    if (toolDown) {
      const v = pointerMesh.material.uniforms.targetPos.value;
      if (selectedTool === 'brush') {
        _paintMiningMeshes(v.x+1, v.y+1, v.z+1);
      } else if (selectedTool === 'erase') {
        _eraseMiningMeshes(v.x+1, v.y+1, v.z+1);
      }
      _refreshMiningMeshes();
    }
  } else if (selectedTool === 'select') {
    const intersections = raycaster.intersectObjects(objectMeshes);
    if (intersections.length > 0) {
      const [{object}] = intersections;
      hoveredObjectMesh = object;
    } else {
      hoveredObjectMesh = null;
    }
  } else if (selectedTool === 'paint') {
    _collideMiningMeshes();
  }
  
  const intersections = raycaster.intersectObject(uiMesh);
  if (intersections.length > 0 && intersections[0].distance < 3) {
    const [{distance, uv}] = intersections;
    rayMesh.position.copy(raycaster.ray.origin);
    rayMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), raycaster.ray.direction);
    rayMesh.scale.z = distance;
    rayMesh.visible = true;

    // orbitControls.enabled = false;

    uiMesh.intersect(uv);
  } else {
    rayMesh.visible = false;
    
    // orbitControls.enabled = selectedTool === 'camera';

    uiMesh.intersect(null);
  }
};
const _beginTool = () => {
  if (uiMesh.click()) {
    // nothing
  } else {
    if (selectedTool === 'brush') {
      const v = pointerMesh.material.uniforms.targetPos.value;
      _paintMiningMeshes(v.x+1, v.y+1, v.z+1);
      _refreshMiningMeshes();
    } else if (selectedTool === 'erase') {
      const v = pointerMesh.material.uniforms.targetPos.value;
      _eraseMiningMeshes(v.x+1, v.y+1, v.z+1);
      _refreshMiningMeshes();
    } else if (selectedTool === 'select') {
      if (!transformControlsHovered) {
        if (selectedObjectMesh) {
          _unbindObjectMeshControls(selectedObjectMesh);
        }
        selectedObjectMesh = hoveredObjectMesh;
        if (selectedObjectMesh) {
          _bindObjectMeshControls(selectedObjectMesh);
        }
      }
    } else if (selectedTool === 'paint') {
      const v = new THREE.Vector3(
        Math.floor(collisionMesh.position.x*10),
        Math.floor(collisionMesh.position.y*10),
        Math.floor(collisionMesh.position.z*10)
      );
      _colorMiningMeshes(v.x+1, v.y+1, v.z+1, currentColor);
      _refreshMiningMeshes();
    }

    toolDown = true;
  }
};
const _endTool = () => {
  if (toolDown) {
    toolDown = false;
  }
};
[window, interfaceWindow].forEach(w => {
  w.addEventListener('keydown', e => {
    switch (e.which) {
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      {
        tools[e.which - 49].click();
        break;
      }
    }
  });
  w.addEventListener('mousemove', e => {
    _updateRaycasterFromMouseEvent(localRaycaster, e);
    _updateTool(localRaycaster);
  });
  w.addEventListener('mousedown', _beginTool);
  w.addEventListener('mouseup', _endTool);
});

// interface

const tools = interfaceDocument.querySelectorAll('.tool');
Array.from(tools).forEach((tool, i) => {
  tool.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();

    if (i === 5) {
      _commitMiningMeshes();
    } else {
      Array.from(tools).forEach(tool => {
        tool.classList.remove('selected');
      });
      selectedTool = tool.getAttribute('tool');
      tool.classList.add('selected');
      
      uiMesh.update();
      
      orbitControls.enabled = selectedTool === 'camera';
    }
    selectedObjectMesh && _unbindObjectMeshControls(selectedObjectMesh);
    hoveredObjectMesh = null;
    selectedObjectMesh = null;
  });
});
let selectedTool = tools[0].getAttribute('tool');
tools[0].classList.add('selected');

const opsForm = interfaceDocument.getElementById('ops-form');
const objectNameEl = interfaceDocument.getElementById('object-name');
opsForm.addEventListener('submit', async e => {
  e.preventDefault();
  const dataArrayBuffer = _saveMiningMeshes();

  const screenshotBlob = await _screenshotMiningMeshes();

  const [
    dataHash,
    screenshotHash,
  ] = await Promise.all([
    fetch(`https://cryptopolys.webaverse.workers.dev/data/`, {
      method: 'PUT',
      body: dataArrayBuffer,
    })
      .then(res => res.json())
      .then(j => j.hash),
    fetch(`https://cryptopolys.webaverse.workers.dev/data/`, {
      method: 'PUT',
      body: screenshotBlob,
    })
      .then(res => res.json())
      .then(j => j.hash),
  ]);
  const metadataHash = await fetch(`https://cryptopolys.webaverse.workers.dev/metadata/`, {
      method: 'PUT',
      body: JSON.stringify({
        objectName: objectNameEl.value,
        dataHash,
        screenshotHash,
      }),
    })
      .then(res => res.json())
      .then(j => j.hash);

  const p = makePromise();
  const instance = await contract.getInstance();
  instance.mintWithMetadata(0, '0x0000000000000000000000000000000000000000', 1, 'hash', metadataHash, (err, value) => {
    if (!err) {
      p.accept(value);
    } else {
      p.reject(err);
    }
  });
  await p;
});
interfaceDocument.getElementById('new-op').addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();

  objectNameEl.value = '';
  _newMiningMeshes();
});
interfaceDocument.getElementById('load-op').addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();

  console.log('load');
});

const colors = interfaceDocument.querySelectorAll('.color');
Array.from(colors).forEach(color => {
  const inner = color.querySelector('.inner');
  color.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    
    Array.from(colors).forEach(color => {
      color.classList.remove('selected');
    });
    currentColor = new THREE.Color().setStyle(inner.style.backgroundColor);
    pointerMesh.material.uniforms.uBrushColor.value.set(currentColor.r, currentColor.g, currentColor.b);
    color.classList.add('selected');
    
    uiMesh.update();
  });
});
let currentColor = new THREE.Color().setStyle(colors[0].querySelector('.inner').style.backgroundColor);
colors[0].classList.add('selected');
pointerMesh.material.uniforms.uBrushColor.value.set(currentColor.r, currentColor.g, currentColor.b);
const brushSizeEl = interfaceDocument.getElementById('brush-size');
let brushSize = brushSizeEl.value;
brushSizeEl.addEventListener('input', e => {
  brushSize = e.target.value;
  interfaceDocument.getElementById('brush-size-text').innerHTML = brushSize;
});

const objectSizeX = interfaceDocument.getElementById('object-size-x');
const objectSizeY = interfaceDocument.getElementById('object-size-y');
const objectSizeZ = interfaceDocument.getElementById('object-size-z');
[objectSizeX, objectSizeY, objectSizeZ].forEach(el => {
  el.addEventListener('input', e => {
    const x = objectSizeX.value;
    const y = objectSizeY.value;
    const z = objectSizeZ.value;
    _resizeMiningMeshes(x, y, z);
    pointerMesh.resize(x, y, z);
  });
});
interfaceDocument.getElementById('enable-physics-button').addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();

  _bindObjectMeshPhysics();
});

// xr

const rayMesh = (() => {
  const geometry = new THREE.CylinderBufferGeometry(0.002, 0.002, 1, 3, 1, false, 0, Math.PI*2)
    .applyMatrix4(new THREE.Matrix4().makeTranslation(0, 1/2, 0))
    .applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI/2)));
  const material = new THREE.MeshBasicMaterial({
    color: 0x42a5f5,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false;
  mesh.frustumCulled = false;
  return mesh;
})();
scene.add(rayMesh);

const enterXrButton = interfaceDocument.getElementById('enter-xr-button');
let currentSession = null;
function onSessionStarted(session) {
  session.addEventListener('end', onSessionEnded);

  renderer.xr.setSession(session);

  currentSession = session;

  const controllerModelFactory = new XRControllerModelFactory();
  for (let i = 0; i < 2; i++) {
    const controller = renderer.xr.getController(i);
    controller.addEventListener('connected', e => {
      controller.userData.data = e.data;
    });
    controller.addEventListener('selectstart', e => {
      if (controller.userData.data && controller.userData.data.handedness === 'right') {
        _beginTool();
      }
    });
    controller.addEventListener('selectend', e => {
      if (controller.userData.data && controller.userData.data.handedness === 'right') {
        _endTool();
      }
    });
    
    const controllerGrip = renderer.xr.getControllerGrip(i);
    controllerGrip.add(controllerModelFactory.createControllerModel(controllerGrip));
    scene.add(controllerGrip);
  }
}
function onSessionEnded() {
  currentSession.removeEventListener('end', onSessionEnded);

  currentSession = null;
}
enterXrButton.addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();
  
  if (currentSession === null) {
    // WebXR's requestReferenceSpace only works if the corresponding feature
    // was requested at session creation time. For simplicity, just ask for
    // the interesting ones as optional features, but be aware that the
    // requestReferenceSpace call will fail if it turns out to be unavailable.
    // ('local' is always available for immersive sessions and doesn't need to
    // be requested separately.)
    var sessionInit = {
      optionalFeatures: [
        'local-floor',
        'bounded-floor',
      ],
    };
    navigator.xr.requestSession('immersive-vr', sessionInit).then(onSessionStarted);
  } else {
    currentSession.end();
  }
});

const uiRenderer = (() => {
  const loadPromise = Promise.all([
    new Promise((accept, reject) => {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://render.exokit.xyz/';
      iframe.onload = () => {
        accept(iframe);
      };
      iframe.onerror = err => {
        reject(err);
      };
      iframe.setAttribute('frameborder', 0);
      iframe.style.position = 'absolute';
      iframe.style.width = `${uiSize}px`;
      iframe.style.height = `${uiSize}px`;
      iframe.style.top = '-4096px';
      iframe.style.left = '-4096px';
      document.body.appendChild(iframe);
    }),
    fetch('interface.html')
      .then(res => res.text()),
  ]);

  let renderIds = 0;
  return {
    async render(searchResults, inventory, channels, selectedTab, rtcConnected, landConnected) {
      const [iframe, interfaceHtml] = await loadPromise;

      if (renderIds > 0) {
        iframe.contentWindow.postMessage({
          method: 'cancel',
          id: renderIds,
        });
      }

      const start = Date.now();
      const mc = new MessageChannel();
      const templateData = {
        width: uiSize,
        height: uiSize,
        zoom: 5,
        hideOps: true,
      };
      for (let i = 0; i < tools.length; i++) {
        templateData[`tool${i+1}Selected`] = selectedTool === tools[i].getAttribute('tool');
      }
      const currentColorString = currentColor.getHexString();
      for (let i = 0; i < colors.length; i++) {
        const colorString = new THREE.Color(colors[i].querySelector('.inner').style.backgroundColor).getHexString();
        templateData[`color${i+1}Selected`] = currentColorString === colorString;
      }
      iframe.contentWindow.postMessage({
        method: 'render',
        id: ++renderIds,
        htmlString: interfaceHtml,
        templateData,
        width: uiSize,
        height: uiSize,
        port: mc.port2,
      }, '*', [mc.port2]);
      const result = await new Promise((accept, reject) => {
        mc.port1.onmessage = e => {
          const {data} = e;
          const {error, result} = data;

          if (result) {
            console.log('time taken', Date.now() - start);

            accept(result);
          } else {
            reject(error);
          }
        };
      });
      return result;
    },
  };
})();
const uiMesh = (() => {
  const geometry = new THREE.PlaneBufferGeometry(0.2, 0.2)
    .applyMatrix4(new THREE.Matrix4().makeTranslation(0, uiWorldSize/2, 0));
  const canvas = document.createElement('canvas');
  canvas.width = uiSize;
  canvas.height = uiSize;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(uiSize, uiSize);
  const texture = new THREE.Texture(
    canvas,
    THREE.UVMapping,
    THREE.ClampToEdgeWrapping,
    THREE.ClampToEdgeWrapping,
    THREE.LinearFilter,
    THREE.LinearMipMapLinearFilter,
    THREE.RGBAFormat,
    THREE.UnsignedByteType,
    16,
    THREE.LinearEncoding
  );
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false;
  mesh.frustumCulled = false;
  
  const highlightMesh = (() => {
    const geometry = new THREE.BoxBufferGeometry(1, 1, 0.01);
    const material = new THREE.MeshBasicMaterial({
      color: 0x42a5f5,
      transparent: true,
      opacity: 0.5,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.visible = false;
    return mesh;
  })();
  /* highlightMesh.position.x = -uiWorldSize/2 + (10 + 150/2)/uiSize*uiWorldSize;
  highlightMesh.position.y = uiWorldSize - (60 + 150/2)/uiSize*uiWorldSize;
  highlightMesh.scale.x = highlightMesh.scale.y = 150/uiSize*uiWorldSize; */
  mesh.add(highlightMesh);

  let anchors = [];
  mesh.update = () => {
    uiRenderer.render()
      .then(result => {
        imageData.data.set(result.data);
        ctx.putImageData(imageData, 0, 0);
        texture.needsUpdate = true;
        mesh.visible = true;
        
        anchors = result.anchors;
        // console.log(anchors);
      });
  };
  let hoveredAnchor = null;
  mesh.intersect = uv => {
    hoveredAnchor = null;
    highlightMesh.visible = false;

    if (uv) {
      uv.y = 1 - uv.y;
      uv.multiplyScalar(uiSize);

      for (let i = 0; i < anchors.length; i++) {
        const anchor = anchors[i];
        const {top, bottom, left, right, width, height} = anchor;
        // console.log('check', {x: uv.x, y: uv.y, top, bottom, left, right});
        if (uv.x >= left && uv.x < right && uv.y >= top && uv.y < bottom) {
          hoveredAnchor = anchor;
          
          highlightMesh.position.x = -uiWorldSize/2 + (left + width/2)/uiSize*uiWorldSize;
          highlightMesh.position.y = uiWorldSize - (top + height/2)/uiSize*uiWorldSize;
          highlightMesh.scale.x = width/uiSize*uiWorldSize;
          highlightMesh.scale.y = height/uiSize*uiWorldSize;
          highlightMesh.visible = true;
          break;
        }
      }
    }
  };
  mesh.click = () => {
    if (hoveredAnchor) {
      const {id} = hoveredAnchor;
      if (/^(?:tool-|color-)/.test(id)) {
        interfaceDocument.getElementById(id).click();
      } else {
        switch (id) {
          default: {
            console.warn('unknown anchor click', id);
            break;
          }
        }
      }
      return true;
    } else {
      return false;
    }
  };
  mesh.update();

  return mesh;
})();
uiMesh.position.set(0.5, 0.5, 1);
scene.add(uiMesh);

function animate() {
  orbitControls.update();
  renderer.render(scene, camera);
  
  if (currentSession) {
    for (let i = 0; i < 2; i++) {
      const controller = renderer.xr.getController(i);
      if (controller.userData.data) {
        if (controller.userData.data.handedness === 'left') {
          uiMesh.position.copy(controller.position);
          uiMesh.quaternion.copy(controller.quaternion);
        } else if (controller.userData.data.handedness === 'right') {
          _updateRaycasterFromObject(localRaycaster, controller);
          _updateTool(localRaycaster);
        }
      }
    }
  }

  if (ammo) {
    ammo.simulate();
    for (let i = 0; i < objectMeshes.length; i++) {
      ammo.updateObjectMesh(objectMeshes[i]);
    }
  }
}
renderer.setAnimationLoop(animate);

(async () => {
  const q = parseQuery(window.location.search);
  const {o} = q;
  if (o) {
    const metadata = await fetch(`https://cryptopolys.webaverse.workers.dev/metadata${o}`)
      .then(res => res.json());
    const {objectName, dataHash} = metadata;
    objectNameEl.value = objectName;
    const arrayBuffer = await fetch(`https://cryptopolys.webaverse.workers.dev/data${dataHash}`)
      .then(res => res.arrayBuffer());
    for (let i = 0; i < miningMeshes.length; i++) {
      const miningMesh = miningMeshes[i];
      scene.remove(miningMesh);
      miningMesh.destroy();
    }
    miningMeshes = _loadMiningMeshes(new Uint8Array(arrayBuffer));
    for (let i = 0; i < miningMeshes.length; i++) {
      scene.add(miningMeshes[i]);
    }
    _refreshMiningMeshes();
  }
})();

navigator.xr.isSessionSupported('immersive-vr').then(supported => {
  if (supported) {
    renderer.xr.enabled = true;
    enterXrButton.classList.remove('disabled');
  } else {
    // nothing
  }
});

};

const interfaceIframe = document.getElementById('interface-iframe');
const interfaceWindow = interfaceIframe.contentWindow;
const interfaceDocument = interfaceIframe.contentDocument;
if (interfaceDocument.readyState === 'complete') {
  _load();
} else {
  interfaceDocument.addEventListener('readystatechange', () => {
    if (interfaceDocument.readyState === 'complete') {
      _load();
    }
  });
}