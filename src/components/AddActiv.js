import { useState, useCallback } from "react";
import ActivDataService from "../services/activs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, ListGroup, ListGroupItem } from "react-bootstrap";
import Geocode from 'react-geocode';

import S3 from 'react-aws-s3';
import Upload from "./Upload";
// window.Buffer = window.Buffer || require("buffer").Buffer;

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);

const AddActiv = ({ user }) => {
  const navigate = useNavigate();
  const params = useParams();
  const location=useLocation();

  let editing = false;
  
  let initialNameState = "";
  let initialAddressState = "";
  let initialDescriptionState = "";
  let initialImageUrlState = "";
  let initialTagState = "";
  let initialCoordinate = null;

  
  if(location.state && location.state.currentActiv){
    editing = true;
    initialNameState = location.state.currentActiv.name;
    initialAddressState = location.state.currentActiv.address;
    initialDescriptionState = location.state.currentActiv.description;
    initialImageUrlState = location.state.currentActiv.images;
    initialTagState = location.state.currentActiv.tags;
    initialCoordinate = location.state.currentActiv.coord;
  }
  
  
  const [name, setName] = useState(initialNameState);
  const [address, setAddress] = useState(initialAddressState);
  const [description, setDescription] = useState(initialDescriptionState);
  const [imageUrl, setImageUrl] = useState(initialImageUrlState);
  const [tag, setTag] = useState(initialTagState);
  const [coordinate, setCoordinate] = useState([]);
  const [editAddress, setEditAddress] = useState(false);

  const onChangeName = e => {
    setName(e.target.value);
  }

  const onChangeAddress = e => {
    setAddress(e.target.value);
    setEditAddress(true);
    console.log(editAddress);
  }

  const onChangeDescription = e => {
    setDescription(e.target.value);
  }

  const onChangeTag = e => {
    setTag(e.target.value);
  }

  
  const getCoordinate = async () => {
    await Geocode.fromAddress(address).then(
       response => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);
        setCoordinate([lat, lng]);
        //return [lat, lng];
        //return `{ lat: ${lat}, lng: ${lng} }`
      },
      error => {
        console.log("Geocode.fromAddress(address) error")
        console.error(error);
      },);
  }
  

  const saveActiv = () => {
    console.log(coordinate);
    var data = {
      user_id: user.googleId,
      user_name: user.name,
      name: name,
      address: address,
      imageUrl: imageUrl,
      description: description,
      tag: tag,
      coordinate: coordinate
    }
    console.log(data);
    if (editing) {
      data.activ_id = location.state.currentActiv._id;
      ActivDataService.updateActiv(data)
        .then(response => {
          navigate("/activs/"+location.state.currentActiv._id);
        })
        .catch(e => {
          console.log(e);
        })
    }
    else {
      ActivDataService.creatActiv(data)
      .then(response => {
        console.log(response);
        navigate("/user");
        // navigate("/activs/");
      })
      .catch(e => {
        console.log(e);
      });
    }
  }

  return (
    <Container className="main-container">
      
      <Form className="form-horizontal">
        <Form.Group className="mb-3">
          <Form.Label>Name:</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter name"
            required
            name={ name }
            onChange={ onChangeName }
            defaultValue={ name }
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address: --'please use get coordinate before submit'</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter address"
            required
            address={ address }
            onChange={ onChangeAddress }
            defaultValue={ address }
          ></Form.Control>
        </Form.Group>
        <Button onClick={getCoordinate}>get coordinate</Button>
        <ListGroup>
          <ListGroupItem variant='success' horizontal='true'>{coordinate}</ListGroupItem>
        </ListGroup>

        <Form.Group className="mb-3">
          <Form.Label>Description:</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter description"
            required
            description={ description }
            onChange={ onChangeDescription }
            defaultValue={ description }
            as="textarea" rows={3}
          ></Form.Control >
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tag:</Form.Label>
          <Form.Select 
            aria-label="Tag:" 
            onChange={onChangeTag}
            tag={ tag }
            defaultValue = {tag}
            >
            <option value="">chose tag</option>
            <option value="hiking">hiking</option>
            <option value="climbing">climbing</option>
            <option value="fishing">fishing</option>
            <option value="kayaking">kayaking</option>
            <option value="camping">camping</option>
            <option value="cycling">cycling</option>
          </Form.Select>
        </Form.Group>
      </Form>

      <Upload setImageUrl={setImageUrl} ImageUrl={imageUrl}></Upload>
      <br></br>
      <br></br>
      <br></br>
      <Button variant="primary" onClick={saveActiv}>
        Submit
      </Button>

    </Container>
  )
}

export default AddActiv;