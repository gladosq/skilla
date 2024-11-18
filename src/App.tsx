import {Route, Routes} from 'react-router-dom';
import PhoneCallsTable from './components/PhoneCallsTable/PhoneCallsTable';

export default function App() {
  return (
    <div className='layout'>
      <Routes location={location}>
        <Route index path='*' element={<PhoneCallsTable/>}/>
      </Routes>
    </div>
  );
}
