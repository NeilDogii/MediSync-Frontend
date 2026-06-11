// // "use client";

// // import axios from "axios";
// // import React, { useEffect, useState } from "react";

// // interface DoctorRequest {
// //   id: number;
// //   name: string;
// //   username: string;
// //   email: string;
// //   phone: string;
// //   specialization: string;
// //   fees?: number;
// //   status: string;
// // }

// // export default function DoctorRequests() {
// //   const [requests, setRequests] = useState<DoctorRequest[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   const fetchRequests = async () => {
// //     try {
// //       const res = await axios.get(
// //         `${process.env.NEXT_PUBLIC_API_URL}/admin/doctor-requests`,
// //       );

// //       setRequests(res.data);
// //     } catch (error) {
// //       console.error(error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchRequests();
// //   }, []);

// //   const handleApprove = async (id: number) => {
// //     try {
// //       await axios.patch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/admin/doctor-requests/${id}/approve`,
// //       );

// //       fetchRequests();
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// //   const handleReject = async (id: number) => {
// //     try {
// //       await axios.patch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/admin/doctor-requests/${id}/reject`,
// //       );

// //       fetchRequests();
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="p-6">
// //         <h2 className="text-xl font-semibold">Loading requests...</h2>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-6">
// //       <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
// //         <div className="px-6 py-5 border-b">
// //           <h1 className="text-2xl font-bold text-slate-900">Doctor Requests</h1>

// //           <p className="text-sm text-slate-500 mt-1">
// //             Review and approve doctor registrations
// //           </p>
// //         </div>

// //         {requests.length === 0 ? (
// //           <div className="p-10 text-center text-slate-500">
// //             No pending doctor requests
// //           </div>
// //         ) : (
// //           <div className="overflow-x-auto">
// //             <table className="w-full">
// //               <thead>
// //                 <tr className="bg-slate-50 border-b">
// //                   <th className="text-left px-6 py-4">Name</th>
// //                   <th className="text-left px-6 py-4">Username</th>
// //                   <th className="text-left px-6 py-4">Email</th>
// //                   <th className="text-left px-6 py-4">Phone</th>
// //                   <th className="text-left px-6 py-4">Specialization</th>
// //                   <th className="text-left px-6 py-4">Fees</th>
// //                   <th className="text-center px-6 py-4">Action</th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {requests.map((doctor) => (
// //                   <tr key={doctor.id} className="border-b hover:bg-slate-50">
// //                     <td className="px-6 py-4 font-medium">{doctor.name}</td>

// //                     <td className="px-6 py-4">{doctor.username}</td>

// //                     <td className="px-6 py-4">{doctor.email}</td>

// //                     <td className="px-6 py-4">{doctor.phone}</td>

// //                     <td className="px-6 py-4">
// //                       {doctor.specialization.replaceAll("_", " ").toLowerCase()}
// //                     </td>

// //                     <td className="px-6 py-4">₹{doctor.fees || 0}</td>

// //                     <td className="px-6 py-4">
// //                       <div className="flex items-center justify-center gap-3">
// //                         <button
// //                           onClick={() => handleApprove(doctor.id)}
// //                           className="
// //                             px-4 py-2 rounded-xl
// //                             bg-green-600 text-white
// //                             hover:bg-green-700
// //                             transition
// //                           "
// //                         >
// //                           Approve
// //                         </button>

// //                         <button
// //                           onClick={() => handleReject(doctor.id)}
// //                           className="
// //                             px-4 py-2 rounded-xl
// //                             bg-red-600 text-white
// //                             hover:bg-red-700
// //                             transition
// //                           "
// //                         >
// //                           Reject
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { UserPlus } from "lucide-react";

// interface DoctorRequest {
//   id: number;
//   name: string;
//   username: string;
//   email: string;
//   phone: string;
//   specialization: string;
//   fees?: number;
//   status: string;
// }

// export default function DoctorRequests() {
//   const [requests, setRequests] = useState<DoctorRequest[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchRequests = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/admin/doctor-requests`,
//       );

//       setRequests(res.data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const handleApprove = async (id: number) => {
//     try {
//       await axios.patch(
//         `${process.env.NEXT_PUBLIC_API_URL}/admin/doctor-requests/${id}/approve`,
//       );

//       fetchRequests();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleReject = async (id: number) => {
//     try {
//       await axios.patch(
//         `${process.env.NEXT_PUBLIC_API_URL}/admin/doctor-requests/${id}/reject`,
//       );

//       fetchRequests();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6">
//         <h2 className="text-xl font-semibold">Loading requests...</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-full overflow-hidden">
//       {/* Header Banner */}
//       <div className="bg-gradient-to-r from-blue-700 to-cyan-500 rounded-3xl p-8 mb-6 relative overflow-hidden">
//         <div className="relative z-10">
//           <p className="text-blue-100 text-sm mb-1">Admin Portal</p>
//           <h1 className="text-4xl font-bold text-white mb-2">
//             Doctor Requests
//           </h1>
//           <p className="text-blue-100">
//             Review and approve doctor registrations
//           </p>
//         </div>

//         {/* Decorative circles */}
//         <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20" />
//         <div className="absolute right-20 bottom-0 w-40 h-40 bg-white/10 rounded-full -mb-16" />
//       </div>

//       <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
//         <div className="px-6 py-5 border-b">
//           <div className="flex items-center gap-3">
//             <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
//               <UserPlus className="h-5 w-5 text-white" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-slate-900">
//                 Pending Requests
//               </h2>
//               <p className="text-sm text-slate-500">
//                 Click approve or reject to process a request.
//               </p>
//             </div>
//           </div>
//         </div>

//         {requests.length === 0 ? (
//           <div className="p-10 text-center text-slate-500">
//             No pending doctor requests
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[900px]">
//               <thead>
//                 <tr className="bg-slate-50 border-b">
//                   <th className="text-left px-6 py-4 whitespace-nowrap">
//                     Name
//                   </th>
//                   <th className="text-left px-6 py-4 whitespace-nowrap">
//                     Username
//                   </th>
//                   <th className="text-left px-6 py-4 whitespace-nowrap">
//                     Email
//                   </th>
//                   <th className="text-left px-6 py-4 whitespace-nowrap">
//                     Phone
//                   </th>
//                   <th className="text-left px-6 py-4 whitespace-nowrap">
//                     Specialization
//                   </th>
//                   <th className="text-left px-6 py-4 whitespace-nowrap">
//                     Fees
//                   </th>
//                   <th className="text-center px-6 py-4 whitespace-nowrap">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {requests.map((doctor) => (
//                   <tr key={doctor.id} className="border-b hover:bg-slate-50">
//                     <td className="px-6 py-4 font-medium whitespace-nowrap">
//                       {doctor.name}
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {doctor.username}
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {doctor.email}
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {doctor.phone}
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {doctor.specialization.replaceAll("_", " ").toLowerCase()}
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       ₹{doctor.fees || 0}
//                     </td>

//                     <td className="px-6 py-4">
//                       <div className="flex items-center justify-center gap-3">
//                         <button
//                           onClick={() => handleApprove(doctor.id)}
//                           className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition whitespace-nowrap"
//                         >
//                           Approve
//                         </button>

//                         <button
//                           onClick={() => handleReject(doctor.id)}
//                           className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition whitespace-nowrap"
//                         >
//                           Reject
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React from "react";
import AdminDoctorRequestsPage from "@/components/AdminComponents/AdminDoctorRequestsPage";
import { fetchDoctorRequests } from "@/utils/requests/admin/doctor";
export default async function Page() {
  const requests = await fetchDoctorRequests();

  return <AdminDoctorRequestsPage data={requests} />;
}
