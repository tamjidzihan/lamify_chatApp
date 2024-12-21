import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className="fixed inset-0 flex bg-white">
            <Outlet />
        </div>
    )
}

export default Layout