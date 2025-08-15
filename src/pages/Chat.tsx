import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import BottomTab from '../components/BottomTab';
import ChatMessage from '../components/ChatMessage';

const initialMessages = [
	{
		message: 'Hey, did you pay the electricity bill?',
		time: '2:30 PM',
		isUser: false,
	},
	{
		message: 'Yes, I paid it yesterday. $120',
		time: '2:32 PM',
		isUser: true,
	},
	{
		message: 'Great! Should we split the grocery bill from today?',
		time: '2:35 PM',
		isUser: false,
	},
];

const Chat: React.FC = () => {
	const [messages, setMessages] = useState(initialMessages);
	const [input, setInput] = useState('');

	const handleSend = () => {
		if (input.trim()) {
			setMessages([...messages, { message: input, time: '2:40 PM', isUser: true }]);
			setInput('');
		}
	};

	return (
		<IonPage>
			<IonContent className="ion-padding bg-gray-50 pb-24">
				<div className="flex items-center justify-between mb-2">
					<div className="font-bold text-lg text-gray-900">Live-in</div>
					<div className="flex items-center space-x-3">
						<button className="text-xl text-gray-400"><i className="fas fa-bell"></i></button>
						<img src="https://randomuser.me/api/portraits/women/44.jpg" alt="profile" className="w-7 h-7 rounded-full border-2 border-white" />
					</div>
				</div>
				<div className="bg-white rounded-xl shadow p-4 mt-2 max-w-md mx-auto">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center space-x-2">
							<img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah" className="w-7 h-7 rounded-full border-2 border-white" />
							<img src="https://randomuser.me/api/portraits/men/43.jpg" alt="Marcus" className="w-7 h-7 rounded-full border-2 border-white" />
							<span className="font-semibold text-gray-900 ml-2">Finance Chat</span>
							<span className="text-green-500 text-xs ml-2">Online</span>
						</div>
						<button className="text-gray-400 text-lg">×</button>
					</div>
					<div className="overflow-y-auto max-h-72 mb-4">
						{messages.map((msg, idx) => (
							<ChatMessage key={idx} {...msg} />
						))}
					</div>
					<div className="flex space-x-2 mb-2">
						<button className="flex-1 bg-gray-100 rounded-full py-2 font-semibold text-gray-500">Share Expense</button>
						<button className="flex-1 bg-gray-100 rounded-full py-2 font-semibold text-gray-500">Split Bill</button>
					</div>
					<div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
						<input
							type="text"
							className="flex-1 bg-transparent outline-none px-2 py-2 text-sm"
							placeholder="Type a message..."
							value={input}
							onChange={e => setInput(e.target.value)}
						/>
						<button
							className="bg-pink-500 text-white rounded-full w-9 h-9 flex items-center justify-center ml-2 text-xl"
							onClick={handleSend}
						>
							<i className="fas fa-paper-plane"></i>
						</button>
					</div>
				</div>
				<BottomTab />
			</IonContent>
		</IonPage>
	);
};

export default Chat;
