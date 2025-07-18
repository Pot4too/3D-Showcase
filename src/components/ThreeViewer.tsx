import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, ZoomIn, ZoomOut, Move3D, AlertCircle } from 'lucide-react';

interface ThreeViewerProps {
  objUrl: string;
  className?: string;
  showInstructions?: Boolean;
  autoRotate?: Boolean;
  cameraConfig?: {
    position?: [number, number, number];
    lookAt?: [number, number, number];
  };
}

// const ThreeViewer: React.FC<ThreeViewerProps> = ({ objUrl, className = '' }) => {
  const ThreeViewer: React.FC<ThreeViewerProps> = ({ objUrl, className = '', showInstructions = false, autoRotate = false, cameraConfig}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const axesHelperRef = useRef<THREE.AxesHelper | null>(null);
  const modelRef = useRef<THREE.Group>();
  const controlsRef = useRef<{
    isRotating: boolean;
    isPanning: boolean;
    isZooming: boolean;
    lastMouseX: number;
    lastMouseY: number;
    rotationSpeed: number;
    zoomSpeed: number;
    panSpeed: number;
  }>({
    isRotating: false,
    isPanning: false,
    isZooming: false,
    lastMouseX: 0,
    lastMouseY: 0,
    rotationSpeed: 0.005,
    zoomSpeed: 0.1,
    panSpeed: 0.002,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const applyCameraConfig = () => {
    const camera = cameraRef.current;
    if (!camera) return;

    const defaultPos: [number, number, number] = cameraConfig?.position ?? [0, 0, 3];
    camera.position.set(...defaultPos);

    if (cameraConfig?.lookAt) {
      const [x, y, z] = cameraConfig.lookAt;
      camera.lookAt(new THREE.Vector3(x, y, z));
    }
  };

    
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    // camera.position.set(0, -1, 3);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    // const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x3b82f6, 0.5, 100);
    pointLight1.position.set(-10, 0, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.5, 100);
    pointLight2.position.set(10, 0, -10);
    scene.add(pointLight2);

    // Load model
    loadModel();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (modelRef.current && !controlsRef.current.isRotating && !controlsRef.current.isPanning && autoRotate) {
        modelRef.current.rotation.z += 0.004;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Mouse controls
    const handleMouseDown = (event: MouseEvent) => {
      const controls = controlsRef.current;
      controls.lastMouseX = event.clientX;
      controls.lastMouseY = event.clientY;

      if (event.button === 0) { // Left click - rotate
        controls.isRotating = true;
      } else if (event.button === 2) { // Right click - pan
        controls.isPanning = true;
        event.preventDefault();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const controls = controlsRef.current;
      const deltaX = event.clientX - controls.lastMouseX;
      const deltaY = event.clientY - controls.lastMouseY;

      if (controls.isRotating && modelRef.current) {
        modelRef.current.rotation.y += deltaX * controls.rotationSpeed;
        modelRef.current.rotation.x += deltaY * controls.rotationSpeed;
      }

      if (controls.isPanning && cameraRef.current) {
        cameraRef.current.position.x -= deltaX * controls.panSpeed;
        cameraRef.current.position.y += deltaY * controls.panSpeed;
      }

      controls.lastMouseX = event.clientX;
      controls.lastMouseY = event.clientY;
    };

    const handleMouseUp = () => {
      const controls = controlsRef.current;
      controls.isRotating = false;
      controls.isPanning = false;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const controls = controlsRef.current;
      const camera = cameraRef.current;
      
      if (camera) {
        const zoomFactor = event.deltaY > 0 ? 1 + controls.zoomSpeed : 1 - controls.zoomSpeed;
        camera.position.multiplyScalar(zoomFactor);
        
        // Clamp zoom limits
        const distance = camera.position.length();
        if (distance < 1) camera.position.normalize().multiplyScalar(1);
        if (distance > 50) camera.position.normalize().multiplyScalar(50);
      }
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);
    
    useEffect(() => {
      if (!cameraRef.current) return;
      if (!cameraConfig) return;

      applyCameraConfig();
    }, [cameraConfig]);


  const loadModel = async () => {
  if (!sceneRef.current) return;

  setIsLoading(true);
  setError(null);
  setLoadingProgress(0);

  try {
    console.log('Loading OBJ from:', objUrl);
    setLoadingProgress(50);

    const objResponse = await fetch(objUrl);
    if (!objResponse.ok) {
      throw new Error(`Failed to load OBJ file: ${objResponse.status} ${objResponse.statusText}`);
    }

    const objText = await objResponse.text();
    console.log('OBJ file loaded, size:', objText.length, 'characters');
    setLoadingProgress(75);

    const geometry = parseOBJ(objText);

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 100,
      specular: 0x222222,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    const group = new THREE.Group();
    group.add(mesh);

    // Optional fix for Fusion360
    group.rotation.x = -Math.PI / 2;
    group.rotation.z = -Math.PI / 3;


    // Center and scale model (assume origin = bottom center)
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    //const size = box.getSize(new THREE.Vector3());
    //const maxDim = Math.max(size.x, size.y, size.z);
    //const scale = 2 / maxDim;

    group.position.set(0, 0, 0);


    // Clear old model
    if (modelRef.current) {
      sceneRef.current.remove(modelRef.current);
    }

    modelRef.current = group;
    sceneRef.current.add(group);

    // Replace AxesHelper
    if (axesHelperRef.current) {
      sceneRef.current.remove(axesHelperRef.current);
    }

    //* uncomment to enable Axes in model previews
    // const axesHelper = new THREE.AxesHelper(1);
    // axesHelperRef.current = axesHelper;
    // sceneRef.current.add(axesHelper);

    // Auto-fit camera
    const camera = cameraRef.current;
    if (camera) {
      const boundingSphere = box.getBoundingSphere(new THREE.Sphere());
      const modelBottomCenter = new THREE.Vector3(center.x, box.min.y, center.z);
      const distance = boundingSphere.radius * 2.5;

      const baseDirection = new THREE.Vector3(1, 1, 1).normalize();
      const defaultCameraPos = modelBottomCenter.clone().add(baseDirection.multiplyScalar(distance));

      const offsetPos = cameraConfig?.position ?? [0, 0, 0];
      const offsetLook = cameraConfig?.lookAt ?? [0, 0, 0];

      const cameraPosition = defaultCameraPos.clone().add(new THREE.Vector3(...offsetPos));
      const lookAtTarget = modelBottomCenter.clone().add(new THREE.Vector3(...offsetLook));

      camera.position.copy(cameraPosition);
      camera.lookAt(lookAtTarget);
    }

    setLoadingProgress(100);
    setIsLoading(false);
    console.log('Model loaded successfully');
  } catch (err) {
    console.error('Error loading model:', err);
    setError(err instanceof Error ? err.message : 'Failed to load 3D model');
    setIsLoading(false);
  }
};

  const parseOBJ = (objText: string): THREE.BufferGeometry => {
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const faces: Array<{ vertices: number[]; normals?: number[]; uvs?: number[] }> = [];

    const lines = objText.split('\n');

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const type = parts[0];

      switch (type) {
        case 'v':
          vertices.push(
            parseFloat(parts[1]),
            parseFloat(parts[2]),
            parseFloat(parts[3])
          );
          break;
        case 'vn':
          normals.push(
            parseFloat(parts[1]),
            parseFloat(parts[2]),
            parseFloat(parts[3])
          );
          break;
        case 'vt':
          uvs.push(parseFloat(parts[1]), parseFloat(parts[2]));
          break;
        case 'f':
          const face: { vertices: number[]; normals?: number[]; uvs?: number[] } = {
            vertices: []
          };
          
          for (let i = 1; i < parts.length; i++) {
            const indices = parts[i].split('/');
            face.vertices.push(parseInt(indices[0]) - 1); // Vertex index (OBJ is 1-indexed)
            
            if (indices[1] && uvs.length > 0) {
              if (!face.uvs) face.uvs = [];
              face.uvs.push(parseInt(indices[1]) - 1);
            }
            
            if (indices[2] && normals.length > 0) {
              if (!face.normals) face.normals = [];
              face.normals.push(parseInt(indices[2]) - 1);
            }
          }
          faces.push(face);
          break;
      }
    }

    const geometry = new THREE.BufferGeometry();
    const positionArray: number[] = [];
    const normalArray: number[] = [];
    const uvArray: number[] = [];

    // Convert faces to triangles
    for (const face of faces) {
      if (face.vertices.length >= 3) {
        // Triangulate face (simple fan triangulation)
        for (let i = 1; i < face.vertices.length - 1; i++) {
          const indices = [face.vertices[0], face.vertices[i], face.vertices[i + 1]];
          
          for (let j = 0; j < 3; j++) {
            const vertexIndex = indices[j];
            positionArray.push(
              vertices[vertexIndex * 3],
              vertices[vertexIndex * 3 + 1],
              vertices[vertexIndex * 3 + 2]
            );

            // Add normals if available
            if (face.normals && face.normals[j] !== undefined) {
              const normalIndex = face.normals[j];
              normalArray.push(
                normals[normalIndex * 3],
                normals[normalIndex * 3 + 1],
                normals[normalIndex * 3 + 2]
              );
            }

            // Add UVs if available
            if (face.uvs && face.uvs[j] !== undefined) {
              const uvIndex = face.uvs[j];
              uvArray.push(
                uvs[uvIndex * 2],
                uvs[uvIndex * 2 + 1]
              );
            }
          }
        }
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3));
    
    if (normalArray.length > 0) {
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normalArray, 3));
    } else {
      geometry.computeVertexNormals();
    }
    
    if (uvArray.length > 0) {
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvArray, 2));
    }

    return geometry;
  };

const resetView = () => {
  const camera = cameraRef.current;
  const group = modelRef.current;
  if (!camera || !group) return;

  // Compute bounding box and center
  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  const boundingSphere = box.getBoundingSphere(new THREE.Sphere());

  const modelBottomCenter = new THREE.Vector3(center.x, box.min.y, center.z);
  const distance = boundingSphere.radius * 2.5;

  const baseDirection = new THREE.Vector3(1, 1, 1).normalize();
  const defaultCameraPos = modelBottomCenter.clone().add(baseDirection.multiplyScalar(distance));

  const offsetPos = cameraConfig?.position ?? [0, 0, 0];
  const offsetLook = cameraConfig?.lookAt ?? [0, 0, 0];

  const cameraPosition = defaultCameraPos.clone().add(new THREE.Vector3(...offsetPos));
  const lookAtTarget = modelBottomCenter.clone().add(new THREE.Vector3(...offsetLook));

  camera.position.copy(cameraPosition);
  camera.lookAt(lookAtTarget);

  // Optional: reset model rotation
  group.rotation.set(-Math.PI / 2, 0, -Math.PI / 3); // match your initial rotation if needed
};


  const zoomCamera = (zoomDirection: "in" | "out") => {
  const camera = cameraRef.current;
  if (!camera || !cameraConfig?.lookAt) return;

  const lookAt = new THREE.Vector3(...cameraConfig.lookAt);
  const direction = new THREE.Vector3().subVectors(camera.position, lookAt).normalize();
  const distance = camera.position.distanceTo(lookAt);
  const zoomSpeed = 0.2;
  const newDistance = distance * (zoomDirection === "in" ? 1 - zoomSpeed : 1 + zoomSpeed);

  const minDistance = -100;
  const maxDistance = 100;
  if (newDistance > minDistance && newDistance < maxDistance) {
    camera.position.copy(direction.multiplyScalar(newDistance).add(lookAt));
  }
};

const zoomIn = () => zoomCamera("in");
const zoomOut = () => zoomCamera("out");

  return (
    <div className={`relative ${className}`}>
      <div ref={mountRef} className="w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-gray-800" />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-white mb-2">Loading 3D model...</p>
            <div className="w-48 bg-gray-700 rounded-full h-2 mx-auto">
              <div 
                className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-sm mt-2">{loadingProgress}%</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center rounded-lg">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Model</h3>
            <p className="text-red-400 mb-4 text-sm">{error}</p>
            <div className="text-gray-400 text-xs mb-4">
              <p>Make sure your OBJ file is in the correct location:</p>
              <p className="font-mono bg-gray-800 p-2 rounded mt-2">
                public/Objects/myObject.obj
              </p>
            </div>
            <button
              onClick={loadModel}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      {!isLoading && !error &&(
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetView();
            }}
            className="bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
            title="Reset view"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              zoomIn();
            }}
            className="bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              zoomOut();
            }}
            className="bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Instructions */}
      {!isLoading && !error && showInstructions && (
        <div className="absolute bottom-4 left-4 bg-gray-800/90 text-white text-sm p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Move3D className="h-4 w-4" />
            <span className="font-medium">Controls:</span>
          </div>
          <div className="text-xs space-y-1">
            <p>• Left click + drag: Rotate</p>
            <p>• Right click + drag: Pan</p>
            <p>• Mouse wheel: Zoom</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeViewer;