/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/index.ts":
/*!******************************!*\
  !*** ./src/scripts/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const three_1 = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
const OrbitControls_js_1 = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls.js */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
const GLTFLoader_1 = __webpack_require__(/*! three/examples/jsm/loaders/GLTFLoader */ "./node_modules/three/examples/jsm/loaders/GLTFLoader.js");
//
class BagGfx {
    constructor() {
        this.elapsedTime = 0;
        this.sizes = {
            width: 0,
            height: 0
        };
        this.tick = () => {
            window.requestAnimationFrame(this.tick);
            this.delta = this.clock.getDelta() * 1000;
            this.elapsedTime += this.delta;
            if (this.sizes.width !== window.innerWidth || this.sizes.height !== window.innerHeight) {
                this.resize();
            }
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        this.init();
        console.log('loaded!');
    }
    ;
    init() {
        // Canvas
        this.canvas = document.querySelector('canvas.webglView');
        // Scene
        this.scene = new three_1.Scene();
        this.scene.background = new three_1.Color('#fff'); //324345 - at night  // b2eef5
        // Sizes
        this.sizes.width = window.innerWidth,
            this.sizes.height = window.innerHeight;
        // Camera
        this.camera = new three_1.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100);
        this.camera.position.set(0, 1, 0.5);
        this.scene.add(this.camera);
        // Light
        const light = new three_1.PointLight(0xffffff, 3, 10);
        light.position.set(3, 7, 3);
        this.scene.add(light);
        const ambientLight = new three_1.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        // Controls
        this.controls = new OrbitControls_js_1.MapControls(this.camera, this.canvas);
        // Renderer
        this.renderer = new three_1.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        // Load model
        this.loadModal();
        this.eventListeners();
        // Resize
        window.addEventListener('resize', this.resize());
        this.clock = new three_1.Clock();
        //
        this.tick();
    }
    ;
    eventListeners() {
        document.querySelectorAll('.body-color').forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.dataset.color;
                this.changeBodyColor(color);
            });
        });
        document.querySelectorAll('.metal-color').forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.dataset.color;
                this.changeMetalColor(color);
            });
        });
        document.querySelectorAll('.material').forEach(btn => {
            btn.addEventListener('click', () => {
                const material = btn.dataset.type;
                this.changeMaterial(material); // Your function
            });
        });
        document.getElementById('seeInRealLife').addEventListener('click', () => {
            this.showARPreview(); // Example function
        });
        this.initAREvents();
    }
    ;
    showARPreview() {
        const arModal = document.getElementById('ar-preview');
        const qrImg = document.getElementById('ar-qr-code');
        const qrURL = 'http://localhost:8007'; // 'https://example.com/ar-view'; // Replace with your AR URL
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrURL)}`;
        arModal.style.display = 'flex';
    }
    ;
    initAREvents() {
        const closeBtn = document.querySelector('.close-btn');
        const arModal = document.getElementById('ar-preview');
        closeBtn.addEventListener('click', () => {
            arModal.style.display = 'none';
        });
        arModal.addEventListener('click', (e) => {
            if (e.target === arModal)
                arModal.style.display = 'none';
        });
    }
    ;
    changeBodyColor(colorName) {
        const colorMap = {
            brown: '#c9892e',
            black: '#1b1c1c',
            blue: '#625df5',
        };
        if (!this.backpack)
            return;
        this.backpack.traverse((child) => {
            if (child.isMesh && child.material.name !== 'metall') {
                const material = child.material;
                material.color.set(colorMap[colorName]);
            }
        });
    }
    ;
    changeMetalColor(colorName) {
        const colorMap = {
            silver: '#CCCCCC',
            gold: '#FFD700',
            black: '#111111',
        };
        if (!this.backpack)
            return;
        this.backpack.traverse((child) => {
            if (child.isMesh && child.material.name == 'metall') {
                const material = child.material;
                material.color.set(colorMap[colorName]);
            }
        });
    }
    ;
    changeMaterial(type) {
        if (!this.backpack)
            return;
        const textureLoader = new three_1.TextureLoader();
        const textureMap = {
            leather: {
                map: 'resources/models/backpack/leather_baseColor.jpg',
                normalMap: 'resources/models/backpack/metall_normal.jpg'
            },
            fabric: {
                map: 'resources/models/backpack/fabric_baseColor.jpg',
                normalMap: 'resources/models/backpack/fabric_normal.jpg'
            },
            denim: {
                map: 'resources/models/backpack/denim_baseColor.jpg',
                normalMap: 'resources/models/backpack/denim_normal.jpg'
            },
        };
        const textures = textureMap[type];
        const mapTexture = textureLoader.load(textures.map);
        const normalTexture = textureLoader.load(textures.normalMap);
        this.backpack.traverse((child) => {
            if (child.isMesh && child.material.name !== 'metall') {
                child.material = new three_1.MeshStandardMaterial({
                    map: mapTexture,
                    normalMap: normalTexture
                });
            }
        });
    }
    ;
    loadModal() {
        const loader = new GLTFLoader_1.GLTFLoader();
        loader.load('resources/models/backpack/backpack.glb', (gltf) => {
            this.backpack = gltf.scene;
            this.backpack.position.set(0, 0, 0);
            this.scene.add(this.backpack);
            this.backpack.traverse((child) => {
                if (child.isMesh) {
                    const mesh = child;
                    mesh.rotation.x += Math.PI / 8;
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    mesh.material.needsUpdate = true;
                }
            });
            this.camera.lookAt(this.backpack);
        }, undefined, function (error) {
            console.error('An error happened while loading the model:', error);
        });
    }
    ;
    resize() {
        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    ;
}
exports["default"] = new BagGfx();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkblood"] = self["webpackChunkblood"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/scripts/index.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map