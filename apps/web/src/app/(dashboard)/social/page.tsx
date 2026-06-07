'use client';

import { useState } from 'react';
import {
  Heart, MessageCircle, Share2, MoreHorizontal, Award,
  Send, Image, Smile, Bookmark, TrendingUp, Users
} from 'lucide-react';
import { cn, getInitials, formatRelativeTime } from '@/lib/utils';

const posts = [
  {
    id: '1',
    author: { name: 'Dilnoza Yusupova', title: 'HR Director', avatar: null },
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    content: '🎉 Welcome our newest team members who joined this month! Jasur Karimov (Engineering), Malika Hamidova (HR), and Sherzod Alimov (Finance). We are excited to have you on board at Nexus Group!',
    likes: 24,
    comments: 8,
    liked: false,
    type: 'announcement',
  },
  {
    id: '2',
    author: { name: 'Bobur Rashidov', title: 'CTO', avatar: null },
    time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    content: 'Great job to the Engineering team! We successfully deployed our new microservices architecture this week. Zero downtime, seamless transition. Proud of every single one of you! 💪',
    likes: 41,
    comments: 12,
    liked: true,
    type: 'post',
  },
  {
    id: '3',
    author: { name: 'Aziz Nazarov', title: 'CEO', avatar: null },
    time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    content: 'Q1 results are in — and they are outstanding! Revenue up 34% YoY, team efficiency improved by 18%. This is the result of hard work by every department. Let\'s keep this momentum going into Q2! 🚀',
    likes: 68,
    comments: 22,
    liked: false,
    type: 'announcement',
  },
  {
    id: '4',
    author: { name: 'Kamola Umarova', title: 'L&D Specialist', avatar: null },
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    content: 'Reminder: The Excel & Google Sheets workshop is scheduled for this Friday at 14:00. It\'s available for all staff. Only 5 seats remaining — register now in the Training portal!',
    likes: 15,
    comments: 4,
    liked: false,
    type: 'event',
  },
];

const recognitions = [
  { from: 'Bobur Rashidov', to: 'Sardor Toshev', badge: '⭐', message: 'Excellent frontend work on the new dashboard', time: '2 hours ago' },
  { from: 'Dilnoza Yusupova', to: 'Malika Hamidova', badge: '🚀', message: 'Outstanding performance in the new hire onboarding', time: '1 day ago' },
  { from: 'Aziz Nazarov', to: 'Mirzo Tursunov', badge: '💡', message: 'Innovative approach to the Q1 financial planning', time: '2 days ago' },
];

const typeConfig: Record<string, { bg: string; text: string; label: string }> = {
  announcement: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Announcement' },
  event: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Event' },
  post: { bg: 'bg-gray-50', text: 'text-gray-600', label: 'Post' },
};

function PostCard({ post }: { post: typeof posts[0] }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const tc = typeConfig[post.type];

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          {getInitials(post.author.name.split(' ')[0] || '', post.author.name.split(' ')[1] || '')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900">{post.author.name}</span>
            <span className="text-xs text-gray-400">{post.author.title}</span>
            {post.type !== 'post' && (
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', tc.bg, tc.text)}>
                {tc.label}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(post.time)}</div>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>

      <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={cn('flex items-center gap-1.5 text-sm transition-colors', liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400')}
        >
          <Heart className={cn('w-4 h-4', liked && 'fill-current')} /> {likes}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-500 transition-colors">
          <MessageCircle className="w-4 h-4" /> {post.comments}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-500 transition-colors">
          <Share2 className="w-4 h-4" /> Share
        </button>
        <button className="ml-auto text-gray-400 hover:text-blue-500 transition-colors">
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function SocialPage() {
  const [newPost, setNewPost] = useState('');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Social Feed</h1>
        <p className="page-subtitle">Company news, announcements, and employee recognition</p>
      </div>

      <div className="flex gap-6">
        {/* Feed */}
        <div className="flex-1 space-y-4">
          {/* Compose */}
          <div className="card p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                HR
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share an update, announcement, or recognition..."
                  className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none outline-none min-h-[60px]"
                  rows={2}
                />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                      <Image className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                      <Smile className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                      <Award className="w-4 h-4" />
                    </button>
                  </div>
                  <button className={cn('btn-primary text-sm py-1.5 px-3', !newPost.trim() && 'opacity-50 cursor-not-allowed')} disabled={!newPost.trim()}>
                    <Send className="w-3.5 h-3.5" /> Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>

        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 space-y-4">
          {/* Recognitions */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-yellow-500" />
              <h3 className="text-sm font-semibold text-gray-900">Recent Recognitions</h3>
            </div>
            <div className="space-y-3">
              {recognitions.map((r, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-xl flex-shrink-0">{r.badge}</span>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">{r.from}</span>
                      <span className="text-gray-400"> recognized </span>
                      <span className="font-medium text-blue-600">{r.to}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 truncate">{r.message}</div>
                    <div className="text-xs text-gray-300 mt-0.5">{r.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-3">
              {[
                { label: 'Posts & Announcements', value: 14, icon: TrendingUp, color: 'text-blue-500' },
                { label: 'Recognitions Given', value: 23, icon: Award, color: 'text-yellow-500' },
                { label: 'Active Members', value: 42, icon: Users, color: 'text-green-500' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon className={cn('w-3.5 h-3.5', s.color)} />
                      {s.label}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{s.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
