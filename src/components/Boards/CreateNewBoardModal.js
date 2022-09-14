import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import {
  fieldErrorMessage
} from 'utilities/validators'

function CreateNewBoardModal({ show, onClose, onCreateNewBoard }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    onCreateNewBoard(data)
      .then(() => {
        onClose()
        reset()
      })
  }

  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      animation={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="h5">Create new board</Modal.Title>
      </Modal.Header>
      <Form className="common__form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>Board Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              autoFocus
              {...register('title', {
                required: { value: true, message: 'Title is required.' },
                minLength: { value: 3, message: 'Min Length is 3 characters' },
                maxLength: { value: 50, message: 'Max Length is 50 characters' }
              })}
            />
            {fieldErrorMessage(errors, 'title')}
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="formBasicDescription"
          >
            <Form.Label>Board Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register('description', { required: { value: true, message: 'Description is required.' } })}
            />
            {fieldErrorMessage(errors, 'description')}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="success" type="submit">Create</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default CreateNewBoardModal
