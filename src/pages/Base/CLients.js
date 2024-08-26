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
import * as ClientAPI from "../ApiCalls/ClientAPI";
import * as CollaboratorsAPI from "../ApiCalls/CollaboratorsAPI";
import {updateClientRequest} from "../ApiCalls/ClientAPI";
export default function Clients() {
  document.title = "Clients";

/*  // DATA
  const mockClients = [
    {
      id: 1,
      clientId: "#VZ001",
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
      clientId: "#VZ002",
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
      clientId: "#VZ003",
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
      clientId: "#VZ004",
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
      clientId: "#VZ005",
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
      clientId: "#VZ006",
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
      clientId: "#VZ007",
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
      clientId: "#VZ008",
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
      clientId: "#VZ009",
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
      clientId: "#VZ010",
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
  const [clients, setClient] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [clientDeleted, setClientDeleted] = useState(false);
  const [clientAdded, setClientAdded] = useState(false);
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
///////////////////////////////////////////////////////////////////////////GET ALL CLIENTS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*  useEffect(() => {
    setClient(mockClients);
    if (!info.id && clients.length > 0) {
      setIsEdit(false);
      setInfo(clients[0]);
    }
  }, []);*/


  const getAllClients = async () => {
    try {
      const response = await axiosWithToken.get('/client');
      console.log(response)
      if (response.data != null ) {
      const clients = response.data.map(client => ({
        ...client,
        _id: client.clientId,
      }));
        console.log('Response of getting all clients:', clients);
        return clients;
      }else {
        console.log('No clients found');
        return [];
      }

    } catch (error) {
      console.error('Error getting clients:', error);
      throw error;
    }
  } ;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsData = await  getAllClients();
        
        setClient(clientsData);

        if (!info.id && clientsData.length > 0) {
          setIsEdit(false);
          setInfo(clientsData[0]);
        }
      } catch (error) {
        console.error('Failed to fetch clients:', error);
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
      setSelectedClient(null);
    } else {
      setModal(true);
      setStatus([]);
      setAssignStatus([]);
    }
  }, [modal]);

  const toggleViewModal = useCallback(() => {
    setViewModal(!viewModal);
  }, [viewModal]);

  const handleClientClicks = () => {
    setSelectedClient("");
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
    return clients.length > 0 ? Math.max(clients.map((client) => client.id)) + 1 : 1;
  };

  const generateNewClientId = () => {
    return `#VZ${String(generateNewId()).padStart(3, "0")}`;
  };
  function handlesStatus(statuses) {
    setStatus(statuses);
    const assigned = statuses.map(({ label, value }) => ({ label, value }));
    setAssignStatus(assigned);
  }

  const addClient = async(newClient) => {
    try {
      const response = await ClientAPI.addClientRequest(newClient);
   /*   const parts =response.split('CLIENT') ;
      const loginId = parts[0] ;
      const clientId = parts[1].trim(" ") ;
      console.log("LOGIN ID of adding client:", loginId);
      console.log("ClientID of adding client:", clientId);*/
      console.log("CLIENT PASSWORD IS : " ,  response.password)  ;
      const  newL = {
        ...response,
        _id : response.clientId,
        username : response.username,
      statuses  : newClient.status ? [transformStatus(newClient.status)] : [],
      }
     

      console.log('New Client added:', response) ;
      setClient(clients);
      setClientAdded(true);
      setIsEdit(false);
      setModal(false);
      toast.success("client addedd!") 
    } catch (error) {
      toast.error('Failed to add client.');
      console.error('Error adding client:', error);
    }
  }

/*
  const addClient = (newClient) => {
    console.log("New Client:", newClient);

    // Check if the id exists in the clients array
    const existingClientIndex = clients.findIndex((c) => c._id === newClient._id);

    let updatedClients;
    if (existingClientIndex !== -1) {
      // Update existing client
      updatedClients = clients.map((c, index) =>
        index === existingClientIndex
          ? {
              ...c, // Preserve other fields from the existing client
              ...newClient, // Update fields with new values
              last_activity: [
                moment().format("DD MMM, YYYY"),
                moment().format("hh:mmA"),
              ],
            }
          : c
      );
    } else {
      // Add new client
      const newClientWithId = {
        ...newClient,
        id: generateNewId(), // Generate a new unique id
        clientId: generateNewClientId(),
        creation_date: moment().format("DD MMM, YYYY"),
        last_activity: [
          moment().format("DD MMM, YYYY"),
          moment().format("hh:mmA"),
        ],
      };
      updatedClients = [newClientWithId, ...clients];
    }

    setClient(updatedClients);
    setClientAdded(true);
    setIsEdit(false);
    setModal(false);
  };
*/

  useEffect(() => {
    if (clientAdded) {
      setClientAdded(false);
    }
  }, [clientAdded]);

  ////////////////////////////////////// UPDATE ////////////////////////////////////

  const handleClientClick = useCallback(
    (arg) => {
      const selectedClient = arg;

      setSelectedClient({
        id: selectedClient.id,
        name: selectedClient.name,
        address: selectedClient.address,
        phone: selectedClient.phone,
        email: selectedClient.email,
        
       

      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  const HandleupdateClient = async (id, updateClient) => {
    console.log('New collab body Form ', updateClient);
    console.log('New collab body ID ', id);

    try {
      const response = await ClientAPI.updateClientRequest(id, updateClient);
      const updatedL = {
        ...response,
        id: id,
        statuses: response.status ? [transformStatus(response.status)] : [],
      };
      setClient(clients.map(client =>
          client._id === id ? updatedL : client
      ));
      setClientAdded(true);
      setIsEdit(false);
      setModal(false);
      toast.success('Client updated successfully.');
    } catch (error) {
      toast.error('Failed to update collaborator.');
    }
  };

  ////////////////////////////////////// DELETE ////////////////////////////////////

/*  const deleteClient = useCallback((clientToDelete) => {
    setClient((prevClients) => prevClients.filter((c) => c.id !== clientToDelete.id));
    setClientDeleted(true);
  }, []);*/


  const deleteClient = useCallback(async (clientToDelete) => {
    try {
      const response = await ClientAPI.deleteClientRequest(clientToDelete.id);
    

     
        setClient((prevClients) =>
            prevClients.filter((c) => c.id !== clientToDelete.id)
        );
        setClientDeleted(true);
        toast.success('Client deleted successfully.');

    } catch (error) {
      toast.error('Failed to delete Client.');
    }
  }, []);


  const handleDeleteClient = useCallback(() => {
    if (clientToDelete) {
      console.log("client to deleteeeee",clientToDelete)
      deleteClient(clientToDelete);
      setDeleteModal(false);
    }
  }, [clientToDelete, deleteClient]);

  const onClickDelete = (clients) => {
    setClientToDelete(clients);
    setDeleteModal(true);
  };

  useEffect(() => {
    if (clientToDelete) {
      //deleteClient(clientToDelete); Cz I think is running the deletion twice
      setClientToDelete(null);
    }
  }, [clientDeleted]);

  //////////////////////////////////////   EXPORT  ////////////////////////////////////

  const headers = [
    { id: "clientId", displayName: "Client ID" },
    { id: "name", displayName: "Name" },
    { id: "email", displayName: "Email" },
    { id: "phone", displayName: "Phone" },
    { id: "address", displayName: "Address" },
  ];

  //////////////////////////////////////   STATUSES  ////////////////////////////////////

  // const StatusBadge = ({ status }) => {
  //   switch (status) {
  //     case "ACTIVE":
  //       return (
  //         <span className="badge bg-success text-uppercase me-1">{status}</span>
  //       );
  //     case "INACTIVE":
  //       return (
  //         <span className="badge bg-danger text-uppercase me-1">{status}</span>
  //       );

  //     default:
  //       return (
  //         <span className="badge bg-secondary text-uppercase me-1">
  //           {status}
  //         </span>
  //       );
  //   }
  // };

  /////////////////////////////////////////////////////////////////////////////////////
  // validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: selectedClient ? selectedClient.id : "0",
      name: (selectedClient && selectedClient.name) || "",
      email: (selectedClient && selectedClient.email) || "",
      phone: (selectedClient && selectedClient.phone) || "",
      address: (selectedClient && selectedClient.address) || "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Name"),
      email: Yup.string().required("Please Enter Email"),
      phone: Yup.string().required("Please Enter Phone"),
      address: Yup.string().required("Please Enter address"),

    }),
    onSubmit: (values) => {
      console.log("selected client to update",selectedClient)
      if (isEdit) {
        const updateClient = {
          id: selectedClient ? selectedClient.id : 0,
          name: values.name,
          email: values.email,
          phoneNumber: values.phone,
          address: values.address,

        };
        console.log("id", selectedClient.id);
        const id = selectedClient.id;
        HandleupdateClient( id , updateClient);
        validation.resetForm();
      } else {
        const newClient = {
          // _id: (Math.floor(Math.random() * 10) + 20).toString(),
          name: values["name"],
          email: values["email"],
          phone: values["phone"],
          address: values["address"],

        };
        console.log("new client", newClient);
        addClient(newClient);
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
      header: "Email ID",
      accessorKey: "email",
      enableColumnFilter: false,
    },
    {
      header: "Phone No",
      //accessorKey: "phone",
      accessorKey: "phone",
      enableColumnFilter: false,
    },
    {
      header: "Address",
      //accessorKey: "phone",
      accessorKey: "address",
      enableColumnFilter: false,
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
    // {
    //   header: "Last Activity",
    //   accessorKey: "lastActivity",
    //   enableColumnFilter: false,
    //   cell: (cell) => {
    //     const value = cell.getValue();
    //     if (value) {
    //       const [date, time] = value.split("T");
    //       return (
    //           <>
    //             {handleValidDate(date)},{" "}
    //             <small className="text-muted">
    //               {handleValidTime(time)}
    //             </small>
    //           </>
    //       );
    //     } else {
    //       return null;
    //     }
    //   },
    // },

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
                const clientData = cellProps.row.original;
                setInfo(clientData);
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
              onClick={() => handleClientClick(cellProps.row.original)}
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
                const clientData = cellProps.row.original;
                console.log("client date delte",clientData)
                onClickDelete(clientData);
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
      const allIds = clients.map((item) => item.id);
      setSelectedCheckBoxDelete(allIds);
      setIsMultiDeleteButton(true);
      console.log(allIds);
    } else {
      setSelectedCheckBoxDelete([]);
      setIsMultiDeleteButton(false);
    }
  }, [clients]);

  const deleteMultiple = useCallback(() => {
    setClient((prevClients) => {
      const updatedClients = prevClients.filter(
        (c) => !selectedCheckBoxDelete.includes(c.id)
      );
      return updatedClients;
    });
    setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete([]);
    document.getElementById("checkBoxAll").checked = false;
    setDeleteModalMulti(false);
  }, [selectedCheckBoxDelete]);

  useEffect(() => {
    if (clientDeleted) {
      setClientToDelete(null);
      setClientDeleted(false);
    }
  }, [clientDeleted]);

  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={clients.map((client) => ({
            clientId: String(client.clientId),
            name: String(client.name),
            email: String(client.email),
            phone: String(client.phone),
            address: String(client.address),

          }))}
          headers={headers}
          filename={"Clients"}
        />

        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteClient}
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
          <BreadCrumb title="Clients" pageTitle="CRM" />
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
                        Add Clients
                      </button>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
                        {/* :::::::::::::::::::::::::: DELETE MULTIPLE CLIENTS ::::::::::::::::::: */}
                        {isMultiDeleteButton && (
                          <button
                            className="btn btn-secondary"
                            onClick={() => setDeleteModalMulti(true)}
                          >
                            <i className="ri-delete-bin-2-line"></i>
                          </button>
                        )}
                        {/* <button className="btn btn-danger">
                          <i className="ri-filter-2-line me-1 align-bottom"></i>{" "}
                          Filters
                        </button> */}
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
            <Col xxl={12}>
              <Card id="contactList">
                <CardBody className="pt-0">
                  {/* :::::::::::::::::::::: LIST CLIENTS :::::::::::::::::::::::::: */}
                  {/*{clients && clients.length ? (*/}
                  {isLoiding  ? ( <Loader/> ) : (
                    <TableContainer
                      columns={columns}
                      data={clients || []}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={8}
                      className="custom-header-css"
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light"
                      handleClientClick={handleClientClicks}
                      isClientsFilter={true}
                      SearchPlaceholder="Search for clients..."
                    />
                    )}
            {/*      ) : (
                    <Loader />
                  )}
*/}
                  {/* :::::::::::::::::::::: ADD / UPDATE MODAL :::::::::::::::::::::::::: */}
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                    <ModalHeader className="bg-info-subtle p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Client" : "Add Client"}
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
                                htmlFor="address-field"
                                className="form-label"
                              >
                                Address
                              </Label>
                              <Input
                                name="address"
                                id="address-field"
                                className="form-control"
                                placeholder="Enter Address"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.address || ""}
                                invalid={
                                  validation.touched.address &&
                                  validation.errors.address
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.address &&
                              validation.errors.address ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.address}
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
                            {!!isEdit ? "Update" : "Add Client"}
                          </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>

            {/* :::::::::::::::::::::: VIEW Client :::::::::::::::::::::::::: */}
            <Modal
              id="viewModal"
              isOpen={viewModal}
              toggle={toggleViewModal}
              centered
            >
              <ModalHeader toggle={toggleViewModal}>View Client</ModalHeader>
              <ModalBody>
                <div id="contact-view-detail">
                  <div className="text-center mb-3">
                    <h5 className="mt-4 mb-1">{info.name}</h5>
                    <p className="text-muted">{info.clientId}</p>

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
                            <td className="fw-medium">Address</td>
                            <td>{info.address}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Email ID</td>
                            <td>{info.email || "tonyanoble@velzon.com"}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Phone No</td>
                            <td>{info.phoneNumber}</td>
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
