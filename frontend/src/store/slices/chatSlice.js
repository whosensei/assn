import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [
      {
        id: 1,
        title: 'hi there',
        preview: "That's an interesting point. Here's what",
        timestamp: 'Today',
        messages: [
          {
            id: 1,
            type: 'user',
            content: 'hi there',
            timestamp: '11:09 PM'
          },
          {
            id: 2,
            type: 'assistant',
            content: "That's an interesting point. Here's what I think... This is a mock response to demonstrate the chat functionality. In a real application, this would be connected to an actual AI service.",
            timestamp: '11:09 PM'
          }
        ]
      }
    ],
    activeConversationId: 1,
    isLoading: false,
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.messages.push(message);
        conversation.preview = message.content.substring(0, 50) + '...';
      }
    },
    createNewConversation: (state) => {
      const newId = Math.max(...state.conversations.map(c => c.id), 0) + 1;
      const newConversation = {
        id: newId,
        title: 'New Chat',
        preview: 'Start a conversation with our AI assistant...',
        timestamp: 'Now',
        messages: []
      };
      state.conversations.unshift(newConversation);
      state.activeConversationId = newId;
    },
    updateConversationTitle: (state, action) => {
      const { conversationId, title } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.title = title;
      }
    },
  },
});

export const { 
  setActiveConversation, 
  addMessage, 
  createNewConversation, 
  updateConversationTitle 
} = chatSlice.actions;

export default chatSlice.reducer;