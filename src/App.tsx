import { Editor } from './Editor'
import { Sidebar } from './Sidebar'
import { Provider, useApp } from './store'
import { Toasts } from './ui'
import {
  BriefView,
  HomeView,
  ImagesView,
  LibraryView,
  NotebooksView,
  ResultsView,
  SearchView,
  SparkView,
  VideosView,
} from './views'

function Shell() {
  const app = useApp()
  if (app.editor) return <Editor />

  let view = <HomeView />
  if (app.mode === 'spark') view = <SparkView />
  else if (app.route === 'search') view = <SearchView />
  else if (app.route === 'brief') view = <BriefView />
  else if (app.route === 'images') view = <ImagesView />
  else if (app.route === 'videos') view = <VideosView />
  else if (app.route === 'library') view = <LibraryView />
  else if (app.route === 'notebooks') view = <NotebooksView />
  else if (app.route === 'results') view = <ResultsView />

  return (
    <div className={`shell ${app.collapsed ? 'is-collapsed' : ''}`}>
      <Sidebar />
      <main id="main" className="main">
        {view}
      </main>
    </div>
  )
}

export function App() {
  return (
    <Provider>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Shell />
      <Toasts />
    </Provider>
  )
}
