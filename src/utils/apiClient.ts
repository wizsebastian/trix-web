interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone: string;
  countryCode: string;
  hasWhatsApp: boolean;
}

interface ContactAPIPayload {
  email_type: "contact";
  name: string;
  phone: string;
  email: string;
  message: string;
  whatsapp_check: boolean;
  meta: {
    source: "website";
    page: "contact";
    utm_campaign?: string;
    ip?: string;
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

export const sendContactToAPI = async (formData: ContactFormData, metadata: any) => {
  try {
    // Formatear teléfono con código de país
    const fullPhone = formData.phone ? `${formData.countryCode}${formData.phone}` : '';
    
    // Preparar payload según el formato requerido
    const payload: ContactAPIPayload = {
      email_type: "contact",
      name: formData.name,
      phone: fullPhone,
      email: formData.email,
      message: formData.message,
      whatsapp_check: formData.hasWhatsApp,
      meta: {
        source: "website",
        page: "contact",
        utm_campaign: "trix_website_2025",
        ip: "client-side", // Se puede obtener del servidor
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

    console.log('Sending contact data to API:', payload);

    // Llamada a la API externa
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/send-email`, {
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
    console.log('API response:', result);
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending contact to API:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};