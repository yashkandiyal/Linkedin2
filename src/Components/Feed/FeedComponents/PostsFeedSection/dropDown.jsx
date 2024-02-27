import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  
} from "@nextui-org/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
export default function DropDown({ handleDelete }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <MoreVertIcon className=" cursor-pointer" />
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new">Edit</DropdownItem>
        <DropdownItem
          key="delete"
          className="text-danger"
          color="danger"
          onClick={handleDelete}
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
