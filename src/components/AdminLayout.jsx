import { useEffect } from 'react'
import TopNavbar from './TopNavbar'
import Sidebar from './Sidebar'

export default function AdminLayout({ children }) {
    // Apply body class for admin pages (matches original CSS)
    useEffect(() => {
        document.body.className = 'adm-body'
        return () => { document.body.className = '' }
    }, [])

    return (
        <>
            <TopNavbar />
            <div className="adm-layout">
                <Sidebar />
                <main className="adm-main">
                    {children}
                </main>
            </div>
        </>
    )
}
