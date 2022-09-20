import React from 'react'
import { useDispatch } from 'react-redux'
import { updateCurrentActiveCard } from 'redux/activeCard/activeCardSlice'
import './Card.scss'

function Card(props) {
  const { card } = props

  const dispatch = useDispatch()

  const setActiveCard = () => {
    dispatch(updateCurrentActiveCard(card))
  }

  return (
    <div className="card-item" onClick={setActiveCard}>
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

export default React.memo(Card)