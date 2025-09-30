'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, MessageSquare, HelpCircle, ChevronDown, Settings, CreditCard, LogOut, Package, Star, Monitor, X, Send, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TopHeader() {
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showSupportChat, setShowSupportChat] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Price Update Alert',
      message: 'Product ASIN B089XYZ123 price changed by competitor',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      title: 'Buy Box Lost',
      message: 'You lost the Buy Box for SKU ABC-123',
      time: '15 minutes ago',
      read: false
    },
    {
      id: 3,
      title: 'Repricing Complete',
      message: 'Daily repricing cycle completed for 245 products',
      time: '1 hour ago',
      read: true
    },
    {
      id: 4,
      title: 'Low Stock Warning',
      message: 'Product SKU DEF-456 has only 3 units remaining',
      time: '2 hours ago',
      read: true
    }
  ]);

  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Support Team',
      lastMessage: 'Thank you for contacting us. How can we help you today?',
      time: '10:30 AM',
      unread: false
    },
    {
      id: 2,
      name: 'Technical Support',
      lastMessage: 'Your API integration issue has been resolved.',
      time: 'Yesterday',
      unread: true
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const startSupportChat = () => {
    setShowSupportChat(true);
    setMessagesOpen(true);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Add new message logic here
      setNewMessage('');
    }
  };

  const faqItems = [
    {
      question: 'How do I connect my Amazon seller account?',
      answer: 'Go to Settings > Account Settings, then click "Connect Amazon Store" and follow the authorization process with your Amazon Seller Central credentials.'
    },
    {
      question: 'What is the Buy Box and why is it important?',
      answer: 'The Buy Box is the white box on Amazon product pages where customers can add items to their cart. Winning the Buy Box dramatically increases your sales as most customers buy from the Buy Box winner.'
    },
    {
      question: 'How often does RepriceLab update prices?',
      answer: 'RepriceLab monitors competitor prices in real-time and can update your prices as frequently as every 15 minutes, depending on your plan and repricing rules.'
    },
    {
      question: 'Can I set minimum and maximum price limits?',
      answer: 'Yes, you can set minimum and maximum price boundaries for each product to ensure your prices never go below your cost or above your desired maximum selling price.'
    },
    {
      question: 'What marketplaces does RepriceLab support?',
      answer: 'RepriceLab supports all major Amazon marketplaces including US, UK, Germany, France, Italy, Spain, Canada, Mexico, Japan, and Australia.'
    },
    {
      question: 'How do I create repricing rules?',
      answer: 'Navigate to Repricing Rules in the sidebar, click "Add New Rule", then configure your pricing strategy, conditions, and apply it to your selected products.'
    },
    {
      question: 'Can I exclude certain competitors from my repricing strategy?',
      answer: 'Yes, you can create competitor blacklists to exclude specific sellers from your repricing calculations in your rule settings.'
    },
    {
      question: 'What happens if a competitor sets an unrealistically low price?',
      answer: 'Your minimum price limits will protect you from following competitors into unprofitable pricing. RepriceLab will alert you but won\'t price below your set minimums.'
    }
  ];

  const filteredFaqItems = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const LabLogo = () => (
    <div className="relative w-10 h-10">
      {/* Laboratory Flask */}
      <svg 
        viewBox="0 0 32 32" 
        className="w-10 h-10 text-white drop-shadow-lg"
        fill="currentColor"
      >
        <path d="M12 4h8v6l6 12H6l6-12V4z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M10 4h12" stroke="currentColor" strokeWidth="2"/>
        <circle cx="16" cy="18" r="6" fill="currentColor" opacity="0.3"/>
      </svg>
      {/* R Symbol in the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-lg drop-shadow-md">R</span>
      </div>
    </div>
  );

  return (
    <header className="h-16 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 flex items-center justify-between px-6 border-b relative z-40 shadow-lg">
      {/* Left side - RepriceLab Branding */}
      <div className="flex items-center space-x-3">
        <LabLogo />
        <div className="flex items-center space-x-1">
          <h1 className="text-xl font-bold text-white drop-shadow-md tracking-tight">RepriceLab</h1>
          <span className="text-purple-200 text-sm font-medium">.com</span>
        </div>
      </div>
      
      {/* Right side - Navigation Icons */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-white hover:bg-purple-700"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setMessagesOpen(false);
              setFaqOpen(false);
            }}
          >
            <Bell className="w-5 h-5" />
            {notifications.some(n => !n.read) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </Button>

          {notificationsOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-20">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <button 
                    onClick={markAllAsRead}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Message Icon */}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={() => {
              setMessagesOpen(!messagesOpen);
              setNotificationsOpen(false);
              setFaqOpen(false);
            }}
          >
            <MessageSquare className="w-5 h-5" />
            {conversations.some(c => c.unread) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </Button>

          {messagesOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setMessagesOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-20">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Messages</h3>
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={startSupportChat}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {conversations.map((conversation) => (
                    <div key={conversation.id} className="p-4 border-b hover:bg-gray-50 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900">{conversation.name}</h4>
                            {conversation.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 truncate">{conversation.lastMessage}</p>
                          <p className="text-xs text-gray-400 mt-2">{conversation.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {showSupportChat && (
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <Button 
                        size="sm" 
                        onClick={sendMessage}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {conversations.length === 0 && !showSupportChat && (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No conversations yet</p>
                    <p className="text-sm mt-1">Start a conversation with our support team</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Help/FAQ Icon */}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={() => {
              setFaqOpen(!faqOpen);
              setNotificationsOpen(false);
              setMessagesOpen(false);
            }}
          >
            <HelpCircle className="w-5 h-5" />
          </Button>

          {faqOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setFaqOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border z-20">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Frequently Asked Questions</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFaqOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-3 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search FAQ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {filteredFaqItems.map((item, index) => (
                    <div key={index} className="p-4 border-b">
                      <details className="group">
                        <summary className="font-medium text-gray-900 cursor-pointer hover:text-purple-600 list-none">
                          <div className="flex justify-between items-center">
                            <span>{item.question}</span>
                            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                          </div>
                        </summary>
                        <p className="text-sm text-gray-600 mt-3 leading-relaxed">{item.answer}</p>
                      </details>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t bg-gray-50">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Can't find what you're looking for?</p>
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => {
                        setFaqOpen(false);
                        startSupportChat();
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotificationsOpen(false);
              setMessagesOpen(false);
              setFaqOpen(false);
            }}
            className="flex items-center space-x-2 text-white hover:text-white bg-white/20 backdrop-blur-sm rounded-full px-3 py-2 transition-all duration-200 hover:bg-white/30"
          >
            <div className="w-8 h-8 bg-purple-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">JD</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>

          {profileDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-20">
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">JD</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">John Doe</p>
                      <p className="text-sm text-gray-500">john@repricer.com</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <a href="/settings/account" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </a>
                  <a href="/settings/account" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <CreditCard className="w-4 h-4 mr-3" />
                    Change password
                  </a>
                  <a href="/settings/subscription" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <CreditCard className="w-4 h-4 mr-3" />
                    Pay now
                  </a>
                </div>

                <div className="border-t py-2">
                  <div className="px-4 py-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Products</p>
                  </div>
                  <a href="/feedback/overview" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Star className="w-4 h-4 mr-3" />
                    Feedback
                  </a>
                  <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-3" />
                      Repricer
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Trial</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <div className="flex items-center">
                      <Monitor className="w-4 h-4 mr-3" />
                      eDesk
                    </div>
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Try Now!</span>
                  </div>
                </div>

                <div className="border-t py-2">
                  <button 
                    onClick={() => router.push('/')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}