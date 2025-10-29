import { useState, useEffect } from 'react';
import { ChevronDown, Phone } from 'lucide-react';

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

interface PhoneInputProps {
  value: string;
  countryCode: string;
  hasWhatsApp: boolean;
  onChange: (phone: string, countryCode: string, hasWhatsApp: boolean) => void;
  className?: string;
}

export function PhoneInput({ value, countryCode, hasWhatsApp, onChange, className = "" }: PhoneInputProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      // Using REST Countries API for country data
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag');
      const data = await response.json();
      
      const formattedCountries: Country[] = data
        .filter((country: any) => country.idd?.root && country.idd?.suffixes)
        .map((country: any) => ({
          name: country.name.common,
          code: country.cca2,
          dialCode: country.idd.root + (country.idd.suffixes[0] || ''),
          flag: country.flag
        }))
        .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

      setCountries(formattedCountries);
      
      // Set default to Mexico if not set
      if (!countryCode && formattedCountries.length > 0) {
        const mexico = formattedCountries.find(c => c.code === 'MX');
        if (mexico) {
          onChange(value, mexico.dialCode, hasWhatsApp);
        }
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      // Fallback countries
      const fallbackCountries = [
        { name: 'México', code: 'MX', dialCode: '+52', flag: '🇲🇽' },
        { name: 'Estados Unidos', code: 'US', dialCode: '+1', flag: '🇺🇸' },
        { name: 'España', code: 'ES', dialCode: '+34', flag: '🇪🇸' },
        { name: 'Colombia', code: 'CO', dialCode: '+57', flag: '🇨🇴' },
        { name: 'Argentina', code: 'AR', dialCode: '+54', flag: '🇦🇷' }
      ];
      setCountries(fallbackCountries);
      if (!countryCode) {
        onChange(value, '+52', hasWhatsApp);
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = countries.find(c => c.dialCode === countryCode) || countries[0];

  const handleCountrySelect = (country: Country) => {
    onChange(value, country.dialCode, hasWhatsApp);
    setIsOpen(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value.replace(/[^0-9]/g, '');
    onChange(phoneValue, countryCode, hasWhatsApp);
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(value, countryCode, e.target.checked);
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-slate-300 rounded w-20 mb-2"></div>
          <div className="h-12 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Teléfono
        </label>
        <div className="flex rounded-lg overflow-hidden border border-slate-600">
          {/* Country Code Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3 py-3 bg-slate-700 hover:bg-slate-600 transition-colors border-r border-slate-600 min-w-[100px]"
            >
              <span className="text-lg">{selectedCountry?.flag}</span>
              <span className="text-sm text-slate-300">{selectedCountry?.dialCode}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            
            {isOpen && (
              <div className="absolute top-full left-0 right-0 z-50 bg-slate-800 border border-slate-600 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-slate-700 transition-colors w-full text-left"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{country.name}</div>
                      <div className="text-xs text-slate-400">{country.dialCode}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Phone Number Input */}
          <input
            type="tel"
            value={value}
            onChange={handlePhoneChange}
            placeholder="123 456 7890"
            className="flex-1 px-4 py-3 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* WhatsApp Checkbox */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="whatsapp-checkbox"
          checked={hasWhatsApp}
          onChange={handleWhatsAppChange}
          className="w-4 h-4 text-green-500 bg-slate-700 border-slate-600 rounded focus:ring-green-500 focus:ring-2"
        />
        <label htmlFor="whatsapp-checkbox" className="text-sm text-slate-300 flex items-center gap-2">
          <span className="text-green-400">📱</span>
          Este número tiene WhatsApp para contacto
        </label>
      </div>
    </div>
  );
}