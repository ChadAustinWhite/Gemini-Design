import { IcoDownload, IcoImage, IcoLibrary, IcoMoon, IcoPencil, IcoPlus, IcoSearch, IcoSettings, IcoSidebar, IcoSun, IcoVideo, Sparkle } from './icons'
import { useApp } from './store'
import { Tip, useDismiss } from './ui'

const NAV = [
  { id: 'home' as const, label: 'New chat', icon: IcoPencil },
  { id: 'search' as const, label: 'Search chats', icon: IcoSearch },
  { id: 'brief' as const, label: 'Daily brief', icon: IcoSun },
  { id: 'images' as const, label: 'Images', icon: IcoImage },
  { id: 'videos' as const, label: 'Videos', icon: IcoVideo },
  { id: 'library' as const, label: 'Library', icon: IcoLibrary },
]

export function Sidebar() {
  const app = useApp()
  const settingsRef = useDismiss(app.settingsOpen, () => app.setSettingsOpen(false))
  const tip = app.collapsed ? 'right' : 'top'

  function go(id: (typeof NAV)[number]['id']) {
    app.setMode('chat')
    if (id === 'home') app.newChat()
    else app.setRoute(id)
  }

  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="brand">
        <button type="button" className="brand-btn" onClick={app.newChat}>
          <Sparkle size={22} />
          <span className="brand-name">ChadGPT</span>
        </button>
        <Tip label={app.collapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement={tip}>
          <button
            type="button"
            className="icon-btn"
            aria-label={app.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-pressed={app.collapsed}
            onClick={() => app.setCollapsed(!app.collapsed)}
          >
            <IcoSidebar size={18} />
          </button>
        </Tip>
      </div>

      <div className={`mode-switch ${app.collapsed ? 'is-rail' : ''}`} role="tablist" aria-label="Mode">
        <button type="button" role="tab" aria-label="Chat" aria-selected={app.mode === 'chat'} onClick={() => app.setMode('chat')}>
          <span className="mode-label">Chat</span>
          <span className="mode-short" aria-hidden="true">C</span>
        </button>
        <button type="button" role="tab" aria-label="Spark, beta" aria-selected={app.mode === 'spark'} onClick={() => app.setMode('spark')}>
          <span className="mode-label">
            Spark <span className="beta">Beta</span>
          </span>
          <span className="mode-short">
            <Sparkle size={16} />
          </span>
        </button>
      </div>

      <div className="sidebar-scroll">
        <nav className="nav" aria-label="Primary">
          {NAV.map((item) => {
            const Icon = item.icon
            const active = item.id === 'home' ? app.route === 'home' && app.mode === 'chat' : app.route === item.id && app.mode === 'chat'
            return (
              <Tip key={item.id} label={item.label} placement={app.collapsed ? 'right' : 'top'}>
                <button
                  type="button"
                  className={`nav-item ${active ? 'is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => go(item.id)}
                >
                  <Icon size={18} />
                  <span className="nav-label">{item.label}</span>
                </button>
              </Tip>
            )
          })}
        </nav>

        <div className="notebook-block">
          <p className="section-label">Notebooks</p>
          <button type="button" className="nav-item" onClick={app.addNotebook}>
            <IcoPlus size={18} />
            <span className="nav-label">New notebook</span>
          </button>
        </div>

        <div className="recents">
          <p className="section-label">Recents</p>
          <ul>
            {app.projects.map((p) => {
              const current = app.activeId === p.id && app.route === 'results' && app.mode === 'chat'
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`recent ${current ? 'is-current' : ''}`}
                    aria-current={current ? 'true' : undefined}
                    onClick={() => app.openProject(p.id)}
                  >
                    {p.title}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="user-row" ref={settingsRef}>
        <span className="avatar" aria-hidden="true">
          CW
        </span>
        <span className="user-meta">
          <span className="user-name">Chad White</span>
          <span className="user-plan">Pro</span>
        </span>
        <button
          type="button"
          className="icon-btn"
          aria-label="Settings"
          aria-expanded={app.settingsOpen}
          onClick={() => app.setSettingsOpen(!app.settingsOpen)}
        >
          <IcoSettings size={18} />
        </button>
        {app.settingsOpen && (
          <div className="settings-pop" role="dialog" aria-label="Settings">
            <p className="section-label tight">Theme</p>
            <div className="seg" role="group" aria-label="Theme">
              <button type="button" aria-pressed={app.theme === 'light'} onClick={() => app.setTheme('light')}>
                <IcoSun size={16} /> Light
              </button>
              <button type="button" aria-pressed={app.theme === 'dark'} onClick={() => app.setTheme('dark')}>
                <IcoMoon size={16} /> Dark
              </button>
            </div>
            <label className="switch-row">
              <span>Reduce motion</span>
              <button
                type="button"
                role="switch"
                className="switch"
                aria-checked={app.reduceMotion}
                onClick={() => app.setReduceMotion(!app.reduceMotion)}
              >
                <span />
              </button>
            </label>
            <p className="section-label tight">Shortcuts</p>
            <ul className="shortcuts">
              <li>
                <span>Undo</span>
                <kbd>⌘Z</kbd>
              </li>
              <li>
                <span>Redo</span>
                <kbd>⇧⌘Z</kbd>
              </li>
              <li>
                <span>Save</span>
                <kbd>⌘S</kbd>
              </li>
              <li>
                <span>Size</span>
                <kbd>↑↓</kbd>
              </li>
            </ul>
            <button
              type="button"
              className="btn-quiet full"
              onClick={() => app.notify('The Gemini app isn’t part of this preview.')}
            >
              <IcoDownload size={16} /> Get app
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
