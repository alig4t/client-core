// src/components/AnimatedBackground.tsx

import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { inSphere } from "maath/random";
import type { Points as PointsType } from "three";

// کامپوننت اصلی که ذرات را رندر و انیمیت می‌کند
function Stars(props: any) {
  const ref = useRef<PointsType>(null!);

  // ایجاد 5000 ذره در یک کره با شعاع 1.2
  const [sphere] = useState(() =>
    inSphere(new Float32Array(5000), { radius: 1.2 })
  );

  // انیمیشن در هر فریم
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color="#ffffff" // رنگ ذرات
          size={0.005} // اندازه ذرات
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

// کامپوننت والد که Canvas را برای رندر صحنه آماده می‌کند
export default function AnimatedBackground() {
  return (
    <div className="w-full h-full fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
      </Canvas>
    </div>
  );
}
