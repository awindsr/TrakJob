import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableCard = ({ job, children }) => {
  const [, dragRef] = useDrag({
    type: 'CARD',
    item: { id: job.id, current_status: job.current_status },
  });

  return (
    <div ref={dragRef} className="draggable-card">
      {children}
    </div>
  );
};

export default DraggableCard;
