import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
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
import axiosInstance from '../ApiCalls/axiosInstance';
import axiosWithToken from '../ApiCalls/axiosWithToken' ;
import Cookies from 'js-cookie';
import * as CollaboratorsAPI from "../ApiCalls/CollaboratorsAPI";

const Collaborators = () => {
  document.title = "Collaborators";

  // Data
  /*const mockCollaborators = [
    {
      id: 1,
      collaboratorId: "#VZ001",
      name: "Tonya Noble",
      designation: "Operations Manager",
      email: "tonyanoble@articode.com",
      phone: "414-453-5725",
      date: "15 Dec, 2021",
      time: "08:58AM",
      roles: [{ label: "READ", value: "READ" }],
    },
    {
      id: 2,
      collaboratorId: "#VZ002",
      name: "Thomas Taylor",
      designation: "Support Manager",
      email: "thomastaylor@articode.com",
      phone: "580-464-4694",
      date: "17 Dec, 2021",
      time: "10:32AM",
      roles: [{ label: "EDIT", value: "EDIT" }],
    },
    {
      id: 3,
      collaboratorId: "#VZ003",
      name: "Nancy Martino",
      designation: "Financial Analyst",
      email: "nancymartino@articode.com",
      phone: "786-253-9927",
      date: "04 Dec, 2021",
      time: "01:36PM",
      roles: [{ label: "READ", value: "READ" }],
    },
    {
      id: 4,
      collaboratorId: "#VZ004",
      name: "Alexis Clarke",
      designation: "Data Analyst",
      email: "alexisclarke@articode.com",
      phone: "515-395-1069",
      date: "27 Oct, 2021",
      time: "03:47PM",
      roles: [{ label: "ADMIN", value: "ADMIN" }],
    },
    {
      id: 5,
      collaboratorId: "#VZ005",
      name: "James Price",
      designation: "Marketing Specialist",
      email: "jamesprice@articode.com",
      phone: "646-276-2274",
      date: "23 Oct, 2021",
      time: "03:47PM",
      roles: [{ label: "EDIT", value: "EDIT" }],
    },
    {
      id: 6,
      collaboratorId: "#VZ006",
      name: "Mary Cousar",
      designation: "Support Manager",
      email: "marycousar@articode.com",
      phone: "540-575-0991",
      date: "18 Oct, 2021",
      time: "11:08AM",
      roles: [{ label: "READ", value: "READ" }],
    },
    {
      id: 7,
      collaboratorId: "#VZ007",
      name: "Herbert Stokes",
      designation: "Sales Representative",
      email: "herbertstokes@articode.com",
      phone: "949-791-0614",
      date: "01 Jan, 2022",
      time: "03:51PM",
      roles: [{ label: "READ", value: "READ" }],
    },
    {
      id: 8,
      collaboratorId: "#VZ008",
      name: "Michael Morris",
      designation: "Sales Manager",
      email: "michaelmorris@articode.com",
      phone: "484-606-3104",
      date: "20 Sep, 2021",
      time: "07:55AM",
      roles: [{ label: "READ", value: "READ" }],
    },
    {
      id: 9,
      collaboratorId: "#VZ009",
      name: "Timothy Smith",
      designation: "Support Manager",
      email: "timothysmith@articode.com",
      phone: "231-480-8536",
      date: "02 Jan, 2022",
      time: "09:32AM",
      roles: [{ label: "ADMIN", value: "ADMIN" }],
    },
    {
      id: 10,
      collaboratorId: "#VZ0010",
      name: "Kevin Dawson",
      designation: "CRM Administrator",
      email: "kevindawson@articode.com",
      phone: "745-321-9874",
      date: "10 Jun, 2011",
      time: "4:00AM",
      roles: [{ label: "READ", value: "READ" }],
    },
  ];*/

  const roles = [
    { label: "READ", value: "READ" },
    { label: "EDIT", value: "EDIT" },
    { label: "ADMIN", value: "ADMIN" },
  ];
//ROLE TRONSFORMATION BETWEEN BACK & FRON

  const transformRole = (role) => {
    return { label: role, value: role };
  };

  const transformRoles = (roles) => {
    if (!roles) return [];
    return roles.map(role => transformRole(role));
  };

  // State management
  const [isEdit, setIsEdit] = useState(false);
  const [collaborators, setCollaborator] = useState([]);
  const [selectedCollaborator, setSelectedCollaborator] = useState([]);
  const [collaboratorToDelete, setCollaboratorToDelete] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [collaboratorDeleted, setCollaboratorDeleted] = useState(false);
  const [collaboratorAdded, setCollaboratorAdded] = useState(false);
  const [modal, setModal] = useState(false);
  const [tag, setTag] = useState([]);
  const [assignTag, setAssignTag] = useState([]);
  const [info, setInfo] = useState([]);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  ///GET ALL COLLABORATORS FROM THE DATABSE //



/*
useEffect(() => {
    setCollaborator(mockCollaborators);
    if (!info.id && collaborators.length > 0) {
      setIsEdit(false);
      setInfo(collaborators[0]);
    }
  }, []);
*/

  const getCollaborators = async () => {
    try {
      const response = await axiosWithToken.get('/collaborators/get-all-client-collaborator');
      if (response.data != null ) {
      const collaborators = response.data.map(collaborator => ({
        ...collaborator,
        _id: collaborator.collabId,
        roles: collaborator.role ? [transformRole(collaborator.role)] : [],
      }));
        console.log('Response of getting all collaborators:', collaborators);
        return collaborators;
      }else {
        return [];
      }

    } catch (error) {
      console.error('Error getting collaborators:', error);
      throw error;
    }
  } ;


  useEffect(() => {
      const fetchData = async () => {
        try {
          const collaboratorsData = await  getCollaborators();
          setCollaborator(collaboratorsData);

          if (!info.id && collaboratorsData.length > 0) {
            setIsEdit(false);
            setInfo(collaboratorsData[0]);
          }
        } catch (error) {
          console.error('Failed to fetch collaborators:', error);
        }finally {
            setIsLoading(false);
        }
      };      fetchData();
    }, []);




  ////////////////////////////////////// HANDLERS ////////////////////////////////////


  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setIsEdit(false);
      setSelectedCollaborator(null);
    } else {
      setModal(true);
      setTag([]);
      setAssignTag([]);
    }
  }, [modal]);

  const toggleViewModal = useCallback(() => {
    setViewModal(!viewModal);
  }, [viewModal]);

  const handleCollaboratorClicks = () => {
    setSelectedCollaborator("");
    setIsEdit(false);
    toggle();
  };

  ////////////////////////////////////// ADDFRONTCOLLAB ////////////////////////////////////


  const addCollaborator = async (newCollaborator) => {
    console.log('New collab body Form ' , newCollaborator)  ;
    try {
      const CollabUUID = await CollaboratorsAPI.addCollaboratorRequest(newCollaborator);
      console.log('CollabUUID is:', CollabUUID);
      //const parts = jwtToken.split('COLLAB');
      //const jwt = parts[0];
      //const uuid = parts[1].trim();
      const newC = {
        ...newCollaborator,
        _id: CollabUUID,
        roles: newCollaborator.role ? [transformRole(newCollaborator.role)] : [],
      };
      console.log('New Collaborator:', newC) ;
      //console.log('JTW ET UUID :', [jwt, uuid]) ;

      //Cookies.set('accessToken', jwt, { expires: 5 });

     if (CollabUUID === "Email already exists") {
  toast.error("The email provided already exists in the system. Please use a different email.");
} else if (CollabUUID === "Invalid Collaborator Email") {
  toast.error("The email provided is invalid. Please check the email format and try again.");
} else {
  toast.success('Collaborator added successfully!');
  setCollaborator(prevCollaborators => [...prevCollaborators, newC]);
  setCollaboratorAdded(true);
  setIsEdit(false); 
  setModal(false);
}
    } catch (error) {
      toast.error('Failed to add collaborator.');
    }
  };

  useEffect(() => {
    if (collaboratorAdded) {
      setCollaboratorAdded(false);
    }
  }, [collaboratorAdded]);

  

  ////////////////////////////////////// CREATE ////////////////////////////////////

  function handlestag(roles) {
    setTag(roles);
    const assigned = roles.map(({ label, value }) => ({ label, value }));
    setAssignTag(assigned);
  }
/*

  const addCollaborator = (newCollaborator) => {
    console.log("Assign Roles:", assignTag);
    console.log("New Collaborator:", newCollaborator);

    // Check if the _id exists in the collaborators array
    const existingCollaboratorIndex = collaborators.findIndex(
      (c) => c._id === newCollaborator._id
    );

    let updatedCollaborators;
    if (existingCollaboratorIndex !== -1) {
      // Update existing collaborators
      updatedCollaborators = collaborators.map((c, index) =>
        index === existingCollaboratorIndex ? newCollaborator : c
      );
    } else {
      // Add new collaborators
      updatedCollaborators = [newCollaborator, ...collaborators];
    }

    setCollaborator(updatedCollaborators);
    setCollaboratorAdded(true);
    setIsEdit(false);
    setModal(false);
  };

  useEffect(() => {
    if (collaboratorAdded) {
      setCollaboratorAdded(false);
    }
  }, [collaboratorAdded]);
*/

  ////////////////////////////////////// UPDATE ////////////////////////////////////

  const handleCollaboratorClick = useCallback(
    (arg) => {
      const selectedCollaborator = arg;

      setSelectedCollaborator({
        _id: selectedCollaborator._id,
        name: selectedCollaborator.name,
        email: selectedCollaborator.email,
        designation: selectedCollaborator.occupation,
        phone: selectedCollaborator.phoneNumber,
        roles: selectedCollaborator.roles,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );



  const HandleupdateCollaborator = async (id, updateCollaborator) => {
    console.log('New collab body Form ', updateCollaborator);
    console.log('New collab body ID ', id);

    try {
      const response = await CollaboratorsAPI.updateCollaboratorRequest(id, updateCollaborator);
      const updatedC = {
        ...updateCollaborator,
        _id: id,
        roles: updateCollaborator.role ? [transformRole(updateCollaborator.role)] : [],
      };
      setCollaborator(collaborators.map(collaborator =>
          collaborator._id === id ? updatedC : collaborator
      ));
      setCollaboratorAdded(true);
      setIsEdit(false);
      setModal(false);
      toast.success(response);
    } catch (error) {
      toast.error('Failed to update collaborator.');
    }
  };

  ////////////////////////////////////// DELETE ////////////////////////////////////
/*
  const deleteCollaborator = useCallback((collaboratorToDelete) => {
    setCollaborator((prevCollaborators) =>
      prevCollaborators.filter((c) => c.id !== collaboratorToDelete.id)
    );
    setCollaboratorDeleted(true);
  }, []);*/



  const deleteCollaborator = useCallback(async (collaboratorToDelete) => {
    try {
      const response = await CollaboratorsAPI.deleteCollaboratorRequest(collaboratorToDelete._id);
      if (response) {
        setCollaborator((prevCollaborators) =>
            prevCollaborators.filter((c) => c._id !== collaboratorToDelete._id)
        );
        setCollaboratorDeleted(true);
        toast.success('Collaborator deleted successfully.');
      } else {
        toast.error('Failed to delete collaborator.');
      }
    } catch (error) {
      toast.error('Failed to delete collaborator.');
    }
  }, []);


  const handleDeleteCollaborator = useCallback(() => {
    if (collaboratorToDelete) {
      deleteCollaborator(collaboratorToDelete);
      setDeleteModal(false);
    }
  }, [collaboratorToDelete, deleteCollaborator]);

  const onClickDelete = (collaborators) => {
    setCollaboratorToDelete(collaborators);
    setDeleteModal(true);
  };

  useEffect(() => {
    if (collaboratorToDelete) {
      deleteCollaborator(collaboratorToDelete);
      setCollaboratorToDelete(null);
    }
  }, [collaboratorDeleted]);

  //////////////////////////////////////   EXPORT  ////////////////////////////////////

  const headers = [
    { id: "collaboratorId", displayName: "Collaborator ID" },
    { id: "name", displayName: "Name" },
    { id: "designation", displayName: "Designation" },
    { id: "email", displayName: "Email" },
    { id: "phone", displayName: "Phone" },
  ];

  //////////////////////////////////////   ROLES  ////////////////////////////////////

  const RoleBadge = ({ role }) => {
    switch (role) {
      case "READ":
        return (
          <span className="badge bg-secondary text-uppercase me-1">{role}</span>
        );
      case "EDIT":
        return (
          <span className="badge bg-success text-uppercase me-1">{role}</span>
        );
      case "ADMIN":
        return (
          <span className="badge bg-danger text-uppercase me-1">{role}</span>
        );
      default:
        return (
          <span className="badge bg-secondary text-uppercase me-1">{role}</span>
        );
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////

 const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: (selectedCollaborator && selectedCollaborator.name) || "",
      designation:
        (selectedCollaborator && selectedCollaborator.designation) || "",
      email: (selectedCollaborator && selectedCollaborator.email) || "",
      phone: (selectedCollaborator && selectedCollaborator.phone) || "",
      password: (selectedCollaborator && selectedCollaborator.password) || "",
      roles: (selectedCollaborator && selectedCollaborator.roles) || [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Name"),
      designation: Yup.string().required("Please Enter Designation"),
      email: Yup.string().required("Please Enter Email"),
      password: Yup.string().required("Please Enter password"),
      phone: Yup.string().required("Please Enter Phone"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateCollaborator = {
          _id: selectedCollaborator ? selectedCollaborator._id : 0,
          name: values.name,
          occupation: values.designation,
          email: values.email,
          password: values.password,
          phoneNumber: values.phone,
          role : assignTag[0]?.value ,
        };
        console.log("id", selectedCollaborator._id);
        HandleupdateCollaborator(selectedCollaborator._id, updateCollaborator);
        validation.resetForm();
      } else {
        const newCollaborator = {
          //_id: (Math.floor(Math.random() * 10) + 20).toString(),
          name: values["name"],
          occupation : values["designation"],
          email: values["email"],
          phoneNumber: values["phone"],
          password: values["password"],
          //roles: assignTag,
          role : assignTag[0]?.value ,
        };
        console.log('New collab body in sumbit ' , newCollaborator) ;
        addCollaborator(newCollaborator);
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
      header: "Designation",
     // accessorKey: "designation",
      accessorKey: "occupation" ,
      enableColumnFilter: false,
    },
    {
      header: "Email ID",
      accessorKey: "email",
      enableColumnFilter: false,
    },
    {
      header: "Phone No",
      accessorKey: "phoneNumber",
      enableColumnFilter: false,
    },
    {
      header: "Role",
      accessorKey: "roles",
      enableColumnFilter: false,
      cell: (cell) => (
        <>
          {( cell.getValue()|| [] ).map((item, key) => (
            <RoleBadge role={item.label} key={key} />
          ))}
        </>
      ),
      sortingFn: (rowA, rowB) => {
        const roleOrder = { ADMIN: 0, EDIT: 1, READ: 2 };

        const roleA = rowA.original.roles.find(
          (role) => role.value in roleOrder
        );
        const roleB = rowB.original.roles.find(
          (role) => role.value in roleOrder
        );

        const orderA = roleA ? roleOrder[roleA.value] : Infinity;
        const orderB = roleB ? roleOrder[roleB.value] : Infinity;

        return orderA - orderB;
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
                const collaboratorData = cellProps.row.original;
                setInfo(collaboratorData);
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

          {/* EDIT  */}
          <li className="list-inline-item edit" title="Message">
            <div
              className="dropdown-item edit-item-btn"
              href="#"
              onClick={() => handleCollaboratorClick(cellProps.row.original)}
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
                const collaboratorData = cellProps.row.original;
                onClickDelete(collaboratorData);
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
      const allIds = collaborators.map((item) => item.id);
      setSelectedCheckBoxDelete(allIds);
      setIsMultiDeleteButton(true);
      console.log(allIds);
    } else {
      setSelectedCheckBoxDelete([]);
      setIsMultiDeleteButton(false);
    }
  }, [collaborators]);

  const deleteMultiple = useCallback(() => {
    setCollaborator((prevCollaborators) => {
      const updatedCollaborators = prevCollaborators.filter(
        (c) => !selectedCheckBoxDelete.includes(c.id)
      );
      return updatedCollaborators;
    });
    setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete([]);
    document.getElementById("checkBoxAll").checked = false;
    setDeleteModalMulti(false);
  }, [selectedCheckBoxDelete]);

  useEffect(() => {
    if (collaboratorDeleted) {
      setCollaboratorToDelete(null);
      setCollaboratorDeleted(false);
    }
  }, [collaboratorDeleted]);

  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => [setIsExportCSV(false)]}
          data={collaborators}
          headers={headers}
          fileName={"collaborators"}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCollaborator}
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
          <BreadCrumb title="Collaborators" pageTitle="CRM" />
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
                        Add Collaborators
                      </button>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
                        {/* :::::::::::::::::::::::::: DELETE MULTIPLE COLLABORATORS ::::::::::::::::::: */}
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
                  {/* :::::::::::::::::::::: LIST COLLABORATORS :::::::::::::::::::::::::: */}
              {/*removing loading when the database is empty*/}
               {/*{collaborators && collaborators.length ? ( */}
                          {isLoading ? (
                                <Loader />
                            ) : (
                    <TableContainer
                      columns={columns}
                      data={collaborators || []}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={8}
                      className="custom-header-css"
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light"
                      handleCollaboratorClick={handleCollaboratorClicks}
                      isCollaboratorsFilter={true}
                      SearchPlaceholder="Search for collaborators..."
                    />  )}
               {/*    ) : (
                     <Loader />
                   )}*/}

                  {/* :::::::::::::::::::::: ADD / UPDATE MODAL :::::::::::::::::::::::::: */}
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                    <ModalHeader className="bg-info-subtle p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Collaborator" : "Add Collaborator"}
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
                            <div className="text-center">
                              <div className="position-relative d-inline-block">
                                <div className="position-absolute  bottom-0 end-0"></div>
                              </div>
                            </div>

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
                          {/* DESIGNATION */}
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="designation-field"
                                className="form-label"
                              >
                                Designation
                              </Label>

                              <Input
                                name="designation"
                                id="designation-field"
                                className="form-control"
                                placeholder="Enter Designation"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.designation || ""}
                                invalid={
                                  validation.touched.designation &&
                                  validation.errors.designation
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.designation &&
                              validation.errors.designation ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.designation}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          {/* EMAIL */}
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
                          {/* PASSWORD */}
                          <Col lg={12}>
                            <div>
                              <Label
                                  htmlFor="designation-field"
                                  className="form-label"
                              >
                                Password
                              </Label>

                              <Input
                                  name="password"
                                  id="password-field"
                                  className="form-control"
                                  placeholder="Enter Password"
                                  type="password"
                                  validate={{
                                    required: { value: true },
                                  }}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.password || ""}
                                  invalid={
                                    validation.touched.password &&
                                    validation.errors.password
                                        ? true
                                        : false
                                  }
                              />
                              {validation.touched.password &&
                              validation.errors.password ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.password}
                                  </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          {/* PHONE */}
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
                                htmlFor="taginput-choices"
                                className="form-label font-size-13"
                              >
                                Role
                              </Label>
                              <Select
                                isMulti
                                value={tag}
                                onChange={(e) => {
                                  handlestag(e);
                                }}
                                className="mb-0"
                                options={roles}
                                id="taginput-choices"
                              ></Select>

                              {validation.touched.roles &&
                              validation.errors.roles ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.roles}
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
                            {!!isEdit ? "Update" : "Add Collaborator"}
                          </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>

            {/* :::::::::::::::::::::: VIEW COLLABORATOR :::::::::::::::::::::::::: */}
            <Modal
              id="viewModal"
              isOpen={viewModal}
              toggle={toggleViewModal}
              centered
            >
              <ModalHeader toggle={toggleViewModal}>
                View Collaborator
              </ModalHeader>
              <ModalBody>
                <div id="contact-view-detail">
                  <div className="text-center mb-3">
                    <h5 className="mt-4 mb-1">{info.name || "Tonya Noble"}</h5>
                    <p className="text-muted">{info.occupation}</p>

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
                            <td className="fw-medium">Designation</td>
                            <td>{info.occupation}</td>
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
                            <td className="fw-medium">Role</td>
                            <td>
                              {(info.roles || []).map((tag, key) => (
                                <span
                                  className="badge bg-primary-subtle text-primary me-1"
                                  key={key}
                                >
                                  {tag.label || tag.value}
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
};

export default Collaborators;
