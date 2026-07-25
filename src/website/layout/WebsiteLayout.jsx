import { Outlet } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import '../../styles/website.css'

export default function WebsiteLayout() {
  return (
    <div className="website-layout">
      <header className="website-header">
        <div className="website-main !py-0 !px-4">
          <h1>Chick Blast</h1>
        </div>
      </header>
      <main className="website-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
