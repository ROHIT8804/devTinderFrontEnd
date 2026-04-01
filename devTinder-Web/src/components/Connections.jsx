import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { setConnections } from '../utils/connectionSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/userSlice';
import { createSocketConnection } from '../utils/socket';

const Connections = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const connectionsData = useSelector((state) => state.connections);
  const user = useSelector((state) => state.user?.userData);

  const [activeTargetUser, setActiveTargetUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch connections
  const fetchConnections = async () => {
    if (connectionsData) return;
    try {
      const response = await axios.get(BASE_URL + '/users/connections', { withCredentials: true });
      dispatch(setConnections(response.data));
    } catch (error) {
      console.error("Error fetching connections:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("user");
        dispatch(logout());
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  // Fetch chat and setup socket for active target user
  const fetchChat = async (targetUserId) => {
    try {
      const chatRes = await axios.get(BASE_URL + "/chat/" + targetUserId, { withCredentials: true });
      const chatMessages = chatRes.data?.messages?.map(msg => ({
        ...msg,
        firstName: msg.senderId.firstName,
        senderId: msg.senderId._id || msg.senderId
      })) || [];
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error fetching chat", error);
    }
  };

  useEffect(() => {
    if (!user || !activeTargetUser) {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        return;
    }
    
    fetchChat(activeTargetUser._id);

    // Disconnect previous socket if any
    if (socketRef.current) {
        socketRef.current.disconnect();
    }

    // Connect new socket
    socketRef.current = createSocketConnection();
    const socket = socketRef.current;
    const currentUserId = user._id || user.id;

    socket.emit("joinChat", { userId: currentUserId, targetUserId: activeTargetUser._id });

    socket.on("messageReceived", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, activeTargetUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !activeTargetUser) return;

    const socket = socketRef.current;
    const currentUserId = user._id || user.id;
    if (socket) {
      socket.emit("sendMessage", {
        firstName: user.firstName,
        userId: currentUserId,
        targetUserId: activeTargetUser._id,
        text: newMessage
      });
      setNewMessage("");
    }
  };

  const filteredConnections = Array.isArray(connectionsData) 
    ? connectionsData.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-100 p-2 md:p-6" style={{ backgroundColor: "#f0f2f5" }}>
      <div className="w-full max-w-6xl mx-auto bg-white h-full rounded-2xl shadow-xl flex overflow-hidden border border-gray-200">
        
        {/* Left Sidebar - Connections List */}
        <div className={`w-full md:w-[380px] flex-shrink-0 flex flex-col border-r border-gray-200 ${activeTargetUser ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Messages</h1>
            
            {/* Tabs */}
            <div className="flex mb-4">
              <button 
                className="py-1.5 px-6 rounded-full text-white font-medium text-sm shadow-sm transition-all"
                style={{ background: 'linear-gradient(135deg, #5F5BDA, #7B4CE3, #9B4EF2)' }}
              >
                General <span className="ml-1 bg-white/30 px-1.5 py-0.5 rounded-full text-xs">{filteredConnections.length}</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#7B4CE3] outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Connections List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConnections.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No connections found.</div>
            ) : (
              filteredConnections.map((conn) => (
                <div 
                  key={conn._id}
                  onClick={() => setActiveTargetUser(conn)}
                  className={`flex items-center gap-3 p-3 mx-2 my-1 rounded-xl cursor-pointer transition-all ${activeTargetUser?._id === conn._id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <div className="relative flex-shrink-0">
                    <img 
                      src={conn.photoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"} 
                      alt={conn.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{conn.firstName} {conn.lastName}</h3>
                      {/* Random generic time placeholder */}
                      <span className="text-xs text-gray-400">9:41</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">Tap to view conversation</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className={`flex-1 flex flex-col bg-[#efeae2] relative ${!activeTargetUser ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
          {!activeTargetUser ? (
             <div className="text-center p-8">
               <div className="w-20 h-20 bg-[#f1edfb] rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[#7B4CE3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                 </svg>
               </div>
               <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Messages</h2>
               <p className="text-gray-500 max-w-xs mx-auto">Select a connection from the list to start messaging or view previous chats.</p>
             </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm z-10 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                      {/* Back button visible only on mobile */}
                      <button 
                        onClick={() => setActiveTargetUser(null)}
                        className="md:hidden text-gray-500 hover:text-gray-700"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                      </button>
                      <img
                          src={activeTargetUser?.photoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                          <h2 className="text-md font-semibold text-gray-800">
                              {activeTargetUser.firstName} {activeTargetUser.lastName}
                          </h2>
                          <p className="text-xs text-green-500 font-medium">Online</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.733.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                          </svg>
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                          </svg>
                      </button>
                  </div>
              </div>

              {/* Messages List Area */}
              <div 
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
                style={{ 
                  backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', 
                  backgroundSize: '100px', 
                  backgroundBlendMode: 'overlay', 
                  backgroundColor: 'rgba(255, 255, 255, 0.6)' 
                }}
              >
                  {messages.length === 0 && (
                      <div className="flex justify-center my-4">
                          <span className="bg-white text-gray-500 text-xs px-4 py-2 rounded-full shadow-sm">
                              Start of the conversation
                          </span>
                      </div>
                  )}

                  {messages.map((msg, index) => {
                      const currentUserId = user._id || user.id;
                      const isSentByUser = msg.senderId === currentUserId || (msg.senderId?._id === currentUserId);
                      
                      return (
                          <div key={index} className={`flex ${isSentByUser ? "justify-end" : "justify-start"} items-end gap-2`}>
                              {!isSentByUser && (
                                <img 
                                  src={activeTargetUser?.photoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"} 
                                  className="w-6 h-6 rounded-full mb-1 flex-shrink-0"
                                  alt="Avatar"
                                />
                              )}
                              <div 
                                  className={`max-w-[70%] md:max-w-[60%] px-4 py-2.5 text-[15px] shadow-sm flex flex-col group ${
                                      isSentByUser 
                                      ? "bg-[#f1f1f1] text-gray-800 rounded-2xl rounded-br-sm" 
                                      : "text-white rounded-2xl rounded-bl-sm"
                                  }`}
                                  style={!isSentByUser ? { background: 'linear-gradient(135deg, #5F5BDA, #7B4CE3, #9B4EF2)' } : {}}
                              >
                                  <div className="break-words leading-relaxed">{msg.text}</div>
                                  <div className={`text-[10px] self-end mt-0.5 flex items-center ${isSentByUser ? 'text-gray-400' : 'text-white/80'}`}>
                                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      {isSentByUser && (
                                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 inline-block ml-1 text-[#9B4EF2]" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                      )}
                                  </div>
                              </div>
                          </div>
                      );
                  })}
                  <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-white px-4 py-4 flex items-center gap-3 border-t border-gray-100 z-10">
                  <button className="text-gray-400 hover:text-[#7B4CE3] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                      </svg>
                  </button>
                  <button className="text-gray-400 hover:text-[#7B4CE3] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transform rotate-45">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                      </svg>
                  </button>
                  <div className="flex-1 bg-gray-100 rounded-full flex items-center px-4 py-2">
                    <input
                        type="text"
                        placeholder="Type a message"
                        className="flex-1 bg-transparent outline-none text-gray-700 text-[15px]"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                  </div>
                  {newMessage ? (
                      <button 
                         onClick={sendMessage} 
                         className="text-white p-2.5 rounded-full hover:opacity-90 transition-opacity ml-1 shadow-sm"
                         style={{ background: 'linear-gradient(135deg, #5F5BDA, #7B4CE3, #9B4EF2)' }}
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                          </svg>
                      </button>
                  ) : (
                      <button className="text-gray-400 hover:text-[#7B4CE3] p-2 ml-1 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                          </svg>
                      </button>
                  )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connections;