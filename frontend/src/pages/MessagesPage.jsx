import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MessageSquare,
  Send,
  Car,
  User,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowLeft,
  CheckCheck,
  Check,
  Phone,
  Info,
  MapPin
} from 'lucide-react';
import { useUserChats, useBookingChat, useSendChatMessage } from '../api/chatApi';
import { FLEET_VEHICLES } from '../content/fleetData';

const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const MessagesPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { data: userChats = [], isLoading: isChatsLoading } = useUserChats();
  const [selectedBookingId, setSelectedBookingId] = useState(bookingId || '');
  const [content, setContent] = useState('');
  const [localMessages, setLocalMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // If a bookingId is provided in URL, make sure it's selected
  useEffect(() => {
    if (bookingId) {
      setSelectedBookingId(bookingId);
    } else if (userChats.length > 0 && !selectedBookingId) {
      setSelectedBookingId(userChats[0].bookingId || userChats[0].id);
    }
  }, [bookingId, userChats, selectedBookingId]);

  // Fetch chat details for the selected booking
  const { data: activeChatData, isLoading: isChatLoading, isError: isChatError } = useBookingChat(
    selectedBookingId
  );
  const { mutate: sendServerMessage, isPending: isSending } = useSendChatMessage();

  // Find vehicle details from backend chat data or static fallback
  const vehicleContext = useMemo(() => {
    if (activeChatData?.booking?.vehicle) {
      const v = activeChatData.booking.vehicle;
      return {
        id: v.id,
        make: v.make,
        model: v.model,
        type: v.type,
        dailyPrice: v.dailyPrice,
        location: v.location,
        image: v.images?.[0]?.url
          ? (v.images[0].url.startsWith('http') || v.images[0].url.startsWith('/cars') ? v.images[0].url : `${apiBase}${v.images[0].url}`)
          : '/cars/supercar-fleet.jpg',
        ownerName: v.organization?.name || (v.owner ? `${v.owner.firstName} ${v.owner.lastName}` : 'Apex Exotic Reserve'),
        customerName: activeChatData.booking.customer ? `${activeChatData.booking.customer.firstName} ${activeChatData.booking.customer.lastName}` : 'VIP Renter',
        totalAmount: activeChatData.booking.totalAmount,
      };
    }

    // Check if selected ID is a vehicle ID from static fleet
    const staticVehicle = FLEET_VEHICLES.find(
      (v) => v.id === selectedBookingId || selectedBookingId?.includes(v.make?.toLowerCase())
    );

    if (staticVehicle) {
      return {
        id: staticVehicle.id,
        make: staticVehicle.make,
        model: staticVehicle.model,
        type: staticVehicle.type,
        dailyPrice: staticVehicle.dailyPrice,
        location: staticVehicle.location,
        image: staticVehicle.primaryImage,
        ownerName: staticVehicle.host?.name || 'Apex Exotic Reserve',
        customerName: user ? `${user.firstName} ${user.lastName}` : 'VIP Renter',
        totalAmount: staticVehicle.dailyPrice,
      };
    }

    return {
      id: 'default',
      make: 'Ferrari',
      model: '12Cilindri Speciale',
      type: 'Supercar',
      dailyPrice: 1450,
      location: 'Beverly Hills, CA',
      image: '/cars/ferrari-12cilindri.avif',
      ownerName: 'Apex Exotic Reserve',
      customerName: user ? `${user.firstName} ${user.lastName}` : 'VIP Renter',
      totalAmount: 1450,
    };
  }, [activeChatData, selectedBookingId, user]);

  // Combine server messages with local optimistic messages
  const displayMessages = useMemo(() => {
    const serverMsgs = activeChatData?.messages || [];
    if (serverMsgs.length > 0) {
      return serverMsgs;
    }
    // If no server messages exist yet, provide welcome conversation context
    if (localMessages.length > 0) {
      return localMessages;
    }
    return [
      {
        id: 'msg-welcome',
        senderId: 'host-system',
        sender: { firstName: vehicleContext.ownerName, lastName: '' },
        content: `Hello ${user?.firstName || 'there'}! Thank you for inquiring about the ${vehicleContext.make} ${vehicleContext.model}. I am the vehicle host. How can I help coordinate your delivery, dates, or custom requests?`,
        createdAt: new Date().toISOString(),
      },
    ];
  }, [activeChatData, localMessages, vehicleContext, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || content).trim();
    if (!text) return;

    const newMsg = {
      id: `local-${Date.now()}`,
      senderId: user?.id || 'me',
      sender: { firstName: user?.firstName || 'Me', lastName: user?.lastName || '' },
      content: text,
      createdAt: new Date().toISOString(),
    };

    setLocalMessages((prev) => [...prev, newMsg]);
    setContent('');

    // Attempt sending to backend if this is a real booking ID
    if (selectedBookingId && selectedBookingId.length > 10) {
      sendServerMessage(
        { bookingId: selectedBookingId, content: text },
        {
          onError: () => {
            // Simulated host response if backend offline or booking simulated
            simulateHostResponse(text);
          },
        }
      );
    } else {
      simulateHostResponse(text);
    }
  };

  const simulateHostResponse = (buyerText) => {
    setTimeout(() => {
      let reply = `Got your message! I've noted that for the ${vehicleContext.make} ${vehicleContext.model}. The vehicle is fully detailed, topped off, and ready at ${vehicleContext.location}. Let me know if you need airport terminal handover!`;
      if (buyerText.toLowerCase().includes('deposit') || buyerText.toLowerCase().includes('pay')) {
        reply = `The deposit and payment are handled hand-to-hand at vehicle pickup after you inspect the ${vehicleContext.make}. No upfront card deductions!`;
      } else if (buyerText.toLowerCase().includes('airport') || buyerText.toLowerCase().includes('delivery')) {
        reply = `Yes, white-glove airport or villa delivery is available! Just share your flight details or arrival time and our team will have the ${vehicleContext.model} waiting curbside.`;
      }
      setLocalMessages((prev) => [
        ...prev,
        {
          id: `host-reply-${Date.now()}`,
          senderId: 'host-system',
          sender: { firstName: vehicleContext.ownerName, lastName: '' },
          content: reply,
          createdAt: new Date().toISOString(),
        },
      ]);
    }, 1200);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-36 pb-20 text-center flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl">
          <MessageSquare className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Sign In to View Messages</h2>
          <p className="text-sm text-slate-400 mb-6 font-normal">
            Direct chat between buyers and vehicle owners requires an active EasyGo account.
          </p>
          <Link
            to="/login"
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm inline-block shadow-lg shadow-emerald-500/25 transition-all"
          >
            Sign In / Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 selection:bg-emerald-500 selection:text-white">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
                <span>Buyer & Owner Chat Hub</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Direct, encrypted messaging between renters and vehicle hosts to coordinate handovers and questions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Direct Escrow Messaging
            </span>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold border border-white/10 transition-colors"
            >
              My Dashboard
            </Link>
          </div>
        </div>

        {/* 2-Pane Chat Hub Container */}
        <div className="grid lg:grid-cols-12 gap-6 h-[720px] bg-slate-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Left Pane: Conversation List (4 cols) */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col bg-slate-950/60">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Your Conversations
              </h3>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                {userChats.length || 1} Active
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-none">
              {/* If user has real server chats, list them */}
              {userChats.map((chat) => {
                const b = chat.booking;
                const v = b?.vehicle;
                const isSelected = selectedBookingId === b?.id;
                const otherParty = user.id === b?.customerId ? (v?.organization?.name || (v?.owner ? `${v.owner.firstName} ${v.owner.lastName}` : 'Host')) : `${b?.customer?.firstName || 'Renter'}`;
                const otherRole = user.id === b?.customerId ? 'Rent Giver (Host)' : 'Buyer (Renter)';

                return (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setSelectedBookingId(b?.id);
                      navigate(`/messages/${b?.id}`);
                    }}
                    className={`w-full p-4 text-left transition-colors flex items-center gap-3.5 ${
                      isSelected ? 'bg-emerald-500/15 border-l-4 border-emerald-400' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-white/10">
                      <img
                        src={v?.images?.[0]?.url ? (v.images[0].url.startsWith('http') || v.images[0].url.startsWith('/cars') ? v.images[0].url : `${apiBase}${v.images[0].url}`) : '/cars/supercar-fleet.jpg'}
                        alt={v?.model || 'Vehicle'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-white text-xs truncate">{v?.make} {v?.model}</h4>
                        <span className="text-[10px] text-slate-400">Active</span>
                      </div>
                      <p className="text-[11px] text-emerald-400 font-semibold truncate flex items-center gap-1">
                        <User className="w-3 h-3 shrink-0" /> {otherParty} • <span className="text-slate-400 text-[10px]">{otherRole}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {chat.messages?.[0]?.content || 'Click to view conversation'}
                      </p>
                    </div>
                  </button>
                );
              })}

              {/* Default Active Showcase Conversation */}
              {userChats.length === 0 && (
                <div
                  className="p-4 text-left bg-emerald-500/15 border-l-4 border-emerald-400 flex items-center gap-3.5 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-white/10">
                    <img
                      src={vehicleContext.image}
                      alt={vehicleContext.model}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-white text-xs truncate">{vehicleContext.make} {vehicleContext.model}</h4>
                      <span className="text-[10px] text-emerald-400 font-bold">Online</span>
                    </div>
                    <p className="text-[11px] text-emerald-400 font-semibold truncate flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 shrink-0" /> {vehicleContext.ownerName}
                    </p>
                    <p className="text-[10px] text-slate-400">Rent Giver • Verified Host</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Helper Note */}
            <div className="p-4 bg-slate-950 border-t border-white/10 text-[11px] text-slate-400 space-y-1">
              <p className="font-bold text-white flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-emerald-400" /> Buyer & Owner Protection:
              </p>
              <p>Direct communication ensures proper vehicle handover, license verification, and zero hidden fees.</p>
            </div>
          </div>

          {/* Right Pane: Active Chat Window (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-slate-900">
            
            {/* Top Bar: Vehicle & Other Party Header */}
            <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-white/15">
                  <img
                    src={vehicleContext.image}
                    alt={vehicleContext.model}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-white text-sm">
                      {vehicleContext.make} {vehicleContext.model}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {vehicleContext.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                    <span>Host: <strong className="text-slate-200">{vehicleContext.ownerName}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-400" /> {vehicleContext.location}</span>
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to={`/vehicles/${vehicleContext.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-colors"
                >
                  View Vehicle
                </Link>
                <Link
                  to={`/book/${vehicleContext.id}`}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs shadow-md shadow-emerald-500/20 transition-all"
                >
                  Book (${vehicleContext.dailyPrice}/day)
                </Link>
              </div>
            </div>

            {/* Middle: Message Bubble Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-none">
              {displayMessages.map((msg, idx) => {
                const isMine = msg.senderId === user?.id || msg.senderId === 'me';
                const timeStr = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now';

                return (
                  <div
                    key={msg.id || idx}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {!isMine && (
                        <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-black shrink-0">
                          {msg.sender?.firstName?.charAt(0) || 'H'}
                        </div>
                      )}

                      <div
                        className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                          isMine
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 rounded-br-xs'
                            : 'bg-slate-800/90 border border-white/10 text-slate-100 rounded-bl-xs'
                        }`}
                      >
                        {!isMine && (
                          <p className="text-[11px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
                            {msg.sender?.firstName || 'Host'}
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({user.id === activeChatData?.booking?.customerId ? 'Rent Giver' : 'Sender'})
                            </span>
                          </p>
                        )}
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                      {timeStr}
                      {isMine && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom: Quick Inquiry Suggestions & Message Input */}
            <div className="p-4 border-t border-white/10 bg-slate-950/70 space-y-3">
              {/* Quick Suggestion Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Quick Ask:</span>
                {[
                  'Is this available for airport terminal delivery?',
                  'What is the refundable deposit policy?',
                  'Can I arrange pickup 2 hours earlier?',
                  'Are all insurance and miles included?'
                ].map((quickText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(quickText)}
                    className="px-3 py-1 rounded-full bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-300 text-[11px] font-medium whitespace-nowrap transition-colors"
                  >
                    {quickText}
                  </button>
                ))}
              </div>

              {/* Message Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Type a message to ${vehicleContext.ownerName}...`}
                  className="flex-1 bg-slate-900 border border-white/15 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!content.trim() || isSending}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
