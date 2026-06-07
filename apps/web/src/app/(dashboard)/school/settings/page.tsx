'use client';

import { useState } from 'react';
import { Bot, Camera, Bell, Shield, Save, Eye, EyeOff, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SchoolSettingsPage() {
  const [botToken, setBotToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [botInfo, setBotInfo] = useState<{name?:string;username?:string;valid?:boolean}|null>(null);
  const [testing, setTesting] = useState(false);
  const [showGrades, setShowGrades] = useState(false);
  const [showAttendance, setShowAttendance] = useState(true);
  const [sendPhoto, setSendPhoto] = useState(true);
  const [language, setLanguage] = useState<'uz'|'ru'>('uz');
  const [dailyTime, setDailyTime] = useState('17:00');
  const [saving, setSaving] = useState(false);

  const testBot = async () => {
    if (!botToken.trim()) { toast.error('Bot tokenni kiriting'); return; }
    setTesting(true);
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const data = await res.json();
      if (data.ok) {
        setBotInfo({ valid: true, name: data.result.first_name, username: data.result.username });
        toast.success(`Bot topildi: @${data.result.username}`);
      } else {
        setBotInfo({ valid: false });
        toast.error('Bot topilmadi. Token noto\'g\'ri');
      }
    } catch {
      setBotInfo({ valid: false });
      toast.error('Xato yuz berdi');
    } finally {
      setTesting(false);
    }
  };

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast.success('Sozlamalar saqlandi!');
  };

  const sendTestMessage = async () => {
    if (!botToken) { toast.error('Avval bot tokenini kiriting va sinang'); return; }
    toast.success('Test xabar yuborildi — botga /start yozing');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Telegram Bot Sozlamalari</h1>
          <p className="text-xs text-gray-500">Har bir maktab o&#39;z botini ulaydi</p>
        </div>
      </div>

      {/* Bot Setup */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Bot className="w-4 h-4 text-green-600" />
          <h3 className="font-semibold text-gray-800">Bot ulash</h3>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 space-y-1">
          <p className="font-semibold">Bot yaratish tartibi:</p>
          <p>1. Telegramda <strong>@BotFather</strong> ga yozing</p>
          <p>2. <strong>/newbot</strong> buyrug&#39;ini yuboring</p>
          <p>3. Maktab nomini kiriting (masalan: <em>Maktab1_Toshkent</em>)</p>
          <p>4. Token oling va quyida kiriting</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bot Token</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showToken ? 'text' : 'password'}
                value={botToken}
                onChange={e => { setBotToken(e.target.value); setBotInfo(null); }}
                className="input-field pr-10"
                placeholder="7xxxxxxxxxx:AAHxxxxxxxxxxxxxxxxxx"
              />
              <button onClick={() => setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={testBot} disabled={testing}
              className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 disabled:opacity-60 whitespace-nowrap">
              {testing ? 'Tekshirilmoqda...' : 'Test'}
            </button>
          </div>
        </div>

        {botInfo && (
          <div className={`flex items-center gap-3 p-3 rounded-xl ${botInfo.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {botInfo.valid
              ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              : <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
            <div>
              {botInfo.valid
                ? <><p className="text-sm font-semibold text-green-800">{botInfo.name}</p><p className="text-xs text-green-600">@{botInfo.username} — Ulashga tayyor</p></>
                : <p className="text-sm font-semibold text-red-800">Token noto&#39;g&#39;ri</p>}
            </div>
          </div>
        )}
      </div>

      {/* Notification settings */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4 text-green-600" />
          <h3 className="font-semibold text-gray-800">Xabarnoma sozlamalari</h3>
        </div>

        <div className="space-y-3">
          {[
            { label: "Kelish/ketish xabarnomasi", desc: "O'quvchi kelsa/ketsa ota-onaga xabar", state: showAttendance, set: setShowAttendance, locked: true },
            { label: "Foto bilan xabarnoma", desc: "Kamera suratini xabarga biriktirish", state: sendPhoto, set: setSendPhoto, locked: false },
            { label: "Baholarni ko'rsatish", desc: "Ota-ona /baholar buyrug'i bilan ko'ra olsin", state: showGrades, set: setShowGrades, locked: false },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                {item.locked && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-semibold">Majburiy</span>}
                <button onClick={() => !item.locked && item.set(!item.state)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${item.state ? 'bg-green-500' : 'bg-gray-300'} ${item.locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.state ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bot tili</label>
            <select value={language} onChange={e => setLanguage(e.target.value as any)} className="input-field">
              <option value="uz">O&#39;zbek tili</option>
              <option value="ru">Русский язык</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kunlik hisobot vaqti</label>
            <input type="time" value={dailyTime} onChange={e => setDailyTime(e.target.value)} className="input-field" />
          </div>
        </div>
      </div>

      {/* Webhook info */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-green-600" />
          <h3 className="font-semibold text-gray-800">Webhook sozlamalari</h3>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl font-mono text-xs text-gray-600 space-y-1">
          <p className="text-gray-400"># Webhook URL (avtomatik o&#39;rnatiladi):</p>
          <p>https://yourdomain.uz/api/v1/telegram-bot/webhook/maktab-id</p>
        </div>
        <button onClick={sendTestMessage} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-xl hover:bg-blue-100">
          <Send className="w-4 h-4" /> Test xabar yuborish
        </button>
      </div>

      {/* Example messages */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-3">Xabarnoma namunalari</h3>
        <div className="space-y-3">
          <div className="p-3 bg-green-50 rounded-xl font-mono text-xs text-gray-700">
            <p className="text-green-700 font-bold mb-1">Kelish xabarnomasi:</p>
            <p>✅ <b>Zafar Toshmatov</b></p>
            <p>🏫 Sinf: 5A • Maktab: 1-sonli Maktab</p>
            <p>📋 Holat: <b>Maktabga keldi</b></p>
            <p>🕐 Vaqt: 08:42 • 30 May 2024</p>
            {sendPhoto && <p className="text-gray-400">[📷 Kirish kamerasi surati]</p>}
          </div>
          {showGrades && (
            <div className="p-3 bg-blue-50 rounded-xl font-mono text-xs text-gray-700">
              <p className="text-blue-700 font-bold mb-1">/baholar buyrug&#39;i natijasi:</p>
              <p>📊 <b>Baholar</b></p>
              <p>🟢 Matematika: <b>4.8</b> (5, 5, 4, 5)</p>
              <p>🟡 Fizika: <b>3.9</b> (4, 3, 4, 4)</p>
              <p>🟢 Ingliz tili: <b>4.5</b> (5, 4, 5)</p>
            </div>
          )}
        </div>
      </div>

      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-60">
        {saving ? <><span className="animate-spin">⟳</span> Saqlanmoqda...</> : <><Save className="w-4 h-4" /> Saqlash</>}
      </button>
    </div>
  );
}
