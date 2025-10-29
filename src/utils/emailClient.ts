interface ContactData {
  nombre: string;
  email: string;
  mensaje: string;
  telefono?: string;
  codigoPais?: string;
  tieneWhatsApp?: boolean;
}

export const sendThankYouEmail = async (contactData: ContactData) => {
  try {
    const phoneInfo = contactData.telefono 
      ? `${contactData.codigoPais} ${contactData.telefono}${contactData.tieneWhatsApp ? ' (WhatsApp disponible)' : ''}`
      : '';

    const emailHTML = createTrixEmailTemplate({
      nombre: contactData.nombre,
      mensaje: contactData.mensaje,
      telefono: phoneInfo
    });

    // Llamada directa a la API de Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'TRIX <onboarding@resend.dev>',
        to: [contactData.email],
        subject: '¡Gracias por contactar a TRIX! - Hemos recibido tu mensaje',
        html: emailHTML
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log('Email sent successfully via Resend:', result);
    
    return { success: true, data: result, message: 'Email enviado correctamente' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message || error };
  }
};

interface EmailTemplateData {
  nombre: string;
  mensaje: string;
  telefono?: string;
}

const createTrixEmailTemplate = ({ nombre, mensaje, telefono }: EmailTemplateData) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gracias por contactar a TRIX</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%);
        }
        
        .logo {
            position: relative;
            z-index: 2;
        }
        
        .logo h1 {
            font-size: 42px;
            font-weight: 900;
            color: #ffffff;
            letter-spacing: 4px;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .logo .tagline {
            color: #94a3b8;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 16px;
            color: #475569;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        
        .info-box {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border-left: 4px solid #3b82f6;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        
        .info-title {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 10px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-content {
            color: #475569;
            font-size: 14px;
            background: white;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        
        .features {
            margin: 30px 0;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .feature {
            text-align: center;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        
        .feature-icon {
            font-size: 24px;
            margin-bottom: 8px;
            display: block;
        }
        
        .feature-text {
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
        }
        
        .cta {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin: 30px 0;
        }
        
        .cta h3 {
            font-size: 18px;
            margin-bottom: 10px;
        }
        
        .cta p {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-content {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 15px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            margin: 15px 0;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #475569;
            font-size: 13px;
        }
        
        .social-links {
            margin-top: 20px;
        }
        
        .social-links a {
            color: #3b82f6;
            text-decoration: none;
            margin: 0 10px;
            font-size: 13px;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
            
            .logo h1 {
                font-size: 32px;
            }
            
            .greeting {
                font-size: 20px;
            }
            
            .contact-info {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header con Logo TRIX -->
        <div class="header">
            <div class="logo">
                <h1>TRIX</h1>
                <div class="tagline">Sistemas Geoespaciales Inteligentes</div>
            </div>
        </div>
        
        <!-- Contenido Principal -->
        <div class="content">
            <div class="greeting">¡Hola ${nombre}!</div>
            
            <div class="message">
                Gracias por contactarnos. Hemos recibido tu mensaje y queremos que sepas que es muy importante para nosotros.
            </div>
            
            <div class="info-box">
                <div class="info-title">Tu mensaje recibido:</div>
                <div class="info-content">"${mensaje}"</div>
                ${telefono ? `
                <div class="info-title" style="margin-top: 15px;">Información de contacto:</div>
                <div class="info-content">${telefono}</div>
                ` : ''}
            </div>
            
            <div class="message">
                Nuestro equipo de expertos revisará tu consulta y nos pondremos en contacto contigo muy pronto. 
                Mientras tanto, te invitamos a conocer más sobre nuestras soluciones tecnológicas.
            </div>
            
            <!-- Características -->
            <div class="features">
                <div class="feature-grid">
                    <div class="feature">
                        <span class="feature-icon">🗺️</span>
                        <div class="feature-text">Sistemas GIS Avanzados</div>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">🤖</span>
                        <div class="feature-text">Inteligencia Artificial</div>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">📊</span>
                        <div class="feature-text">Análisis de Datos</div>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">🚀</span>
                        <div class="feature-text">Soluciones Innovadoras</div>
                    </div>
                </div>
            </div>
            
            <!-- CTA -->
            <div class="cta">
                <h3>¿Necesitas algo urgente?</h3>
                <p>Si tu consulta es urgente, no dudes en contactarnos directamente por teléfono o WhatsApp.</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <strong>TRIX - Sistemas Geoespaciales Inteligentes</strong>
            </div>
            
            <div class="contact-info">
                <div class="contact-item">
                    <span>📧</span>
                    <span>info@trixgeo.com</span>
                </div>
                <div class="contact-item">
                    <span>🌐</span>
                    <span>www.trixgeo.com</span>
                </div>
                <div class="contact-item">
                    <span>📱</span>
                    <span>WhatsApp disponible</span>
                </div>
            </div>
            
            <div class="social-links">
                <a href="#">LinkedIn</a>
                <a href="#">Twitter</a>
                <a href="#">Facebook</a>
            </div>
            
            <div style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
                © 2025 TRIX. Todos los derechos reservados.
            </div>
        </div>
    </div>
</body>
</html>
  `;
};