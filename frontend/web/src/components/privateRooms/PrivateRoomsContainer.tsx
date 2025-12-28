import React, { useState } from "react";
import { PrivateRoomsMain } from "./PrivateRoomsMain";
import { CreateRoomModal } from "./CreateRoomModal";
import { PrivateRoomChat } from "./PrivateRoomChat";
import { PrivateRoom, User } from "@/types/privateRooms";
import { mockUsers } from "@/data/privateRoomsMockData";

export const PrivateRoomsContainer: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<PrivateRoom | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock current user - in real app this would come from auth context
  const currentUser: User = mockUsers[0]; // TechBull2024 (premium user)

  const handleRoomSelect = (room: PrivateRoom) => {
    setSelectedRoom(room);
    // Here we would navigate to the room chat view
    console.log("Selected room:", room.name);
  };

  const handleCreateRoom = () => {
    setShowCreateModal(true);
  };

  const handleRoomCreated = (roomData: Partial<PrivateRoom>) => {
    console.log("Creating room:", roomData);
    // Here we would call the API to create the room
    // For now, just close the modal
    setShowCreateModal(false);
  };

  return (
    <div className="h-full">
      {!selectedRoom ? (
        <PrivateRoomsMain
          onRoomSelect={handleRoomSelect}
          onCreateRoom={handleCreateRoom}
        />
      ) : (
        <PrivateRoomChat
          room={selectedRoom}
          onBackToRooms={() => setSelectedRoom(null)}
        />
      )}

      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRoom={handleRoomCreated}
        userTier={currentUser.tier}
      />
    </div>
  );
};
