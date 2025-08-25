"use client";

import { memo } from 'react';

interface SceneryProps {
  cameraX: number;
  worldHeight: number;
  groundY: number;
}

const hillPositions = [
  { x: 100, r: 300, color: "hsl(140, 55%, 60%)" },
  { x: 600, r: 400, color: "hsl(140, 55%, 55%)" },
  { x: 1200, r: 250, color: "hsl(140, 55%, 60%)" },
  { x: 1800, r: 500, color: "hsl(140, 55%, 50%)" },
  { x: 2500, r: 350, color: "hsl(140, 55%, 58%)" },
  { x: 3200, r: 450, color: "hsl(140, 55%, 55%)" },
  { x: 3800, r: 300, color: "hsl(140, 55%, 60%)" },
];

const cloudPositions = [
  { x: 200, y: 100, s: 1 },
  { x: 500, y: 150, s: 1.2 },
  { x: 900, y: 80, s: 0.9 },
  { x: 1400, y: 200, s: 1.5 },
  { x: 1900, y: 120, s: 1.1 },
  { x: 2400, y: 180, s: 1.3 },
  { x: 2800, y: 90, s: 0.8 },
  { x: 3300, y: 160, s: 1.2 },
  { x: 3700, y: 110, s: 1 },
];

const MemoizedCloud = memo(({ cloud, cameraX }: { cloud: typeof cloudPositions[0], cameraX: number }) => (
    <g transform={`translate(${cloud.x - cameraX * 0.8}, ${cloud.y}) scale(${cloud.s})`} opacity="0.8">
      <circle cx="0" cy="0" r="30" fill="white" />
      <circle cx="30" cy="0" r="30" fill="white" />
      <circle cx="15" cy="-15" r="30" fill="white" />
    </g>
));
MemoizedCloud.displayName = 'MemoizedCloud';


export function Scenery({ cameraX, worldHeight, groundY }: SceneryProps) {
  return (
    <>
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-sky-300 to-sky-100 dark:from-sky-900 dark:to-gray-800" />
        
        {/* Hills and Clouds as inline SVG for performance */}
        <svg width="4000" height={worldHeight} className="absolute top-0 left-0" preserveAspectRatio="xMinYMin meet">
            <g transform={`translate(0, ${groundY})`}>
                {hillPositions.map(hill => (
                    <path key={hill.x} d={`M ${hill.x - hill.r} 0 A ${hill.r} ${hill.r} 0 0 1 ${hill.x + hill.r} 0 Z`} fill={hill.color} transform={`translate(-${cameraX * 0.5}, 0)`}/>
                ))}
            </g>
             <g>
                {cloudPositions.map(cloud => <MemoizedCloud key={cloud.x} cloud={cloud} cameraX={cameraX}/>)}
            </g>
        </svg>

        {/* Ground */}
        <div className="absolute bottom-0 left-0 w-full bg-green-500 dark:bg-green-800" style={{height: worldHeight - groundY}}/>
    </>
  );
}
