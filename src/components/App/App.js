import React from 'react';
import Home from '../Home';
import Firebase from '../Firebase';

function App() {
  return (
    <div style={{ height: '600px', width: '360px' }} className="bg-white">
      <Firebase>
        <Home />
      </Firebase>
    </div>
  );
}

export default App;
