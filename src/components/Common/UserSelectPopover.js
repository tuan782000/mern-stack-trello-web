import React, { useState, useEffect } from 'react'
import UserAvatar from 'components/Common/UserAvatar'
import {
  USER_SELECT_POPOVER_TYPE_CARD_MEMBERS,
  CARD_MEMBERS_ACTION_PUSH,
  CARD_MEMBERS_ACTION_REMOVE
} from 'utilities/constants'
import { cloneDeep } from 'lodash'

function UserSelectPopover({ label, users=[], type, cardMemberIds, beforeUpdateCardMembers }) {
  const [showPopover, setShowPopover] = useState(false)
  const [remakeUsers, setRemakeUsers] = useState([])

  const toggleShowPopOver = () => {
    setShowPopover(!showPopover)
  }

  useEffect(() => {
    if (Array.isArray(users) && Array.isArray(cardMemberIds) && type === USER_SELECT_POPOVER_TYPE_CARD_MEMBERS) {
      let newRemakeUsers = cloneDeep(users)
      newRemakeUsers.forEach(user => {
        if (cardMemberIds.includes(user._id)) {
          user['selected'] = true
        }
      })
      setRemakeUsers(newRemakeUsers)
    } else {
      setRemakeUsers(users)
    }
  }, [users, cardMemberIds, type])

  const handleClickUser = (incomingUser) => {
    if (type === USER_SELECT_POPOVER_TYPE_CARD_MEMBERS) {
      let action = CARD_MEMBERS_ACTION_PUSH
      if (incomingUser.selected) { action = CARD_MEMBERS_ACTION_REMOVE }

      beforeUpdateCardMembers(incomingUser._id, action)
    }
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
            {remakeUsers.map((u, index) => (
              <div
                className={`user ${u.selected ? 'selected' : ''}`}
                key={index}
                onClick={() => handleClickUser(u)}
              >
                <UserAvatar
                  user={u}
                  width="32px"
                  height="32px"
                  fontSize="14px"
                />
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  )
}

export default UserSelectPopover
