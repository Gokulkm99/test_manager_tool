import React from 'react';
   import { motion } from 'framer-motion';

   const SettingsCardUI = ({
     user,
     activeTab,
     setActiveTab,
     newUser,
     setNewUser,
     projects,
     newProject,
     setNewProject,
     newSubProject,
     setNewSubProject,
     labels,
     newLabel,
     setNewLabel,
     taskTypes,
     newTaskType,
     setNewTaskType,
     confirmDeleteProject,
     setConfirmDeleteProject,
     confirmDeleteSubProject,
     setConfirmDeleteSubProject,
     error,
     setError,
     handleAddUser,
     handleAddProject,
     handleAddSubProject,
     handleDeleteProject,
     handleDeleteSubProject,
     handleAddLabel,
     handleDeleteLabel,
     handleAddTaskType,
     handleDeleteTaskType,
     UserDetailsFormComponent,
   }) => {
     if (!user) return null;

     return (
       <motion.div
         className="p-5 max-w-[1200px] mx-auto"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
       >
         <h2 className="text-2xl font-bold mb-4 text-gray-800">Settings</h2>
         <div className="flex gap-2 mb-5">
           {['user-details', ...(user.role === 'Admin' ? ['manage-users', 'manage-projects', 'manage-labels', 'manage-task-types'] : [])].map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-5 py-2 border-none cursor-pointer rounded-md transition-colors duration-200 ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
             >
               {tab.replace('-', ' ').toUpperCase()}
             </button>
           ))}
         </div>

         {error && <div className="text-red-500 mb-2">{error}</div>}

         {activeTab === 'user-details' && <UserDetailsFormComponent />}

         {activeTab === 'manage-users' && user.role === 'Admin' && (
           <motion.div
             className="manage-users"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.5 }}
           >
             <h3 className="text-xl font-semibold mb-3 text-gray-800">Add New User</h3>
             <form onSubmit={handleAddUser}>
               <div className="mb-4">
                 <label className="block mb-1 font-bold">Username</label>
                 <input
                   type="text"
                   value={newUser.username}
                   onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                   required
                   className="w-full p-2 border border-gray-300 rounded-md"
                 />
               </div>
               <div className="mb-4">
                 <label className="block mb-1 font-bold">Password</label>
                 <input
                   type="password"
                   value={newUser.password}
                   onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                   required
                   className="w-full p-2 border border-gray-300 rounded-md"
                 />
               </div>
               <div className="mb-4">
                 <label className="block mb-1 font-bold">Email</label>
                 <input
                   type="email"
                   value={newUser.email}
                   onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                   required
                   className="w-full p-2 border border-gray-300 rounded-md"
                 />
               </div>
               <div className="mb-4">
                 <label className="block mb-1 font-bold">Designation</label>
                 <input
                   type="text"
                   value={newUser.designation}
                   onChange={(e) => setNewUser({ ...newUser, designation: e.target.value })}
                   required
                   className="w-full p-2 border border-gray-300 rounded-md"
                 />
               </div>
               <div className="mb-4">
                 <label className="block mb-1 font-bold">Employee ID</label>
                 <input
                   type="text"
                   value={newUser.employee_id}
                   onChange={(e) => setNewUser({ ...newUser, employee_id: e.target.value })}
                   required
                   className="w-full p-2 border border-gray-300 rounded-md"
                 />
               </div>
               <button type="submit" className="bg-blue-600 text-white border-none px-5 py-2 rounded-md cursor-pointer mt-2 hover:bg-blue-700 transition-colors duration-200">
                 Add User
               </button>
             </form>
           </motion.div>
         )}

         {activeTab === 'manage-projects' && user.role === 'Admin' && (
           <motion.div
             className="manage-projects"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.5 }}
           >
             <h3 className="text-xl font-semibold mb-3 text-gray-800">Manage Projects</h3>
             <form onSubmit={handleAddProject}>
               <div className="mb-4">
                 <label className="block mb-1 font-bold">Main Project</label>
                 <input
                   type="text"
                   value={newProject}
                   onChange={(e) => setNewProject(e.target.value)}
                   required
                   className="w-full p-2 border border-gray-300 rounded-md"
                 />
               </div>
               <button type="submit" className="bg-blue-600 text-white border-none px-5 py-2 rounded-md cursor-pointer mt-2 hover:bg-blue-700 transition-colors duration-200">
                 Add Project
               </button>
             </form>
             <form onSubmit={handleAddSubProject}>
               <div className="mb-4">
                 <label className="block mb-1 font-bold">Main Project</label>
                 <select
                   value={newSubProject.mainProject}
                   onChange={(e) => setNewSubProject({ ...newSubProject, mainProject: e.target.value })}
                   required
                   className="w-full p-2 border border-gray-300 rounded-md"
                 >
                   <option value="">Select Main Project</option>
                   {Object.keys(projects).map(proj => (
                     <option key={proj} value={proj}>{proj}</option>
                   ))}
                 </select>
               </div>
               <div className="mb-4">
                 <label className="block mb-1 font-bold">Sub-Project</label>
                 <input
                   type="text"
                   value={newSubProject.subProject}
                   onChange={(e) => setNewSubProject({ ...newSubProject, subProject: e.target.value })}
                   required
                   className="w-full p-2 border border-gray-300 rounded-md"
                 />
               </div>
               <button type="submit" className="bg-blue-600 text-white border-none px-5 py-2 rounded-md cursor-pointer mt-2 hover:bg-blue-700 transition-colors duration-200">
                 Add Sub-Project
               </button>
             </form>
             <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Existing Projects and Subprojects</h4>
             <table className="w-full border-collapse mt-5">
               <thead>
                 <tr>
                   <th className="border border-gray-300 p-3 text-left bg-gray-100">Main Project</th>
                   <th className="border border-gray-300 p-3 text-left bg-gray-100">Sub-Project</th>
                   <th className="border border-gray-300 p-3 text-left bg-gray-100">Action</th>
                 </tr>
               </thead>
               <tbody>
                 {Object.entries(projects).flatMap(([mainProj, subProjs]) =>
                   subProjs.length > 0 ? (
                     subProjs.map(subProj => (
                       <tr key={`${mainProj}-${subProj}`}>
                         <td className="border border-gray-300 p-3">{mainProj}</td>
                         <td className="border border-gray-300 p-3">{subProj}</td>
                         <td className="border border-gray-300 p-3">
                           <button
                             onClick={() => setConfirmDeleteSubProject({ mainProject: mainProj, subProject: subProj })}
                             className="bg-red-500 text-white border-none px-3 py-1 rounded-md cursor-pointer hover:bg-red-600 transition-colors duration-200"
                           >
                             Delete
                           </button>
                           {confirmDeleteSubProject?.mainProject === mainProj &&
                             confirmDeleteSubProject?.subProject === subProj && (
                               <div className="mt-2">
                                 <p className="text-gray-700">Are you sure you want to delete {subProj} from {mainProj}?</p>
                                 <button
                                   onClick={() => handleDeleteSubProject(mainProj, subProj)}
                                   className="mr-2 px-3 py-1 border-none rounded-md cursor-pointer bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                                 >
                                   Yes
                                 </button>
                                 <button
                                   onClick={() => setConfirmDeleteSubProject(null)}
                                   className="px-3 py-1 border-none rounded-md cursor-pointer bg-gray-400 text-white hover:bg-gray-500 transition-colors duration-200"
                                 >
                                   No
                                 </button>
                               </div>
                             )}
                         </td>
                       </tr>
                     ))
                   ) : (
                     <tr key={mainProj}>
                       <td className="border border-gray-300 p-3">{mainProj}</td>
                       <td className="border border-gray-300 p-3">-</td>
                       <td className="border border-gray-300 p-3">
                         <button
                           onClick={() => setConfirmDeleteProject(mainProj)}
                           className="bg-red-500 text-white border-none px-3 py-1 rounded-md cursor-pointer hover:bg-red-600 transition-colors duration-200"
                         >
                           Delete
                         </button>
                         {confirmDeleteProject === mainProj && (
                           <div className="mt-2">
                             <p className="text-gray-700">Are you sure you want to delete {mainProj}?</p>
                             <button
                               onClick={() => handleDeleteProject(mainProj)}
                               className="mr-2 px-3 py-1 border-none rounded-md cursor-pointer bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                             >
                               Yes
                             </button>
                             <button
                               onClick={() => setConfirmDeleteProject(null)}
                               className="px-3 py-1 border-none rounded-md cursor-pointer bg-gray-400 text-white hover:bg-gray-500 transition-colors duration-200"
                             >
                               No
                             </button>
                           </div>
                         )}
                       </td>
                     </tr>
                   )
                 )}
               </tbody>
             </table>
           </motion.div>
         )}

         {activeTab === 'manage-labels' && user.role === 'Admin' && (
           <motion.div
             className="manage-labels"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.5 }}
           >
             <h3 className="text-xl font-semibold mb-3 text-gray-800">Manage Labels</h3>
             <form onSubmit={handleAddLabel}>
               <div className="mb-4">
                 <label className="block mb-1 font-bold">Label Name</label>
                 <input
                   type="text"
                   value={newLabel.label_name}
                   onChange={(e) => setNewLabel({ ...newLabel, label_name: e.target.value })}
                   required
                   className="w-full p-2 border border-gray-300 rounded-md"
                 />
               </div>
               <div className="mb-4">
                 <label className="block mb-1 font-bold">Color</label>
                 <input
                   type="color"
                   value={newLabel.color}
                   onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })}
                   required
                   className="w-full p-2 border border-gray-300 rounded-md"
                 />
               </div>
               <button type="submit" className="bg-blue-600 text-white border-none px-5 py-2 rounded-md cursor-pointer mt-2 hover:bg-blue-700 transition-colors duration-200">
                 Add Label
               </button>
             </form>
             <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Existing Labels</h4>
             <ul className="list-none p-0">
               {Object.entries(labels).map(([labelName, color]) => (
                 <li key={labelName} className="py-2 flex items-center gap-2">
                   <span>{labelName}</span>
                   <span style={{ color }} className="inline-block w-5 h-5 rounded-full border border-gray-300"></span>
                   <button
                     onClick={() => handleDeleteLabel(labelName)}
                     className="bg-red-500 text-white border-none px-3 py-1 rounded-md cursor-pointer hover:bg-red-600 transition-colors duration-200"
                   >
                     Delete
                   </button>
                 </li>
               ))}
             </ul>
           </motion.div>
         )}

         {activeTab === 'manage-task-types' && user.role === 'Admin' && (
           <motion.div
             className="manage-task-types"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.5 }}
           >
             <h3 className="text-xl font-semibold mb-3 text-gray-800">Manage Task Types</h3>
             <form onSubmit={handleAddTaskType}>
               <div className="mb-4">
                 <label className="block mb-1 font-bold">Task Type</label>
                 <input
                   type="text"
                   value={newTaskType}
                   onChange={(e) => setNewTaskType(e.target.value)}
                   required
                   className="w-full p-2 border border-gray-300 rounded-md"
                 />
               </div>
               <button type="submit" className="bg-blue-600 text-white border-none px-5 py-2 rounded-md cursor-pointer mt-2 hover:bg-blue-700 transition-colors duration-200">
                 Add Task Type
               </button>
             </form>
             <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Existing Task Types</h4>
             <ul className="list-none p-0">
               {taskTypes.map(tt => (
                 <li key={tt} className="py-2 flex items-center gap-2">
                   <span>{tt}</span>
                   <button
                     onClick={() => handleDeleteTaskType(tt)}
                     className="bg-red-500 text-white border-none px-3 py-1 rounded-md cursor-pointer hover:bg-red-600 transition-colors duration-200"
                   >
                     Delete
                   </button>
                 </li>
               ))}
             </ul>
           </motion.div>
         )}
       </motion.div>
     );
   };

   export default SettingsCardUI;