import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Typography,
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { getEnquiries } from "../../services/userApiServices";

function EnquiryManagement() {
  const [enquiry, setEnquiry] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await getEnquiries();
        setEnquiry(response);
      } catch (error) {
        console.log("Error fetching enquiries", error);
      }
    };

    fetchEnquiries();
  }, []);

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMessage("");
  };

  return (
    <div>
      <Typography className="text-5xl text-center mb-4 text-[#1da199] font-roboto-mono">
        Enquiry Management
      </Typography>

      <div className="flex flex-wrap gap-5 justify-end mb-3 px-5">
        <div className="relative flex w-64">
          <Input
            type="search"
            label="Search Here"
            className="pr-20"
            containerProps={{
              className: "min-w-0",
            }}
          />
          <Button
            size="sm"
            className="!absolute right-1 top-1 rounded BG-BLACK"
          >
            Search
          </Button>
        </div>
      </div>

      <div className="px-3 pr-3">
        <TableContainer className="border-[1px] border-[#565454] rounded-3xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="text-left">Id</TableCell>
                <TableCell className="text-left">Name</TableCell>
                <TableCell className="text-left">Country</TableCell>
                <TableCell className="text-left">Email</TableCell>
                <TableCell className="text-left">Phone Number</TableCell>
                <TableCell className="text-left">Content</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enquiry.map((row) => (
                <TableRow key={row.id} className="hover:bg-[#c9f0e6]">
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.first_name}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>+91 {row.mobile_number}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleViewMessage(row.message)}
                      className="bg-[#1da199] text-white"
                    >
                      View Message
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Modal for Viewing Message */}
      <Dialog open={openModal} handler={handleCloseModal}>
        <DialogHeader>Enquiry Message</DialogHeader>
        <DialogBody>
          <div className="p-4 max-h-[300px] overflow-y-auto break-words whitespace-pre-line">
            <p className="text-gray-700">{selectedMessage}</p>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleCloseModal} className="bg-gray-900 text-white">
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default EnquiryManagement;
