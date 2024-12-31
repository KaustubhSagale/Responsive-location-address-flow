import React from 'react';

const AddressManagement = ({ savedAddresses, onDelete }) => {
  return (
    <div className="address-management">
      <h2>Saved Addresses</h2>
      {savedAddresses.length > 0 ? (
        <ul>
          {savedAddresses.map((address, index) => (
            <li key={index}>
              <div>
                <strong>{address.name}</strong>
                <p>{address.address}</p>
                <p>{address.description}</p>
                <button onClick={() => onDelete(address.name)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No saved addresses.</p>
      )}
    </div>
  );
};

export default AddressManagement;
