import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import "./Favorites.css";

const style = {
  padding: '0.6rem 0.6rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

const DnDCard = ({ activ, index, moveCard }) => {
  const activId = activ._id;
  const ref = useRef(null)
  const [{ handlerId }, drop] = useDrop({
    accept: 'DnDCard',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Items not replaced with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      moveCard(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'DnDCard',
    item: () => {
      return { activId, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      <Card className="favoritesCard">
        {
          index < 9 ? 
            <div className="favoritesNumber favoritesNumberOneDigit">
              {index + 1}
            </div>
            :
            <div className="favoritesNumber favoritesNumberTwoDigit">
              {index + 1}
            </div>
        }
        <Link to={"/activs/"+activ._id}>
          {
            activ.hide ? 
            <Card.Img 
              className="favoritesPoster" 
              src={"../images/NoImageAvailable_james-wheeler-ZOA-cqKuJAA-unsplash.jpg"}
            />
            :
            <Card.Img 
              className="favoritesPoster" 
              // src={activ.images+"/100px180"}
              src={activ.images[0]}
              alt={"poster not available"}
              onError={event => {
                event.target.src = "../images/NoImageAvailable_james-wheeler-ZOA-cqKuJAA-unsplash.jpg"
                event.onerror = null
              }}
            />
          }
          {/* <Card.Img 
            className="favoritesPoster" 
            // src={activ.images+"/100px180"}
            src={activ.images[0]}
            alt={"poster not available"}
            onError={event => {
              event.target.src = "../images/NoImageAvailable_james-wheeler-ZOA-cqKuJAA-unsplash.jpg"
              event.onerror = null
            }}
            /> */}
        </Link>
        <Card.Body style={{ textAlign: "center" }}>
          <Card.Title className='favoritesTitle'> {activ.hide ? "This Activity No Longer Exists!" : activ.name}</Card.Title>
        </Card.Body>  
      </Card>
    </div>
  )
}

export default DnDCard;