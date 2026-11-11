import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useBookingChat, useSendChatMessage } from '../api/chatApi';

const MessagesPage = () => {
  const { bookingId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { data: chat, isLoading, isError } = useBookingChat(bookingId);
  const { mutate: sendMessage, isPending } = useSendChatMessage();
  const [content, setContent] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <Link to="/login" className="text-primary-500 font-bold">Sign in to view messages</Link>
      </div>
    );
  }

  if (isLoading) return <div className="min-h-screen pt-32 text-center text-gray-500">Loading conversation...</div>;
  if (isError) return <div className="min-h-screen pt-32 text-center text-red-500">Unable to load messages.</div>;

  const onSend = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    sendMessage({ bookingId, content: content.trim() }, { onSuccess: () => setContent('') });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking messages</h1>
          <Link to="/dashboard" className="text-primary-500 text-sm font-semibold">← Dashboard</Link>
        </div>
        <div className="glass-card rounded-3xl flex flex-col h-[32rem]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chat.messages?.length ? (
              chat.messages.map((msg) => {
                const mine = msg.senderId === user.id;
                return (
                  <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${mine ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'}`}>
                      {!mine && (
                        <p className="text-xs opacity-70 mb-1">{msg.sender?.firstName} {msg.sender?.lastName}</p>
                      )}
                      {msg.content}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 text-sm">No messages yet. Say hello to coordinate pickup.</p>
            )}
          </div>
          <form onSubmit={onSend} className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            />
            <button type="submit" disabled={isPending} className="px-6 rounded-xl bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold disabled:opacity-50">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
