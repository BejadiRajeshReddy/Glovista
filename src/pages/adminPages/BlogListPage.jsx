// import React, { useState } from "react";
// import {
//   Search,
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   Calendar,
//   Tag,
//   Layout,
//   Sliders,
//   Download,
//   ChevronDown,
//   MoreHorizontal,
//   Loader2,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../components/ui/table";
// import { Badge } from "../../components/ui/badge";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "../../components/ui/dropdown-menu";
// import { dummyBlogs } from "./dummyData"; // Import your dummy data

// const BlogListPage = () => {
//   const [blogs, setBlogs] = useState(dummyBlogs);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [sortConfig, setSortConfig] = useState({
//     key: "publish_date",
//     direction: "desc",
//   });
//   const [deleteConfirmation, setDeleteConfirmation] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Sorting functionality
//   const sortedBlogs = [...blogs].sort((a, b) => {
//     if (sortConfig.key) {
//       if (a[sortConfig.key] < b[sortConfig.key]) {
//         return sortConfig.direction === "asc" ? -1 : 1;
//       }
//       if (a[sortConfig.key] > b[sortConfig.key]) {
//         return sortConfig.direction === "asc" ? 1 : -1;
//       }
//     }
//     return 0;
//   });

//   // Filtering logic
//   const filteredBlogs = sortedBlogs.filter((blog) => {
//     const matchesSearch =
//       blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       blog.author.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory =
//       selectedCategory === "all" || blog.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   const handleDelete = (blogId) => {
//     setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
//     setDeleteConfirmation(null);
//   };

//   const getStatusBadge = (status) => {
//     const statusMap = {
//       draft: { color: "bg-yellow-100 text-yellow-800", label: "Draft" },
//       published: { color: "bg-green-100 text-green-800", label: "Published" },
//       archived: { color: "bg-gray-100 text-gray-800", label: "Archived" },
//     };
//     const { color, label } = statusMap[status] || {};
//     return <Badge className={`${color} hover:${color}`}>{label}</Badge>;
//   };

//   const categories = [
//     "all",
//     "skincare",
//     "beauty",
//     "wellness",
//     "tips",
//     "products",
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Blog Management
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               {filteredBlogs.length} articles published
//             </p>
//           </div>
//           <Button asChild>
//             <Link to="/admin/blogs/new" className="flex items-center gap-2">
//               <Plus className="h-4 w-4" />
//               New Blog Post
//             </Link>
//           </Button>
//         </div>

//         {/* Filters Section */}
//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//             <Input
//               placeholder="Search articles..."
//               className="pl-10"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" className="flex items-center gap-2">
//                 <Sliders className="h-4 w-4" />
//                 Category: {selectedCategory}
//                 <ChevronDown className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               {categories.map((category) => (
//                 <DropdownMenuItem
//                   key={category}
//                   onSelect={() => setSelectedCategory(category)}
//                 >
//                   {category.charAt(0).toUpperCase() + category.slice(1)}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         {/* Blog Table */}
//         <div className="bg-white rounded-lg shadow">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead
//                   className="cursor-pointer"
//                   onClick={() => handleSort("title")}
//                 >
//                   Title
//                   {sortConfig.key === "title" && (
//                     <span className="ml-1">
//                       {sortConfig.direction === "asc" ? "↑" : "↓"}
//                     </span>
//                   )}
//                 </TableHead>
//                 <TableHead>Author</TableHead>
//                 <TableHead
//                   className="cursor-pointer"
//                   onClick={() => handleSort("category")}
//                 >
//                   Category
//                   {sortConfig.key === "category" && (
//                     <span className="ml-1">
//                       {sortConfig.direction === "asc" ? "↑" : "↓"}
//                     </span>
//                   )}
//                 </TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead
//                   className="cursor-pointer"
//                   onClick={() => handleSort("publish_date")}
//                 >
//                   Publish Date
//                   {sortConfig.key === "publish_date" && (
//                     <span className="ml-1">
//                       {sortConfig.direction === "asc" ? "↑" : "↓"}
//                     </span>
//                   )}
//                 </TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="h-24 text-center">
//                     <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
//                   </TableCell>
//                 </TableRow>
//               ) : filteredBlogs.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="h-24 text-center">
//                     No articles found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredBlogs.map((blog) => (
//                   <TableRow key={blog.id}>
//                     <TableCell className="font-medium">
//                       <Link
//                         to={`/admin/blogs/edit/${blog.id}`}
//                         className="hover:text-primary"
//                       >
//                         {blog.title}
//                       </Link>
//                       <div className="text-sm text-gray-500 mt-1">
//                         {blog.subtitle}
//                       </div>
//                     </TableCell>
//                     <TableCell>{blog.author}</TableCell>
//                     <TableCell>
//                       <Badge variant="outline">{blog.category}</Badge>
//                     </TableCell>
//                     <TableCell>{getStatusBadge(blog.status)}</TableCell>
//                     <TableCell>
//                       {new Date(blog.publish_date).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end items-center gap-2">
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           asChild
//                           className="hover:bg-gray-100"
//                         >
//                           <Link to={`/blog/${blog.id}`} target="_blank">
//                             <Eye className="h-4 w-4 text-gray-600" />
//                           </Link>
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           asChild
//                           className="hover:bg-gray-100"
//                         >
//                           <Link to={`/admin/blogs/edit/${blog.id}`}>
//                             <Edit className="h-4 w-4 text-gray-600" />
//                           </Link>
//                         </Button>
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="hover:bg-gray-100"
//                             >
//                               <MoreHorizontal className="h-4 w-4 text-gray-600" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuItem
//                               className="text-red-600"
//                               onSelect={() => setDeleteConfirmation(blog.id)}
//                             >
//                               <Trash2 className="mr-2 h-4 w-4" />
//                               Delete
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Delete Confirmation Dialog */}
//         {deleteConfirmation && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg p-6 max-w-md w-full">
//               <div className="flex items-start gap-4">
//                 <div className="mt-1">
//                   <AlertCircle className="h-6 w-6 text-red-500" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium">Delete Article</h3>
//                   <p className="text-sm text-gray-500 mt-2">
//                     Are you sure you want to delete this article? This action
//                     cannot be undone.
//                   </p>
//                 </div>
//               </div>
//               <div className="mt-6 flex justify-end gap-3">
//                 <Button
//                   variant="outline"
//                   onClick={() => setDeleteConfirmation(null)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   onClick={() => handleDelete(deleteConfirmation)}
//                 >
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BlogListPage;
