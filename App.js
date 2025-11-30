import React from 'react';
import TableReader from './components/TableReader';

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Supabase Read Function</h1>
      <TableReader tableName="main_table" />
    </div>
  );
}

export default App;
