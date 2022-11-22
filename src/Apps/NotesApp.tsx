import React, { ChangeEvent, useState } from 'react'

interface Props {
  name: string
  timestamp: Date
}

const NotesApp: React.FunctionComponent<Props> = ({ name, timestamp }: Props) => {
  const APP_PERSIST_KEY = `${name}-${timestamp.toString()}`
  const deserializedState = localStorage.getItem(APP_PERSIST_KEY)
  const [textContent, setTextContent] = useState<string>(deserializedState != null ? deserializedState : '')

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const text = event.target.value
    localStorage.setItem(APP_PERSIST_KEY, text)
    setTextContent(text)
  }
  return (
        <textarea placeholder="Enter some notes..." value={textContent} onChange={handleChange}/>
  )
}

export default NotesApp
