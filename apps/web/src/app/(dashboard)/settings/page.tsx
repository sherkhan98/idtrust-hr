'use client';

import { useState } from 'react';
import { Settings, Building2, Users, Bell, Shield, Globe, Palette, CreditCard, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'hr', label: 'HR Settings', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'localization', label: 'Localization', icon: Globe },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your company and platform settings</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0">
          <div className="card p-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50',
                )}
              >
                <tab.icon className={cn('w-4 h-4', activeTab === tab.id ? 'text-blue-600' : 'text-gray-400')} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card p-6">
            {activeTab === 'company' && (
              <div className="space-y-6">
                <h2 className="text-base font-semibold text-gray-900">Company Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Company Name', value: 'Nexus Group LLC', placeholder: 'Enter company name' },
                    { label: 'Company Slug', value: 'nexus-group', placeholder: 'url-friendly-name' },
                    { label: 'Industry', value: 'Technology', placeholder: 'Select industry' },
                    { label: 'Phone', value: '+998 (71) 200-00-00', placeholder: 'Company phone' },
                    { label: 'Website', value: 'https://nexusgroup.uz', placeholder: 'https://...' },
                    { label: 'Address', value: 'Tashkent, Uzbekistan', placeholder: 'Company address' },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                      <input defaultValue={field.value} placeholder={field.placeholder} className="input-field" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button className="btn-primary"><Save className="w-4 h-4" />Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'hr' && (
              <div className="space-y-6">
                <h2 className="text-base font-semibold text-gray-900">HR Configuration</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Working Hours', subLabel: 'Standard working hours per day', value: '8', type: 'number' },
                    { label: 'Work Days', subLabel: 'Standard work days per week', value: '5', type: 'number' },
                    { label: 'Annual Leave Days', subLabel: 'Default annual leave allocation', value: '24', type: 'number' },
                    { label: 'Probation Period (months)', subLabel: 'Default probation period', value: '3', type: 'number' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{s.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{s.subLabel}</div>
                      </div>
                      <input type={s.type} defaultValue={s.value} className="input-field w-24 text-center" />
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                    <div>
                      <div className="text-sm font-medium text-gray-800">Currency</div>
                      <div className="text-xs text-gray-400">Primary currency for payroll</div>
                    </div>
                    <select className="input-field w-28">
                      <option value="UZS">UZS</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="btn-primary"><Save className="w-4 h-4" />Save</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-base font-semibold text-gray-900">Notification Settings</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Telegram Notifications', desc: 'Send HR notifications via Telegram bot', enabled: true },
                    { label: 'SMS Notifications (Eskiz)', desc: 'Send SMS for important HR events', enabled: true },
                    { label: 'Email Notifications', desc: 'Send email notifications to employees', enabled: true },
                    { label: 'Push Notifications', desc: 'Mobile app push notifications', enabled: true },
                    { label: 'Attendance Alerts', desc: 'Alert managers on late or absent employees', enabled: false },
                    { label: 'Leave Request Alerts', desc: 'Notify managers of leave requests', enabled: true },
                    { label: 'Payroll Notifications', desc: 'Notify employees when payroll is processed', enabled: true },
                    { label: 'Birthday Reminders', desc: 'Remind HR of upcoming employee birthdays', enabled: true },
                  ].map((n) => (
                    <div key={n.label} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{n.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{n.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={n.enabled} className="sr-only peer" />
                        <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:outline-none transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-base font-semibold text-gray-900">Security Settings</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Two-Factor Authentication (MFA)', desc: 'Require MFA for all admin users', enabled: true },
                    { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', enabled: true },
                    { label: 'IP Whitelist', desc: 'Restrict access to specific IP addresses', enabled: false },
                    { label: 'Audit Logging', desc: 'Log all user actions for compliance', enabled: true },
                    { label: 'Password Policy', desc: 'Require strong passwords (min 8 chars, mixed)', enabled: true },
                    { label: 'Failed Login Protection', desc: 'Lock account after 5 failed login attempts', enabled: true },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{s.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{s.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={s.enabled} className="sr-only peer" />
                        <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'localization' || activeTab === 'appearance' || activeTab === 'billing') && (
              <div className="text-center py-12 text-gray-400">
                <Settings className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">This section is coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
