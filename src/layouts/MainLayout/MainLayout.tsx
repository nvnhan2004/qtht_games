  import Header from '../../components/Header';
  import Footer from '../../components/Footer';
  import SideNav from '../../components/SideNav';
  import { Outlet } from 'react-router-dom'
  interface Props {
    children?: React.ReactNode
  }
  export default function MainLayout({ children }: Props) {
    return (
      <div>
        <Header />
        <SideNav />
        {children}
        <Outlet />
        <Footer />
      </div>
    )
  }