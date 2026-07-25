import { Outlet, Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import logoImg from '../../assets/logo.png'
import '../../styles/website.css'

export default function WebsiteLayout() {
  return (
    <div className="website-layout">
      <header className="website-header">
        <div className="website-main !py-0 !px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <img
              src={logoImg}
              alt="Chick Blast Logo"
              className="h-10 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200"
            />
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 m-0">
              Chick Blast
            </h1>
          </Link>
        </div>
      </header>
      <main className="website-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
