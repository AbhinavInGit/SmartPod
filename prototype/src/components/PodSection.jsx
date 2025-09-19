import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import initialFriends from "../data/friends.json";

function PodSection({ onCreate }) {
  const [name, setName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const navigate = useNavigate();

  // State for new friend selection features
  const [friends, setFriends] = useState(initialFriends);
  const [searchQuery, setSearchQuery] = useState("");
  const [newFriendUsername, setNewFriendUsername] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter friends for the searchable dropdown
  const filteredFriends = friends.filter(
    (friend) =>
      friend.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedMembers.includes(friend)
  );

  // Add a friend from the dropdown to the pod members
  const addMember = (friend) => {
    setSelectedMembers([...selectedMembers, friend]);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  // Remove a friend from the pod members
  const removeMember = (friendToRemove) => {
    setSelectedMembers(selectedMembers.filter((f) => f !== friendToRemove));
  };

  // Add a new friend by username
  const handleAddNewFriend = () => {
    if (newFriendUsername && !friends.includes(newFriendUsername)) {
      setFriends([...friends, newFriendUsername]);
      setSelectedMembers([...selectedMembers, newFriendUsername]);
      setNewFriendUsername("");
    } else if (newFriendUsername && !selectedMembers.includes(newFriendUsername)) {
      // If friend exists but isn't selected, add them
      setSelectedMembers([...selectedMembers, newFriendUsername]);
      setNewFriendUsername("");
    }
  };

  const handleCreate = () => {
    if (name && selectedMembers.length > 0) {
      const podId = onCreate(name, selectedMembers);
      navigate(`/pods/${podId}`);
    } else {
      alert("Please provide a pod name and select at least one member.");
    }
  };

  return (
    <div className="card">
      <h2>Create Pod</h2>
      <input
        type="text"
        placeholder="Pod Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <h3>Select Existing Friends</h3>
      <div className="search-dropdown-container">
        <input
          type="text"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
        />
        {isDropdownOpen && filteredFriends.length > 0 && (
          <div className="dropdown-list">
            {filteredFriends.map((friend) => (
              <div
                key={friend}
                className="dropdown-item"
                onClick={() => addMember(friend)}
              >
                {friend}
              </div>
            ))}
          </div>
        )}
      </div>

      <h4>Pod Members:</h4>
      {selectedMembers.length === 0 ? (
        <p>No members selected yet.</p>
      ) : (
        <div className="selected-members">
          {selectedMembers.map((member) => (
            <div key={member} className="member-tag">
              <span>{member}</span>
              <button
                onClick={() => removeMember(member)}
                className="remove-btn"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <hr style={{ margin: "24px 0" }} />

      <h3>Add New Friend by Username</h3>
      <div className="add-friend-section">
        <input
          type="text"
          placeholder="Enter username..."
          value={newFriendUsername}
          onChange={(e) => setNewFriendUsername(e.target.value)}
        />
        <button onClick={handleAddNewFriend}>Add Friend</button>
      </div>

      <button
        onClick={handleCreate}
        style={{ width: "100%", marginTop: "24px", paddingTop: '12px', paddingBottom: '12px', fontSize: '1rem' }}
      >
        Create Pod
      </button>
    </div>
  );
}

export default PodSection;