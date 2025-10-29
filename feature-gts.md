import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Zap, MapPin, Brain, TrendingUp, Users, Code, Send, Mail, CheckCircle, Map, Layers, Activity } from 'lucide-react';

// Estilos CSS personalizados
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  html {
    scroll-behavior: smooth;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
    50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.9); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-custom {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  @keyframes mapFlow {
    0% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
    50% { opacity: 0.6; }
    100% { transform: translateX(100%) rotate(0deg); opacity: 0.3; }
  }
  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }
  @keyframes ping {
    75%, 100% { transform: scale(2); opacity: 0; }
  }
  @keyframes scan-line {
    0%, 100% { top: 0%; }
    50% { top: 50%; }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  .animate-glow {
    animation: glow 2s ease-in-out infinite;
  }
  .animate-pulse-custom {
    animation: pulse-custom 2s ease-in-out infinite;
  }
  .animate-map-flow {
    animation: mapFlow 6s linear infinite;
  }
  .animate-grid {
    animation: gridMove 8s linear infinite;
  }
  .animate-ping {
    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  .scan-line {
    animation: scan-line 3s ease-in-out infinite;
  }
  .gis-grid {
    background-image: 
      linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
      linear-gradient(0deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
  }
  .hexagon {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
  .gis-layer {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(34, 197, 94, 0.05) 50%, rgba(168, 85, 247, 0.05) 100%);
  }
`;
document.head.appendChild(styleSheet);

// Componente de Mapa GIS Interactivo - Opción 1: Capas Dinámicas + Opción 2: Heatmap
const GISMapVisualization = () => {
  const [layers, setLayers] = useState([
    { id: 1, name: 'Topografía', active: true, color: 'rgb(59, 130, 246)', icon: '🏔️' },
    { id: 2, name: 'Uso de Suelo', active: true, color: 'rgb(34, 197, 94)', icon: '🌱' },
    { id: 3, name: 'Cobertura Vegetal', active: false, color: 'rgb(168, 85, 247)', icon: '🌲' },
    { id: 4, name: 'Infraestructura', active: false, color: 'rgb(245, 158, 11)', icon: '🏗️' },
    { id: 5, name: 'Riesgos', active: false, color: 'rgb(239, 68, 68)', icon: '⚠️' }
  ]);

  const [viewMode, setViewMode] = useState('layers'); // 'layers' o 'heatmap'

  const toggleLayer = (layerId) => {
    setLayers(layers.map(layer => 
      layer.id === layerId ? {...layer, active: !layer.active} : layer
    ));
  };

  const getLayerStyle = (layer) => {
    if (!layer.active) return null;
    if (layer.id === 1) return { d: "M 10 100 Q 100 50, 200 100 T 400 100", strokeWidth: 2 };
    if (layer.id === 2) return { d: "M 20 150 Q 120 80, 220 150 T 420 150", strokeWidth: 2 };
    if (layer.id === 3) return { d: "M 30 200 Q 130 120, 230 200 T 430 200", strokeWidth: 2 };
    if (layer.id === 4) return { d: "M 50 120 L 150 120 L 150 220 L 50 220 Z", strokeWidth: 1.5 };
    if (layer.id === 5) return { d: "M 250 80 Q 280 100, 250 120 Q 220 100, 250 80", strokeWidth: 2 };
  };

  const dataPoints = [
    { x: 20, y: 30, intensity: 9, label: 'Zona A - Alta' },
    { x: 60, y: 40, intensity: 6, label: 'Zona B - Media' },
    { x: 80, y: 70, intensity: 7, label: 'Zona C - Media-Alta' },
    { x: 45, y: 80, intensity: 8, label: 'Zona D - Alta' },
  ];

  const getHeatmapColor = (intensity) => {
    if (intensity >= 8) return { fill: 'rgb(239, 68, 68)', label: 'Muy Alta' };
    if (intensity >= 6) return { fill: 'rgb(245, 158, 11)', label: 'Alta' };
    return { fill: 'rgb(34, 197, 94)', label: 'Media' };
  };

  return (
    <div className="space-y-4">
      {/* Selector de Modo */}
      <div className="flex gap-2 bg-slate-800/50 border border-blue-400/30 rounded-lg p-2">
        <button
          onClick={() => setViewMode('layers')}
          className={`flex-1 px-3 py-2 rounded transition text-sm font-semibold ${
            viewMode === 'layers' 
              ? 'bg-blue-500 text-white' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          📍 Capas Dinámicas
        </button>
        <button
          onClick={() => setViewMode('heatmap')}
          className={`flex-1 px-3 py-2 rounded transition text-sm font-semibold ${
            viewMode === 'heatmap' 
              ? 'bg-blue-500 text-white' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          🔥 Mapa de Calor
        </button>
      </div>

      {/* Mapa Principal */}
      <div className="relative w-full h-96 bg-slate-900/50 border border-blue-400/30 rounded-2xl overflow-hidden group">
        {/* Fondo Grid GIS */}
        <div className="absolute inset-0 gis-grid opacity-50"></div>

        {/* Vista de Capas Dinámicas */}
        {viewMode === 'layers' && (
          <>
            <svg className="absolute inset-0 w-full h-full" style={{opacity: 0.6}}>
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5"/>
                  <stop offset="50%" stopColor="rgb(34, 197, 94)" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.5"/>
                </linearGradient>
              </defs>
              
              {/* Renderizar capas activas */}
              {layers.map((layer) => {
                const style = getLayerStyle(layer);
                return layer.active && style ? (
                  <path 
                    key={layer.id}
                    d={style.d} 
                    stroke={layer.color} 
                    strokeWidth={style.strokeWidth} 
                    fill="none"
                    opacity="0.7"
                    className="transition-all"
                  />
                ) : null;
              })}

              {/* Puntos de datos */}
              {layers.find(l => l.id === 2 && l.active) && dataPoints.map((point, idx) => (
                <g key={idx}>
                  <circle cx={`${point.x}%`} cy={`${point.y}%`} r="5" fill="rgb(59, 130, 246)" opacity="0.7"/>
                  <circle cx={`${point.x}%`} cy={`${point.y}%`} r="10" fill="none" stroke="rgb(34, 211, 238)" strokeWidth="2" className="animate-ping"/>
                </g>
              ))}
            </svg>

            {/* Marcador central */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 hidden group-hover:block">
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="w-4 h-4 bg-cyan-400 rounded-full absolute top-0 left-0"></div>
            </div>
          </>
        )}

        {/* Vista de Mapa de Calor */}
        {viewMode === 'heatmap' && (
          <svg className="absolute inset-0 w-full h-full">
            {/* Grid de fondo suave */}
            <defs>
              <radialGradient id="heatmapGrad">
                <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="rgb(245, 158, 11)" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.2"/>
              </radialGradient>
            </defs>

            {/* Puntos del Heatmap con radios según intensidad */}
            {dataPoints.map((point, idx) => {
              const color = getHeatmapColor(point.intensity);
              const radius = 50 + (point.intensity * 8);
              
              return (
                <g key={idx}>
                  {/* Anillos concéntricos */}
                  <circle 
                    cx={`${point.x}%`} 
                    cy={`${point.y}%`} 
                    r={radius * 1.5} 
                    fill={color.fill} 
                    opacity="0.15"
                  />
                  <circle 
                    cx={`${point.x}%`} 
                    cy={`${point.y}%`} 
                    r={radius} 
                    fill={color.fill} 
                    opacity="0.4"
                  />
                  <circle 
                    cx={`${point.x}%`} 
                    cy={`${point.y}%`} 
                    r={radius * 0.5} 
                    fill={color.fill} 
                    opacity="0.8"
                  />
                  
                  {/* Punto central */}
                  <circle 
                    cx={`${point.x}%`} 
                    cy={`${point.y}%`} 
                    r="6" 
                    fill={color.fill}
                    className="animate-pulse"
                  />
                </g>
              );
            })}

            {/* Efecto de texto en puntos (hover) */}
            {dataPoints.map((point, idx) => (
              <text 
                key={`label-${idx}`}
                x={`${point.x}%`} 
                y={`${point.y + 10}%`} 
                textAnchor="middle"
                className="text-xs fill-white opacity-0 group-hover:opacity-100 transition-opacity"
                fontSize="10"
                fontWeight="bold"
              >
                {point.intensity}
              </text>
            ))}
          </svg>
        )}

        {/* Overlay de efecto scaneo */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent scan-line opacity-30"></div>

        {/* Info de ubicación */}
        <div className="absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur border border-blue-400/50 rounded-lg p-3 z-10 text-xs">
          <p className="text-slate-300">
            <span className="text-blue-400 font-bold">GIS Analytics</span><br/>
            {viewMode === 'layers' ? 'Capas Temáticas' : 'Densidad de Datos'}
          </p>
        </div>

        {/* Leyenda dinámica */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 sm:gap-4 text-xs z-10 max-w-xs">
          {viewMode === 'layers' ? (
            layers.filter(l => l.active).map(layer => (
              <div key={layer.id} className="flex items-center gap-1.5 bg-slate-800/70 px-2 py-1 rounded">
                <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: layer.color}}></div>
                <span className="text-slate-300 text-xs truncate">{layer.name}</span>
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center gap-1.5 bg-slate-800/70 px-2 py-1 rounded">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="text-slate-300">Muy Alta</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/70 px-2 py-1 rounded">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <span className="text-slate-300">Alta</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/70 px-2 py-1 rounded">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-slate-300">Media</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Selector de Capas */}
      {viewMode === 'layers' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={`p-2 sm:p-3 rounded-lg transition-all border-2 text-xs sm:text-sm font-semibold flex items-center gap-1.5 ${
                layer.active 
                  ? 'border-blue-400 bg-blue-500/20 text-blue-300' 
                  : 'border-slate-600 bg-slate-800/50 text-slate-400 hover:border-blue-400/50'
              }`}
            >
              <span className="text-base">{layer.icon}</span>
              <span className="truncate">{layer.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Estadísticas del Heatmap */}
      {viewMode === 'heatmap' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {dataPoints.map((point, idx) => (
            <div 
              key={idx}
              className="bg-slate-800/50 border border-blue-400/30 rounded-lg p-2 text-xs text-center hover:border-blue-400/60 transition"
            >
              <div className="font-bold text-blue-300">{point.label}</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{backgroundColor: getHeatmapColor(point.intensity).fill}}
                ></div>
                <span className="text-slate-300">{point.intensity}/10</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente de AI + GIS Convergence
const AIGISConvergence = () => {
  const [activeTab, setActiveTab] = useState('gis');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
      {/* GIS Side */}
      <div className="space-y-4">
        <div 
          onClick={() => setActiveTab('gis')}
          className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 ${
            activeTab === 'gis' 
              ? 'border-blue-400 bg-blue-500/10' 
              : 'border-slate-600 bg-slate-800/50 hover:border-blue-400/50'
          }`}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-blue-500/20 rounded-lg flex-shrink-0">
              <Map className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-xl font-bold mb-2">GIS - Inteligencia Espacial</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                Datos geoespaciales en tiempo real. Satélites, drones y sensores para mapeo de precisión.
              </p>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <span>Levantamientos Topográficos</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <span>Modelos Digitales 3D</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <span>Análisis Catastral</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Side */}
      <div className="space-y-4">
        <div 
          onClick={() => setActiveTab('ai')}
          className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 ${
            activeTab === 'ai' 
              ? 'border-cyan-400 bg-cyan-500/10' 
              : 'border-slate-600 bg-slate-800/50 hover:border-cyan-400/50'
          }`}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-cyan-500/20 rounded-lg flex-shrink-0">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-xl font-bold mb-2">IA - Inteligencia Artificial</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                Machine learning aplicado a datos geoespaciales. Automatización de análisis y predicción.
              </p>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"></div>
                  <span>Clasificación Automática</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"></div>
                  <span>Análisis Predictivo</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"></div>
                  <span>Detección de Anomalías</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Página Geomatrix GTS
const GeomatrixGTSPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white">
      {/* Botón volver */}
      <div className="fixed top-24 left-4 z-40">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-4 py-2 bg-green-500/20 border border-green-400/50 rounded-lg hover:bg-green-500/30 transition text-sm flex items-center gap-2 group"
        >
          <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition rotate-180" />
          Volver al inicio
        </button>
      </div>

      {/* Header GTS */}
      <section className="pt-32 sm:pt-40 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-green-500/10 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 sm:px-6 py-3 sm:py-4 bg-green-500/20 border border-green-400/50 rounded-full mb-6 animate-bounce">
            <span className="text-sm sm:text-base text-green-300 font-semibold flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Sistema GPS/GPRS en Tiempo Real
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Geomatrix <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">GTS</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Solución integral de rastreo satelital para administración y control de flotas vehiculares
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <div className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition text-sm sm:text-base">
              🎯 Localización Exacta
            </div>
            <div className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition text-sm sm:text-base">
              🔔 Alertas en Tiempo Real
            </div>
            <div className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition text-sm sm:text-base">
              📊 Reportes Históricos
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-20">
            {/* Rastreo en Tiempo Real */}
            <div className="bg-slate-800/50 border border-green-400/30 rounded-lg sm:rounded-2xl p-6 sm:p-8 hover:border-green-400/60 transition">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl">📍</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-green-300">Rastreo en Tiempo Real</h3>
              <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
                Localización exacta de su vehículo o flotilla en nuestro sistema totalmente web, permitiendo rastrear su vehículo en tiempo real las 24 horas del día.
              </p>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Acceso desde cualquier dispositivo
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Batería de repuesto hasta 24 horas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Precisión GPS/GPRS
                </li>
              </ul>
            </div>

            {/* Alertas y Notificaciones */}
            <div className="bg-slate-800/50 border border-green-400/30 rounded-lg sm:rounded-2xl p-6 sm:p-8 hover:border-green-400/60 transition">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl">🔔</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-green-300">Alertas y Notificaciones</h3>
              <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
                Geomatrix GTS proporciona notificaciones web instantáneas junto con soporte para correo electrónico y SMS.
              </p>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Velocidad excedida
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Detección de paradas no autorizadas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Alertas por baja batería
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Notificación de fraude
                </li>
              </ul>
            </div>

            {/* Reportes */}
            <div className="bg-slate-800/50 border border-green-400/30 rounded-lg sm:rounded-2xl p-6 sm:p-8 hover:border-green-400/60 transition">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl">📋</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-green-300">Reportes Históricos</h3>
              <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
                Acceso a reportes sencillos de historial de ubicaciones, viajes, gráficos y resúmenes con almacenamiento de hasta 12 meses.
              </p>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Consumo de combustible
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Mantenimiento automático
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Reproducción de registros
                </li>
              </ul>
            </div>

            {/* Seguridad */}
            <div className="bg-slate-800/50 border border-green-400/30 rounded-lg sm:rounded-2xl p-6 sm:p-8 hover:border-green-400/60 transition">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl">🔒</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-green-300">Seguridad</h3>
              <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
                Nuestro sistema facilita la detección de fraudes como uso sin autorización, kilometraje incorrecto y monitoreo en movimiento.
              </p>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Detección de fraudes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Autorización requerida
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Rastreo 24/7
                </li>
              </ul>
            </div>

            {/* Almacenamiento */}
            <div className="bg-slate-800/50 border border-green-400/30 rounded-lg sm:rounded-2xl p-6 sm:p-8 hover:border-green-400/60 transition">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl">💾</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-green-300">Almacenamiento</h3>
              <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
                Capacidad de almacenamiento de datos hasta 12 meses para análisis histórico y auditoría.
              </p>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> 12 meses de histórico
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Backup automático
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Acceso a cualquier momento
                </li>
              </ul>
            </div>

            {/* Geofences */}
            <div className="bg-slate-800/50 border border-green-400/30 rounded-lg sm:rounded-2xl p-6 sm:p-8 hover:border-green-400/60 transition">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl">🗺️</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-green-300">Geofences</h3>
              <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
                Delimitación de zonas de trabajo y rutas específicas para control de operaciones.
              </p>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Zonas de trabajo
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Rutas específicas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Alertas de límites
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 rounded-lg sm:rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-green-300">¿Listo para Optimizar tu Flota?</h2>
            <p className="text-slate-300 text-sm sm:text-base mb-8">
              Ponte en contacto con nuestro equipo para obtener más información y demostración.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg font-bold hover:shadow-lg hover:shadow-green-500/50 transition">
              Solicitar Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default function TrixLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [emailSent, setEmailSent] = useState(false);
  const [showGTSPage, setShowGTSPage] = useState(false);

  const handleSendEmail = () => {
    const mailtoLink = `mailto:info@trixgeo.com?subject=Consulta desde TRIX - ${formData.name}&body=Nombre: ${formData.name}%0DEmail: ${formData.email}%0D%0DMensaje:%0D${formData.message}`;
    window.location.href = mailtoLink;
    setEmailSent(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setEmailSent(false);
    }, 3000);
  };

  const services = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Geomática de Precisión",
      description: "Levantamientos topográficos, cartografía, modelos digitales del terreno y geoprocesamientos avanzados."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Inteligencia Espacial + IA",
      description: "Sistemas de información geográfica con algoritmos de machine learning para análisis predictivo."
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Soluciones Tecnológicas",
      description: "Plataformas geomáticas, aplicaciones móvil/GPS, geoportales y software como servicio."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Gestión de Proyectos",
      description: "Supervisión, fiscalización y evaluación de proyectos con metodologías integradas."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Consultoría Estratégica",
      description: "Asesoría en planificación territorial, estudios ambientales y ordenamiento urbano."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Representación de Marcas",
      description: "Distribución de tecnología de vanguardia y equipamiento geomático especializado."
    }
  ];

  const expertise = [
    "Estudios Ambientales y Socioeconómicos",
    "Planificación Territorial y Urbana",
    "Sistemas de Información Geográfica (SIG)",
    "Rastreo Satelital y Monitoreo",
    "Catastro y Mediciones de Precisión",
    "Análisis de Datos Espaciales"
  ];

  const story = [
    {
      title: "Pasado: 20 años de Excelencia",
      description: "Geomatrix consolidó un legado de innovación en geomática e inteligencia espacial, posicionándose como referente en soluciones territoriales."
    },
    {
      title: "Presente: Evolución Necesaria",
      description: "Reconociendo los cambios del mercado, la necesidad de modernización y la importancia de la tecnología, surge Trix como relanzamiento estratégico."
    },
    {
      title: "Futuro: Trix - Nuevas Posibilidades",
      description: "Con nueva administración, tecnología de punta e inteligencia artificial, Trix amplía alcances y genera ingresos recurrentes."
    }
  ];

  if (showGTSPage) {
    return (
      <>
        <GeomatrixGTSPage />
        <div className="fixed top-24 left-4 sm:left-8 z-50">
          <button
            onClick={() => setShowGTSPage(false)}
            className="px-4 py-2 bg-slate-800/90 border border-slate-400/50 rounded-lg hover:bg-slate-700/90 transition text-sm flex items-center gap-2 group"
          >
            <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition rotate-180" />
            ← Volver
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Maintenance Banner */}
      <div className="bg-amber-500/10 border-b-2 border-amber-500/50 backdrop-blur-sm fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-amber-400 rounded-full animate-pulse"></div>
            <p className="text-amber-200 text-xs sm:text-sm md:text-base font-medium text-center">
              🚀 <span className="font-bold">Estamos trabajando en nuestra web</span>
            </p>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-amber-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full bg-slate-900/95 backdrop-blur-md z-40 border-b border-blue-500/30 top-11 sm:top-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-lg flex items-center justify-center font-bold text-slate-900 animate-glow text-xs sm:text-sm">
                TX
              </div>
              <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                TRIX
              </span>
            </div>
            
            <div className="hidden md:flex gap-6 lg:gap-8">
              <a href="#gis" className="text-sm hover:text-blue-400 transition">GIS + AI</a>
              <a href="#products" className="text-sm hover:text-green-400 transition">Productos</a>
              <a href="#services" className="text-sm hover:text-blue-400 transition">Servicios</a>
              <a href="#contact" className="text-sm hover:text-blue-400 transition">Contacto</a>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-1">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pb-4 flex flex-col gap-3 bg-slate-900/50 rounded-b-lg px-4 py-2">
              <a href="#gis" className="hover:text-blue-400 transition text-sm" onClick={() => setIsMenuOpen(false)}>GIS + AI</a>
              <a href="#products" className="hover:text-green-400 transition text-sm" onClick={() => setIsMenuOpen(false)}>Productos</a>
              <a href="#services" className="hover:text-blue-400 transition text-sm" onClick={() => setIsMenuOpen(false)}>Servicios</a>
              <a href="#contact" className="hover:text-blue-400 transition text-sm" onClick={() => setIsMenuOpen(false)}>Contacto</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with GIS Background */}
      <section className="pt-32 sm:pt-40 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden mt-2">
        {/* Animated GIS Map Background - Hidden on mobile */}
        <div className="hidden sm:block absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1000 600">
            {/* Grid pattern */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgb(59, 130, 246)" strokeWidth="0.5"/>
              </pattern>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3"/>
                <stop offset="50%" stopColor="rgb(34, 197, 94)" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <rect width="1000" height="600" fill="url(#grid)"/>
            
            {/* Topographic lines */}
            <path d="M 0 150 Q 250 100 500 150 T 1000 150" stroke="url(#gradient)" strokeWidth="2" fill="none"/>
            <path d="M 0 250 Q 250 200 500 250 T 1000 250" stroke="url(#gradient)" strokeWidth="2" fill="none"/>
            <path d="M 0 350 Q 250 300 500 350 T 1000 350" stroke="url(#gradient)" strokeWidth="2" fill="none"/>
            
            {/* Data points */}
            <circle cx="200" cy="150" r="8" fill="rgb(59, 130, 246)" opacity="0.6"/>
            <circle cx="500" cy="250" r="8" fill="rgb(34, 197, 94)" opacity="0.6"/>
            <circle cx="800" cy="350" r="8" fill="rgb(168, 85, 247)" opacity="0.6"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="inline-block px-3 sm:px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-full mb-4 sm:mb-6 animate-bounce">
                <span className="text-xs sm:text-sm text-blue-300 flex items-center gap-2">
                  <Map className="w-3 h-3 sm:w-4 sm:h-4" /> Geomática + IA
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Tecnología para la <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Humanidad</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 leading-relaxed">
                Trix combina geomática con IA para resolver desafíos territoriales. Mapeo, análisis y predicción en tiempo real.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
                <a href="#gis" className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition flex items-center justify-center gap-2 animate-float text-sm sm:text-base group">
                  <span>GIS + IA</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
                <a href="#products" className="px-6 sm:px-8 py-2 sm:py-3 border border-green-400/50 rounded-lg font-semibold hover:bg-green-500/10 transition text-center text-sm sm:text-base">
                  Productos
                </a>
                <a href="#contact" className="px-6 sm:px-8 py-2 sm:py-3 border border-cyan-400/50 rounded-lg font-semibold hover:bg-cyan-500/10 transition text-center text-sm sm:text-base">
                  Contactanos
                </a>
              </div>
            </div>

            <div className="relative hidden md:block">
              <GISMapVisualization />
            </div>
          </div>

          {/* Mobile GIS Map - Smaller version */}
          <div className="md:hidden mt-8 relative">
            <div className="h-64 sm:h-80 bg-slate-900/50 border border-blue-400/30 rounded-xl overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                <defs>
                  <linearGradient id="gradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.2"/>
                  </linearGradient>
                </defs>
                <path d="M 0 80 Q 100 50 200 80 T 400 80" stroke="url(#gradient-mobile)" strokeWidth="2" fill="none"/>
                <path d="M 0 130 Q 100 100 200 130 T 400 130" stroke="url(#gradient-mobile)" strokeWidth="2" fill="none"/>
                <path d="M 0 180 Q 100 150 200 180 T 400 180" stroke="url(#gradient-mobile)" strokeWidth="2" fill="none"/>
                <circle cx="80" cy="80" r="5" fill="rgb(59, 130, 246)" opacity="0.6"/>
                <circle cx="200" cy="130" r="5" fill="rgb(34, 197, 94)" opacity="0.6"/>
                <circle cx="320" cy="180" r="5" fill="rgb(168, 85, 247)" opacity="0.6"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* GIS + AI Section */}
      <section id="gis" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <Layers className="w-6 sm:w-10 h-6 sm:h-10 text-blue-400" />
              <span>GIS + IA: Nicho Principal</span>
              <Brain className="w-6 sm:w-10 h-6 sm:h-10 text-cyan-400" />
            </h2>
            <p className="text-base sm:text-xl text-slate-300 px-2">La convergencia de inteligencia espacial e IA</p>
          </div>

          <AIGISConvergence />

          {/* Integration visualization */}
          <div className="mt-12 sm:mt-16 grid md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-slate-900/50 border border-blue-400/30 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-blue-400/60 transition">
              <Activity className="w-10 sm:w-12 h-10 sm:h-12 text-blue-400 mx-auto mb-3 sm:mb-4 animate-pulse"/>
              <h3 className="font-bold mb-2 text-sm sm:text-base">Captura en Tiempo Real</h3>
              <p className="text-xs sm:text-sm text-slate-400">Drones, satélites y sensores</p>
            </div>
            <div className="bg-slate-900/50 border border-cyan-400/30 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-cyan-400/60 transition">
              <Brain className="w-10 sm:w-12 h-10 sm:h-12 text-cyan-400 mx-auto mb-3 sm:mb-4 animate-pulse"/>
              <h3 className="font-bold mb-2 text-sm sm:text-base">Procesamiento IA</h3>
              <p className="text-xs sm:text-sm text-slate-400">Machine learning analiza patrones</p>
            </div>
            <div className="bg-slate-900/50 border border-green-400/30 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-green-400/60 transition">
              <TrendingUp className="w-10 sm:w-12 h-10 sm:h-12 text-green-400 mx-auto mb-3 sm:mb-4 animate-pulse"/>
              <h3 className="font-bold mb-2 text-sm sm:text-base">Decisiones Accionables</h3>
              <p className="text-xs sm:text-sm text-slate-400">Reportes y recomendaciones</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <Code className="w-6 sm:w-10 h-6 sm:h-10 text-green-400" />
              <span>Productos Destacados</span>
              <Zap className="w-6 sm:w-10 h-6 sm:h-10 text-green-400" />
            </h2>
            <p className="text-base sm:text-xl text-slate-300 px-2">Soluciones tecnológicas potenciadas con IA</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Producto GTS */}
            <button
              onClick={() => setShowGTSPage(true)}
              className="group relative overflow-hidden rounded-lg sm:rounded-2xl border-2 border-green-400/30 hover:border-green-400/80 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 cursor-pointer hover:scale-105 text-left"
            >
              <div className="bg-gradient-to-br from-green-900/30 to-slate-900/50 p-6 sm:p-8 h-full">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition">
                      <div className="text-2xl sm:text-3xl">🗺️</div>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-bold text-green-300 mb-2">Geomatrix GTS</h3>
                  </div>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 group-hover:translate-x-2 transition" />
                </div>
                
                <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
                  Sistema de rastreo satelital GPS/GPRS para administración de flotas vehiculares en tiempo real.
                </p>

                <div className="space-y-2 text-xs sm:text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>Localización exacta en tiempo real</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>Alertas web y SMS instantáneas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>Reportes históricos de 12 meses</span>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-green-400/30">
                  <span className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg font-semibold text-sm sm:text-base inline-block group-hover:shadow-lg group-hover:shadow-green-500/50 transition">
                    Ver Detalles →
                  </span>
                </div>
              </div>
            </button>

            {/* Próximos productos */}
            <div className="bg-slate-800/50 border-2 border-slate-600/50 rounded-lg sm:rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl sm:text-4xl">🚀</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-300">Más Productos</h3>
              <p className="text-slate-400 text-sm sm:text-base">
                Nuevas soluciones geomáticas potenciadas con IA en desarrollo...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Nuestra Evolución</h2>
            <p className="text-base sm:text-xl text-slate-300 px-2">De Geomatrix a Trix: Legado reimaginado</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {story.map((item, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-blue-400/30 rounded-lg sm:rounded-xl p-4 sm:p-8 hover:border-blue-400/60 transition hover:scale-105 duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2 sm:mb-3 animate-float">{idx + 1}</div>
                <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-slate-300 text-sm sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Nuestros Servicios</h2>
            <p className="text-base sm:text-xl text-slate-300 px-2">Soluciones completas en geomática e IA</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 border border-blue-400/20 rounded-lg sm:rounded-xl p-4 sm:p-8 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/20 transition group cursor-pointer hover:scale-105 duration-300"
              >
                <div className="text-blue-400 mb-3 sm:mb-4 group-hover:scale-110 transition group-hover:animate-float">
                  {service.icon}
                </div>
                <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3">{service.title}</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">Áreas de Expertise</h2>
              <p className="text-base sm:text-lg text-slate-300 mb-6 sm:mb-8">
                Con dos décadas en geomática, potenciamos soluciones con inteligencia artificial.
              </p>
              
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {expertise.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 sm:gap-3 hover:translate-x-2 transition duration-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-1 sm:mt-2 flex-shrink-0 animate-pulse"></div>
                    <span className="text-slate-200 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg sm:rounded-2xl p-6 sm:p-8 hover:border-blue-400/60 transition animate-glow">
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center hover:scale-110 transition duration-300">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2 animate-float">20+</div>
                  <div className="text-slate-300 text-sm sm:text-base">Años de Experiencia</div>
                </div>
                <div className="text-center hover:scale-110 transition duration-300">
                  <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2 animate-float">100+</div>
                  <div className="text-slate-300 text-sm sm:text-base">Proyectos Completados</div>
                </div>
                <div className="text-center hover:scale-110 transition duration-300">
                  <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2 animate-float">∞</div>
                  <div className="text-slate-300 text-sm sm:text-base">Posibilidades con IA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-lg sm:rounded-2xl p-6 sm:p-12 text-center hover:border-blue-400/60 transition hover:shadow-lg hover:shadow-blue-500/20 duration-300">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 animate-bounce">Nuestra Brújula</h2>
            <p className="text-base sm:text-xl text-slate-200 mb-6 sm:mb-8 leading-relaxed px-2">
              Así como la brújula ha orientado a la humanidad durante milenios, nuestro compromiso es utilizar geomática e IA como herramientas para resolver desafíos territoriales.
            </p>
            <p className="text-base sm:text-lg text-blue-300 font-semibold">
              🧭 Tecnología al servicio de la humanidad.
            </p>
          </div>
        </div>
      </section>

      {/* Under Construction Notice with Contact Form */}
      <section id="contact" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-y border-amber-500/30 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{animationDelay: '1s'}}></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block px-3 sm:px-4 py-2 bg-amber-500/20 border border-amber-400/50 rounded-full mb-4 sm:mb-6 animate-bounce">
              <span className="text-xs sm:text-sm text-amber-300 font-semibold">⚙️ EN MANTENIMIENTO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Rediseñando Nuestra Plataforma
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-4 sm:mb-6 leading-relaxed px-2">
              Trabajamos en una experiencia nueva que refleje la evolución de <span className="font-bold text-blue-300">Trix</span> e innovación en geomática + IA.
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-800/70 backdrop-blur border-2 border-blue-400/50 rounded-lg sm:rounded-2xl p-4 sm:p-8 shadow-2xl shadow-blue-500/20 hover:border-blue-400/80 transition-all duration-300 hover:scale-105">
            {!emailSent ? (
              <>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 animate-float">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 animate-bounce" />
                  Contactanos
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">Tu Nombre</label>
                    <input
                      type="text"
                      placeholder="Juan Pérez"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-blue-400/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/80 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 group-hover:border-blue-400/50 text-sm sm:text-base"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">Tu Email</label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-blue-400/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/80 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 group-hover:border-blue-400/50 text-sm sm:text-base"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">Tu Mensaje</label>
                    <textarea
                      placeholder="Cuéntanos sobre tu proyecto..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-blue-400/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/80 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 group-hover:border-blue-400/50 resize-none h-24 sm:h-32 text-sm sm:text-base"
                    />
                  </div>

                  <button
                    onClick={handleSendEmail}
                    disabled={!formData.name || !formData.email || !formData.message}
                    className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden hover:scale-105 text-sm sm:text-base"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
                      Enviar Email
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-3 sm:mt-4 text-center">
                  📧 Recibirás el email en tu cliente de correo
                </p>
              </>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="mb-3 sm:mb-4 flex justify-center animate-bounce">
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400" />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-green-400 mb-2 animate-float">¡Listo!</h4>
                <p className="text-slate-300 text-sm sm:text-base">Tu correo está listo para enviar.</p>
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg hover:border-blue-400/60 transition hover:shadow-lg hover:shadow-blue-500/20">
            <p className="text-xs sm:text-sm text-slate-300 text-center px-2">
              <span className="font-semibold text-blue-300">💡 Consejo:</span> Contacta en <span className="font-bold text-cyan-300">info@trixgeo.com</span>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-400/20 bg-slate-900/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base">TRIX</h3>
              <p className="text-slate-400 text-xs sm:text-sm">Geomática + IA</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 sm:mb-4 text-xs sm:text-base">Servicios</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-400">
                <li><a href="#gis" className="hover:text-blue-400 transition">GIS + IA</a></li>
                <li><a href="#products" className="hover:text-green-400 transition">Productos</a></li>
                <li><a href="#contact" className="hover:text-blue-400 transition">Consultar</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 sm:mb-4 text-xs sm:text-base">Empresa</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-400">
                <li><a href="#gis" className="hover:text-blue-400 transition">Sobre</a></li>
                <li><a href="#products" className="hover:text-green-400 transition">Portafolio</a></li>
                <li><a href="#contact" className="hover:text-blue-400 transition">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 sm:mb-4 text-xs sm:text-base">Contacto</h4>
              <p className="text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition cursor-pointer">info@trixgeo.com</p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6 sm:pt-8 text-center text-slate-400 text-xs sm:text-sm">
            <p>&copy; 2025 TRIX - Inteligencia Espacial + IA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TrixLanding;