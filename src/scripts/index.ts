import { AmbientLight, Clock, Color, Mesh, MeshBasicMaterial, MeshStandardMaterial, TextureLoader, PerspectiveCamera, PlaneBufferGeometry, PointLight, Scene, WebGLRenderer } from "three";
import { MapControls, OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import QRCode from 'qrcode';

//

class BagGfx {

    public camera: PerspectiveCamera;
    public plane: Mesh;
    public scene: Scene;
    public canvas: HTMLCanvasElement;
    public controls: OrbitControls;
    public renderer: WebGLRenderer;
    public delta: number;
    public elapsedTime: number = 0;
    public clock: Clock;
    public backpack: GLTF.scene;

    private sizes = {
        width: 0,
        height: 0
    };

    constructor() {

        this.init();
        console.log('loaded!');

    };

    public init () : void {

        // Canvas
        this.canvas = document.querySelector( 'canvas.webglView' ) as HTMLCanvasElement;

        // Scene
        this.scene = new Scene();
        this.scene.background = new Color( '#fff' ); //324345 - at night  // b2eef5

        // Sizes
        this.sizes.width = window.innerWidth,
        this.sizes.height = window.innerHeight;

        // Camera
        this.camera = new PerspectiveCamera( 45, this.sizes.width / this.sizes.height, 0.1, 100 );
        this.camera.position.set( 0, 1, 0.5 );
        this.scene.add( this.camera );

        // Light
        const light = new PointLight( 0xffffff, 3, 10 );
        light.position.set( 3, 7, 3 );
        this.scene.add( light );

        const ambientLight = new AmbientLight( 0xffffff, 0.4 );
        this.scene.add( ambientLight );

        // Controls
        this.controls = new MapControls( this.camera, this.canvas );

        // Renderer
        this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize( this.sizes.width, this.sizes.height );
        this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

        // Load model
        this.loadModal();

        this.eventListeners();

        // Resize
        window.addEventListener( 'resize', this.resize() );

        this.clock = new Clock();

        //

        this.tick();

    };

    public eventListeners () : void {

        document.querySelectorAll( '.body-color' ).forEach( btn => {

            btn.addEventListener( 'click', () => {

              const color = btn.dataset.color;
              this.changeBodyColor( color );

            });

        });

        document.querySelectorAll( '.metal-color' ).forEach( btn => {

            btn.addEventListener('click', () => {

                const color = btn.dataset.color;
                this.changeMetalColor(color);

            });

        });

        document.querySelectorAll( '.material' ).forEach( btn => {

            btn.addEventListener( 'click', () => {

                const material = btn.dataset.type;
                this.changeMaterial( material ); // Your function

            });

        });

        document.getElementById( 'seeInRealLife' ).addEventListener( 'click', () => {

            this.showARPreview(); // Example function

        });

        this.initAREvents();

    };

    public showARPreview(): void {

        const arModal = document.getElementById('ar-preview')!;
        const qrImg = document.getElementById('ar-qr-code') as HTMLImageElement;

        const qrURL = 'http://localhost:8007';// 'https://example.com/ar-view'; // Replace with your AR URL
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrURL)}`;

        arModal.style.display = 'flex';

    };

    public initAREvents(): void {

        const closeBtn = document.querySelector('.close-btn')!;
        const arModal = document.getElementById('ar-preview')!;

        closeBtn.addEventListener('click', () => {

            arModal.style.display = 'none';

        });

        arModal.addEventListener('click', (e) => {

            if (e.target === arModal) arModal.style.display = 'none';

        });

    };

    public changeBodyColor( colorName: string ): void {

        const colorMap: Record< string, string > = {

            brown: '#c9892e',
            black: '#1b1c1c',
            blue: '#625df5',

        };

        if ( !this.backpack ) return;

        this.backpack.traverse( ( child ) => {

            if ( child.isMesh && child.material.name !== 'metall' ) {

                const material = child.material as THREE.MeshStandardMaterial;
                material.color.set( colorMap[ colorName ] );

            }

        });

    };

    public changeMetalColor( colorName: string ): void {

        const colorMap: Record< string, string > = {

            silver: '#CCCCCC',
            gold: '#FFD700',
            black: '#111111',

        };

        if ( !this.backpack ) return;

        this.backpack.traverse( ( child ) => {

            if ( child.isMesh && child.material.name == 'metall' ) {

                const material = child.material as MeshStandardMaterial;
                material.color.set( colorMap[ colorName ] );

            }

        });

    };

    public changeMaterial( type: string ): void {
        if ( !this.backpack ) return;

        const textureLoader = new TextureLoader();
        const textureMap: Record<string, { map: string, normalMap: string }> = {

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

        const textures = textureMap[ type ];

        const mapTexture = textureLoader.load( textures.map );
        const normalTexture = textureLoader.load( textures.normalMap );

        this.backpack!.traverse( ( child ) => {

            if ( child.isMesh && child.material.name !== 'metall' ) {

                child.material = new MeshStandardMaterial( {

                    map: mapTexture,
                    normalMap: normalTexture

                } );

            }

        } );

    };

    public loadModal () : void {

        const loader = new GLTFLoader();

        loader.load(

          'resources/models/backpack/backpack.glb',
            ( gltf ) => {

            this.backpack = gltf.scene;
            this.backpack.position.set( 0, 0, 0 );
            this.scene.add( this.backpack );

            this.backpack.traverse((child) => {

                if ( ( child as THREE.Mesh ).isMesh ) {

                    const mesh = child as THREE.Mesh;

                    mesh.rotation.x += Math.PI / 8;

                    mesh.castShadow = true;
                    mesh.receiveShadow = true;

                    mesh.material.needsUpdate = true;

                }

            } );

            this.camera.lookAt( this.backpack );

          },

          undefined,
          function ( error ) {

            console.error( 'An error happened while loading the model:', error );

          }

        );

    };

    private resize () : any {

        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;

        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( this.sizes.width, this.sizes.height );
        this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

    };

    public tick = () : void => {

        window.requestAnimationFrame( this.tick );

        this.delta = this.clock.getDelta() * 1000;
        this.elapsedTime += this.delta;

        if ( this.sizes.width !== window.innerWidth || this.sizes.height !== window.innerHeight ) {

            this.resize();

        }

        this.controls.update();
        this.renderer.render( this.scene, this.camera );

    };

}

export default new BagGfx();