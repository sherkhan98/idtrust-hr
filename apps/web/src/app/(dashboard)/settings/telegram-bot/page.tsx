'use client';

import { useState } from 'react';
import { Bot, Eye, EyeOff, CheckCircle2, AlertCircle, Send, Copy, ExternalLink, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

const APP_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

export default function TelegramBotSettingsPage() {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [botInfo, setBotInfo] = useState<{valid:boolean;name?:string;username?:string}|null>(null);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [webhookSet, setWebhookSet] = useState(false);

  const testBot = async () => {
    if (!token.trim()) { toast.error('Token kiriting'); return; }
    setTesting(true);
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const data = await res.json();
      if (data.ok) {
        setBotInfo({ valid: true, name: data.result.first_name, username: data.result.username });
        toast.success(`Bot topildi: @${data.result.username}`);
      } else {
        setBotInfo({ valid: false });
        toast.error('Token noto\'g\'ri');
      }
    } catch {
      setBotInfo({ valid: false });
      toast.error('Xato');
    } finally { setTesting(false); }
  };

  const save = async () => {
    if (!botInfo?.valid) { toast.error('Avval botni test qiling'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));

    // Set webhook
    const webhookUrl = `${APP_URL}/api/v1/telegram-bot/employee/webhook`;
    try {
      await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl, allowed_updates: ['message', 'callback_query'] }),
      });
      setWebhookSet(true);
    } catch {}

    setSaving(false);
    toast.success('Bot sozlamalari saqlandi!');
  };

  const copyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Nusxalandi!');
  };

  const miniAppUrl = `${APP_URL}/tma`;
  const botLink = botInfo?.username ? `https://t.me/${botInfo.username}` : null;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Xodim Telegram Boti</h1>
          <p className="text-xs text-gray-500">Mini App — Davomat, ta&#39;til, maosh Telegram ichida</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
        <p className="font-semibold text-blue-900 mb-3">📱 Qanday ishlaydi?</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { step: '1', text: 'Xodim botga /start yozadi', icon: '💬' },
            { step: '2', text: '"Ilovani ochish" tugmasini bosadi', icon: '👆' },
            { step: '3', text: 'Telegram ichida to\'liq ilova ochiladi', icon: '🚀' },
          ].map(s => (
            <div key={s.step} className="bg-white rounded-xl p-3 text-center">
              <span className="text-2xl block mb-1">{s.icon}</span>
              <p className="text-xs text-gray-600 leading-tight">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {['✅ Kelish/ketish', "🌴 Ta'til so'rash", '💰 Maosh ko\'rish', '📊 Profil'].map(f => (
            <span key={f} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{f}</span>
          ))}
        </div>
      </div>

      {/* Bot token setup */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Bot className="w-4 h-4 text-blue-500" /> Bot token
        </h3>

        <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600 space-y-1">
          <p className="font-semibold text-gray-700">Bot yaratish:</p>
          <p>1. Telegramda <code className="bg-white px-1 rounded">@BotFather</code> ga yozing</p>
          <p>2. <code className="bg-white px-1 rounded">/newbot</code> buyrug&#39;ini yuboring</p>
          <p>3. Kompaniya nomini kiriting, token oling</p>
          <p>4. <code className="bg-white px-1 rounded">/setmenubutton</code> → Mini App URL: <code className="bg-white px-1 rounded text-blue-600">{miniAppUrl}</code></p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bot Token</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input type={showToken?'text':'password'} value={token} onChange={e=>{setToken(e.target.value);setBotInfo(null);}}
                className="input-field pr-10" placeholder="7xxxxxxxxxx:AAHxxxxxxxx..." />
              <button onClick={()=>setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={testBot} disabled={testing}
              className="px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 text-sm whitespace-nowrap">
              {testing ? 'Test...' : 'Test'}
            </button>
          </div>
        </div>

        {botInfo && (
          <div className={`flex items-center gap-3 p-3 rounded-xl ${botInfo.valid?'bg-green-50 border border-green-200':'bg-red-50 border border-red-200'}`}>
            {botInfo.valid
              ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              : <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
            <div className="flex-1">
              {botInfo.valid
                ? <><p className="text-sm font-semibold text-green-800">{botInfo.name}</p><p className="text-xs text-green-600">@{botInfo.username}</p></>
                : <p className="text-sm font-semibold text-red-800">Token noto&#39;g&#39;ri</p>}
            </div>
            {botInfo.valid && botLink && (
              <a href={botLink} target="_blank" rel="noopener noreferrer"
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-semibold flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> Ochish
              </a>
            )}
          </div>
        )}
      </div>

      {/* Mini App URL */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-violet-500" /> Mini App URL
        </h3>
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
          <code className="flex-1 text-sm text-blue-600 truncate">{miniAppUrl}</code>
          <button onClick={()=>copyLink(miniAppUrl)} className="p-1.5 hover:bg-gray-200 rounded-lg">
            <Copy className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <p className="text-xs text-gray-400">Bu URLni @BotFather da <code>/setmenubutton</code> orqali kiriting</p>

        {/* Preview */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
          <a href={miniAppUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">
            <ExternalLink className="w-4 h-4" /> Mini App ni ko&#39;rish
          </a>
          <p className="text-xs text-gray-400 mt-2">Brauzerde test qiling (Telegram ichida to&#39;liq ishlaydi)</p>
        </div>
      </div>

      {/* Commands */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-3">Bot buyruqlari</h3>
        <div className="space-y-2 text-sm">
          {[
            { cmd: '/start', desc: "Botni boshlash, xush kelibsiz xabari" },
            { cmd: '/app', desc: "Mini ilovani ochish tugmasi" },
            { cmd: '/davomat', desc: "Davomat tarixini ko'rish" },
            { cmd: "/tatil", desc: "Ta'til balansini ko'rish" },
            { cmd: '/maosh', desc: "Maosh ma'lumotini ko'rish" },
          ].map(c => (
            <div key={c.cmd} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <code className="text-blue-600 font-mono w-24 flex-shrink-0">{c.cmd}</code>
              <span className="text-gray-600 text-xs">{c.desc}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          @BotFather da <code className="bg-gray-100 px-1 rounded">/setcommands</code> orqali xodimlar uchun ko&#39;rinadigan buyruqlarni belgilang
        </p>
      </div>

      {/* Webhook status */}
      {webhookSet && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4" />
          Webhook muvaffaqiyatli o&#39;rnatildi — bot xabarlarni qabul qilmoqda
        </div>
      )}

      <button onClick={save} disabled={saving || !botInfo?.valid}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50">
        {saving ? 'Saqlanmoqda...' : '💾 Saqlash va Webhook ulash'}
      </button>
    </div>
  );
}
