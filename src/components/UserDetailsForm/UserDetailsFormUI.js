import React from 'react';

   const UserDetailsFormUI = ({ formData, error, handleChange, handleSubmit }) => {
     return (
       <div className="max-w-[400px] mx-auto p-5">
         <h3 className="text-xl font-semibold mb-3 text-gray-800">User Details</h3>
         {error && <div className="text-red-500 mb-2">{error}</div>}
         <form onSubmit={handleSubmit}>
           <div className="mb-4">
             <label className="block mb-1 font-bold">Username:</label>
             <input
               type="text"
               name="username"
               value={formData.username}
               onChange={handleChange}
               required
               className="w-full p-2 border border-gray-300 rounded-md"
             />
           </div>
           <div className="mb-4">
             <label className="block mb-1 font-bold">Email:</label>
             <input
               type="email"
               name="email"
               value={formData.email}
               onChange={handleChange}
               required
               className="w-full p-2 border border-gray-300 rounded-md"
             />
           </div>
           <div className="mb-4">
             <label className="block mb-1 font-bold">Designation:</label>
             <input
               type="text"
               name="designation"
               value={formData.designation}
               onChange={handleChange}
               required
               className="w-full p-2 border border-gray-300 rounded-md"
             />
           </div>
           <button type="submit" className="bg-blue-600 text-white border-none px-5 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition-colors duration-200">
             Update
           </button>
         </form>
       </div>
     );
   };

   export default UserDetailsFormUI;