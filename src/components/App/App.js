import React from 'react';
import Home from '../Home';
import Firebase from '../Firebase';

function App() {
  return (
    <div style={{ height: '600px', width: '360px' }} className="py-2 overflow-auto text-sm bg-white">
      <Firebase>
        <Home />
      </Firebase>
    </div>
  );
}

export default App;
