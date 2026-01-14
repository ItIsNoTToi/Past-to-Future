/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from 'react';
import { Palette, RotateCcw, Play, Award, Sparkles, Clock } from 'lucide-react';

type Tool = 'BRUSH' | 'LINE' | 'RECT' | 'CIRCLE';

interface Position {
  x: number;
  y: number;
}

interface TimePositions {
  past: Position;
  future: Position;
}

interface LevelTargets {
  past: (ctx: CanvasRenderingContext2D) => void;
  present: (ctx: CanvasRenderingContext2D) => void;
  future: (ctx: CanvasRenderingContext2D) => void;
}

interface Level {
  name: string;
  rule: string;
  targets: LevelTargets;
}

const EchoPainter = () => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [showWin, setShowWin] = useState<boolean>(false);
  const [brushSize, setBrushSize] = useState<number>(3);
  const [currentColor, setCurrentColor] = useState<string>('#4F46E5');
  
  const presentCanvasRef = useRef<HTMLCanvasElement>(null);
  const pastCanvasRef = useRef<HTMLCanvasElement>(null);
  const futureCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const presentTargetRef = useRef<HTMLCanvasElement>(null);
  const pastTargetRef = useRef<HTMLCanvasElement>(null);
  const futureTargetRef = useRef<HTMLCanvasElement>(null);

  // FIX: Added ref to track the start of a shape
  const startPos = useRef<Position | null>(null);

  const colors: string[] = ['#4F46E5', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6'];
  const [tool, setTool] = useState<Tool>('BRUSH');
  const snapshots = useRef<{ present: ImageData; past: ImageData; future: ImageData } | null>(null);

  // sound
  const sounds = useRef<Record<string, HTMLAudioElement>>({
    draw: new Audio('/sounds/draw.mp3'),
    win: new Audio('/sounds/win.mp3'),
    level: new Audio('/sounds/level-up.mp3'),
  });

  const playSound = (name: keyof typeof sounds.current) => {
    const s = sounds.current[name];
    s.currentTime = 0;
    s.volume = 0.4;
    s.play().catch(() => {});
  };

  // Level definitions
  const levels: Level[] = 
  [  
    {
      name: "Level 1: Simple Line",
      rule: "Direct Echo",
      targets: {
        past: (ctx) => { ctx.strokeStyle = '#4F46E5'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(20, 80); ctx.lineTo(130, 80); ctx.stroke(); },
        present: (ctx) => { ctx.strokeStyle = '#4F46E5'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(20, 80); ctx.lineTo(130, 80); ctx.stroke(); },
        future: (ctx) => { ctx.strokeStyle = '#4F46E5'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(20, 80); ctx.lineTo(130, 80); ctx.stroke(); }
      }
    },
    {
      name: "Level 2: Cross Pattern",
      rule: "Rotation 90°",
      targets: {
        past: (ctx) => { ctx.strokeStyle = '#EC4899'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(75, 30); ctx.lineTo(75, 130); ctx.stroke(); },
        present: (ctx) => { ctx.strokeStyle = '#EC4899'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(25, 80); ctx.lineTo(125, 80); ctx.stroke(); },
        future: (ctx) => { ctx.strokeStyle = '#EC4899'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(75, 30); ctx.lineTo(75, 130); ctx.stroke(); }
      }
    },
    {
      name: "Level 3: The Mirror",
      rule: "Vertical Flip",
      targets: {
        past: (ctx) => { ctx.strokeStyle = '#10B981'; ctx.lineWidth = 4; ctx.strokeRect(40, 20, 70, 40); },
        present: (ctx) => { ctx.strokeStyle = '#10B981'; ctx.lineWidth = 4; ctx.strokeRect(40, 100, 70, 40); },
        future: (ctx) => { ctx.strokeStyle = '#10B981'; ctx.lineWidth = 4; ctx.strokeRect(40, 20, 70, 40); }
      }
    },
    {
      name: "Level 4: Diagonal Echo",
      rule: "X ↔ Y Swap",
      targets: {
        past: (ctx) => { ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(20, 140); ctx.lineTo(130, 140); ctx.stroke(); },
        present: (ctx) => { ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(140, 20); ctx.lineTo(140, 130); ctx.stroke(); },
        future: (ctx) => { ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(20, 140); ctx.lineTo(130, 140); ctx.stroke(); }
      }
    },
    {
      name: "Level 5: Split Dimensions",
      rule: "Opposing Horizontals",
      targets: {
        past: (ctx) => { ctx.strokeStyle = '#8B5CF6'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(40, 80, 20, 0, Math.PI * 2); ctx.stroke(); },
        present: (ctx) => { ctx.strokeStyle = '#8B5CF6'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(75, 80, 20, 0, Math.PI * 2); ctx.stroke(); },
        future: (ctx) => { ctx.strokeStyle = '#8B5CF6'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(110, 80, 20, 0, Math.PI * 2); ctx.stroke(); }
      }
    },
    {
      name: "Level 6: Total Inversion",
      rule: "Center Point Mirror",
      targets: {
        past: (ctx) => { ctx.strokeStyle = '#4F46E5'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(20, 20); ctx.lineTo(60, 60); ctx.stroke(); },
        present: (ctx) => { ctx.strokeStyle = '#4F46E5'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(75, 80); ctx.lineTo(75, 80); ctx.stroke(); }, // User draws center point
        future: (ctx) => { ctx.strokeStyle = '#4F46E5'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(130, 140); ctx.lineTo(90, 100); ctx.stroke(); }
      }
    }
  ];

  useEffect(() => {
    drawTargets();
  }, [currentLevel]);

  const drawTargets = (): void => {
    const level = levels[currentLevel - 1];
    const pastTargetCtx = pastTargetRef.current?.getContext('2d');
    const presentTargetCtx = presentTargetRef.current?.getContext('2d');
    const futureTargetCtx = futureTargetRef.current?.getContext('2d');

    if (pastTargetCtx) {
      pastTargetCtx.clearRect(0, 0, 150, 160);
      level.targets.past(pastTargetCtx);
    }
    if (presentTargetCtx) {
      presentTargetCtx.clearRect(0, 0, 150, 160);
      level.targets.present(presentTargetCtx);
    }
    if (futureTargetCtx) {
      futureTargetCtx.clearRect(0, 0, 150, 160);
      level.targets.future(futureTargetCtx);
    }
  };

  const applyTimeRule = (x: number, y: number, canvasWidth: number, canvasHeight: number): TimePositions => {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    switch (currentLevel) {
      case 1: // Level 1: Standard
        return { past: { x, y }, future: { x, y } };

      case 2: // Level 2: Rotation
        return {
          past: { x: centerX + (y - centerY), y: centerY - (x - centerX) },
          future: { x: centerX - (y - centerY), y: centerY + (x - centerX) }
        };

      case 3: // Level 3: Vertical Mirror (Upside down)
        return {
          past: { x, y: canvasHeight - y },
          future: { x, y: canvasHeight - y }
        };

      case 4: // Level 4: Diagonal (Swap X and Y)
        return {
          past: { x: y, y: x },
          future: { x: y, y: x }
        };

      case 5: // Level 5: Split (Move Left and Right)
        return {
          past: { x: x - 35, y },
          future: { x: x + 35, y }
        };

      case 6: // Level 6: Center Inversion (Past is top-left, Future is bottom-right)
        return {
          past: { x: canvasWidth - x, y: canvasHeight - y },
          future: { x: canvasWidth - x, y: canvasHeight - y }
        };

      default:
        return { past: { x, y }, future: { x, y } };
    }
  };

  // FIX: Updated draw function to handle Tool types
  const draw = (canvas: HTMLCanvasElement, x: number, y: number, color: string, size: number, sPos?: Position | null): void => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';

    if (tool === 'BRUSH' || !sPos) {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (tool === 'LINE') {
      ctx.beginPath();
      ctx.moveTo(sPos.x, sPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'RECT') {
      ctx.strokeRect(sPos.x, sPos.y, x - sPos.x, y - sPos.y);
    } else if (tool === 'CIRCLE' && sPos) {
      // 1. Calculate the distance (radius) using the Pythagorean theorem
      const dx = x - sPos.x;
      const dy = y - sPos.y;
      const radius = Math.sqrt(dx * dx + dy * dy);

      // 2. Draw the circle path
      ctx.beginPath();
      
      // arc(centerX, centerY, radius, startAngle, endAngle)
      // Math.PI * 2 creates a full 360-degree circle
      ctx.arc(sPos.x, sPos.y, radius, 0, Math.PI * 2);
      
      ctx.stroke();
    }
  };

  // 2. Updated startDrawing: Captures the "clean" state before the new shape starts
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>, canvasRef: React.RefObject<HTMLCanvasElement | null>): void => {
    if (canvasRef.current !== presentCanvasRef.current) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    startPos.current = { x, y };

    // Capture snapshots of all three timelines
    const pCtx = presentCanvasRef.current?.getContext('2d');
    const pastCtx = pastCanvasRef.current?.getContext('2d');
    const fCtx = futureCanvasRef.current?.getContext('2d');

    if (pCtx && pastCtx && fCtx) {
      snapshots.current = {
        present: pCtx.getImageData(0, 0, 150, 160),
        past: pastCtx.getImageData(0, 0, 150, 160),
        future: fCtx.getImageData(0, 0, 150, 160),
      };
    }

    if (tool === 'BRUSH') {
      drawAtPoint(x, y, true); // true = play sound
    }
  };

  // 3. Updated keepDrawing: Erases the "old" preview and draws the "new" preview
  const keepDrawing = (e: React.MouseEvent<HTMLCanvasElement>, canvasRef: React.RefObject<HTMLCanvasElement | null>): void => {
    if (!isDrawing || canvasRef.current !== presentCanvasRef.current) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // For Line/Rect, we restore snapshots to clear the previous frame's temporary line
    if (tool !== 'BRUSH' && snapshots.current) {
      presentCanvasRef.current?.getContext('2d')?.putImageData(snapshots.current.present, 0, 0);
      pastCanvasRef.current?.getContext('2d')?.putImageData(snapshots.current.past, 0, 0);
      futureCanvasRef.current?.getContext('2d')?.putImageData(snapshots.current.future, 0, 0);
    }

    // Draw the current state of the shape (don't play sound while dragging)
    drawAtPoint(x, y, tool === 'BRUSH'); 
  };

  // 4. Updated stopDrawing: Finalizes the shape
  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (isDrawing && (tool === 'LINE' || tool === 'RECT')) {
      const rect = presentCanvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        playSound('draw'); // Play sound once when shape is finished
        drawAtPoint(x, y, false);
      }
    }
    setIsDrawing(false);
    startPos.current = null;
    snapshots.current = null;
  };

  // 5. Consolidated drawAtPoint
  const drawAtPoint = (x: number, y: number, shouldPlaySound: boolean): void => {
    const canvas = presentCanvasRef.current;
    if (!canvas) return;
    
    if (shouldPlaySound) playSound('draw');
    
    // Draw on Present
    draw(canvas, x, y, currentColor, brushSize, startPos.current);
    
    // Calculate and Draw Echoes
    const positions = applyTimeRule(x, y, canvas.width, canvas.height);
    let sPosEcho = null;
    
    if (startPos.current) {
      const sEcho = applyTimeRule(startPos.current.x, startPos.current.y, canvas.width, canvas.height);
      sPosEcho = sEcho;
    }
    
    if (pastCanvasRef.current) {
      draw(pastCanvasRef.current, positions.past.x, positions.past.y, currentColor, brushSize, sPosEcho?.past);
    }
    if (futureCanvasRef.current) {
      draw(futureCanvasRef.current, positions.future.x, positions.future.y, currentColor, brushSize, sPosEcho?.future);
    }
  };

  const clearCanvases = (): void => {
    [presentCanvasRef, pastCanvasRef, futureCanvasRef].forEach(ref => {
      const ctx = ref.current?.getContext('2d');
      if (ctx && ref.current) {
        ctx.clearRect(0, 0, ref.current.width, ref.current.height);
      }
    });
    setShowWin(false);
  };

  const checkWin = (): void => {
    const checkCanvas = (canvas: HTMLCanvasElement | null, targetCanvas: HTMLCanvasElement | null): boolean => {
      if (!canvas || !targetCanvas) return false;
      const ctx = canvas.getContext('2d');
      const targetCtx = targetCanvas.getContext('2d');
      if (!ctx || !targetCtx) return false;
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const targetData = targetCtx.getImageData(0, 0, canvas.width, canvas.height);
      
      let matchCount = 0;
      let targetPixels = 0;
      
      for (let i = 0; i < targetData.data.length; i += 4) {
        if (targetData.data[i + 3] > 0) {
          targetPixels++;
          if (imgData.data[i + 3] > 0) matchCount++;
        }
      }
      const matchRate = targetPixels > 0 ? (matchCount / targetPixels) : 0;
      return matchRate > 0.6; 
    };
    
    const pastMatch = checkCanvas(pastCanvasRef.current, pastTargetRef.current);
    const presentMatch = checkCanvas(presentCanvasRef.current, presentTargetRef.current);
    const futureMatch = checkCanvas(futureCanvasRef.current, futureTargetRef.current);
    
    if (pastMatch && presentMatch && futureMatch) {
      playSound('win');
      setShowWin(true);
    } else {
      alert(`Not quite! Keep trying!\nPast: ${pastMatch ? '✓' : '✗'}\nPresent: ${presentMatch ? '✓' : '✗'}\nFuture: ${futureMatch ? '✓' : '✗'}`);
    }
  };

  const nextLevel = (): void => {
    if (currentLevel < levels.length) {
      playSound('level');
      setCurrentLevel(currentLevel + 1);
      clearCanvases();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-3xl"></div>
          <div className="relative">
            <div className="inline-flex items-center gap-3 mb-4">
              <Sparkles className="w-10 h-10 text-yellow-400 animate-pulse" />
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Echo Painter
              </h1>
              <Sparkles className="w-10 h-10 text-yellow-400 animate-pulse" />
            </div>
            <div className="bg-black/30 backdrop-blur-sm inline-block px-6 py-3 rounded-full border border-white/10">
              <p className="text-blue-200 text-lg font-semibold">{levels[currentLevel - 1].name}</p>
              <p className="text-purple-300 text-sm mt-1 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Rule: {levels[currentLevel - 1].rule}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 max-w-xl mx-auto">
          <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-purple-500/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-700"
              style={{ width: `${(currentLevel / levels.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-purple-300 text-sm mt-2 font-semibold">
            Level {currentLevel} / {levels.length}
          </p>
        </div>

        {showWin && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl mb-6 text-center shadow-2xl border-4 border-green-300">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Award className="w-10 h-10 animate-bounce" />
              <span className="text-3xl font-black">Level Complete!</span>
              <Award className="w-10 h-10 animate-bounce" />
            </div>
            <p className="text-green-100 mb-4">Amazing work! You mastered the time flow!</p>
            {currentLevel < levels.length && (
              <button
                onClick={nextLevel}
                className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition-all shadow-lg"
              >
                Next Level →
              </button>
            )}
          </div>
        )}

        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-6 mb-8 shadow-2xl border border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                <Palette className="w-6 h-6 text-purple-400" />
                <span className="text-white font-semibold">Colors:</span>
              </div>
              <div className="flex gap-3">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setCurrentColor(color)}
                    className={`w-12 h-12 rounded-xl transition-all transform hover:scale-110 ${
                      currentColor === color
                        ? 'border-4 border-white scale-110 shadow-lg shadow-white/50'
                        : 'border-2 border-white/30 hover:border-white/60'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex gap-3">
                <button 
                    onClick={() => setTool('BRUSH')} 
                    className={`px-4 py-2 rounded-xl transition-all ${tool === 'BRUSH' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' : 'bg-slate-700 text-slate-300'}`}
                >
                  ✏️ Brush
                </button>
                <button 
                    onClick={() => setTool('LINE')} 
                    className={`px-4 py-2 rounded-xl transition-all ${tool === 'LINE' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' : 'bg-slate-700 text-slate-300'}`}
                >
                  📏 Line
                </button>
                <button 
                    onClick={() => setTool('RECT')} 
                    className={`px-4 py-2 rounded-xl transition-all ${tool === 'RECT' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' : 'bg-slate-700 text-slate-300'}`}
                >
                  ▭ Rectangle
                </button>
                <button 
                    onClick={() => setTool('CIRCLE')} 
                    className={`px-4 py-2 rounded-xl transition-all ${tool === 'CIRCLE' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' : 'bg-slate-700 text-slate-300'}`}
                >
                  o Circle
                </button>
              </div>
              <div className="flex items-center gap-3 bg-slate-700/50 px-4 py-2 rounded-xl">
                <span className="text-white text-sm font-medium">Size:</span>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-24 accent-purple-500"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={clearCanvases} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg font-semibold">
                  <RotateCcw className="w-5 h-5" /> Clear
                </button>
                <button onClick={checkWin} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg font-semibold">
                  <Play className="w-5 h-5" /> Check
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'PAST', ref: pastCanvasRef, targetRef: pastTargetRef, gradient: 'from-blue-500 to-blue-700', icon: '⏪', description: 'What happened before' },
            { title: 'PRESENT', ref: presentCanvasRef, targetRef: presentTargetRef, gradient: 'from-purple-500 to-purple-700', icon: '🎨', description: 'Draw here now!' },
            { title: 'FUTURE', ref: futureCanvasRef, targetRef: futureTargetRef, gradient: 'from-pink-500 to-pink-700', icon: '⏩', description: 'What will happen next' }
          ].map(({ title, ref, targetRef, gradient, icon, description }) => (
            <div key={title} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
              <div className={`bg-gradient-to-r ${gradient} py-4 px-6 rounded-2xl mb-4 shadow-lg`}>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl">{icon}</span>
                  <h3 className="text-white font-black text-2xl tracking-wide">{title}</h3>
                </div>
                <p className="text-white/80 text-sm text-center mt-1 font-medium">{description}</p>
              </div>
              <div className="mb-4">
                <div className="bg-white rounded-2xl p-3 shadow-inner">
                  <canvas ref={targetRef} width={150} height={160} className="border-2 border-gray-200 rounded-xl mx-auto" />
                </div>
              </div>
              <div>
                <div className={`bg-white rounded-2xl p-3 shadow-inner ${title === 'PRESENT' ? 'ring-4 ring-purple-500/50' : ''}`}>
                  <canvas
                    ref={ref}
                    width={150}
                    height={160}
                    onPointerDown={(e) => startDrawing(e as any, ref)}
                    onPointerMove={(e) => keepDrawing(e as any, ref)}
                    onPointerUp={(e) => stopDrawing(e as any)}
                    onPointerLeave={(e) => stopDrawing(e as any)}
                    className={`border-2 rounded-xl mx-auto transition-all ${
                      title === 'PRESENT' ? 'border-purple-500 cursor-crosshair' : 'border-gray-200 opacity-75'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EchoPainter;