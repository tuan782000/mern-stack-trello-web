import React from 'react'
import './App.scss'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// custom components
import AppBar from 'components/AppBar/AppBar'
import BoardBar from 'components/BoardBar/BoardBar'
import BoardContent from 'components/BoardContent/BoardContent'
import Auth from 'components/Auth/Auth'
import AccountVerification from 'components/Auth/AccountVerification/AccountVerification'
import { selectIsAuthenticated, selectCurrentUser } from 'redux/user/userSlice'
import UserPage from 'components/UserPage/UserPage'
import Boards from 'components/Boards/Boards'
import ActiveCardModal from 'components/Common/ActiveCardModal'

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      <Route exact path='/' element={
        !isAuthenticated
          ? <Navigate to='/signIn' replace={true} />
          : <Navigate to={`/u/${currentUser?.username}/boards?currentPage=1`} replace={true} />
      } />

      <Route path='/b/:boardId' element={
        <div className="trello-trungquandev-master">
          <AppBar />
          <BoardBar />
          <BoardContent />
          <ActiveCardModal/>
        </div>
      }/>

      <Route path='/u/:username' element={
        <div className="user__page">
          <AppBar/>
          <UserPage/>
        </div>
      }/>

      <Route path='/u/:username/boards' element={
        <div className="boards__page">
          <AppBar/>
          <Boards/>
        </div>
      }/>

      <Route path='/signIn' element={<Auth />}/>
      <Route path='/signUp' element={<Auth />}/>
      <Route path='/account/verification' element={<AccountVerification />}/>

      {/*404*/}
      <Route path='/*' element={
        <div className="not-found">
          <h3>Oops there is not thing here (404) !!!</h3>
        </div>
      } />
    </Routes>
  )
}

export default App
