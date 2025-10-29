import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase-config';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { 
  LogOut, 
  Users, 
  Mail, 
  Calendar, 
  Monitor, 
  Smartphone, 
  Globe, 
  Trash2,
  Eye,
  Download,
  RefreshCw,
  Phone,
  MessageCircle
} from 'lucide-react';

interface Contact {
  id: string;
  nombre: string;
  email: string;
  mensaje?: string;
  telefono?: string;
  codigoPais?: string;
  tieneWhatsApp?: boolean;
  empresa?: string;
  tipo?: string;
  navegador?: string;
  sistemaOperativo?: string;
  tipoDispositivo?: string;
  resolucion?: string;
  idioma?: string;
  zona_horaria?: string;
  url?: string;
  referrer?: string;
  velocidadInternet?: string;
  userAgent?: string;
  fechaCliente: string;
  fechaServidor?: any;
}

export function AdminPanel() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { logout, currentUser } = useAuth();

  const loadContacts = async () => {
    setLoading(true);
    try {
      // Cargar contactos regulares
      const contactsQuery = query(collection(db, 'contactos'), orderBy('fechaServidor', 'desc'));
      const contactsSnapshot = await getDocs(contactsQuery);
      const contactsData = contactsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        tipo: 'contacto'
      })) as Contact[];

      // Cargar solicitudes de demo
      const demosQuery = query(collection(db, 'demo_requests'), orderBy('fechaServidor', 'desc'));
      const demosSnapshot = await getDocs(demosQuery);
      const demosData = demosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        tipo: 'demo_gts'
      })) as Contact[];

      // Combinar y ordenar por fecha
      const allContacts = [...contactsData, ...demosData].sort((a, b) => {
        const dateA = a.fechaServidor?.toDate?.() || new Date(a.fechaCliente);
        const dateB = b.fechaServidor?.toDate?.() || new Date(b.fechaCliente);
        return dateB.getTime() - dateA.getTime();
      });

      setContacts(allContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleDelete = async (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    const isDemo = contact?.tipo === 'demo_gts';
    const confirmMessage = isDemo 
      ? '¿Estás seguro de que quieres eliminar esta solicitud de demo?' 
      : '¿Estás seguro de que quieres eliminar este contacto?';
    
    if (!confirm(confirmMessage)) return;
    
    try {
      const collection_name = isDemo ? 'demo_requests' : 'contactos';
      await deleteDoc(doc(db, collection_name, contactId));
      setContacts(contacts.filter(contact => contact.id !== contactId));
      if (selectedContact?.id === contactId) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      await logout();
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Fecha', 'Tipo', 'Nombre', 'Email', 'Empresa', 'Teléfono', 'Código País', 'WhatsApp', 'Mensaje', 'Navegador', 'SO', 'Dispositivo', 'País/Idioma'].join(','),
      ...contacts.map(contact => [
        new Date(contact.fechaCliente).toLocaleString(),
        contact.tipo === 'demo_gts' ? 'Demo GTS' : 'Contacto',
        contact.nombre,
        contact.email,
        contact.empresa || '',
        contact.telefono || '',
        contact.codigoPais || '',
        contact.tieneWhatsApp ? 'Sí' : 'No',
        `"${(contact.mensaje || '').replace(/"/g, '""')}"`,
        contact.navegador || '',
        contact.sistemaOperativo || '',
        contact.tipoDispositivo || '',
        contact.idioma || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `contactos-trix-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur border-b border-blue-400/30 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold">TX</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Panel de Administración TRIX</h1>
              <p className="text-slate-300 text-sm">Bienvenido, {currentUser?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={loadContacts}
              className="px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-lg hover:bg-blue-500/30 transition flex items-center gap-2 text-blue-300"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
            
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-500/20 border border-green-400/50 rounded-lg hover:bg-green-500/30 transition flex items-center gap-2 text-green-300"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 border border-red-400/50 rounded-lg hover:bg-red-500/30 transition flex items-center gap-2 text-red-300"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-blue-400/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <Users className="w-10 h-10 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{contacts.length}</p>
                <p className="text-slate-400">Total Contactos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-green-400/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <Mail className="w-10 h-10 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {contacts.filter(c => new Date(c.fechaCliente) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </p>
                <p className="text-slate-400">Esta Semana</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-cyan-400/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <Calendar className="w-10 h-10 text-cyan-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {contacts.filter(c => new Date(c.fechaCliente).toDateString() === new Date().toDateString()).length}
                </p>
                <p className="text-slate-400">Hoy</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de Contactos */}
          <div className="bg-slate-800/50 border border-blue-400/30 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Contactos Recibidos</h2>
              <p className="text-slate-400">Click en un contacto para ver detalles</p>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition ${
                    selectedContact?.id === contact.id ? 'bg-blue-500/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{contact.nombre}</h3>
                        {contact.tipo === 'demo_gts' && (
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-semibold">
                            DEMO GTS
                          </span>
                        )}
                      </div>
                      <p className="text-blue-400 text-sm">{contact.email}</p>
                      {contact.empresa && (
                        <p className="text-yellow-400 text-sm">🏢 {contact.empresa}</p>
                      )}
                      {contact.telefono && (
                        <div className="flex items-center gap-2 text-sm text-green-400 mt-1">
                          <Phone className="w-3 h-3" />
                          <span>{contact.codigoPais} {contact.telefono}</span>
                          {contact.tieneWhatsApp && (
                            <MessageCircle className="w-3 h-3" title="WhatsApp disponible" />
                          )}
                        </div>
                      )}
                      <p className="text-slate-400 text-sm mt-1 line-clamp-2">{contact.mensaje || 'Sin mensaje adicional'}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(contact.fechaCliente).toLocaleDateString()}
                        </span>
                        {contact.navegador && (
                          <span className="flex items-center gap-1">
                            <Monitor className="w-3 h-3" />
                            {contact.navegador}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContact(contact);
                        }}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(contact.id);
                        }}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {contacts.length === 0 && (
                <div className="p-8 text-center">
                  <Mail className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No hay contactos aún</p>
                </div>
              )}
            </div>
          </div>

          {/* Detalles del Contacto */}
          <div className="bg-slate-800/50 border border-blue-400/30 rounded-xl">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Detalles del Contacto</h2>
            </div>
            
            {selectedContact ? (
              <div className="p-6 space-y-6">
                {/* Información Básica */}
                <div>
                  <h3 className="font-semibold text-white mb-4">
                    {selectedContact.tipo === 'demo_gts' ? 'Información de Solicitud Demo' : 'Información de Contacto'}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-400">Nombre</label>
                      <p className="text-white">{selectedContact.nombre}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400">Email</label>
                      <p className="text-blue-400">{selectedContact.email}</p>
                    </div>
                    {selectedContact.empresa && (
                      <div>
                        <label className="block text-sm font-medium text-slate-400">Empresa</label>
                        <p className="text-yellow-400">{selectedContact.empresa}</p>
                      </div>
                    )}
                    {selectedContact.tipo && (
                      <div>
                        <label className="block text-sm font-medium text-slate-400">Tipo</label>
                        <div className="flex items-center gap-2">
                          {selectedContact.tipo === 'demo_gts' ? (
                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                              🚀 Solicitud Demo GTS
                            </span>
                          ) : (
                            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
                              📧 Contacto General
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {selectedContact.telefono && (
                      <div>
                        <label className="block text-sm font-medium text-slate-400">Teléfono</label>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-400" />
                          <p className="text-white">
                            {selectedContact.codigoPais} {selectedContact.telefono}
                          </p>
                          {selectedContact.tieneWhatsApp && (
                            <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
                              <MessageCircle className="w-3 h-3 text-green-400" />
                              <span className="text-xs text-green-400">WhatsApp</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-slate-400">Mensaje</label>
                      <p className="text-white bg-slate-700/50 p-3 rounded-lg">{selectedContact.mensaje}</p>
                    </div>
                  </div>
                </div>

                {/* Metadata Técnica */}
                <div>
                  <h3 className="font-semibold text-white mb-4">Información Técnica</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedContact.navegador && (
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-400">Navegador:</span>
                        <span className="text-white">{selectedContact.navegador}</span>
                      </div>
                    )}
                    
                    {selectedContact.sistemaOperativo && (
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-green-400" />
                        <span className="text-slate-400">SO:</span>
                        <span className="text-white">{selectedContact.sistemaOperativo}</span>
                      </div>
                    )}
                    
                    {selectedContact.tipoDispositivo && (
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-cyan-400" />
                        <span className="text-slate-400">Dispositivo:</span>
                        <span className="text-white">{selectedContact.tipoDispositivo}</span>
                      </div>
                    )}
                    
                    {selectedContact.resolucion && (
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-purple-400" />
                        <span className="text-slate-400">Resolución:</span>
                        <span className="text-white">{selectedContact.resolucion}</span>
                      </div>
                    )}
                    
                    {selectedContact.idioma && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-yellow-400" />
                        <span className="text-slate-400">Idioma:</span>
                        <span className="text-white">{selectedContact.idioma}</span>
                      </div>
                    )}
                    
                    {selectedContact.zona_horaria && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span className="text-slate-400">Zona Horaria:</span>
                        <span className="text-white">{selectedContact.zona_horaria}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Información de Acceso */}
                <div>
                  <h3 className="font-semibold text-white mb-4">Información de Acceso</h3>
                  <div className="space-y-2 text-sm">
                    {selectedContact.url && (
                      <div>
                        <span className="text-slate-400">URL:</span>
                        <p className="text-white break-all">{selectedContact.url}</p>
                      </div>
                    )}
                    
                    {selectedContact.referrer && selectedContact.referrer !== 'Directo' && (
                      <div>
                        <span className="text-slate-400">Referrer:</span>
                        <p className="text-white break-all">{selectedContact.referrer}</p>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-slate-400">Fecha:</span>
                      <p className="text-white">{new Date(selectedContact.fechaCliente).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Eye className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Selecciona un contacto para ver los detalles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}