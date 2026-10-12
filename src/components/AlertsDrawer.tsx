import React, { useState } from 'react';
import { X, Bell, AlertTriangle, AlertCircle, Info, Mail, Send, Check } from 'lucide-react';
import { AutomatedAlert } from '../types';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: AutomatedAlert[];
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({ isOpen, onClose, alerts }) => {
  const [activeEmailAlert, setActiveEmailAlert] = useState<AutomatedAlert | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  if (!isOpen) return null;

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
      setActiveEmailAlert(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 text-slate-200 h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Automated OBE Alerts</h3>
              <p className="text-xs text-slate-400">{alerts.length} proactive alerts active</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.map(alert => {
            const isHigh = alert.severity === 'high';
            const isMedium = alert.severity === 'medium';

            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  isHigh
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    : isMedium
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-sky-950/30 border-sky-500/40 text-sky-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 font-bold mb-1">
                    {isHigh ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    ) : isMedium ? (
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Info className="w-4 h-4 text-sky-400" />
                    )}
                    <span className="text-white text-xs">{alert.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{alert.date}</span>
                </div>

                <p className="text-slate-300 text-xs mb-3 leading-relaxed">
                  {alert.message}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Recipient: {alert.emailRecipient}
                  </span>
                  <button
                    onClick={() => setActiveEmailAlert(alert)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium text-[11px] border border-slate-700 transition-colors"
                  >
                    <Mail className="w-3 h-3 text-indigo-400" />
                    <span>Preview Notice</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Simulated Email Modal overlay inside drawer */}
        {activeEmailAlert && (
          <div className="absolute inset-0 bg-slate-950/90 z-20 p-4 flex flex-col justify-center">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <Mail className="w-4 h-4 text-sky-400" />
                  <span>Simulated Dispatch Notice</span>
                </span>
                <button
                  onClick={() => setActiveEmailAlert(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">To:</span>
                <p className="font-mono text-slate-200">{activeEmailAlert.emailRecipient}</p>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Subject:</span>
                <p className="font-semibold text-white">{activeEmailAlert.emailPreview.subject}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                {activeEmailAlert.emailPreview.body}
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setActiveEmailAlert(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={emailSent}
                  className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md transition-colors"
                >
                  {emailSent ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Dispatched!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Alert</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
