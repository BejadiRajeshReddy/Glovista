import React, { useEffect, useState } from "react";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Button, Typography, Input } from "@material-tailwind/react";
import { getAllUsers, manageUserBlock } from "../../services/adminApiService";
import Loader from "../../components/common/Loader";
import { Search } from "lucide-react";

function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const rowsPerPage = 5;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredUsers.slice(indexOfFirstRow, indexOfLastRow);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setIsLoading(true);
      try {
        const response = await getAllUsers();
        if (Array.isArray(response)) {
          setUsers(response);
          setFilteredUsers(response);
        } else if (response?.data && Array.isArray(response.data)) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        } else {
          console.error("Unexpected response format:", response);
          setUsers([]);
          setFilteredUsers([]);
        }
      } catch (error) {
        console.error("Error fetching all the users :- ", error);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    let updatedUsers = users;

    if (searchTerm) {
      updatedUsers = updatedUsers.filter(
        (user) =>
          user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.phone?.includes(searchTerm)
      );
    }

    if (filterStatus !== "all") {
      updatedUsers = updatedUsers.filter((user) =>
        filterStatus === "Blocked" ? !user.is_active : user.is_active
      );
    }

    setFilteredUsers(updatedUsers);
  }, [searchTerm, filterStatus, users]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleUserUpdate = async (id) => {
    setIsLoading(true);
    const user = users.find((user) => user.id === id);
    try {
      const response = await manageUserBlock(id, {
        ...user,
        is_active: !user.is_active,
      });
      setUsers((prev) =>
        prev.map((user) => (user.id === response.id ? response : user))
      );
    } catch (error) {
      console.error("Error updating user :- ", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="px-20">
      <Typography className="text-5xl text-center mb-4 text-[#1da199] font-roboto-mono">
        User Management
      </Typography>
      <div className="flex flex-wrap gap-5 justify-end px-5 mb-3">
        <div className="relative flex w-64">
          <Input
            type="search"
            label="Search Here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-20"
            containerProps={{ className: "min-w-0" }}
          />
          <div className="!absolute top-1 right-1">
            <Search size={30} />
          </div>
        </div>
        <div>
          <select
            className="w-52 h-10 font-prompt-normal pl-2 capitalize border-[1px] rounded-md border-[#b6b3b3]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Blocked">Blocked</option>
            <option value="Unblocked">Unblocked</option>
          </select>
        </div>
      </div>
      <div className="px-3 pr-3">
        <TableContainer className="border-[1px] border-[#565454] rounded-3xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="text-left">User Id</TableCell>
                <TableCell className="text-left">Username</TableCell>
                <TableCell className="text-left">Phone Number</TableCell>
                <TableCell className="text-left">Block User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRows.map((user) => (
                <TableRow key={user.id} className="hover:bg-[#c9f0e6]">
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    {" "}
                    +91 {user.phone_number.slice(3, 8)}{" "}
                    {user.phone_number.slice(8)}
                  </TableCell>
                  <TableCell>
                    {user.is_active ? (
                      <Button
                        onClick={() => handleUserUpdate(user.id)}
                        color="red"
                      >
                        Block
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleUserUpdate(user.id)}
                        color="green"
                      >
                        Unblock
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="flex justify-center items-center">
          <Pagination
            count={Math.ceil(filteredUsers.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
