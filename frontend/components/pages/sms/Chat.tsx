import React from 'react';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, SearchIcon } from '../../Icons';

const contacts = [
    { name: 'John Doe', role: 'Parent', lastMessage: 'Okay, thank you!', time: '10:42 AM', unread: 2 },
    { name: 'Jane Smith', role: 'Teacher', lastMessage: 'Yes, the meeting is confirmed.', time: '9:30 AM', unread: 0 },
    { name: 'Amit Singh', role: 'Parent', lastMessage: 'Can I get an update on...', time: 'Yesterday', unread: 0 },
];

const messages = [
    { sender: 'other', text: "Good morning, I'd like to inquire about Aarav's performance in the recent test.", time: '10:40 AM' },
    { sender: 'me', text: "Good morning Mr. Doe. Aarav performed well, scoring 85%. I can share the detailed report.", time: '10:41 AM' },
    { sender: 'other', text: "That would be great. Okay, thank you!", time: '10:42 AM' },
];

const Chat: React.FC = () => {
  return (
    <div className="flex h-[calc(100vh-7rem)] bg-[--card] rounded-xl shadow-sm border border-[--card-border] overflow-hidden">
        {/* Contacts List */}
        <div className="w-1/3 border-r border-[--card-border] flex flex-col">
            <div className="p-4 border-b border-[--card-border]">
                <h2 className="text-xl font-semibold text-[--text-primary]">Chats</h2>
                <div className="relative mt-2">
                    <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[--text-secondary]"/>
                    <input type="text" placeholder="Search contacts..." className="w-full pl-10 pr-4 py-2 border border-[--card-border] rounded-lg bg-[--background]" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {contacts.map((contact, i) => (
                    <div key={i} className={`p-4 flex items-center cursor-pointer border-b border-[--card-border] ${i === 0 ? 'bg-orange-100/50' : 'hover:bg-gray-100/50'}`}>
                        <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <h3 className="font-semibold text-[--text-primary]">{contact.name}</h3>
                                <p className="text-xs text-[--text-secondary]">{contact.time}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-[--text-secondary] truncate">{contact.lastMessage}</p>
                                {contact.unread > 0 && <span className="text-xs text-white bg-[--primary] rounded-full w-5 h-5 flex items-center justify-center">{contact.unread}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        {/* Chat Window */}
        <div className="w-2/3 flex flex-col">
            <div className="p-4 border-b border-[--card-border] flex items-center">
                 <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                 <div>
                    <h3 className="font-semibold text-[--text-primary]">John Doe</h3>
                    <p className="text-sm text-green-600">Online</p>
                 </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto bg-[#F9F3EB]">
                <div className="space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.sender === 'me' ? 'bg-[--primary] text-white rounded-br-none' : 'bg-white text-[--text-primary] rounded-bl-none shadow-sm'}`}>
                                <p>{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-orange-100' : 'text-[--text-secondary]'} text-right`}>{msg.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-4 border-t border-[--card-border] bg-white">
                <div className="relative">
                    <input type="text" placeholder="Type a message..." className="w-full pr-12 pl-4 py-3 border border-[--card-border] rounded-full bg-[--background]" />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[--primary] rounded-full text-white flex items-center justify-center hover:bg-[--primary-hover]">
                        <PaperAirplaneIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Chat;