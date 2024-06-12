import React from 'react';
import { useDrop } from 'react-dnd';
import supabase from "../utils/Supabase";

const DropZone = ({ status, onDrop, children }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: 'CARD',
    drop: (item) => onDrop(item, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });


  
  return (
    <div ref={dropRef} className={`drop-zone ${isOver ? 'hovered' : ''}`}>
      {children}
    </div>
  );
};

export default DropZone;
