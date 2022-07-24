import React from 'react'

import './Card.scss'

function Card(props) {
  const { card } = props

  return (
    <div className="card-item">
      {card.cover &&
        <img
          src={card.cover}
          className="card-cover"
          alt="trungquandev-alt-img"
          onMouseDown={e => e.preventDefault()}
        />
      }
      <div className="title">{card.title}</div>
    </div>
  )
}

export default Card
