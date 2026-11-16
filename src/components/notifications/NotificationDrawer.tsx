import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Bell,
  CheckCheck,
  HeartHandshake,
  Calendar,
  AlertCircle,
  FileCheck2,
  Trophy,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';
import { NotificationType } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const { notifications, unreadCount, service } = useImpactData();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'donation':
        return <HeartHandshake className="w-4 h-4 text-emerald-600" />;
      case 'campaign_deadline':
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'beneficiary_followup':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'expense_approval':
        return <FileCheck2 className="w-4 h-4 text-blue-600" />;
      case 'campaign_milestone':
        return <Trophy className="w-4 h-4 text-indigo-600" />;
      case 'project_milestone':
        return <Activity className="w-4 h-4 text-teal-600" />;
    }
  };

  const handleNotificationClick = (id: string, link?: string) => {
    service.markNotificationRead(id);
    if (link) {
      navigate(link);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Notifications</h2>
                <p className="text-xs text-slate-500">
                  {unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => service.markAllNotificationsRead()}
                  className="text-xs text-brand-700 hover:text-brand-800 font-medium flex items-center gap-1 p-1 hover:bg-brand-50 rounded transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id, notif.link)}
                  className={`p-4 transition-colors cursor-pointer hover:bg-slate-50 flex items-start gap-3.5 ${
                    !notif.isRead ? 'bg-brand-50/20' : 'opacity-85'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-semibold truncate ${
                          !notif.isRead ? 'text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.link && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-brand-700 font-medium group">
                        <span>View details</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    )}
                  </div>
                  {!notif.isRead && (
                    <div className="w-2 h-2 rounded-full bg-brand-600 shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500">
              Live updates for Hope Foundation operations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
