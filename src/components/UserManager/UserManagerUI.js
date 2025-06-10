import React from 'react';

   const UserManagerUI = ({ users, handleEdit, handleDelete }) => {
     return (
       <div className="p-4">
         <h2 className="text-2xl font-bold mb-4 text-gray-800">User Manager</h2>
         <div className="overflow-x-auto">
           <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
             <thead>
               <tr className="bg-gray-100 border-b">
                 <th className="p-3 text-left text-gray-700 font-semibold">Username</th>
                 <th className="p-3 text-left text-gray-700 font-semibold">Email</th>
                 <th className="p-3 text-left text-gray-700 font-semibold">Actions</th>
               </tr>
             </thead>
             <tbody>
               {users.map(user => (
                 <tr key={user.id} className="border-b hover:bg-gray-50">
                   <td className="p-3 text-gray-800">{user.username}</td>
                   <td className="p-3 text-gray-800">{user.email}</td>
                   <td className="p-3">
                     <button
                       onClick={() => handleEdit(user.id)}
                       className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600 transition-colors duration-200"
                     >
                       Edit
                     </button>
                     <button
                       onClick={() => handleDelete(user.id)}
                       className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-200"
                     >
                       Delete
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
     );
   };

   export default UserManagerUI;