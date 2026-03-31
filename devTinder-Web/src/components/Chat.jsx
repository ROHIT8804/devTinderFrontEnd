import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { createSocketConnection } from "../utils/socket";

const Chat = () => {
    const { targetUserId } = useParams();
    const user = useSelector((state) => state.user?.userData);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [targetUser, setTargetUser] = useState(null);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const fetchChatAndUser = async () => {
        try {
            // First we need the target user details (we can get them from connections or a separate call, 
            // but for simplicity let's fetch the chat history which also contains participant info indirectly
            // Actually, we'll fetch the chat messages
            const chatRes = await axios.get(BASE_URL + "/chat/" + targetUserId, { withCredentials: true });
            
            // To get targetUser info we can fetch all connections from the store or make an API call
            // For now, let's just make a simple API call if needed, or rely on connections
            const connectionsRes = await axios.get(BASE_URL + "/users/connections", { withCredentials: true });
            const tgUser = connectionsRes.data.find(u => u._id === targetUserId);
            if (tgUser) setTargetUser(tgUser);

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
        if (!user) return;
        fetchChatAndUser();

        socketRef.current = createSocketConnection();

        const socket = socketRef.current;
        const currentUserId = user._id || user.id;
        socket.emit("joinChat", { userId: currentUserId, targetUserId });

        socket.on("messageReceived", (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.disconnect();
        };
    }, [user, targetUserId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const socket = socketRef.current;
        const currentUserId = user._id || user.id;
        if (socket) {
            socket.emit("sendMessage", {
                firstName: user.firstName,
                userId: currentUserId,
                targetUserId,
                text: newMessage
            });
            setNewMessage("");
        }
    };

    if (!user) {
        return <div className="flex justify-center items-center h-[calc(100vh-80px)]">Loading...</div>;
    }

    return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)] bg-gray-100 p-2 md:p-6" style={{ backgroundColor: "#eae6df" }}>
            <div className="w-full max-w-2xl bg-[#efeae2] h-full rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-300">
                {/* Header */}
                <div className="bg-[#f0f2f5] px-4 py-3 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <Link to="/connections" className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </Link>
                        <img
                            src={targetUser?.photoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-md font-semibold text-gray-800">
                                {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "User"}
                            </h2>
                            <p className="text-xs text-gray-500">tap here for contact info</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-500">
                        <button className="hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </button>
                        <button className="hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.733.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2] relative" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'contain', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(239, 234, 226, 0.9)' }}>
                    <div className="flex justify-center mb-4">
                        <span className="bg-[#e1f3fb] text-gray-500 text-xs px-3 py-1 rounded-lg uppercase shadow-sm">
                            Today
                        </span>
                    </div>

                    {messages.map((msg, index) => {
                        const currentUserId = user._id || user.id;
                        const isSentByUser = msg.senderId === currentUserId || (msg.senderId?._id === currentUserId);
                        
                        return (
                            <div key={index} className={`flex ${isSentByUser ? "justify-end" : "justify-start"}`}>
                                <div 
                                    className={`max-w-[75%] px-3 py-2 text-[15px] shadow-sm relative ${
                                        isSentByUser 
                                        ? "bg-[#dcf8c6] text-gray-800 rounded-l-lg rounded-tr-lg rounded-br-none" 
                                        : "bg-white text-gray-800 rounded-r-lg rounded-tl-lg rounded-bl-none"
                                    }`}
                                >
                                    {!isSentByUser && <div className="text-xs font-semibold text-[#128C7E] mb-1">{msg.firstName}</div>}
                                    <div className="pr-10">{msg.text}</div>
                                    <div className="text-[10px] text-gray-400 absolute bottom-1 right-2">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-[#f0f2f5] px-3 py-3 flex items-center gap-2">
                    <button className="text-gray-500 hover:text-gray-700 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                        </svg>
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transform rotate-45">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder="Type a message"
                        className="flex-1 rounded-full py-2 px-4 outline-none text-gray-700 text-[15px]"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    {newMessage ? (
                        <button onClick={sendMessage} className="bg-[#00a884] text-white p-2 rounded-full hover:bg-[#008f6f] transition-colors ml-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                    ) : (
                        <button className="text-gray-500 hover:text-gray-700 p-2 ml-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                                <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
