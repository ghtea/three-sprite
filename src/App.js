import { OrbitControls, OrthographicCamera } from "@react-three/drei"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { useControls } from "leva"
import React, { Suspense, useRef } from "react"
import * as THREE from "three"
import bard from "./resources/smiley.png"

const AnimatedSprite = React.forwardRef(({ src, scale, position, frameTime = 100 }, ref) => {
  const [{ frameCount, playing, currentFrame, speed }, set] = useControls(() => ({
    speed: { value: 1, min: 0, max: 5 },
    frameCount: {
      value: 8,
      min: 0,
      max: 8,
      step: 1,
    },
    currentFrame: {
      value: 0,
      min: 0,
      max: 8,
      step: 1,
    },
    playing: true,
  }))

  const texture = useLoader(THREE.TextureLoader, src)
  texture.minFilter = THREE.NearestFilter
  texture.magFilter = THREE.NearestFilter

  texture.repeat.set(1 / frameCount, 1 / 1)

  const t = useRef(0)
  const index = useRef(0)

  useFrame((_, delta) => {
    if (playing) {
      t.current += delta * 1000 * speed

      if (t.current >= frameTime) {
        index.current += 1
        if (index.current >= frameCount) {
          index.current = 0
        }

        t.current = 0

        set({ currentFrame: index.current })
        texture.offset.x = index.current / frameCount
      }
    } else {
      texture.offset.x = currentFrame / frameCount
    }
  })

  return (
    <sprite ref={ref} scale={scale} position={position}>
      <spriteMaterial transparent={true} map={texture} />
    </sprite>
  )
})

function Room() {
  return (
    <>
      <pointLight position={[30, 0, 0]} color="blue" intensity={10} />
      <AnimatedSprite scale={[2, 2, 2]} src={bard} />
    </>
  )
}

export default function App() {
  return (
    <Canvas>
      <color attach="background" args={["black"]} />
      {/* <Sky azimuth={1} inclination={0.1} distance={1000} /> */}
      <OrthographicCamera makeDefault position={[15, 15, 15]} zoom={80} />
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Room />
      </Suspense>
      <OrbitControls minPolarAngle={Math.PI / 10} maxPolarAngle={Math.PI / 1.5} />
    </Canvas>
  )
}
