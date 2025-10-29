// Funciones para capturar metadata del navegador y dispositivo

export function getBrowserInfo(): string {
  const ua = navigator.userAgent;
  
  if (ua.indexOf('Firefox') > -1) return 'Firefox';
  if (ua.indexOf('Chrome') > -1) return 'Chrome';
  if (ua.indexOf('Safari') > -1) return 'Safari';
  if (ua.indexOf('Edge') > -1) return 'Edge';
  if (ua.indexOf('Opera') > -1) return 'Opera';
  
  return 'Desconocido';
}

export function getOS(): string {
  const ua = navigator.userAgent;
  
  if (ua.indexOf('Win') > -1) return 'Windows';
  if (ua.indexOf('Mac') > -1) return 'macOS';
  if (ua.indexOf('Linux') > -1) return 'Linux';
  if (ua.indexOf('Android') > -1) return 'Android';
  if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) return 'iOS';
  
  return 'Desconocido';
}

export function getDeviceType(): string {
  const ua = navigator.userAgent;
  
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'Móvil';
  
  return 'Escritorio';
}

export async function getNetworkSpeed(): Promise<string> {
  try {
    // @ts-ignore - navigator.connection no está en todas las definiciones de TypeScript
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) return 'No disponible';
    
    return connection.effectiveType || 'Desconocido';
  } catch {
    return 'No disponible';
  }
}

export function getScreenInfo() {
  return {
    resolucion: `${window.screen.width}x${window.screen.height}`,
    pixelRatio: window.devicePixelRatio,
    colorDepth: window.screen.colorDepth,
    orientacion: window.screen.orientation?.type || 'Desconocido'
  };
}

export function getLocationInfo() {
  return {
    idioma: navigator.language,
    idiomas: navigator.languages,
    zona_horaria: Intl.DateTimeFormat().resolvedOptions().timeZone,
    url: window.location.href,
    referrer: document.referrer || 'Directo'
  };
}

export function getPerformanceInfo() {
  try {
    const timing = performance.timing;
    return {
      tiempoExposicion: timing.loadEventEnd - timing.navigationStart,
      tiempoCarga: timing.loadEventEnd - timing.responseStart,
      tiempoDNS: timing.domainLookupEnd - timing.domainLookupStart
    };
  } catch {
    return {
      tiempoExposicion: 0,
      tiempoCarga: 0,
      tiempoDNS: 0
    };
  }
}

export async function getCompleteMetadata() {
  const [networkSpeed] = await Promise.all([
    getNetworkSpeed()
  ]);

  return {
    // Información del navegador
    userAgent: navigator.userAgent,
    navegador: getBrowserInfo(),
    sistemaOperativo: getOS(),
    tipoDispositivo: getDeviceType(),
    
    // Pantalla/Dispositivo
    ...getScreenInfo(),
    touchSupport: 'ontouchstart' in window,
    
    // Ubicación/Idioma
    ...getLocationInfo(),
    
    // Rendimiento
    ...getPerformanceInfo(),
    velocidadInternet: networkSpeed,
    
    // Capacidades del navegador
    cookies: navigator.cookieEnabled,
    javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
    onLine: navigator.onLine,
    
    // Timestamps
    fechaCliente: new Date().toISOString()
  };
}