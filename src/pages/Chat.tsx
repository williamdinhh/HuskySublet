import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api, Match, Message } from '../utils/api';
import './Auth.css';

export default function Chat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      loadMessages(selectedMatch._id);
    }
  }, [selectedMatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await api.getMatches();
      setMatches(response.matches);
      if (response.matches.length > 0 && !selectedMatch) {
        setSelectedMatch(response.matches[0]);
      }
    } catch (err: any) {
      console.error('Failed to load matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (matchId: string) => {
    try {
      const response = await api.getMatchMessages(matchId);
      setMessages(response.messages);
    } catch (err: any) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch) return;

    try {
      const response = await api.sendMessage(selectedMatch._id, newMessage.trim());
      setMessages([...messages, response.message]);
      setNewMessage('');
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    }
  };

  const getOtherUser = (match: Match) => {
    if (!user) return null;
    return match.users.find(u => u.id !== user.id) || match.users[0];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="auth-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p>Loading matches...</p>
      </div>
    );
  }

  return (
    <div>
      {/* BOTTOM NAVIGATION */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.75rem 0',
        zIndex: 1000,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: location.pathname === '/' ? '#007AFF' : '#666',
            padding: '0.5rem 1rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span style={{ fontSize: '0.75rem' }}>Home</span>
        </button>
        <button
          onClick={() => navigate('/chat')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: location.pathname === '/chat' ? '#007AFF' : '#666',
            padding: '0.5rem 1rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span style={{ fontSize: '0.75rem' }}>Chat</span>
        </button>
        <button
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: location.pathname === '/profile' ? '#007AFF' : '#666',
            padding: '0.5rem 1rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span style={{ fontSize: '0.75rem' }}>Profile</span>
        </button>
      </nav>
      <div style={{ display: 'flex', height: 'calc(100vh - 80px)', background: '#f5f5f7', paddingBottom: '80px' }}>
      {/* Matches List */}
      <div style={{ width: '320px', background: 'white', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e0e0e0' }}>
          <h2 style={{ margin: 0 }}>Matches</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {matches.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
              <p>No matches yet. Start browsing to find your perfect match!</p>
            </div>
          ) : (
            matches.map((match) => {
              const otherUser = getOtherUser(match);
              const listing = typeof match.listingId === 'object' ? match.listingId : null;
              return (
                <div
                  key={match._id}
                  onClick={() => setSelectedMatch(match)}
                  style={{
                    padding: '1rem 1.5rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    background: selectedMatch?._id === match._id ? '#f5f5f7' : 'white',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedMatch?._id !== match._id) {
                      e.currentTarget.style.background = '#fafafa';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedMatch?._id !== match._id) {
                      e.currentTarget.style.background = 'white';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {otherUser?.profileImage ? (
                      <img
                        src={otherUser.profileImage}
                        alt={otherUser.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = 'none';
                          if (!img.nextElementSibling) {
                            const placeholder = document.createElement("div");
                            placeholder.style.width = '50px';
                            placeholder.style.height = '50px';
                            placeholder.style.borderRadius = '50%';
                            placeholder.style.background = '#007AFF';
                            placeholder.style.color = 'white';
                            placeholder.style.display = 'flex';
                            placeholder.style.alignItems = 'center';
                            placeholder.style.justifyContent = 'center';
                            placeholder.style.fontWeight = '600';
                            placeholder.style.fontSize = '1.25rem';
                            placeholder.textContent = otherUser?.name?.[0]?.toUpperCase() || '?';
                            img.parentElement?.appendChild(placeholder);
                          }
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: '#007AFF',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600',
                          fontSize: '1.25rem',
                        }}
                      >
                        {otherUser?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {otherUser?.name || 'Unknown'}
                      </div>
                      {listing && (
                        <div style={{ fontSize: '0.875rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {listing.title}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
        {selectedMatch ? (
          <>
            {/* Chat Header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {getOtherUser(selectedMatch)?.profileImage ? (
                <img
                  src={getOtherUser(selectedMatch)?.profileImage}
                  alt={getOtherUser(selectedMatch)?.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    if (!img.nextElementSibling) {
                      const placeholder = document.createElement("div");
                      placeholder.style.width = '40px';
                      placeholder.style.height = '40px';
                      placeholder.style.borderRadius = '50%';
                      placeholder.style.background = '#007AFF';
                      placeholder.style.color = 'white';
                      placeholder.style.display = 'flex';
                      placeholder.style.alignItems = 'center';
                      placeholder.style.justifyContent = 'center';
                      placeholder.style.fontWeight = '600';
                      placeholder.textContent = getOtherUser(selectedMatch)?.name?.[0]?.toUpperCase() || '?';
                      img.parentElement?.appendChild(placeholder);
                    }
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#007AFF',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                  }}
                >
                  {getOtherUser(selectedMatch)?.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div>
                <div style={{ fontWeight: '600' }}>{getOtherUser(selectedMatch)?.name || 'Unknown'}</div>
                {typeof selectedMatch.listingId === 'object' && (
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    {selectedMatch.listingId.title}
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = typeof message.senderId === 'object' ? message.senderId.id === user?.id : message.senderId === user?.id;
                  return (
                    <div
                      key={message._id}
                      style={{
                        display: 'flex',
                        justifyContent: isOwn ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '70%',
                          padding: '0.75rem 1rem',
                          borderRadius: '18px',
                          background: isOwn ? '#007AFF' : '#f0f0f0',
                          color: isOwn ? 'white' : '#333',
                          wordWrap: 'break-word',
                        }}
                      >
                        <div>{message.content}</div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            marginTop: '0.25rem',
                            opacity: 0.7,
                            textAlign: 'right',
                          }}
                        >
                          {formatDate(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid #e0e0e0',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: newMessage.trim() ? '#007AFF' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                  fontWeight: '600',
                }}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
            <p>Select a match to start chatting</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

