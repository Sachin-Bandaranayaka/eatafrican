// "use client";

// import React, { useState } from 'react';
// import { ChevronDown, Edit2, X } from 'lucide-react';

// // ===================================================================================
// // MOCK DATA
// // ===================================================================================
// const allRestaurantData = [
//     {
//         region: 'BASEL',
//         restaurants: [
//             {
//                 name: 'African Restaurant 1',
//                 address: 'Example Street 1, Basel',
//                 registrationDate: '01.01.2025',
//                 status: 'ACTIVE',
//                 manager: { firstName: 'John', lastName: 'Doe', email: 'john.doe@email.com', phone: '079 123 45 67' },
//                 fullAddress: { postalCode: '4051', city: 'Basel', street: 'Example Street 1' },
//                 type: 'Normal Restaurant',
//                 offering: 'Nigerian',
//                 logoUrl: '/placeholder.png',
//                 proofUrl: '/placeholder.png',
//                 idUrl: '/placeholder.png',
//                 menu: {
//                     'MAIN DISHES': [{ name: 'Meal 1', description: 'Lorem ipsum, lorem ipsum, lorem ipsumLorem ipsum, lorem ipsumLorem ipsum, l', price: '50. Fr.', quantity: 50, threshold: 50, imageUrl: '/placeholder.png' }],
//                     'APPETIZERS': [{ name: 'Appetizer 1', description: 'A tasty starting dish.', price: '15. Fr.', quantity: 100, threshold: 50, imageUrl: '/placeholder.png' }],
//                 },
//                 activityLog: [
//                     { dateTime: '10.05.2025, 18:00 hrs', activity: 'Logged in' },
//                     { dateTime: '10.05.2025, 17:30 hrs', activity: 'Changed Password' },
//                 ]
//             },
//         ]
//     },
// ];
// const initialSpecialities = ['Eritrean & Ethiopian', 'Kenyan', 'Ghanaian & Nigerian'];
// const initialMenuCategories = ['MAIN DISHES', 'APPETIZERS', 'DRINKS', 'DESSERTS'];
// const initialLocations = ['BASEL', 'BERN', 'LUZERN', 'Zürich'];


// // ===================================================================================
// // MODAL COMPONENTS (Used in Settings)
// // ===================================================================================
// const AddItemModal = ({ itemName, onSave, onCancel }) => {
//     const [name, setName] = useState('');
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-[#FACB9F] rounded-lg p-6 w-11/12 md:w-1/3 max-w-lg shadow-lg">
//                 <h3 className="font-bold text-black mb-4 text-[9px] md:text-[15px]">ADD {itemName.toUpperCase()}</h3>
//                 <div className="space-y-2">
//                     <label className="text-black font-bold text-[7px] md:text-[12px]">Name of {itemName}</label>
//                     <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-400 rounded-md p-2" />
//                 </div>
//                 <div className="flex justify-start gap-4 mt-6">
//                     <button onClick={() => onSave(name)} className="bg-red-900 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">SAVE</button>
//                     <button onClick={onCancel} className="bg-red-900 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">CANCEL</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const EditItemModal = ({ itemName, itemValue, onSave, onCancel }) => {
//     const [name, setName] = useState(itemValue);
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-[#FACB9F] rounded-lg p-6 w-11/12 md:w-1/3 max-w-lg shadow-lg">
//                 <h3 className="font-bold text-black mb-4 text-[9px] md:text-[15px]">EDIT {itemName.toUpperCase()}</h3>
//                 <div className="space-y-2">
//                     <label className="text-black font-bold text-[7px] md:text-[12px]">Name of {itemName}</label>
//                     <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-400 rounded-md p-2" />
//                 </div>
//                 <div className="flex justify-start gap-4 mt-6">
//                     <button onClick={() => onSave(itemValue, name)} className="bg-red-900 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">SAVE</button>
//                     <button onClick={onCancel} className="bg-red-900 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">CANCEL</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const DeleteItemModal = ({ itemName, itemValue, onDelete, onCancel }) => {
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-red-200 border-2 border-red-500 rounded-lg p-6 w-11/12 md:w-1/3 max-w-lg shadow-lg">
//                 <h3 className="font-bold text-black mb-4 text-[9px] md:text-[15px]">DELETE {itemName.toUpperCase()}</h3>
//                 <p className="text-black text-[7px] md:text-[12px] mb-6">Are you sure you want to delete {itemValue}?</p>
//                 <div className="flex justify-start gap-4">
//                     <button onClick={() => onDelete(itemValue)} className="bg-red-800 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">DELETE</button>
//                     <button onClick={onCancel} className="bg-red-800 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">CANCEL</button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // ===================================================================================
// // INDIVIDUAL VIEW & HELPER COMPONENTS
// // ===================================================================================

// // --- Management Page Components ---
// const StatusFilter = ({ status, onStatusChange }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const statuses = ['ACTIVE', 'INACTIVE', 'NEW REGISTRATION'];
//     return (
//         <div className="relative z-1 ">
//             <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-between w-full md:w-48 bg-green-300 text-white font-bold py-1 px-3 transition-all duration-200 text-[7px] md:text-[12px] ${isOpen ? 'rounded-t-lg' : 'rounded-lg'}`}>
//                 <span>{status}</span>
//                 <ChevronDown size={16} />
//             </button>
//             {isOpen && (
//                 <div className="absolute top-full right-0 w-full bg-green-300 border border-gray-300 rounded-b-lg shadow-lg z-20">
//                     {statuses.filter(s => s !== status).map(s => (
//                         <button key={s} onClick={() => { onStatusChange(s); setIsOpen(false); }} className="block w-full text-left px-3 py-2 font-bold text-black hover:bg-gray-100 text-[7px] md:text-[12px]">{s}</button>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// const AllRestaurantsView = ({ restaurants, onSelectRestaurant, status, onStatusChange }) => (
//     <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-4 min-h-[550px]">
//         <div className="flex justify-between w-1/2 items-center mb-4">
//             <h2 className="font-bold text-black text-[9px] md:text-[15px]">All Restaurants</h2>
//             <StatusFilter status={status} onStatusChange={onStatusChange} />
//         </div>
//         <div className="overflow-x-auto">
//             <table className="w-full text-left">
//                 <thead>
//                     <tr className="bg-[#FFE59E]">
//                         <th className="p-3 font-bold text-black uppercase w-1/4 text-[7px] md:text-[15px]">ALL REGIONS</th>
//                         <th className="p-3 font-bold text-black uppercase w-1/4 text-[7px] md:text-[15px]">RESTAURANT NAME</th>
//                         <th className="p-3 font-bold text-black uppercase w-1/4 text-[7px] md:text-[15px]">ADDRESS</th>
//                         <th className="p-3 font-bold text-black uppercase w-1/4 text-[7px] md:text-[15px]">REGISTRATION DATE</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {restaurants.map((group) => (
//                         <React.Fragment key={group.region}>
//                             <tr>
//                                 <td className="pl-4 pt-2 font-bold text-black text-[9px] md:text-[15px]">{group.region}</td>
//                                 <td colSpan={3}></td>
//                             </tr>
//                             {group.restaurants.map((restaurant, index) => (
//                                 <tr key={index} className="hover:bg-gray-100/50">
//                                     <td></td>
//                                     <td className="py-1 pl-4 md:pl-0 text-black font-semibold text-[7px] md:text-[12px] cursor-pointer" onClick={() => onSelectRestaurant(restaurant)}>{restaurant.name}</td>
//                                     <td className="py-1 text-black font-semibold text-[7px] md:text-[12px]">{restaurant.address}</td>
//                                     <td className="py-1 text-black font-semibold text-[7px] md:text-[12px]">{restaurant.registrationDate}</td>
//                                 </tr>
//                             ))}
//                         </React.Fragment>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     </div>
// );

// const RestaurantInfoView = ({ restaurant }) => {
//     // Helper component for individual data fields
//     const InfoField = ({ label, value }) => (
//         <div>
//             <p className="text-[9px] md:text-[13px] text-black font-bold ">{label}</p>
//             <p className="text-[7px] md:text-[12px] ml-2 text-gray-600">{value}</p>
//         </div>
//     );

//     // Helper component for image placeholders
//     const ImagePlaceholder = ({ label }) => (
//         <div>
//             <h3 className="text-[9px] md:text-[15px] text-green-800 font-bold mb-1">{label}</h3>
//             <div className="w-32 h-20 bg-gray-600 rounded-md flex items-center justify-center">
//                 <span className="text-gray-500 text-[7px] md:text-[12px]">No Image</span>
//             </div>
//         </div>
//     );

//     return (
//         <div className="space-y-6">
//             {/* --- Top Section: Logo, Manager, Address --- */}
//             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10">
//                 <div className="space-y-6">
//                     <ImagePlaceholder label="Restaurant's Logo" />
//                 </div>

//                 <div className="space-y-2">
//                     <h3 className="text-[9px] md:text-[15px] text-green-800 font-bold mb-1">Restaurant's Manager</h3>
//                     <div className='flex flex-row gap-16 md:gap-24'>
//                         <InfoField label="Firstname" value={restaurant.manager.firstName} />
//                         <InfoField label="Last Name" value={restaurant.manager.lastName} />
//                     </div>
//                     <div className='flex flex-row gap-8'>
//                         <InfoField label="E-Mail Address" value={restaurant.manager.email} />
//                         <InfoField label="Telephone Number" value={restaurant.manager.phone} />
//                     </div>

//                     <div className="space-y-2">
//                         <h3 className="text-[9px] md:text-[15px] text-green-800 font-bold mb-1">Type of Restaurant</h3>
//                         <InfoField value={restaurant.type} />
//                     </div>

//                     <div className=" ">
//                         <ImagePlaceholder label="Proof of Ownership/Authorization" />
//                     </div>

//                     <div className="pt-4">
//                         <h1 className='text-[9px] md:text-[15px] text-green-800 font-bold mb-1'>Registration Date</h1>
//                         <InfoField label={restaurant.registrationDate} />
//                     </div>

//                     <div className="flex gap-4 mt-4 pt-4">
//                         <button className="bg-amber-500 text-white font-bold py-1 px-4 rounded-lg text-[7px] md:text-[12px]">DEACTIVATE</button>
//                         <button className="bg-amber-500 text-white font-bold py-1 px-4 rounded-lg text-[7px] md:text-[12px]">DELETE</button>
//                     </div>
//                 </div>

//                 <div className="space-y-2">
//                     <h3 className="text-[9px] md:text-[15px] text-green-800 font-bold mb-1">Restaurant's Address</h3>
//                     <div className='flex flex-row gap-12'>
//                         <InfoField label="Postal Code" value={restaurant.fullAddress.postalCode} />
//                         <InfoField label="City" value={restaurant.fullAddress.city} />
//                     </div>
//                     <InfoField label="Street and House Number" value={restaurant.fullAddress.street} />

//                     <div className="space-y-2">
//                         <h3 className="text-[9px] md:text-[15px] text-green-800 font-bold mb-1">Restaurant's Offering</h3>
//                         <InfoField label="Country Speciality" value={restaurant.offering} />
//                     </div>


//                     <div className=" ">
//                         <ImagePlaceholder label="ID/Passport Verification" />
//                     </div>
//                 </div>
//             </div>
//         </div >
//     );
// };

// const RestaurantMenuView = ({ restaurant }) => {
//     const menuCategories = Object.keys(restaurant.menu || {});
//     const [selectedCategory, setSelectedCategory] = useState(menuCategories[0] || '');
//     const menuItems = restaurant.menu?.[selectedCategory] || [];
//     const [isOpen, setIsOpen] = useState(false);
//     return (
//         <div>
//             <div className="relative mb-4 inline-block z-10">
//                 <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 bg-green-300 text-white font-bold py-1 px-3 rounded-lg text-[7px] md:text-[12px]">{selectedCategory} <ChevronDown size={16} /></button>
//                 {isOpen && (
//                     <div className="absolute top-full left-0 mt-0 w-full bg-green-300 rounded-b-lg shadow-lg z-20  ">
//                         {menuCategories.filter(cat => cat !== selectedCategory).map(cat => (
//                             <button key={cat} onClick={() => { setSelectedCategory(cat); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-white font-bold hover:bg-green-300 text-[7px] md:text-[12px]">{cat}</button>
//                         ))}
//                     </div>
//                 )}
//             </div>
//             <div className="overflow-x-auto">
//                 <table className="w-5/6 text-left">
//                     <thead><tr className="bg-[#FFE59E]"><th className="p-3 font-bold text-green-800 uppercase w-1/6 text-[7px] md:text-[15px]">Image</th><th className="p-3 font-bold text-green-800 uppercase w-1/2 text-[7px] md:text-[15px]">Name, Description</th><th className="p-3 font-bold text-green-800 uppercase w-1/6 text-[7px] md:text-[15px]">Price</th><th className="p-3 font-bold text-green-800 uppercase w-1/6 text-[7px] md:text-[15px]">Quantity/Threshold</th></tr></thead>
//                     <tbody>
//                         {menuItems.map((item, index) => (
//                             <tr key={index}>
//                                 <td className="p-2"><div className="w-24 h-16 bg-gray-600 rounded-md"></div></td>
//                                 <td className="p-2 align-top"><p className="font-bold text-black text-[9px] md:text-[15px]">{item.name}</p><p className="text-gray-600 text-[7px] md:text-[12px]">{item.description}</p></td>
//                                 <td className="p-2 align-top text-black font-semibold text-[7px] md:text-[12px]">{item.price}</td>
//                                 <td className="p-2 align-top text-black font-semibold text-[7px] md:text-[12px]">{`${item.quantity}/${item.threshold}`}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// const ActivityLogView = ({ restaurant }) => {
//     const logData = restaurant.activityLog || [];
//     return (
//         <div className="overflow-x-auto">
//             <table className="w-full text-left">
//                 <thead><tr className="bg-[#FFE59E]"><th className="p-3 font-bold text-black uppercase w-1/2 text-[7px] md:text-[15px]">Date, Time</th><th className="p-3 font-bold text-black uppercase w-1/2 text-[7px] md:text-[15px]">Activity</th></tr></thead>
//                 <tbody>
//                     {logData.map((log, index) => (
//                         <tr key={index} className="border-b">
//                             <td className="p-2 text-black font-semibold text-[7px] md:text-[12px]">{log.dateTime}</td>
//                             <td className="p-2 text-black font-semibold text-[7px] md:text-[12px]">{log.activity}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// const RestaurantDetailsView = ({ restaurant, onBack }) => {
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const [selectedView, setSelectedView] = useState('RESTAURANT INFO');
//     const viewOptions = ['RESTAURANT INFO', 'RESTAURANT MENU', 'ACTIVITY LOG'];
//     const renderSelectedView = () => {
//         switch (selectedView) {
//             case 'RESTAURANT INFO': return <RestaurantInfoView restaurant={restaurant} />;
//             case 'RESTAURANT MENU': return <RestaurantMenuView restaurant={restaurant} />;
//             case 'ACTIVITY LOG': return <ActivityLogView restaurant={restaurant} />;
//             default: return <RestaurantInfoView restaurant={restaurant} />;
//         }
//     };
//     return (
//         <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-2 min-h-[550px]">
//             <div className="flex justify-between items-center mb-4">
//                 <div>
//                     <h2 className="font-bold text-green-800 text-[9px] md:text-[15px]">{restaurant.name}</h2>
//                     <p className="text-gray-600 text-[7px] md:text-[12px]">{restaurant.fullAddress.city}</p>
//                 </div>

//                 <div className="flex justify-center items-center ">

//                     <div className="relative inline-block z-30">
//                         <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 bg-green-300 text-white font-bold py-1 px-3 rounded-lg text-[7px] md:text-[12px]">{selectedView} <ChevronDown size={16} /></button>
//                         {isDropdownOpen && (
//                             <div className="absolute top-full left-0 w-auto min-w-full bg-green-300 rounded-lg z-40 ">
//                                 {viewOptions.filter(opt => opt !== selectedView).map(option => (
//                                     <button key={option} onClick={() => { setSelectedView(option); setIsDropdownOpen(false); }} className="block w-full text-left px-3 py-2 text-white font-bold hover:bg-gray-100 text-[7px] md:text-[12px]">{option}</button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <button onClick={onBack} className="bg-red-800 text-white font-bold py-1 px-4 rounded-lg text-[7px] md:text-[12px]">OVERVIEW</button>
//             </div>

//             <div>{renderSelectedView()}</div>

//         </div>
//     );
// };

// // Settings Components
// const SettingsCategoryDropdown = ({ selected, onSelect }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const options = ['COUNTRY SPECIALTY', 'MENU CATEGORY', 'LOCATIONS'];
//     return (
//         <div className="relative inline-block z-20">
//             <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 bg-green-500 text-white font-bold py-1 px-3 rounded-lg text-[7px] md:text-[12px]">{selected} <ChevronDown size={16} /></button>
//             {isOpen && (
//                 <div className="absolute top-full left-0 mt-1 w-auto min-w-full bg-white rounded-lg shadow-lg z-30 border">
//                     {options.filter(opt => opt !== selected).map(option => (
//                         <button key={option} onClick={() => { onSelect(option); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-black font-bold hover:bg-gray-100 text-[7px] md:text-[12px]">{option}</button>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// const GenericSettingsView = ({ title, items, onAdd, onEdit, onDelete }) => {
//     return (
//         <div className="space-y-3">
//             <div className="mt-8 mb-4">
//                 <button onClick={onAdd} className="bg-red-900 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">ADD {title.toUpperCase()}</button>
//             </div>
//             {items.map((item, index) => (
//                 <div key={index} className="flex items-center justify-between p-2 border-b">
//                     <p className="font-bold text-black text-[9px] md:text-[15px]">{item}</p>
//                     <div className="flex items-center gap-4">
//                         <button onClick={() => onEdit(item)} title="Edit"><Edit2 className="w-4 h-4 text-gray-600 hover:text-blue-600" /></button>
//                         <button onClick={() => onDelete(item)} title="Delete"><X className="w-5 h-5 text-gray-600 hover:text-red-600" /></button>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// // --- CONTROLLER COMPONENTS ---
// const RestaurantManagementController = () => {
//     const [currentView, setCurrentView] = useState('list');
//     const [selectedRestaurant, setSelectedRestaurant] = useState(null);
//     const [statusFilter, setStatusFilter] = useState('ACTIVE');
//     const handleSelectRestaurant = (restaurant) => { setSelectedRestaurant(restaurant); setCurrentView('details'); };
//     const handleBackToList = () => { setSelectedRestaurant(null); setCurrentView('list'); };

//     if (currentView === 'details' && selectedRestaurant) {
//         return <RestaurantDetailsView restaurant={selectedRestaurant} onBack={handleBackToList} />;
//     }

//     const filteredData = allRestaurantData.map(region => ({ ...region, restaurants: region.restaurants.filter(r => statusFilter === 'NEW REGISTRATION' ? r.status === 'NEW' : r.status === statusFilter) })).filter(region => region.restaurants.length > 0);
//     return <AllRestaurantsView restaurants={filteredData} onSelectRestaurant={handleSelectRestaurant} status={statusFilter} onStatusChange={setStatusFilter} />;
// };

// const RestaurantSettingsController = () => {
//     const [specialities, setSpecialities] = useState(initialSpecialities);
//     const [menuCategories, setMenuCategories] = useState(initialMenuCategories);
//     const [locations, setLocations] = useState(initialLocations);
//     const [modal, setModal] = useState(null);
//     const [currentItem, setCurrentItem] = useState(null);
//     const [settingType, setSettingType] = useState('COUNTRY SPECIALTY');

//     const handleAdd = (newItem) => { if (!newItem || newItem.trim() === '') { setModal(null); return; } switch (settingType) { case 'COUNTRY SPECIALTY': setSpecialities(prev => [...prev, newItem].sort()); break; case 'MENU CATEGORY': setMenuCategories(prev => [...prev, newItem].sort()); break; case 'LOCATIONS': setLocations(prev => [...prev, newItem].sort()); break; default: break; } setModal(null); };
//     const handleEdit = (oldItem, newItem) => { if (!newItem || newItem.trim() === '') { setModal(null); return; } switch (settingType) { case 'COUNTRY SPECIALTY': setSpecialities(prev => prev.map(i => (i === oldItem ? newItem : i)).sort()); break; case 'MENU CATEGORY': setMenuCategories(prev => prev.map(i => (i === oldItem ? newItem : i)).sort()); break; case 'LOCATIONS': setLocations(prev => prev.map(i => (i === oldItem ? newItem : i)).sort()); break; default: break; } setModal(null); };
//     const handleDelete = (itemToDelete) => { switch (settingType) { case 'COUNTRY SPECIALTY': setSpecialities(prev => prev.filter(i => i !== itemToDelete)); break; case 'MENU CATEGORY': setMenuCategories(prev => prev.filter(i => i !== itemToDelete)); break; case 'LOCATIONS': setLocations(prev => prev.filter(i => i !== itemToDelete)); break; default: break; } setModal(null); };

//     const renderSettingsContent = () => {
//         switch (settingType) {
//             case 'COUNTRY SPECIALTY': return <GenericSettingsView title="Speciality" items={specialities} onAdd={() => setModal('add')} onEdit={(item) => { setCurrentItem(item); setModal('edit'); }} onDelete={(item) => { setCurrentItem(item); setModal('delete'); }} />;
//             case 'MENU CATEGORY': return <GenericSettingsView title="Category" items={menuCategories} onAdd={() => setModal('add')} onEdit={(item) => { setCurrentItem(item); setModal('edit'); }} onDelete={(item) => { setCurrentItem(item); setModal('delete'); }} />;
//             case 'LOCATIONS': return <GenericSettingsView title="Location" items={locations} onAdd={() => setModal('add')} onEdit={(item) => { setCurrentItem(item); setModal('edit'); }} onDelete={(item) => { setCurrentItem(item); setModal('delete'); }} />;
//             default: return null;
//         }
//     };

//     const getItemNameSingular = () => { switch (settingType) { case 'COUNTRY SPECIALTY': return 'Speciality'; case 'MENU CATEGORY': return 'Category'; case 'LOCATIONS': return 'Location'; default: return 'Item'; } };

//     return (
//         <div className="relative">
//             <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-4 min-h-[550px] z-10">
//                 <div className="mb-6">
//                     <SettingsCategoryDropdown selected={settingType} onSelect={setSettingType} />
//                 </div>
//                 {renderSettingsContent()}
//             </div>
//             {modal === 'add' && <AddItemModal itemName={getItemNameSingular()} onSave={handleAdd} onCancel={() => setModal(null)} />}
//             {modal === 'edit' && <EditItemModal itemName={getItemNameSingular()} itemValue={currentItem} onSave={handleEdit} onCancel={() => setModal(null)} />}
//             {modal === 'delete' && <DeleteItemModal itemName={getItemNameSingular()} itemValue={currentItem} onDelete={handleDelete} onCancel={() => setModal(null)} />}
//         </div>
//     );
// };

// // --- MAIN EXPORTED COMPONENT ---
// export const SuperAdminRestaurant = () => {
//     const [activePage, setActivePage] = useState('management');

//     const MainNavigation = ({ currentPage, onPageChange }) => {
//         const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
//         const getButtonClasses = (pageName) => `bg-blue-600 text-white font-bold rounded-lg w-full text-center px-4 py-2 hover:bg-blue-700 transition-colors text-[7px] md:text-[12px] ${currentPage === pageName ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`;

//         return (
//             <div className="w-full md:w-48">
//                 <div className="hidden md:flex flex-col gap-2">
//                     <button onClick={() => onPageChange('management')} className={getButtonClasses('management')}>RESTAURANT MANAGEMENT</button>
//                     <button onClick={() => onPageChange('settings')} className={getButtonClasses('settings')}>RESTAURANT SETTINGS</button>
//                 </div>
//                 <div className="relative md:hidden">
//                     <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className={`${getButtonClasses(activePage)} flex items-center justify-between`}>
//                         {activePage === 'management' ? 'RESTAURANT MANAGEMENT' : 'RESTAURANT SETTINGS'}
//                         <ChevronDown size={20} />
//                     </button>
//                     {isMobileMenuOpen && (
//                         <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-lg z-30 border">
//                             {activePage === 'settings' && <button onClick={() => { onPageChange('management'); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-black font-bold hover:bg-gray-100 text-[7px] md:text-[12px]">RESTAURANT MANAGEMENT</button>}
//                             {activePage === 'management' && <button onClick={() => { onPageChange('settings'); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-black font-bold hover:bg-gray-100 text-[7px] md:text-[12px]">RESTAURANT SETTINGS</button>}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="w-full md:w-5/6 max-w-7xl mx-auto md:px-6 bg-transparent">
//             <div className="flex flex-col md:flex-row gap-4 md:gap-6">
//                 <div className="flex-shrink-0 z-40">
//                     <MainNavigation currentPage={activePage} onPageChange={setActivePage} />
//                 </div>
//                 <div className="flex-1">
//                     {activePage === 'management' ? <RestaurantManagementController /> : <RestaurantSettingsController />}
//                 </div>
//             </div>
//         </div>
//     );
// };