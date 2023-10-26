import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

const MeetingFormPage = ({ onCreateMeeting, onJoinMeeting }) => {
  const [meetingId, setMeetingId] = useState("");

  const handleCreateMeeting = () => {
    onCreateMeeting();
  };

  const handleJoinMeeting = () => {
    onJoinMeeting(meetingId);
  };

  return (
    <Container style={{marginTop: "100px"}}>
      <Row>
        <Col>
          <h2>Create a Meeting</h2>
          <Button variant="primary" onClick={handleCreateMeeting}>
            Create
          </Button>
        </Col>
        <Col>
          <h2>Join a Meeting</h2>
          <Form>
            <Form.Group controlId="formMeetingId">
              <Form.Control
                type="text"
                placeholder="Enter Meeting ID"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" onClick={handleJoinMeeting} className="mt-2">
              Join
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default MeetingFormPage;
