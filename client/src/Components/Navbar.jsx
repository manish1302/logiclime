import React from 'react'
import user from '../assets/user.png'
import lemon from '../assets/lemon.png'

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="logo cursor-pointer"><img style={{height : "30px", cursor : "pointer", marginRight : "8px"}} src={lemon} alt="" />Logic Lime</div>
      <div><img style={{height : "30px", cursor : "pointer"}} src={user} alt="" /></div>
    </div>
  )
}

export default Navbar
