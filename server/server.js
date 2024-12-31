const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let savedAddresses = []; 

app.get('/api/addresses', (req, res) => {
  res.json(savedAddresses);
});

app.post('/api/addresses', (req, res) => {
  const address = req.body;
  savedAddresses.push(address);
  res.status(201).json({ message: 'Address saved successfully' });
});

app.delete('/api/addresses/:label', (req, res) => {
  const { label } = req.params;
  
  deleteAddressByLabel(label)
    .then(() => res.status(200).json({ message: 'Address deleted successfully' }))
    .catch((err) => res.status(500).json({ error: 'Failed to delete address' }));
});

const PORT = 30001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
