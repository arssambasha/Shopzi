import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import ImageWithFallback from './ImageWithFallback.jsx';

const GREETING =
  "Hi! I can find products for you. Try 'gaming accessories under 500' or 'open cheapest headphones'.";

const TEASER_DELAY = 1000;

const SUGGESTIONS = [
  { label: 'Gaming under ₹500', message: 'Show me gaming products under 500' },
  { label: 'Cheapest headphones', message: 'Show me the cheapest headphones' },
  { label: 'Top rated shoes', message: 'Show me top rated shoes' },
];

const ChatProductCard = ({ product, onClick }) => {
  const price = product.discountedPrice || product.price;
  return (
    <Link
      to={`/product/${product._id}`}
      onClick={onClick}
      className="flex gap-2 bg-white border border-[#d5d9d9] rounded-lg p-2 hover:shadow"
    >
      <ImageWithFallback
        src={product.image}
        alt={product.name}
        className="w-14 h-14 object-cover rounded shrink-0"
      />
      <div className="min-w-0">
        <p className="text-xs font-medium line-clamp-2 text-[#0f1111]">{product.name}</p>
        <p className="text-sm font-bold text-[#0f1111]">
          ₹{price}
          {product.discount > 0 && (
            <span className="text-xs text-[#565959] line-through ml-1 font-normal">₹{product.price}</span>
          )}
        </p>
      </div>
    </Link>
  );
};

const ChatWidget = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const teaserInputRef = useRef(null);

  const [teaserDismissed, setTeaserDismissed] = useState(false);
  const [teaserReady, setTeaserReady] = useState(false);
  const showTeaser = !open && !teaserDismissed;

  useEffect(() => {
    if (teaserDismissed) return;
    const timer = setTimeout(() => setTeaserReady(true), TEASER_DELAY);
    return () => clearTimeout(timer);
  }, [teaserDismissed]);

  const openChat = () => {
    setOpen(true);
    setTeaserDismissed(true);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const closeOnMobile = () => {
    if (window.innerWidth < 640) setOpen(false);
  };

  const sendText = async (rawText) => {
    const text = rawText.trim();
    if (!text || loading) return;

    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/chat', {
        messages: next.map(({ role, content }) => ({ role, content })),
      });

      setMessages([
        ...next,
        {
          role: 'assistant',
          content: data.reply,
          products: data.products || [],
          viewAllUrl: data.viewAllUrl,
        },
      ]);

      if (data.navigateTo && data.navigateTo.startsWith('/products')) {
        navigate(data.navigateTo);
        closeOnMobile();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendText(input);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[calc(100vw-2rem)] sm:w-96 h-[28rem] max-h-[70vh] bg-white border border-[#d5d9d9] rounded-lg shadow-xl flex flex-col overflow-hidden">
          <div className="bg-[#232f3e] text-white px-4 py-3 flex items-center justify-between border-b-2 border-[#febd69]">
            <span className="font-semibold text-sm">Shopping Assistant</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-xl leading-none">
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#f3f3f3]">
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm bg-white border border-[#d5d9d9] text-[#0f1111]">
                {GREETING}
              </div>
            </div>

            {messages.map((m, i) =>
              m.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap bg-[#ffd814] text-[#0f1111]">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex flex-col items-start gap-2 max-w-[92%]">
                  <div className="rounded-lg px-3 py-2 text-sm whitespace-pre-wrap bg-white border border-[#d5d9d9] text-[#0f1111]">
                    {m.content}
                  </div>
                  {m.products?.length > 0 && (
                    <div className="w-full space-y-2">
                      {m.products.map((p) => (
                        <ChatProductCard key={p._id} product={p} onClick={closeOnMobile} />
                      ))}
                      {m.viewAllUrl && (
                        <Link
                          to={m.viewAllUrl}
                          onClick={closeOnMobile}
                          className="block text-xs text-[#007185] hover:text-[#c7511f] hover:underline"
                        >
                          See all results →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg px-3 py-2 text-sm bg-white border border-[#d5d9d9] text-[#565959] animate-pulse">
                  Typing...
                </div>
              </div>
            )}
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-[#d5d9d9] p-2 flex gap-2 bg-white">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Ask something..."
              className="flex-1 min-w-0 border border-[#888c8c] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
            />
            <button
              disabled={loading || !input.trim()}
              className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-[#0f1111] px-3 rounded text-sm disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {showTeaser && (
        <div
          className={`relative w-72 max-w-[calc(100vw-2rem)] origin-bottom-right bg-white rounded-xl border border-[#d5d9d9] shadow-xl transition-all duration-300 ${
            teaserReady
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          {/* header */}
          <div className="flex items-center gap-2 bg-[#232f3e] text-white rounded-t-xl px-3 py-2 border-b-2 border-[#febd69]">
            <span className="w-8 h-8 rounded-full bg-[#febd69] text-[#232f3e] flex items-center justify-center text-base shrink-0">
              🛒
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Shopping Assistant</p>
              <p className="text-[11px] text-green-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Online
              </p>
            </div>
            <button
              onClick={() => setTeaserDismissed(true)}
              aria-label="Dismiss"
              className="ml-auto text-white/70 hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* body */}
          <div className="px-3 py-3">
            <p className="text-sm font-semibold text-[#0f1111]">Hi there! 👋 Looking for a deal?</p>
            <p className="text-xs text-[#565959] mt-0.5">
              Tell me what you need and your budget. I&apos;ll find it for you.
            </p>

            <input
              ref={teaserInputRef}
              type="text"
              placeholder="e.g., Best boots under 5k"
              className="w-full mt-2.5 border border-[#d5d9d9] rounded px-2.5 py-1.5 text-xs text-[#0f1111] placeholder-[#888c8c] focus:outline-none focus:border-[#febd69] focus:ring-1 focus:ring-[#febd69]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  openChat();
                  sendText(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />

            <div className="flex flex-wrap gap-1.5 mt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    openChat();
                    sendText(s.message);
                  }}
                  className="text-xs text-[#0f1111] bg-white border border-[#d5d9d9] rounded-full px-2.5 py-1 hover:bg-[#f7fafa] hover:border-[#febd69]"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* tail pointing at the chat icon */}
          <span className="absolute -bottom-1.5 right-[22px] w-3 h-3 bg-white border-r border-b border-[#d5d9d9] rotate-45" />
        </div>
      )}

      <div className="relative">
        {showTeaser && teaserReady && (
          <span className="absolute inset-0 rounded-full bg-[#febd69] opacity-50 animate-ping pointer-events-none" />
        )}
        <button
          onClick={() => (open ? setOpen(false) : openChat())}
          aria-label={open ? 'Close chat' : 'Open chat'}
          className="relative w-14 h-14 rounded-full bg-[#232f3e] hover:bg-[#37475a] ring-2 ring-[#febd69] text-white shadow-lg flex items-center justify-center text-2xl"
        >
          {open ? '×' : '💬'}
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;