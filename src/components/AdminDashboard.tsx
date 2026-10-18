import React, { useState } from 'react';
import { RSVP, InvitationConfig } from '../types';
import { Settings, Users, Download, Trash2, Edit2, Shield, Calendar, MapPin, Gift, Eye, EyeOff, Save, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  rsvps: RSVP[];
  config: InvitationConfig;
  onUpdateConfig: (newConfig: InvitationConfig) => void;
  onClearRSVPs: () => void;
  onRemoveRSVP: (id: string) => void;
}

export default function AdminDashboard({ rsvps, config, onUpdateConfig, onClearRSVPs, onRemoveRSVP }: AdminDashboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'rsvps' | 'config'>('rsvps');
  
  // Local config form states
  const [formConfig, setFormConfig] = useState<InvitationConfig>({ ...config });
  const [isSaved, setIsSaved] = useState(false);

  // Sync formConfig when parent config changes
  React.useEffect(() => {
    setFormConfig({ ...config });
  }, [config]);

  // Stats calculation
  const totalAttending = rsvps
    .filter((r) => r.attending === 'yes')
    .reduce((sum, r) => sum + r.guestsCount, 0);

  const totalNotAttending = rsvps.filter((r) => r.attending === 'no').length;

  // Diet breakdown
  const dietsCount = rsvps
    .filter((r) => r.attending === 'yes' && r.dietary !== 'Ninguna')
    .reduce((acc, r) => {
      acc[r.dietary] = (acc[r.dietary] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formConfig);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const exportToCSV = () => {
    if (rsvps.length === 0) return;
    
    // Create CSV content
    const headers = ['Nombre', 'Asiste', 'Invitados', 'Restricción Alimenticia', 'Mensaje', 'Fecha de Registro'];
    const rows = rsvps.map((r) => [
      `"${r.name.replace(/"/g, '""')}"`,
      r.attending === 'yes' ? 'SÍ' : 'NO',
      r.guestsCount,
      `"${r.dietary.replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      new Date(r.createdAt).toLocaleString('es-AR'),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `asistencia_cumple_${config.name.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      {/* Trigger Button */}
      <div className="flex justify-center mb-4">
        <button
          id="btn-toggle-admin"
          onClick={() => setIsOpen(!isOpen)}
          className="px-5 py-2.5 bg-brand-text text-white rounded-full font-sans text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-2 hover:bg-brand-text/90 cursor-pointer transition-all"
        >
          {isOpen ? (
            <>
              <EyeOff className="w-4 h-4" />
              Ocultar Panel Organizador
            </>
          ) : (
            <>
              <Settings className="w-4 h-4 animate-spin-slow" />
              Ver Panel Organizador (Simulador)
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white rounded-3xl border border-brand-beige-dark/50 shadow-lg p-6 space-y-6"
          >
            {/* Header / Security Warning */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-beige pb-4 gap-2">
              <div>
                <h4 className="font-serif text-xl font-bold text-brand-text flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-pink-dark" />
                  Panel del Organizador (Familiar)
                </h4>
                <p className="text-[11px] text-brand-text/60 font-sans mt-0.5">
                  Este panel simula la visualización de los padres de Olivia. Podés simular confirmaciones y modificar datos del cumple.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex bg-brand-beige-light p-1 rounded-xl border border-brand-beige">
                <button
                  id="tab-admin-rsvps"
                  onClick={() => setActiveTab('rsvps')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'rsvps'
                      ? 'bg-white text-brand-text shadow-xs'
                      : 'text-brand-text/60 hover:text-brand-text'
                  }`}
                >
                  Confirmaciones ({rsvps.length})
                </button>
                <button
                  id="tab-admin-config"
                  onClick={() => setActiveTab('config')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'config'
                      ? 'bg-white text-brand-text shadow-xs'
                      : 'text-brand-text/60 hover:text-brand-text'
                  }`}
                >
                  Editar Datos
                </button>
              </div>
            </div>

            {/* TAB CONTENT: RSVPS */}
            {activeTab === 'rsvps' && (
              <div className="space-y-6 animate-fade-in">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-brand-green-light/60 p-4 rounded-2xl border border-brand-green/30 text-center">
                    <Users className="w-5 h-5 text-brand-green-dark mx-auto mb-1" />
                    <span className="text-2xl font-serif font-bold text-brand-text block">{totalAttending}</span>
                    <span className="text-[10px] uppercase font-bold text-brand-text/60 tracking-wider">Asistirán en Total</span>
                  </div>
                  <div className="bg-brand-pink-light/40 p-4 rounded-2xl border border-brand-pink/20 text-center">
                    <Trash2 className="w-5 h-5 text-brand-pink-dark mx-auto mb-1" />
                    <span className="text-2xl font-serif font-bold text-brand-text block">{totalNotAttending}</span>
                    <span className="text-[10px] uppercase font-bold text-brand-text/60 tracking-wider">No Pueden Asistir</span>
                  </div>
                  <div className="bg-brand-beige-light p-4 rounded-2xl border border-brand-beige-dark/30 text-left">
                    <span className="text-xs font-bold text-brand-text/80 block border-b border-brand-beige pb-1 mb-1.5">Dietas Especiales:</span>
                    {Object.keys(dietsCount).length > 0 ? (
                      <div className="space-y-1 text-xs">
                        {Object.entries(dietsCount).map(([diet, count]) => (
                          <div key={diet} className="flex justify-between font-sans">
                            <span className="text-brand-text/70">{diet}:</span>
                            <span className="font-bold text-brand-text">{count}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-brand-text/50 italic block mt-2 text-center">Ninguna dieta especial registrada</span>
                    )}
                  </div>
                </div>

                {/* RSVP List Table */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-brand-text/70">Invitados Confirmados</h5>
                    <div className="flex gap-2">
                      <button
                        id="btn-export-csv"
                        disabled={rsvps.length === 0}
                        onClick={exportToCSV}
                        className="px-3 py-1.5 bg-brand-green text-brand-text rounded-lg text-xs font-bold hover:bg-brand-green-dark/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 border border-brand-green-dark/15"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Exportar Excel/CSV
                      </button>
                      <button
                        id="btn-clear-rsvps"
                        disabled={rsvps.length === 0}
                        onClick={() => {
                          if (window.confirm('¿Estás seguro/a de que querés borrar todas las confirmaciones?')) {
                            onClearRSVPs();
                          }
                        }}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 border border-red-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Limpiar Lista
                      </button>
                    </div>
                  </div>

                  {rsvps.length === 0 ? (
                    <div className="text-center py-10 bg-brand-beige-light/50 rounded-2xl border border-dashed border-brand-beige-dark/50">
                      <Users className="w-8 h-8 text-brand-text/30 mx-auto mb-2" />
                      <p className="text-xs font-sans text-brand-text/60 italic">Todavía no hay confirmaciones de invitados registradas.</p>
                      <p className="text-[10px] text-brand-text/50 mt-1">Simula una confirmación llenando el formulario de arriba.</p>
                    </div>
                  ) : (
                    <div className="border border-brand-beige rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                      <table className="w-full text-left border-collapse bg-white">
                        <thead>
                          <tr className="bg-brand-beige-light text-brand-text/70 text-[10px] font-bold uppercase tracking-wider border-b border-brand-beige">
                            <th className="py-2.5 px-3">Invitado</th>
                            <th className="py-2.5 px-3">¿Asiste?</th>
                            <th className="py-2.5 px-3">Cant.</th>
                            <th className="py-2.5 px-3">Menú Especial</th>
                            <th className="py-2.5 px-3">Mensaje</th>
                            <th className="py-2.5 px-3 text-center">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-beige text-xs">
                          {rsvps.map((rsvp) => (
                            <tr key={rsvp.id} className="hover:bg-brand-beige-light/30">
                              <td className="py-2.5 px-3 font-semibold text-brand-text">{rsvp.name}</td>
                              <td className="py-2.5 px-3">
                                {rsvp.attending === 'yes' ? (
                                  <span className="px-2 py-0.5 bg-brand-green-light text-brand-green-dark border border-brand-green-dark/20 rounded-full font-bold text-[10px]">SÍ</span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-brand-pink-light text-brand-pink-dark border border-brand-pink-dark/20 rounded-full font-bold text-[10px]">NO</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold">{rsvp.guestsCount}</td>
                              <td className="py-2.5 px-3 text-brand-text/80">{rsvp.dietary}</td>
                              <td className="py-2.5 px-3 max-w-[150px] truncate text-brand-text/60 italic" title={rsvp.message}>
                                {rsvp.message || '-'}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  id={`btn-delete-rsvp-${rsvp.id}`}
                                  onClick={() => onRemoveRSVP(rsvp.id)}
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: CONFIG */}
            {activeTab === 'config' && (
              <form onSubmit={handleSaveConfig} className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Event Info */}
                  <div className="bg-brand-beige-light/50 p-4 rounded-2xl border border-brand-beige space-y-3">
                    <h5 className="text-xs font-bold text-brand-text/80 border-b border-brand-beige pb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-pink-dark" />
                      Información del Evento
                    </h5>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-brand-text/60">Nombre del Festejado:</label>
                        <input
                          type="text"
                          value={formConfig.name}
                          onChange={(e) => setFormConfig({ ...formConfig, name: e.target.value })}
                          className="bg-white border border-brand-beige-dark/40 rounded-lg p-2 text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-brand-text/60">Edad del Cumple:</label>
                        <input
                          type="number"
                          value={formConfig.age}
                          onChange={(e) => setFormConfig({ ...formConfig, age: parseInt(e.target.value) || 1 })}
                          className="bg-white border border-brand-beige-dark/40 rounded-lg p-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-brand-text/60">Fecha Cuenta Regresiva (YYYY-MM-DD):</label>
                      <input
                        type="date"
                        value={formConfig.date}
                        onChange={(e) => setFormConfig({ ...formConfig, date: e.target.value })}
                        className="bg-white border border-brand-beige-dark/40 rounded-lg p-2 text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-brand-text/60">Fecha para Mostrar:</label>
                      <input
                        type="text"
                        value={formConfig.displayDate}
                        onChange={(e) => setFormConfig({ ...formConfig, displayDate: e.target.value })}
                        className="bg-white border border-brand-beige-dark/40 rounded-lg p-2 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-brand-text/60">Hora Desde:</label>
                        <input
                          type="text"
                          value={formConfig.timeFrom}
                          onChange={(e) => setFormConfig({ ...formConfig, timeFrom: e.target.value })}
                          className="bg-white border border-brand-beige-dark/40 rounded-lg p-2 text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-brand-text/60">Hora Hasta:</label>
                        <input
                          type="text"
                          value={formConfig.timeTo}
                          onChange={(e) => setFormConfig({ ...formConfig, timeTo: e.target.value })}
                          className="bg-white border border-brand-beige-dark/40 rounded-lg p-2 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Venue & Location */}
                  <div className="bg-brand-beige-light/50 p-4 rounded-2xl border border-brand-beige space-y-3">
                    <h5 className="text-xs font-bold text-brand-text/80 border-b border-brand-beige pb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-green-dark" />
                      Lugar e Indicaciones
                    </h5>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-brand-text/60">Nombre del Salón:</label>
                      <input
                        type="text"
                        value={formConfig.venue}
                        onChange={(e) => setFormConfig({ ...formConfig, venue: e.target.value })}
                        className="bg-white border border-brand-beige-dark/40 rounded-lg p-2 text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-brand-text/60">Dirección Completa:</label>
                      <input
                        type="text"
                        value={formConfig.address}
                        onChange={(e) => setFormConfig({ ...formConfig, address: e.target.value })}
                        className="bg-white border border-brand-beige-dark/40 rounded-lg p-2 text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-brand-text/60">Enlace de Google Maps:</label>
                      <input
                        type="text"
                        value={formConfig.mapsUrl}
                        onChange={(e) => setFormConfig({ ...formConfig, mapsUrl: e.target.value })}
                        className="bg-white border border-brand-beige-dark/40 rounded-lg p-2 text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-brand-text/60">Celular Receptor WhatsApp (Código país + Nro):</label>
                      <input
                        type="text"
                        placeholder="Ej. 5491123456789"
                        value={formConfig.whatsappPhone}
                        onChange={(e) => setFormConfig({ ...formConfig, whatsappPhone: e.target.value })}
                        className="bg-white border border-brand-beige-dark/40 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>

                  {/* Dress Code & Others */}
                  <div className="bg-brand-beige-light/50 p-4 rounded-2xl border border-brand-beige space-y-3">
                    <h5 className="text-xs font-bold text-brand-text/80 border-b border-brand-beige pb-1 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-brand-green-dark" />
                      Otros Detalles (Límite de RSVP y Vestimenta)
                    </h5>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-brand-text/60">Límite para Confirmar (e.g. "25 de Julio"):</label>
                      <input
                        type="text"
                        value={formConfig.rsvpDeadline}
                        onChange={(e) => setFormConfig({ ...formConfig, rsvpDeadline: e.target.value })}
                        className="bg-white border border-brand-beige-dark/40 rounded-lg p-2 text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-brand-text/60">Título de Vestimenta:</label>
                      <input
                        type="text"
                        value={formConfig.dressCodeTitle}
                        onChange={(e) => setFormConfig({ ...formConfig, dressCodeTitle: e.target.value })}
                        className="bg-white border border-brand-beige-dark/40 rounded-lg p-2 text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-brand-text/60">Detalle de Vestimenta:</label>
                      <textarea
                        value={formConfig.dressCodeDesc}
                        onChange={(e) => setFormConfig({ ...formConfig, dressCodeDesc: e.target.value })}
                        rows={3}
                        className="bg-white border border-brand-beige-dark/40 rounded-lg p-2 text-xs resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <div className="flex justify-end gap-2">
                  <button
                    id="btn-save-config"
                    type="submit"
                    className="px-5 py-2 bg-brand-green-dark hover:bg-brand-green text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-4 h-4 animate-bounce" />
                        ¡Cambios Guardados!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
