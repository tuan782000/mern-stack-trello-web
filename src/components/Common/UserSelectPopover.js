import React, { useState } from 'react'
import UserAvatar from 'components/Common/UserAvatar'

function UserSelectPopover({ label, users=[] }) {
  const [showPopover, setShowPopover] = useState(false)

  const toggleShowPopOver = () => {
    setShowPopover(!showPopover)
  }

  return (
    <div className="users__select">
      <div className="users__select__content" onClick={toggleShowPopOver}>
        {label ? label : <i className="fa fa-plus" />}
      </div>
      {showPopover &&
        <div className="users__select__popover">
          <span className="users__select__popover__close_btn" onClick={toggleShowPopOver}>
            <i className="fa fa-close" />
          </span>
          <div className="title mb-2 text-center">Board members</div>
          <div className="users-list">
            {/* {users.map((u, index) => (
              <div className="user" key={index}>
                <UserAvatar
                  user={u}
                  width="28px"
                  height="28px"
                  fontSize="14px"
                />
              </div>
            ))} */}
            <div className="user">
              <UserAvatar
                // user={u}
                width="28px"
                height="28px"
                fontSize="14px"
              />
            </div>
            <div className="user">
              <UserAvatar
                // user={u}
                width="28px"
                height="28px"
                fontSize="14px"
              />
            </div>
            <div className="user">
              <UserAvatar
                // user={u}
                width="28px"
                height="28px"
                fontSize="14px"
              />
            </div>
            <div className="user">
              <UserAvatar
                // user={u}
                width="28px"
                height="28px"
                fontSize="14px"
              />
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default UserSelectPopover
