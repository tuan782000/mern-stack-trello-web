import React, { useState, useEffect } from 'react'
import {
  Container as BootstrapContainer,
  Row, Col, ListGroup, Card, Form
} from 'react-bootstrap'
import CustomPagination from 'components/Common/Pagination'
import './Boards.scss'
import CreateNewBoardModal from './CreateNewBoardModal'
import { fetchBoardsAPI } from 'actions/ApiCall'
import LoadingSpinner from 'components/Common/LoadingSpinner'
import { isEmpty } from 'lodash'

function Boards (props) {
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false)
  const [boards, setBoards] = useState(null)

  useEffect(() => {
    fetchBoardsAPI().then(res => {
      setBoards(res)
    })
  }, [])

  return (
    <BootstrapContainer>
      <CreateNewBoardModal
        show={showCreateBoardModal}
        onClose={() => setShowCreateBoardModal(false)}
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
                        <Card>
                          <Card.Body>
                            <Card.Title className="card__title">{b.title}</Card.Title>
                            <Card.Text className="card__description">{b.description}</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
                <CustomPagination currentItems={[...Array(350).keys()]} />
              </>
          }
        </Col>
      </Row>
    </BootstrapContainer>
  )
}

export default Boards
