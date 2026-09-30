type IconName =
  | 'chat'
  | 'folder'
  | 'channel'
  | 'contacts'
  | 'phone'
  | 'settings'
  | 'search'
  | 'plus'
  | 'arrow'
  | 'send'
  | 'smile'
  | 'paperclip'
  | 'mic'
  | 'close'
  | 'check'
  | 'dots'
  | 'bookmark'

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  const paths: Record<IconName, React.ReactNode> = {
    chat: (
      <>
        <path
          d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 16.5H10l-4.6 3v-3.1A2 2 0 0 1 2.5 14V7A1.5 1.5 0 0 1 4 5.5Z"
          fill="currentColor"
          stroke="none"
        />
        <circle cx="8" cy="11" r="1" fill="white" stroke="none" />
        <circle cx="12" cy="11" r="1" fill="white" stroke="none" />
        <circle cx="16" cy="11" r="1" fill="white" stroke="none" />
      </>
    ),
    folder: (
      <path
        d="M3 7.5a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z"
        fill="currentColor"
        stroke="none"
      />
    ),
    channel: (
      <path d="M5 7.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Zm3-3h8" />
    ),
    contacts: (
      <>
        <circle cx="8" cy="9" r="3" fill="currentColor" stroke="none" />
        <circle cx="16" cy="9" r="3" fill="currentColor" stroke="none" />
        <path d="M2.5 19c.7-3 2.4-4.5 5.5-4.5s4.8 1.5 5.5 4.5M10.5 19c.7-3 2.4-4.5 5.5-4.5s4.8 1.5 5.5 4.5" />
      </>
    ),
    phone: (
      <path d="M7 3.5 4.8 4.7c-.7.4-.9 1.2-.6 2 1.8 5.7 5.4 9.3 11.1 11.1.8.3 1.6.1 2-.6l1.2-2.2c.3-.6.1-1.3-.5-1.7l-2.7-1.6c-.6-.4-1.4-.2-1.8.4l-.8 1.2a12 12 0 0 1-4.5-4.5l1.2-.8c.6-.4.8-1.2.4-1.8L8.7 4c-.4-.6-1.1-.8-1.7-.5Z" />
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L8 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6.7v-2.4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L8 8.6l1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.1h2.4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1V14h-.1a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    plus: (
      <>
        <circle cx="12" cy="12" r="9.2" fill="currentColor" stroke="none" />
        <path d="M12 7.5v9M7.5 12h9" stroke="white" strokeWidth="2" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M11 6l-6 6 6 6" />
      </>
    ),
    send: <path d="m4 4 16 8-16 8 3-8-3-8Zm3 8h13" fill="currentColor" stroke="none" />,
    smile: (
      <>
        <circle cx="12" cy="12" r="8.8" />
        <path
          d="M8.5 14.5c.9 1.2 2 1.8 3.5 1.8s2.6-.6 3.5-1.8M9 9.5h.01M15 9.5h.01"
          strokeWidth="2"
        />
      </>
    ),
    paperclip: (
      <path d="m8.7 12.8 5.5-5.5a3 3 0 0 1 4.2 4.2l-6.8 6.8a4.5 4.5 0 0 1-6.4-6.4l6.4-6.4a2.7 2.7 0 0 1 3.8 3.8l-5.8 5.8a1.1 1.1 0 1 1-1.6-1.6l5-5" />
    ),
    mic: (
      <>
        <rect x="9" y="3.5" width="6" height="11" rx="3" />
        <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    dots: (
      <>
        <circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none" />
      </>
    ),
    bookmark: (
      <path
        d="M12 3.5a6.8 6.8 0 0 0-4 12.3V20l4-2 4 2v-4.2a6.8 6.8 0 0 0-4-12.3Z"
        fill="currentColor"
        stroke="none"
      />
    ),
  }
  return (
    <svg {...common} aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
