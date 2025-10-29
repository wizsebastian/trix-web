interface DemoFormData {
  name: string;
  email: string;
  company: string;
  phone?: string;
  countryCode?: string;
  hasWhatsApp?: boolean;
  message?: string;
}

interface DemoAPIPayload {
  name: string;
  phone?: string;
  email: string;
  company: string;
  message?: string;
  whatsapp_check: boolean;
  meta: {
    industry?: string;
    source: "website";
    utm_campaign: "demo_request_2024";
    priority: "high";
    user_agent?: string;
    browser?: string;
    os?: string;
    device?: string;
    screen_resolution?: string;
    language?: string;
    timezone?: string;
    referrer?: string;
    timestamp?: string;
  };
}

export const sendDemoRequest = async (formData: DemoFormData, metadata: any) => {
  try {
    // Formatear teléfono con código de país
    const fullPhone = formData.phone ? `${formData.countryCode}${formData.phone}` : undefined;
    
    // Preparar payload según el formato requerido para demo
    const payload: DemoAPIPayload = {
      name: formData.name,
      phone: fullPhone,
      email: formData.email,
      company: formData.company,
      message: formData.message,
      whatsapp_check: formData.hasWhatsApp || false,
      meta: {
        source: "website",
        utm_campaign: "demo_request_2024",
        priority: "high",
        user_agent: metadata.userAgent || navigator.userAgent,
        browser: metadata.navegador,
        os: metadata.sistemaOperativo,
        device: metadata.tipoDispositivo,
        screen_resolution: metadata.resolucion,
        language: metadata.idioma,
        timezone: metadata.zona_horaria,
        referrer: metadata.referrer || document.referrer,
        timestamp: new Date().toISOString()
      }
    };

    console.log('Sending demo request to API:', payload);

    // Llamada a la API externa
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/request-demo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': import.meta.env.VITE_X_API_KEY,
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API error (${response.status}): ${errorData}`);
    }

    const result = await response.json();
    console.log('Demo API response:', result);
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending demo request to API:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};