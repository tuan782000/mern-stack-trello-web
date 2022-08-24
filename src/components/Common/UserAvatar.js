import React from 'react'
import ReactTooltip from 'react-tooltip'

function UserAvatar({ user={}, width='30px', height='30px', fontSize='16px', tooltip }) {
  return (
    <>
      <ReactTooltip />
      {user.avatar
        ? <div className="user-avatar" data-tip={tooltip || user.displayName}>
          <img src={user.avatar} style={{ 'width': width, 'height': height }} />
        </div>
        : <div className="default-avatar" style={{ 'width': width, 'height': height, 'fontSize': fontSize }} data-tip={tooltip || user.displayName}>
          <span className='first-username-char'>{user?.displayName?.charAt(0) || 'A'}</span>
        </div>
      }
    </>
  )
}

export default UserAvatar
