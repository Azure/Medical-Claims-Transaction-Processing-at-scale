import Link from "next/link";
import Image from "next/image";

export default function NavBar({children, menuItems}){  
  return(
    <div className='min-h-screen flex flex-col'>
      <header className='bg-white sticky top-0 h-14 flex justify-center items-center font-semibold uppercase'>
        <h1 className='h-10'>Medical Claims</h1>
        
      </header>

      <button className="float-left absolute w-20">
        <i class="fas fa-align-justify dark:text-slate-300 group-hover:text-blue-400"></i>
      </button>

      <div className='flex flex-col md:flex-row flex-1'>
        <aside className='bg-gray-300 md:w-40'>
          <nav>
            <ul>
              {menuItems.map(({ href, title }) => (
                <li className='m-2' key={title}>
                  <Link href={href} className={`flex p-2 rounded hover:bg-slate-400 cursor-pointer`}>
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className='flex min-h-screen flex-col p-24'>{children}</main>
      </div>
    </div>
  );
}