import Image from 'next/image'
import Members from './pages/members'
import NavBar from './components/navbar'

export default function Home(){
  const menuItems = [
    {
      href: '/search',
      title: 'Search',
    },
    {
      href: '/',
      title: 'Home',
    },
    {
      href: '/members',
      title: 'Members',
    },
    {
      href: '/settings',
      title: 'Settings',
    },
  ];

  return(
    <>
      <NavBar menuItems={menuItems}>
         <Members/>
      </NavBar>
    </>
  );
}

