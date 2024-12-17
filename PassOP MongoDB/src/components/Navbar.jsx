import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-slate-700-200 text-white'>
        <div className="mycontainer flex justify-between px-4 items-center h-14 py-5">
        <div className="logo font-bold text-white text-2xl">
        <span className='text-purple-500'> &lt;</span>
            Pass
        <span className='text-purple-500'> OP/&gt;</span>
           
            
            </div>
      <ul>
        <li className='flex gap-4'>
            <a className='hover:font-bold' href="/">Home</a>
            <a className='hover:font-bold' href="#">About</a>
            <a className='hover:font-bold' href="#">Contact</a>
        </li>
      </ul>
      </div>
    </nav>
  )
}

export default Navbar
