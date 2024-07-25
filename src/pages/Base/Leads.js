import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import * as moment from "moment";
import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  ModalFooter,
  Table,
  FormFeedback,
} from "reactstrap";
import Select from "react-select";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import TableContainer from "../../Components/Common/TableContainer";
import Loader from "../../Components/Common/Loader";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import axiosWithToken from "../ApiCalls/axiosWithToken";
import * as LeadApi from "../ApiCalls/LeadsAPI";
import * as CollaboratorsAPI from "../ApiCalls/CollaboratorsAPI";
import {updateLeadRequest} from "../ApiCalls/LeadsAPI";
export default function Leads() {
  document.title = "Leads";

/*  // DATA
  const mockLeads = [
    {
      id: 1,
      leadId: "#VZ001",
      username: "hajar_ammari",
      name: "Hajar AMMARI",
      email: "hajar.ammari@gmail.com",
      phone: "+212 660 51 58 30",
      creation_date: "09 Jul, 2024",
      last_activity: ["11 Jul, 2024", "08:58AM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 2,
      leadId: "#VZ002",
      username: "john_doe",
      name: "John DOE",
      email: "john.doe@example.com",
      phone: "+1 123 456 7890",
      creation_date: "10 Jul, 2024",
      last_activity: ["12 Jul, 2024", "10:30AM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 3,
      leadId: "#VZ003",
      username: "alice_wonderland",
      name: "Alice WONDERLAND",
      email: "alice.wonderland@example.com",
      phone: "+44 20 1234 5678",
      creation_date: "11 Jul, 2024",
      last_activity: ["13 Jul, 2024", "11:45AM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 4,
      leadId: "#VZ004",
      username: "michael_jones",
      name: "Michael JONES",
      email: "michael.jones@example.com",
      phone: "+1 987 654 3210",
      creation_date: "12 Jul, 2024",
      last_activity: ["14 Jul, 2024", "01:20PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 5,
      leadId: "#VZ005",
      username: "sara_smith",
      name: "Sara SMITH",
      email: "sara.smith@example.com",
      phone: "+61 2 1234 5678",
      creation_date: "13 Jul, 2024",
      last_activity: ["15 Jul, 2024", "03:10PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 6,
      leadId: "#VZ006",
      username: "adam_brown",
      name: "Adam BROWN",
      email: "adam.brown@example.com",
      phone: "+44 20 9876 5432",
      creation_date: "14 Jul, 2024",
      last_activity: ["16 Jul, 2024", "04:55PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 7,
      leadId: "#VZ007",
      username: "emma_davis",
      name: "Emma DAVIS",
      email: "emma.davis@example.com",
      phone: "+1 234 567 8901",
      creation_date: "15 Jul, 2024",
      last_activity: ["17 Jul, 2024", "09:20AM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 8,
      leadId: "#VZ008",
      username: "peter_smith",
      name: "Peter SMITH",
      email: "peter.smith@example.com",
      phone: "+61 2 9876 5432",
      creation_date: "16 Jul, 2024",
      last_activity: ["18 Jul, 2024", "12:40PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 9,
      leadId: "#VZ009",
      username: "lisa_jones",
      name: "Lisa JONES",
      email: "lisa.jones@example.com",
      phone: "+1 345 678 9012",
      creation_date: "17 Jul, 2024",
      last_activity: ["19 Jul, 2024", "02:15PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 10,
      leadId: "#VZ010",
      username: "alex_anderson",
      name: "Alex ANDERSON",
      email: "alex.anderson@example.com",
      phone: "+44 20 3456 7890",
      creation_date: "18 Jul, 2024",
      last_activity: ["20 Jul, 2024", "03:50PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
  ]*/;

  const statuses = [
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "INACTIVE", value: "INACTIVE" },
  ];

  //Status TRONSFORMATION BETWEEN BACK & FRON

  const transformStatus = (status) => {
    return { label: status, value: status };
  };

  const transformStatuses = (statuses) => {
    if (!statuses) return [];
    return statuses.map(status => transformStatus(status));
  };

  // State management
  const [isEdit, setIsEdit] = useState(false);
  const [leads, setLead] = useState([]);
  const [selectedLead, setSelectedLead] = useState([]);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [leadDeleted, setLeadDeleted] = useState(false);
  const [leadAdded, setLeadAdded] = useState(false);
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState([]);
  const [assignStatus, setAssignStatus] = useState([]);
  const [info, setInfo] = useState([]);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [isLoiding, setLoiding] = useState(true);
///////////////////////////////////////////////////////////////////////////GET ALL LEADS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*  useEffect(() => {
    setLead(mockLeads);
    if (!info.id && leads.length > 0) {
      setIsEdit(false);
      setInfo(leads[0]);
    }
  }, []);*/


  const getAllLeads = async () => {
    try {
      const response = await axiosWithToken.get('/leads/get-collaborator-leads');
      if (response.data != null ) {
      const leads = response.data.map(lead => ({
        ...lead,
        _id: lead.leadId,
        statuses: lead.status ? [transformStatus(lead.status)] : [],
      }));
        console.log('Response of getting all leads:', leads);
        return leads;
      }else {
        console.log('No leads found');
        return [];
      }

    } catch (error) {
      console.error('Error getting leads:', error);
      throw error;
    }
  } ;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadsData = await  getAllLeads();
        setLead(leadsData);

        if (!info.id && leadsData.length > 0) {
          setIsEdit(false);
          setInfo(leadsData[0]);
        }
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      }finally {
        setLoiding(false);
      }
    };      fetchData();
  }, []);


  ////////////////////////////////////// HANDLERS ////////////////////////////////////

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setIsEdit(false);
      setSelectedLead(null);
    } else {
      setModal(true);
      setStatus([]);
      setAssignStatus([]);
    }
  }, [modal]);

  const toggleViewModal = useCallback(() => {
    setViewModal(!viewModal);
  }, [viewModal]);

  const handleLeadClicks = () => {
    setSelectedLead("");
    setIsEdit(false);
    toggle();
  };

  // Function to format the date
  const handleValidDate = (date) => {
    if (!date) return "Invalid date";
    const date1 = moment(new Date(date)).format("DD MMM YYYY");
    return date1;
  };

  // Function to format the time
  const handleValidTime = (time) => {
    if (!time) return "Invalid time";
    const time1 = moment(time, "hh:mmA");
    if (!time1.isValid()) {
      return "Invalid time";
    }
    return time1.format("hh:mm A");
  };

  ////////////////////////////////////// CREATE ////////////////////////////////////

  const generateNewId = () => {
    return leads.length > 0 ? Math.max(leads.map((lead) => lead.id)) + 1 : 1;
  };

  const generateNewLeadId = () => {
    return `#VZ${String(generateNewId()).padStart(3, "0")}`;
  };
  function handlesStatus(statuses) {
    setStatus(statuses);
    const assigned = statuses.map(({ label, value }) => ({ label, value }));
    setAssignStatus(assigned);
  }

  const addLead = async(newLead) => {
    try {
      const response = await LeadApi.addLead(newLead);
   /*   const parts =response.split('LEAD') ;
      const loginId = parts[0] ;
      const leadId = parts[1].trim(" ") ;
      console.log("LOGIN ID of adding lead:", loginId);
      console.log("LeadID of adding lead:", leadId);*/
      console.log("LEAD PASSWORD IS : " ,  response.password)  ;
      const  newL = {
        ...response,
        _id : response.leadId,
        username : response.username,
      statuses  : newLead.status ? [transformStatus(newLead.status)] : [],
      }
      console.log('New Lead added:', newL) ;
      setLead([...leads, newL]);
      setLeadAdded(true);
      setIsEdit(false);
      setModal(false);
      toast.success("Lead added successfully") ;
    } catch (error) {
      toast.error('Failed to add lead.');
      console.error('Error adding lead:', error);
    }
  }

/*
  const addLead = (newLead) => {
    console.log("New Lead:", newLead);

    // Check if the id exists in the leads array
    const existingLeadIndex = leads.findIndex((c) => c._id === newLead._id);

    let updatedLeads;
    if (existingLeadIndex !== -1) {
      // Update existing lead
      updatedLeads = leads.map((c, index) =>
        index === existingLeadIndex
          ? {
              ...c, // Preserve other fields from the existing lead
              ...newLead, // Update fields with new values
              last_activity: [
                moment().format("DD MMM, YYYY"),
                moment().format("hh:mmA"),
              ],
            }
          : c
      );
    } else {
      // Add new lead
      const newLeadWithId = {
        ...newLead,
        id: generateNewId(), // Generate a new unique id
        leadId: generateNewLeadId(),
        creation_date: moment().format("DD MMM, YYYY"),
        last_activity: [
          moment().format("DD MMM, YYYY"),
          moment().format("hh:mmA"),
        ],
      };
      updatedLeads = [newLeadWithId, ...leads];
    }

    setLead(updatedLeads);
    setLeadAdded(true);
    setIsEdit(false);
    setModal(false);
  };
*/

  useEffect(() => {
    if (leadAdded) {
      setLeadAdded(false);
    }
  }, [leadAdded]);

  ////////////////////////////////////// UPDATE ////////////////////////////////////

  const handleLeadClick = useCallback(
    (arg) => {
      const selectedLead = arg;

      setSelectedLead({
        _id: selectedLead._id,
        name: selectedLead.name,
        email: selectedLead.email,
        username: selectedLead.username,
        phone: selectedLead.phone,
        statuses: selectedLead.statuses,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  const HandleupdateLead = async (id, updateLead) => {
    console.log('New collab body Form ', updateLead);
    console.log('New collab body ID ', id);

    try {
      const response = await LeadApi.updateLeadRequest(id, updateLead);
      const updatedL = {
        ...response,
        _id: id,
        statuses: response.status ? [transformStatus(response.status)] : [],
      };
      setLead(leads.map(lead =>
          lead._id === id ? updatedL : lead
      ));
      setLeadAdded(true);
      setIsEdit(false);
      setModal(false);
      toast.success('Lead updated successfully.');
    } catch (error) {
      toast.error('Failed to update collaborator.');
    }
  };

  ////////////////////////////////////// DELETE ////////////////////////////////////

/*  const deleteLead = useCallback((leadToDelete) => {
    setLead((prevLeads) => prevLeads.filter((c) => c.id !== leadToDelete.id));
    setLeadDeleted(true);
  }, []);*/


  const deleteLead = useCallback(async (leadToDelete) => {
    try {
      const response = await LeadApi.deleteLeadRequest(leadToDelete._id);
      if (response) {
        setLead((prevLeads) =>
            prevLeads.filter((c) => c._id !== leadToDelete._id)
        );
        setLeadDeleted(true);
        toast.success('Lead deleted successfully.');
      } else {
        toast.error('Failed to delete Lead.');
      }
    } catch (error) {
      toast.error('Failed to delete Lead.');
    }
  }, []);


  const handleDeleteLead = useCallback(() => {
    if (leadToDelete) {
      deleteLead(leadToDelete);
      setDeleteModal(false);
    }
  }, [leadToDelete, deleteLead]);

  const onClickDelete = (leads) => {
    setLeadToDelete(leads);
    setDeleteModal(true);
  };

  useEffect(() => {
    if (leadToDelete) {
      //deleteLead(leadToDelete); Cz I think is running the deletion twice
      setLeadToDelete(null);
    }
  }, [leadDeleted]);

  //////////////////////////////////////   EXPORT  ////////////////////////////////////

  const headers = [
    { id: "leadId", displayName: "Lead ID" },
    { id: "name", displayName: "Name" },
    { id: "username", displayName: "Username" },
    { id: "email", displayName: "Email" },
    { id: "phone", displayName: "Phone" },
    { id: "creationDate", displayName: "Creation Date" },
  ];

  //////////////////////////////////////   STATUSES  ////////////////////////////////////

  const StatusBadge = ({ status }) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="badge bg-success text-uppercase me-1">{status}</span>
        );
      case "INACTIVE":
        return (
          <span className="badge bg-danger text-uppercase me-1">{status}</span>
        );

      default:
        return (
          <span className="badge bg-secondary text-uppercase me-1">
            {status}
          </span>
        );
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////
  // validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      _id: selectedLead ? selectedLead._id : "0",
      name: (selectedLead && selectedLead.name) || "",
      username: (selectedLead && selectedLead.username) || "",
      email: (selectedLead && selectedLead.email) || "",
      phone: (selectedLead && selectedLead.phone) || "",
      statuses: (selectedLead && selectedLead.statuses) || [],
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Name"),
      username: Yup.string().required("Please Enter Username"),
      email: Yup.string().required("Please Enter Email"),
      phone: Yup.string().required("Please Enter Phone"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateLead = {
          _id: selectedLead ? selectedLead._id : 0,
          name: values.name,
          username: values.username,
          email: values.email,
          phoneNumber: values.phone,
          status: assignStatus[0]?.value,
        };
        console.log("id", selectedLead._id);
        const id = selectedLead._id;
        HandleupdateLead( id , updateLead);
        validation.resetForm();
      } else {
        const newLead = {
          // _id: (Math.floor(Math.random() * 10) + 20).toString(),
          name: values["name"],
          username: values["username"],
          email: values["email"],
          phoneNumber: values["phone"],
          status: assignStatus[0]?.value,
        };
        addLead(newLead);
        validation.resetForm();
      }
    },
  });

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          className="form-check-input"
          id="checkBoxAll"
          onClick={() => checkedAll()}
        />
      ),
      cell: (cell) => (
        <input
          type="checkbox"
          className="contactCheckBox form-check-input"
          value={cell.row.original.id}
          checked={selectedCheckBoxDelete.includes(cell.row.original.id)}
          onChange={() => handleCheckboxChange(cell.row.original.id)}
        />
      ),
      id: "#",
      accessorKey: "id",
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      header: "Name",
      accessorKey: "name",
      enableColumnFilter: false,
      cell: (cell) => (
        <div className="d-flex align-items-center">
          <div className="flex-grow-1 ms-2 name">{cell.getValue()}</div>
        </div>
      ),
    },
    {
      header: "Username",
     //accessorKey: "username",
       accessorKey: "loginId",
      enableColumnFilter: false,
    },
    {
      header: "Email ID",
      accessorKey: "email",
      enableColumnFilter: false,
    },
    {
      header: "Phone No",
      //accessorKey: "phone",
      accessorKey: "phoneNumber",
      enableColumnFilter: false,
    },
    {
      header: "Status",
      accessorKey: "statuses",
      enableColumnFilter: false,
      cell: (cell) => (
        <>
          {cell.getValue().map((item, key) => (
            <StatusBadge status={item.label} key={key} />
          ))}
        </>
      ),
      sortingFn: (rowA, rowB) => {
        const statusOrder = { ADMIN: 0, INACTIVE: 1 };

        const statusA = rowA.original.statuses.find(
          (status) => status.value in statusOrder
        );
        const statusB = rowB.original.statuses.find(
          (status) => status.value in statusOrder
        );

        const orderA = statusA ? statusOrder[statusA.value] : Infinity;
        const orderB = statusB ? statusOrder[statusB.value] : Infinity;

        return orderA - orderB;
      },
    },
    {
      header: "Creation Date",
      accessorKey: "creationDate",
      enableColumnFilter: false,
      cell: (cell) => {
        const value = cell.getValue();
        if (value) {
          return handleValidDate(value);
        } else {
          return "No creation date";
        }
      },
    },
   /*{
      header: "Last Activity",
      //accessorKey: "last_activity",
      accessorKey: "lastActivity",
      enableColumnFilter: false,
      cell: (cell) => (
        <>
          {handleValidDate(cell.getValue()[0] || [])},{" "}
          <small className="text-muted">
            {handleValidTime(cell.getValue()[1])}
          </small>
        </>
      ),
    },*/
    {
      header: "Last Activity",
      accessorKey: "lastActivity",
      enableColumnFilter: false,
      cell: (cell) => {
        const value = cell.getValue();
        if (value) {
          const [date, time] = value.split("T");
          return (
              <>
                {handleValidDate(date)},{" "}
                <small className="text-muted">
                  {handleValidTime(time)}
                </small>
              </>
          );
        } else {
          return null;
        }
      },
    },

    {
      header: "Action",
      cell: (cellProps) => (
        <ul className="list-inline hstack gap-2 mb-0">
          {/* VIEW */}
          <li className="list-inline-item edit" title="Call">
            <div
              className="dropdown-item"
              href="#"
              onClick={() => {
                const leadData = cellProps.row.original;
                setInfo(leadData);
                toggleViewModal();
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
            </div>
          </li>

          {/* UPDATE  */}
          <li className="list-inline-item edit" title="Message">
            <div
              className="dropdown-item edit-item-btn"
              href="#"
              onClick={() => handleLeadClick(cellProps.row.original)}
            >
              <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
            </div>
          </li>

          {/* DELETE */}
          <li className="list-inline-item edit" title="Message">
            <div
              className="dropdown-item remove-item-btn"
              href="#"
              onClick={() => {
                const leadData = cellProps.row.original;
                onClickDelete(leadData);
              }}
            >
              <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
            </div>
          </li>
          <li className="list-inline-item"></li>
        </ul>
      ),
    },
  ];

  // checks
  const handleCheckboxChange = useCallback((id) => {
    setSelectedCheckBoxDelete((prevSelected) => {
      const newSelected = prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id];
      console.log(newSelected);
      setIsMultiDeleteButton(newSelected.length > 0);
      return newSelected;
    });
  }, []);

  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    if (checkall.checked) {
      const allIds = leads.map((item) => item.id);
      setSelectedCheckBoxDelete(allIds);
      setIsMultiDeleteButton(true);
      console.log(allIds);
    } else {
      setSelectedCheckBoxDelete([]);
      setIsMultiDeleteButton(false);
    }
  }, [leads]);

  const deleteMultiple = useCallback(() => {
    setLead((prevLeads) => {
      const updatedLeads = prevLeads.filter(
        (c) => !selectedCheckBoxDelete.includes(c.id)
      );
      return updatedLeads;
    });
    setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete([]);
    document.getElementById("checkBoxAll").checked = false;
    setDeleteModalMulti(false);
  }, [selectedCheckBoxDelete]);

  useEffect(() => {
    if (leadDeleted) {
      setLeadToDelete(null);
      setLeadDeleted(false);
    }
  }, [leadDeleted]);

  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={leads.map((lead) => ({
            leadId: String(lead.leadId),
            name: String(lead.name),
            username: String(lead.username),
            email: String(lead.email),
            phone: String(lead.phone),
            creationDate: String(lead.creationDate),
          }))}
          headers={headers}
          filename={"Leads"}
        />

        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteLead}
          onCloseClick={() => setDeleteModal(false)}
        />
        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={() => {
            deleteMultiple();
            setDeleteModalMulti(false);
          }}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Container fluid>
          <BreadCrumb title="Leads" pageTitle="CRM" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="flex-grow-1">
                      <button
                        className="btn btn-info add-btn"
                        onClick={() => {
                          setModal(true);
                        }}
                      >
                        <i className="ri-add-fill me-1 align-bottom"></i>
                        Add Leads
                      </button>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
                        {/* :::::::::::::::::::::::::: DELETE MULTIPLE LEADS ::::::::::::::::::: */}
                        {isMultiDeleteButton && (
                          <button
                            className="btn btn-secondary"
                            onClick={() => setDeleteModalMulti(true)}
                          >
                            <i className="ri-delete-bin-2-line"></i>
                          </button>
                        )}
                        <button className="btn btn-danger">
                          <i className="ri-filter-2-line me-1 align-bottom"></i>{" "}
                          Filters
                        </button>
                        <button
                          className="btn btn-soft-success"
                          onClick={() => setIsExportCSV(true)}
                        >
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
            <Col xxl={9}>
              <Card id="contactList">
                <CardBody className="pt-0">
                  {/* :::::::::::::::::::::: LIST LEADS :::::::::::::::::::::::::: */}
                  {/*{leads && leads.length ? (*/}
                  {isLoiding  ? ( <Loader/> ) : (
                    <TableContainer
                      columns={columns}
                      data={leads || []}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={8}
                      className="custom-header-css"
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light"
                      handleLeadClick={handleLeadClicks}
                      isLeadsFilter={true}
                      SearchPlaceholder="Search for leads..."
                    />
                    )}
            {/*      ) : (
                    <Loader />
                  )}
*/}
                  {/* :::::::::::::::::::::: ADD / UPDATE MODAL :::::::::::::::::::::::::: */}
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                    <ModalHeader className="bg-info-subtle p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Lead" : "Add Lead"}
                    </ModalHeader>
                    <Form
                      className="tablelist-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <ModalBody>
                        <Input type="hidden" id="id-field" />
                        <Row className="g-3">
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="name-field"
                                className="form-label"
                              >
                                Name
                              </Label>
                              <Input
                                name="name"
                                id="customername-field"
                                className="form-control"
                                placeholder="Enter Name"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.name || ""}
                                invalid={
                                  validation.touched.name &&
                                  validation.errors.name
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.name &&
                              validation.errors.name ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.name}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="username-field"
                                className="form-label"
                              >
                                Username
                              </Label>
                              <Input
                                name="username"
                                id="username-field"
                                className="form-control"
                                placeholder="Enter Username"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.username || ""}
                                invalid={
                                  validation.touched.username &&
                                  validation.errors.username
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.username &&
                              validation.errors.username ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.username}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="email_id-field"
                                className="form-label"
                              >
                                Email ID
                              </Label>
                              <Input
                                name="email"
                                id="email_id-field"
                                className="form-control"
                                placeholder="Enter Email"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.email || ""}
                                invalid={
                                  validation.touched.email &&
                                  validation.errors.email
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.email &&
                              validation.errors.email ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.email}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="phone-field"
                                className="form-label"
                              >
                                Phone
                              </Label>
                              <Input
                                name="phone"
                                id="phone-field"
                                className="form-control"
                                placeholder="Enter Phone No."
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.phone || ""}
                                invalid={
                                  validation.touched.phone &&
                                  validation.errors.phone
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.phone &&
                              validation.errors.phone ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.phone}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="statusinput-choices"
                                className="form-label font-size-13"
                              >
                                Status
                              </Label>
                              <Select
                                isMulti
                                value={status}
                                onChange={(e) => {
                                  handlesStatus(e);
                                }}
                                className="mb-0"
                                options={statuses}
                                id="statusinput-choices"
                              />
                              {validation.touched.statuses &&
                              validation.errors.statuses ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.statuses}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => {
                              setModal(false);
                            }}
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="btn btn-success"
                            id="add-btn"
                          >
                            {!!isEdit ? "Update" : "Add Lead"}
                          </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>

            {/* :::::::::::::::::::::: VIEW Lead :::::::::::::::::::::::::: */}
            <Modal
              id="viewModal"
              isOpen={viewModal}
              toggle={toggleViewModal}
              centered
            >
              <ModalHeader toggle={toggleViewModal}>View Lead</ModalHeader>
              <ModalBody>
                <div id="contact-view-detail">
                  <div className="text-center mb-3">
                    <h5 className="mt-4 mb-1">{info.name}</h5>
                    <p className="text-muted">{info.leadId}</p>

                    <ul className="list-inline mb-0">
                      <li className="list-inline-item avatar-xs">
                        <Link
                          to="#"
                          className="avatar-title bg-success-subtle text-success fs-15 rounded"
                        >
                          <i className="ri-phone-line"></i>
                        </Link>
                      </li>
                      <li className="list-inline-item avatar-xs">
                        <Link
                          to="#"
                          className="avatar-title bg-danger-subtle text-danger fs-15 rounded"
                        >
                          <i className="ri-mail-line"></i>
                        </Link>
                      </li>
                      <li className="list-inline-item avatar-xs">
                        <Link
                          to="#"
                          className="avatar-title bg-warning-subtle text-warning fs-15 rounded"
                        >
                          <i className="ri-question-answer-line"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="table-responsive table-card">
                      <Table className="table table-borderless mb-0">
                        <tbody>
                          <tr>
                            <td className="fw-medium">Username</td>
                            <td>{info.username}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Email ID</td>
                            <td>{info.email || "tonyanoble@velzon.com"}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Phone No</td>
                            <td>{info.phoneNumber}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Creation Date</td>
                            <td>{info.creationDate ? handleValidDate(info.creationDate) : "No creation date"}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Last Activity</td>
                            <td>
                              {info.lastActivity &&
                              info.lastActivity.length === 2
                                ? handleValidDate(info.lastActivity[0]) +
                                  ", " +
                                  handleValidTime(info.lastActivity[1])
                                : "No last activity"}
                            </td>
                          </tr>

                          <tr>
                            <td className="fw-medium">Status</td>
                            <td>
                              {(info.statuses || []).map((status, key) => (
                                <span
                                  className="badge bg-primary-subtle text-primary me-1"
                                  key={key}
                                >
                                  {status.label || status.value}
                                </span>
                              ))}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={toggleViewModal}
                >
                  Close
                </button>
              </ModalFooter>
            </Modal>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
