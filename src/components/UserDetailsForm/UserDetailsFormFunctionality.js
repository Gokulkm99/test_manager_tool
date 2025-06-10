import React, { useState, useContext } from 'react';
import { AuthContext } from '../../AuthContext'; 
import UserDetailsFormUI from './UserDetailsFormUI';

   const UserDetailsFormFunctionality = () => {
     const { user, updateUser } = useContext(AuthContext);
     const [formData, setFormData] = useState({
       username: user?.username || '',
       email: user?.email || '',
       designation: user?.designation || '',
     });
     const [error, setError] = useState('');

     const handleChange = (e) => {
       setFormData({ ...formData, [e.target.name]: e.target.value });
     };

     const handleSubmit = async (e) => {
       e.preventDefault();
       try {
         await updateUser(formData);
         setError('');
       } catch (err) {
         setError('Failed to update user details');
       }
     };

     return (
       <UserDetailsFormUI
         formData={formData}
         error={error}
         handleChange={handleChange}
         handleSubmit={handleSubmit}
       />
     );
   };

   export default UserDetailsFormFunctionality;