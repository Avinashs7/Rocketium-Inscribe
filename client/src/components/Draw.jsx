import React, { useRef, useState, useEffect } from 'react';
import { Type, Square, Circle, Trash2, FileText, Download, ZoomIn, ZoomOut,PlusCircle,FileSearch } from 'lucide-react';
import axios from 'axios'
const SERVER_URL=import.meta.env.VITE_SERVER_URL;

export default function Draw() {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [tool, setTool] = useState('freeLine');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [fontSize, setFontSize] = useState('24');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [scale, setScale] = useState(1);
  const currentPathRef = useRef([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [showCanvas, setShowCanvas] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [drawingName, setDrawingName] = useState('');
  const [showFetchInput, setShowFetchInput] = useState(false);
  const [fetchDrawingName, setFetchDrawingName] = useState('');
  const [canvasId,setCanvasId]=useState('')
  
  const fonts = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Helvetica',
    'Tahoma',
    'Trebuchet MS',
  ];

  const handleUpdate=async()=>{
    if(canvasId.length>0 && canvasId.trim()){
      await axios.get(`${SERVER_URL}/api/v1/canvas/id/${canvasId}`)
      .then((data)=>{
        setDrawnShapes(data?.data?.data?.elements);
      })
      .catch(err=>{
        console.error(err);
      });
    }
  }

  useEffect(()=>{
    handleUpdate();
    redrawShapes();
  },[drawnShapes])

  useEffect(() => {
    const updateSize = () => {
      const width = Math.min(window.innerWidth * 0.8, 1200);
      const height = Math.min(window.innerHeight - 200, 800);
      setCanvasSize({ width, height });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.scale(scale, scale);
    
    setContext(ctx);
    redrawShapes();
  }, [drawnShapes, canvasSize, selectedColor, scale]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const getScaledCoordinates = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale
    };
  };

  const handleCreateClick = () => {
    setShowNameInput(true);
  };
  
  const handleNameSubmit = async() => {
    if (drawingName.trim() || fetchDrawingName.trim()) {
      try{
        if(showFetchInput){
          await axios.get(`${SERVER_URL}/api/v1/canvas/${fetchDrawingName}`)
          .then((data)=>{
            setDrawnShapes(data?.data?.data?.elements);
            setCanvasId(data?.data?.data?._id);
            setShowCanvas(true);
          })
          .catch((err)=>console.error(err));
        }
        else{
          await axios.post(`${SERVER_URL}/api/v1/canvas`,{
            name:drawingName
          }).then((data)=>{
            setCanvasId(data?.data?.data?._id);
            setShowCanvas(true);
          })
          .catch(err=>console.error(err));
        }
      }
      catch(err){
        console.error(err);
      }
    }
   
  };

  const handleCanvasClick = (e) => {
    if (tool !== 'text') return;
    const { x, y } = getScaledCoordinates(e);
    setStartX(x);
    setStartY(y);
    setIsTyping(true);
    setTextInput('');
  };

  const startDrawing = (e) => {
    if (tool === 'text') return;
    const { x, y } = getScaledCoordinates(e);
    setStartX(x);
    setStartY(y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || tool === 'text') return;
    const { x, y } = getScaledCoordinates(e);

    context.clearRect(0, 0, canvasSize.width / scale, canvasSize.height / scale);
    redrawShapes();

    if (tool === 'rectangle') {
      const width = x - startX;
      const height = y - startY;
      context.strokeRect(startX, startY, width, height);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
      context.beginPath();
      context.arc(startX, startY, radius, 0, Math.PI * 2);
      context.stroke();
    }
  };

  const stopDrawing = async(e) => {
    if (!isDrawing || tool === 'text') return;
    const { x, y } = getScaledCoordinates(e);
    if (tool === 'rectangle') {
      await axios.patch(`${SERVER_URL}/api/v1/canvas/${canvasId}`,{
          type: tool,
          x: startX,
          y: startY,
          width: x - startX,
          height: y - startY,
          color: selectedColor
      }).then((data)=>{
  
      })
      .catch(err=>console.error(err));
      setDrawnShapes(prev => [...prev, {
        type: 'rectangle',
        x: startX,
        y: startY,
        width: x - startX,
        height: y - startY,
        color: selectedColor
      }]);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
      await axios.patch(`${SERVER_URL}/api/v1/canvas/${canvasId}`,{
        type: 'circle',
        x: startX,
        y: startY,
        radius,
        color: selectedColor
      }).then((data)=>{
  
      })
      .catch(err=>console.error(err));
      setDrawnShapes(prev => [...prev, {
        type: 'circle',
        x: startX,
        y: startY,
        radius,
        color: selectedColor
      }]);
    }

    setIsDrawing(false);
    currentPathRef.current = [];
  };

  const clearCanvas = async() => {
    context.clearRect(0, 0, canvasSize.width / scale, canvasSize.height / scale);
    setDrawnShapes([]);
    await axios.delete(`${SERVER_URL}/api/v1/canvas/${canvasId}`).then((data)=>{

    })
    .catch((err)=>{
      console.error(err);
    })
    currentPathRef.current = [];
  };

  const redrawShapes = () => {
    if (!context) return;

    context.clearRect(0, 0, canvasSize.width / scale, canvasSize.height / scale);
    
    drawnShapes.forEach(shape => {
      context.beginPath();
      context.strokeStyle = shape.color;
      context.fillStyle = shape.color;

      if (shape.type === 'rectangle') {
        context.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === 'circle') {
        context.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        context.stroke();
      } else if (shape.type === 'text') {
        context.font = `${shape.fontSize}px ${shape.font}`;
        context.fillText(shape.text, shape.x, shape.y);
      }
    });
  };

  const handleTextInput = async() => {
    if (textInput.trim()) {
      
      const newShapes = [...drawnShapes, {
        type: 'text',
        x: startX,
        y: startY,
        text: textInput,
        font: selectedFont,
        fontSize,
        color: selectedColor
      }];

      setDrawnShapes(newShapes);
      
      if (context) {
        context.clearRect(0, 0, canvasSize.width / scale, canvasSize.height / scale);
        redrawShapes();
        context.beginPath();
        context.strokeStyle = newShapes.color;
        context.fillStyle = newShapes.color;
        context.font = `${newShapes.fontSize}px ${newShapes.font}`;
        context.fillText(newShapes.text, newShapes.x, newShapes.y);
      }
      await axios.patch(`${SERVER_URL}/api/v1/canvas/${canvasId}`,{
        type: 'text',
        x: startX,
        y: startY,
        text: textInput,
        font: selectedFont,
        fontSize,
        color: selectedColor
      })
      .then((data)=>{

      }).catch(err=>console.error(err));
    }
    setIsTyping(false);
    setTextInput('');
  };

  const exportAsSVG = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', canvasRef.current.width);
    svg.setAttribute('height', canvasRef.current.height);
    
    drawnShapes.forEach((shape) => {
      if (shape.type === 'text') {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', shape.x);
        text.setAttribute('y', shape.y);
        text.setAttribute('font-family', shape.font);
        text.setAttribute('font-size', shape.fontSize);
        text.setAttribute('fill', shape.color);
        text.textContent = shape.text;
        svg.appendChild(text);
      } else if (shape.type === 'rectangle') {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', shape.x);
        rect.setAttribute('y', shape.y);
        rect.setAttribute('width', shape.width);
        rect.setAttribute('height', shape.height);
        rect.setAttribute('stroke', shape.color);
        rect.setAttribute('fill', 'none');
        svg.appendChild(rect);
      } else if (shape.type === 'circle') {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', shape.x);
        circle.setAttribute('cy', shape.y);
        circle.setAttribute('r', shape.radius);
        circle.setAttribute('stroke', shape.color);
        circle.setAttribute('fill', 'none');
        svg.appendChild(circle);
      } else if (shape.type === 'freeLine') {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d = `M ${shape.points[0].x} ${shape.points[0].y}`;
        shape.points.forEach((point) => {
          d += ` L ${point.x} ${point.y}`;
        });
        path.setAttribute('d', d);
        path.setAttribute('stroke', shape.color);
        path.setAttribute('fill', 'none');
        svg.appendChild(path);
      }
    });

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'drawing.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadAsPNG = () => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;
    const tempContext = tempCanvas.getContext('2d');
  
    tempContext.fillStyle = 'white';
    tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  
    tempContext.drawImage(canvasRef.current, 0, 0);
  
    const link = document.createElement('a');
    link.href = tempCanvas.toDataURL('image/png');
    link.download = 'drawing.png';
    link.click();
  
    tempCanvas.remove();
  };

    return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!showCanvas && (
      <div className="flex-1 flex items-center justify-center">
        {(!showNameInput && !showFetchInput) ? (
          <>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
            >
            <PlusCircle className="w-5 h-5" />
            <span className="text-lg font-medium">Create New Canvas</span>
          </button>
          <button
          onClick={() => {setShowFetchInput(true);}}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
          >
          <FileSearch className="w-5 h-5" />
          <span className="text-lg font-medium">Load Existing Canvas</span>
        </button>
          </>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            {showFetchInput && 
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Fetch Drawing Name</h2>}
            {showNameInput&&
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Name Your Drawing</h2>}
            <div className="space-y-4">
              <input
                type="text"
                value={ showFetchInput? fetchDrawingName : drawingName}
                onChange={(e) => {
                  showFetchInput?
                  setFetchDrawingName(e.target.value):
                  setDrawingName(e.target.value)
                }}
                placeholder="Enter drawing name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && drawingName.trim()) {
                    handleNameSubmit();
                  }
                }}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {showFetchInput?setShowFetchInput(false):setShowNameInput(false)}}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                {
                  showFetchInput?
                <button
                  onClick={handleNameSubmit}
                  disabled={!fetchDrawingName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Fetch
                </button>
                  :
                <button
                  onClick={handleNameSubmit}
                  disabled={!drawingName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Create
                </button>
                }
              </div>
            </div>
          </div>
        )}
      </div>
    )}
  {showCanvas && (
     <>
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
              <button
                onClick={() => setTool('text')}
                className={`p-2 rounded-lg transition-colors ${
                  tool === 'text' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                <Type className="w-6 h-6" />
              </button>
              <button
                onClick={() => setTool('rectangle')}
                className={`p-2 rounded-lg transition-colors ${
                  tool === 'rectangle' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                <Square className="w-6 h-6" />
              </button>
              <button
                onClick={() => setTool('circle')}
                className={`p-2 rounded-lg transition-colors ${
                  tool === 'circle' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                <Circle className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="p-2 border rounded-lg bg-white"
              >
                {fonts.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
              
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="p-2 w-20 border rounded-lg bg-white"
                min="10"
                max="72"
              />

              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ZoomOut className="w-6 h-6" />
              </button>
              <span className="text-sm font-medium">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ZoomIn className="w-6 h-6" />
              </button>
            </div>

            <button
              onClick={clearCanvas}
              className="p-2 rounded-lg hover:bg-red-100 text-red-600"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportAsSVG}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span>Save SVG</span>
            </button>
            <button
              onClick={downloadAsPNG}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Save PNG</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 flex justify-center items-center bg-gray-200">
        <div className="relative bg-white rounded-lg shadow-lg">
          <canvas
            ref={canvasRef}
            className="rounded-lg"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onClick={handleCanvasClick}
          />
          {isTyping && (
            <div
              className="absolute"
              style={{
                top: startY * scale,
                left: startX * scale,
              }}
            >
              <input
                type="text"
                className="p-1 border rounded"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onBlur={handleTextInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTextInput();
                  }
                }}
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
}