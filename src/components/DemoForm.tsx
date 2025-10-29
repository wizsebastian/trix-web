import { useState } from 'react';
import { X, Send, Building, User, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { PhoneInput } from './PhoneInput';

interface DemoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: DemoFormData) => Promise<void>;
}

export interface DemoFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  countryCode: string;
  hasWhatsApp: boolean;
  message: string;
}

export function DemoForm({ isOpen, onClose, onSubmit }: DemoFormProps) {
  const [formData, setFormData] = useState<DemoFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    countryCode: '+52',
    hasWhatsApp: false,
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setIsSubmitted(true);
      
      // Cerrar modal después de 3 segundos
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          countryCode: '+52',
          hasWhatsApp: false,
          message: ''
        });
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting demo form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (phone: string, countryCode: string, hasWhatsApp: boolean) => {
    setFormData({ ...formData, phone, countryCode, hasWhatsApp });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-green-400/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-400/30">
          <div>
            <h2 className="text-2xl font-bold text-green-300">Solicitar Demo GTS</h2>
            <p className="text-slate-400 text-sm mt-1">Descubre cómo el GTS puede optimizar tu flota</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-green-400/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-400/80 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Corporativo *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-green-400/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-400/80 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                  placeholder="tu@empresa.com"
                  required
                />
              </div>

              {/* Empresa */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Empresa *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-green-400/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-400/80 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                  placeholder="Nombre de tu empresa"
                  required
                />
              </div>

              {/* Teléfono */}
              <div className="group">
                <PhoneInput
                  value={formData.phone}
                  countryCode={formData.countryCode}
                  hasWhatsApp={formData.hasWhatsApp}
                  onChange={handlePhoneChange}
                />
              </div>

              {/* Mensaje */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Información Adicional
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-green-400/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-400/80 focus:ring-2 focus:ring-green-400/20 transition-all duration-300 resize-none h-24"
                  placeholder="Cuéntanos sobre tu flota, necesidades específicas, número de vehículos, etc."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!formData.name || !formData.email || !formData.company || isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Send className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : 'animate-bounce'}`} />
                    {isSubmitting ? 'Enviando Demo...' : 'Solicitar Demo GTS'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </button>

                <p className="text-xs text-slate-400 mt-4 text-center">
                  🚀 Nuestro equipo se pondrá en contacto contigo en menos de 24 horas
                </p>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="mb-4 flex justify-center animate-bounce">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-2 animate-float">
                ¡Demo Solicitada!
              </h3>
              <p className="text-slate-300 mb-4">
                Tu solicitud de demo ha sido enviada exitosamente. Nuestro equipo especializado en GTS se pondrá en contacto contigo muy pronto.
              </p>
              <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-4">
                <p className="text-green-300 text-sm">
                  ✅ Solicitud registrada<br/>
                  📧 Email de confirmación enviado<br/>
                  ⏰ Respuesta en menos de 24 horas
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}