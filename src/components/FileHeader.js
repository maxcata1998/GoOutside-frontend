import { Button, ListGroup } from 'react-bootstrap';
import React from 'react';

const FileHeader = ({url, deleteFile}) => {
  return (
    <ListGroup variant="flush">
      <ListGroup.Item variant='success' horizontal='true'>{url} 
        <Button className="position-absolute end-0" size='sm' variant='warning' onClick={() => deleteFile(url)}>Delete</Button>
      </ListGroup.Item>
      {/* <ListGroup.Item><Button size='sm' variant='warning' onClick={() => deleteFile(url)}>Delete</Button></ListGroup.Item> */}
    </ListGroup>
  );
}

export default FileHeader;