import React from 'react'
import ChatList from '../components/ChatList'
import ChatMenu from '../components/ChatMenu'
import ChatPanel from '../components/ChatPanel'

const Chats = () => {
  return (
    <div className='flex justify-between h-screen'>
        <ChatList />
        <ChatPanel />
        <ChatMenu />
    </div>
  )
}

export default Chats