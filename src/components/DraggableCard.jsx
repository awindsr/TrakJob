import React from "react";
import { useDrag } from "react-dnd";

const DraggableCard = ({ job, children }) => {
  const [, dragRef] = useDrag({
    type: "CARD",
    item: { id: job.application_id, current_status: job.current_status },
  });

  return (
    <div
      ref={dragRef}
      style={{
        
        cursor: "move",
      
      }}
      className="draggable-card">
      {children}
    </div>
  );
};

export default DraggableCard;
