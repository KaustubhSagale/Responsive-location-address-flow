import React, { useState } from 'react';

const AddressForm = ({ onSave }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAddress = {
      name,
      address,
      description,
    };

    onSave(newAddress);

    setName('');
    setAddress('');
    setDescription('');
  };

  return (
    <div className="address-form">
      <h2>Add New Address</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button type="submit">Save Address</button>
      </form>
    </div>
  );
};

export default AddressForm;
