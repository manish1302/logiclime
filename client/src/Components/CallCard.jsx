import React from 'react'

const CallCard = ({username}) => {
    console.log(username)
  return (
    <div className='call-card'>
        <div className="caller-name">
            {username && username[4]}
        </div>
    </div>
  )
}

export default CallCard