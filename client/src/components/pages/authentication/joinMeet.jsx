import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  getUsersByRoom,
  updateUserProfile,
} from "../../../actions/userActions";
import { UPDATE_PROFILE_RESET } from "../../../constants/userConstants";
import toast from "react-hot-toast";

const MeetingFormPage = () => {
  const [meetingId, setMeetingId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isUpdated, user } = useSelector((state) => state.updatedUsers);
  const { error, users } = useSelector((state) => state.users);

  function GenerateRandomId() {
    const randomUUID = uuidv4();
    const uuidString = randomUUID.toString();
    return uuidString;
  }

  const randomId = GenerateRandomId();

  const handleCreateMeeting = () => {
    dispatch(updateUserProfile({ roomId: randomId }));
  };

  const handleJoinMeeting = async () => {
    if (meetingId) {
      try {
        await dispatch(getUsersByRoom(meetingId));
        if (users && meetingId) {
          dispatch(updateUserProfile({roomId: meetingId}));
          navigate(`/home/${meetingId}`);
        } else {
          toast.error("Error joining meeting.");
        }
      } catch (error) {
        toast.error("Error joining meeting: " + error.message);
      }
    }
  };

  useEffect(() => {
    if (isUpdated) {
      navigate(`/home/${user.roomId}`);
      dispatch({
        type: UPDATE_PROFILE_RESET,
      });
    }
  }, [isUpdated]);

  return (
    <Container style={{ marginTop: "100px" }}>
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
            <Button
              variant="success"
              onClick={handleJoinMeeting}
              className="mt-2"
            >
              Join
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default MeetingFormPage;
