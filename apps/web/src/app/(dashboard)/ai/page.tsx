'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Brain, Send, Sparkles, TrendingUp, Users, Calendar,
  BarChart3, AlertTriangle, RefreshCw, Copy, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const QUICK_PROMPTS = [
  { icon: TrendingUp, label: 'Turnover Analysis', prompt: 'Analyze our employee turnover for the last 6 months and suggest retention strategies.' },
  { icon: Users, label: 'Hiring Forecast', prompt: 'Based on current growth, how many employees should we hire in Q3 2024?' },
  { icon: Calendar, label: 'Leave Patterns', prompt: 'Are there any unusual leave patterns I should be aware of this quarter?' },
  { icon: BarChart3, label: 'KPI Insights', prompt: 'Which departments have the lowest KPI scores and what might be causing this?' },
  { icon: AlertTriangle, label: 'Attendance Risk', prompt: 'Identify employees with high absenteeism risk based on recent attendance data.' },
  { icon: Sparkles, label: 'Salary Review', prompt: 'When should we conduct the next salary review and what factors should we consider?' },
];

const SAMPLE_RESPONSES: Record<string, string> = {
  default: `Based on the data from your StaffFlow HR system, here is my analysis:

**Key Findings:**
- Employee attendance rate is 94.2% this month, which is above the industry average of 91%
- Engineering department has the highest KPI score at 87%, followed by HR at 83%
- 3 employees have shown consistent late arrivals in the past 2 weeks

**Recommendations:**
1. Consider recognizing top performers in Engineering to maintain motivation
2. Schedule a 1:1 with the 3 employees showing attendance issues
3. The Finance department KPI score of 71% warrants attention — consider additional training resources

Would you like me to generate a detailed report or take any specific action?`,
  turnover: `**Turnover Analysis — Last 6 Months**

Your current turnover rate is **8.4%**, which is below the regional average of 12.3% for technology companies in Uzbekistan.

**Breakdown by Department:**
- Engineering: 3.2% (Low risk ✅)
- Sales: 18.7% (High risk ⚠️)
- Finance: 5.1% (Normal)
- HR: 2.0% (Excellent ✅)

**Root Causes Identified:**
1. Sales team shows high turnover due to aggressive targets without proportional compensation
2. 2 of 3 departures cited "limited growth opportunities"

**Recommended Actions:**
- Implement a Sales career ladder with clear promotion criteria
- Consider a performance-based bonus structure for Sales
- Conduct stay interviews with top performers in Sales

Would you like me to draft a retention plan for the Sales team?`,
};

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hello! I'm your **StaffFlow AI Assistant**. I have access to your HR data and can help you with:

- 📊 Analyzing employee performance and attendance trends
- 🎯 Identifying retention risks and suggesting actions
- 📅 Forecasting hiring needs based on growth patterns
- 💡 Providing insights on payroll, KPIs, and leave patterns
- 📝 Drafting HR policies and communication templates

What would you like to know about your workforce today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const lowerText = text.toLowerCase();
    const responseContent = lowerText.includes('turnover')
      ? SAMPLE_RESPONSES.turnover
      : SAMPLE_RESPONSES.default;

    const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: responseContent, timestamp: new Date() };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listBuffer: string[] = [];
    let listType: 'ul' | 'ol' | null = null;

    const flushList = () => {
      if (listBuffer.length === 0) return;
      const key = `list-${elements.length}`;
      if (listType === 'ul') {
        elements.push(
          <ul key={key} className="list-disc ml-5 space-y-1 my-1">
            {listBuffer.map((item, j) => (
              <li key={j} className="text-sm text-gray-700">{item}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={key} className="list-decimal ml-5 space-y-1 my-1">
            {listBuffer.map((item, j) => (
              <li key={j} className="text-sm text-gray-700">{item}</li>
            ))}
          </ol>
        );
      }
      listBuffer = [];
      listType = null;
    };

    lines.forEach((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        flushList();
        elements.push(<p key={i} className="font-semibold text-gray-900 mt-3 mb-1">{line.slice(2, -2)}</p>);
      } else if (line.startsWith('- ')) {
        if (listType !== 'ul') { flushList(); listType = 'ul'; }
        listBuffer.push(line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1'));
      } else if (/^\d+\./.test(line)) {
        if (listType !== 'ol') { flushList(); listType = 'ol'; }
        listBuffer.push(line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '$1'));
      } else if (line.trim() === '') {
        flushList();
        elements.push(<br key={i} />);
      } else {
        flushList();
        elements.push(
          <p key={i} className="text-sm text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        );
      }
    });
    flushList();
    return elements;
  };

  return (
    <div className="space-y-5 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="page-title">AI Assistant</h1>
          <p className="page-subtitle">Powered by GPT-4 · Connected to your HR data</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Connected to StaffFlow data
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-3 gap-3 flex-shrink-0">
          {QUICK_PROMPTS.map((qp) => {
            const Icon = qp.icon;
            return (
              <button
                key={qp.label}
                onClick={() => handleSend(qp.prompt)}
                className="card p-4 text-left hover:shadow-md transition-all hover:border-blue-200 border border-transparent group"
              >
                <Icon className="w-5 h-5 text-blue-500 mb-2" />
                <div className="text-sm font-medium text-gray-900">{qp.label}</div>
                <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">{qp.prompt}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Brain className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={cn(
              'max-w-2xl rounded-2xl px-5 py-4',
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-white border border-gray-100 shadow-sm rounded-bl-sm'
            )}>
              {msg.role === 'user' ? (
                <p className="text-sm">{msg.content}</p>
              ) : (
                <div className="space-y-1">{renderContent(msg.content)}</div>
              )}
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 rounded hover:bg-green-50 transition-colors text-gray-400 hover:text-green-600">
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 rounded hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500">
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 ml-auto">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-5 py-4">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="card p-3 flex-shrink-0">
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your HR data... (Shift+Enter for new line)"
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 resize-none outline-none max-h-32 min-h-[40px]"
            rows={1}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className={cn(
              'p-2.5 rounded-xl transition-all flex-shrink-0',
              input.trim() && !isTyping
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <Sparkles className="w-3 h-3" />
          AI responses are based on your company data. Always verify important decisions.
        </div>
      </div>
    </div>
  );
}
