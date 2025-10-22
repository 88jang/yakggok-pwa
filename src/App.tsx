import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import AlarmList from './routes/AlarmList'
import AlarmEdit from './routes/AlarmEdit'
import PopupPreview from './routes/PopupPreview'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: '#0b1320', color: 'white' }}>
        <header style={{ padding: '12px 16px', borderBottom: '1px solid #111827' }}>
          <nav style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: '#16a34a', fontWeight: 700 }}>약꼭</Link>
            <Link to="/" style={{ color: '#38bdf8' }}>알람 목록</Link>
            <Link to="/edit" style={{ color: '#38bdf8' }}>알람 추가</Link>
            <Link to="/preview" style={{ color: '#38bdf8' }}>팝업 미리보기</Link>
          </nav>
        </header>
        <main style={{ padding: 16 }}>
          <Routes>
            <Route path="/" element={<AlarmList />} />
            <Route path="/edit" element={<AlarmEdit />} />
            <Route path="/edit/:id" element={<AlarmEdit />} />
            <Route path="/preview" element={<PopupPreview />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
