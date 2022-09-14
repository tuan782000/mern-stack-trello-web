import React, { useState, useEffect } from 'react'
import { useSearchParams, createSearchParams, Link } from 'react-router-dom'
import {
  Container as BootstrapContainer,
  Row, Col, ListGroup, Card, Form
} from 'react-bootstrap'
import CustomPagination from 'components/Common/Pagination'
import './Boards.scss'
import CreateNewBoardModal from './CreateNewBoardModal'
import { fetchBoardsAPI, createNewBoardAPI } from 'actions/ApiCall'
import LoadingSpinner from 'components/Common/LoadingSpinner'
import { isEmpty } from 'lodash'
import { useDebounce } from 'customHooks/useDebounce'

function Boards () {
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false)
  const [boards, setBoards] = useState(null)
  const [totalPages, setTotalPages] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const searchPath = `?${createSearchParams(searchParams)}`
    fetchBoardsAPI(searchPath).then(res => {
      setBoards(res.results)
      setTotalPages(res.totalResults)
    })
  }, [searchParams])

  // Khi người dùng click sang một page tiếp theo
  const onPageChange = (selectedPage) => {
    setSearchParams({
      ...Object.fromEntries([...searchParams]),
      currentPage: selectedPage
      //itemsPerPage: 1 // for test
    })
  }

  const debounceSearchBoard = useDebounce((event) => {
    const searchTerm = event.target?.value

    setSearchParams({
      ...Object.fromEntries([...searchParams]),
      'q[title]': searchTerm
      // 'q[description]': searchTerm
    })
  }, 1000)

  const createNewBoard = async (boardData) => {
    try {
      await createNewBoardAPI(boardData)

      const searchPath = `?${createSearchParams(searchParams)}`
      const listBoards = await fetchBoardsAPI(searchPath)
      setBoards(listBoards.results)
      setTotalPages(listBoards.totalResults)

      return true
    } catch (error) {
      return error
    }
  }

  return (
    <BootstrapContainer>
      <CreateNewBoardModal
        show={showCreateBoardModal}
        onClose={() => setShowCreateBoardModal(false)}
        onCreateNewBoard={createNewBoard}
      />
      <Row>
        <Col md={3} className="mt-5">
          <div className="boards__navigation">
            <div className="boards__heading">Navigation</div>
            <ListGroup variant="flush" className="boards__menu">
              <ListGroup.Item action active><i className="fa fa-columns icon" /> Boards</ListGroup.Item>
              <ListGroup.Item action><i className="fa fa-globe icon" /> Templates</ListGroup.Item>
              <ListGroup.Item action><i className="fa fa-home icon" /> Home</ListGroup.Item>
              <hr/>
              <ListGroup.Item action variant="success" onClick={() => setShowCreateBoardModal(true)}>
                <i className="fa fa-plus-square-o icon" /> Create new board
              </ListGroup.Item>
              <hr/>
              <ListGroup.Item className="p-0">
                <Form className="common__form">
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Search boards..."
                    defaultValue={searchParams.get('q[title]') || ''}
                    onChange={debounceSearchBoard}
                  />
                </Form>
              </ListGroup.Item>
            </ListGroup>
          </div>
        </Col>
        <Col md={9} className="mt-5">
          {!boards
            ? <LoadingSpinner caption="Loading boards..." />
            : isEmpty(boards)
              ? <div>You currently have no board Please create new board!</div>
              : <>
                <div className="grid__boards">
                  <div className="boards__heading">Your boards:</div>
                  <Row xs={1} md={2} lg={3} className="g-4">
                    {boards.map(b => (
                      <Col key = {b._id}>
                        <Card as={Link} to={`/b/${b._id}`} className="text-decoration-none">
                          <Card.Body>
                            <Card.Title className="card__title">{b.title}</Card.Title>
                            <Card.Text className="card__description">{b.description}</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
                <CustomPagination
                  currentPage={searchParams.get('currentPage') || 1}
                  totalPages={totalPages}
                  onPageChange = {onPageChange}
                />
              </>
          }
        </Col>
      </Row>
    </BootstrapContainer>
  )
}

export default Boards
