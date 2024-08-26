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
import * as MatierePremiereAPI from "../ApiCalls/MatierePremiereAPI";
import * as CollaboratorsAPI from "../ApiCalls/CollaboratorsAPI";
import {updateMatierePremiereRequest} from "../ApiCalls/MatierePremiereAPI";
export default function MatierePremieres() {
  document.title = "MatierePremieres";

/*  // DATA
  const mockMatierePremieres = [
    {
      id: 1,
      matierePremiereId: "#VZ001",
      username: "hajar_ammari",
      name: "Hajar AMMARI",
      quantity: "hajar.ammari@gmail.com",
      unit: "+212 660 51 58 30",
      creation_date: "09 Jul, 2024",
      last_activity: ["11 Jul, 2024", "08:58AM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 2,
      matierePremiereId: "#VZ002",
      username: "john_doe",
      name: "John DOE",
      quantity: "john.doe@example.com",
      unit: "+1 123 456 7890",
      creation_date: "10 Jul, 2024",
      last_activity: ["12 Jul, 2024", "10:30AM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 3,
      matierePremiereId: "#VZ003",
      username: "alice_wonderland",
      name: "Alice WONDERLAND",
      quantity: "alice.wonderland@example.com",
      unit: "+44 20 1234 5678",
      creation_date: "11 Jul, 2024",
      last_activity: ["13 Jul, 2024", "11:45AM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 4,
      matierePremiereId: "#VZ004",
      username: "michael_jones",
      name: "Michael JONES",
      quantity: "michael.jones@example.com",
      unit: "+1 987 654 3210",
      creation_date: "12 Jul, 2024",
      last_activity: ["14 Jul, 2024", "01:20PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 5,
      matierePremiereId: "#VZ005",
      username: "sara_smith",
      name: "Sara SMITH",
      quantity: "sara.smith@example.com",
      unit: "+61 2 1234 5678",
      creation_date: "13 Jul, 2024",
      last_activity: ["15 Jul, 2024", "03:10PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 6,
      matierePremiereId: "#VZ006",
      username: "adam_brown",
      name: "Adam BROWN",
      quantity: "adam.brown@example.com",
      unit: "+44 20 9876 5432",
      creation_date: "14 Jul, 2024",
      last_activity: ["16 Jul, 2024", "04:55PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 7,
      matierePremiereId: "#VZ007",
      username: "emma_davis",
      name: "Emma DAVIS",
      quantity: "emma.davis@example.com",
      unit: "+1 234 567 8901",
      creation_date: "15 Jul, 2024",
      last_activity: ["17 Jul, 2024", "09:20AM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 8,
      matierePremiereId: "#VZ008",
      username: "peter_smith",
      name: "Peter SMITH",
      quantity: "peter.smith@example.com",
      unit: "+61 2 9876 5432",
      creation_date: "16 Jul, 2024",
      last_activity: ["18 Jul, 2024", "12:40PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 9,
      matierePremiereId: "#VZ009",
      username: "lisa_jones",
      name: "Lisa JONES",
      quantity: "lisa.jones@example.com",
      unit: "+1 345 678 9012",
      creation_date: "17 Jul, 2024",
      last_activity: ["19 Jul, 2024", "02:15PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 10,
      matierePremiereId: "#VZ010",
      username: "alex_anderson",
      name: "Alex ANDERSON",
      quantity: "alex.anderson@example.com",
      unit: "+44 20 3456 7890",
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
  const [matierePremieres, setMatierePremiere] = useState([]);
  const [selectedMatierePremiere, setSelectedMatierePremiere] = useState([]);
  const [matierePremiereToDelete, setMatierePremiereToDelete] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [matierePremiereDeleted, setMatierePremiereDeleted] = useState(false);
  const [matierePremiereAdded, setMatierePremiereAdded] = useState(false);
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
    setMatierePremiere(mockMatierePremieres);
    if (!info.id && matierePremieres.length > 0) {
      setIsEdit(false);
      setInfo(matierePremieres[0]);
    }
  }, []);*/


  const getAllMatierePremieres = async () => {
    try {
      const response = await axiosWithToken.get('/matiere');
      console.log(response)
      if (response.data != null ) {
      const matierePremieres = response.data.map(matierePremiere => ({
        ...matierePremiere,
        id: matierePremiere.id,
      }));
        console.log('Response of getting all matierePremieres:', matierePremieres);
        return matierePremieres;
      }else {
        console.log('No matierePremieres found');
        return [];
      }

    } catch (error) {
      console.error('Error getting matierePremieres:', error);
      throw error;
    }
  } ;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const matierePremieresData = await  getAllMatierePremieres();
        
        setMatierePremiere(matierePremieresData);

        if (!info.id && matierePremieresData.length > 0) {
          setIsEdit(false);
          setInfo(matierePremieresData[0]);
        }
      } catch (error) {
        console.error('Failed to fetch matierePremieres:', error);
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
      setSelectedMatierePremiere(null);
    } else {
      setModal(true);
      setStatus([]);
      setAssignStatus([]);
    }
  }, [modal]);

  const toggleViewModal = useCallback(() => {
    setViewModal(!viewModal);
  }, [viewModal]);

  const handleMatierePremiereClicks = () => {
    setSelectedMatierePremiere("");
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
    return matierePremieres.length > 0 ? Math.max(matierePremieres.map((matierePremiere) => matierePremiere.id)) + 1 : 1;
  };

  const generateNewMatierePremiereId = () => {
    return `#VZ${String(generateNewId()).padStart(3, "0")}`;
  };
  function handlesStatus(statuses) {
    setStatus(statuses);
    const assigned = statuses.map(({ label, value }) => ({ label, value }));
    setAssignStatus(assigned);
  }

  const addMatierePremiere = async(newMatierePremiere) => {
    try {
      const response = await MatierePremiereAPI.addMatierePremiereRequest(newMatierePremiere);
   /*   const parts =response.split('CLIENT') ;
      const loginId = parts[0] ;
      const matierePremiereId = parts[1].trim(" ") ;
      console.log("LOGIN ID of adding matierePremiere:", loginId);
      console.log("MatierePremiereID of adding matierePremiere:", matierePremiereId);*/
      console.log("CLIENT PASSWORD IS : " ,  response.password)  ;
      const  newL = {
        ...response,
        id : response.matierePremiereId,
        username : response.username,
      statuses  : newMatierePremiere.status ? [transformStatus(newMatierePremiere.status)] : [],
      }
     

      console.log('New MatierePremiere added:', response) ;
      setMatierePremiere(matierePremieres);
      setMatierePremiereAdded(true);
      setIsEdit(false);
      setModal(false);
      toast.success("matierePremiere addedd!") 
    } catch (error) {
      toast.error('Failed to add matierePremiere.');
      console.error('Error adding matierePremiere:', error);
    }
  }

/*
  const addMatierePremiere = (newMatierePremiere) => {
    console.log("New MatierePremiere:", newMatierePremiere);

    // Check if the id exists in the matierePremieres array
    const existingMatierePremiereIndex = matierePremieres.findIndex((c) => c.id === newMatierePremiere.id);

    let updatedMatierePremieres;
    if (existingMatierePremiereIndex !== -1) {
      // Update existing matierePremiere
      updatedMatierePremieres = matierePremieres.map((c, index) =>
        index === existingMatierePremiereIndex
          ? {
              ...c, // Preserve other fields from the existing matierePremiere
              ...newMatierePremiere, // Update fields with new values
              last_activity: [
                moment().format("DD MMM, YYYY"),
                moment().format("hh:mmA"),
              ],
            }
          : c
      );
    } else {
      // Add new matierePremiere
      const newMatierePremiereWithId = {
        ...newMatierePremiere,
        id: generateNewId(), // Generate a new unique id
        matierePremiereId: generateNewMatierePremiereId(),
        creation_date: moment().format("DD MMM, YYYY"),
        last_activity: [
          moment().format("DD MMM, YYYY"),
          moment().format("hh:mmA"),
        ],
      };
      updatedMatierePremieres = [newMatierePremiereWithId, ...matierePremieres];
    }

    setMatierePremiere(updatedMatierePremieres);
    setMatierePremiereAdded(true);
    setIsEdit(false);
    setModal(false);
  };
*/

  useEffect(() => {
    if (matierePremiereAdded) {
      setMatierePremiereAdded(false);
    }
  }, [matierePremiereAdded]);

  ////////////////////////////////////// UPDATE ////////////////////////////////////

  const handleMatierePremiereClick = useCallback(
    (arg) => {
      const selectedMatierePremiere = arg;
console.log("sele",selectedMatierePremiere)
      setSelectedMatierePremiere({
        id: selectedMatierePremiere.id,
        name: selectedMatierePremiere.name,
        unit: selectedMatierePremiere.unit,
        quantity: selectedMatierePremiere.quantity,
        priceU: selectedMatierePremiere.priceU,
        
       

      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  const HandleupdateMatierePremiere = async (id, updateMatierePremiere) => {
    console.log('New collab body Form ', updateMatierePremiere);
    console.log('New collab body ID ', id);

    try {
      const response = await MatierePremiereAPI.updateMatierePremiereRequest(id, updateMatierePremiere);
      console.log("resp",response)
      const updatedL = {
        ...response,
        id: id,
        statuses: response.status ? [transformStatus(response.status)] : [],
      };
      setMatierePremiere(matierePremieres.map(matierePremiere =>
          matierePremiere.id === id ? updatedL : matierePremiere
      ));
      setMatierePremiereAdded(true);
      setIsEdit(false);
      setModal(false);
      toast.success('MatierePremiere updated successfully.');
    } catch (error) {
      toast.error('Failed to update collaborator.');
    }
  };

  ////////////////////////////////////// DELETE ////////////////////////////////////

/*  const deleteMatierePremiere = useCallback((matierePremiereToDelete) => {
    setMatierePremiere((prevMatierePremieres) => prevMatierePremieres.filter((c) => c.id !== matierePremiereToDelete.id));
    setMatierePremiereDeleted(true);
  }, []);*/


  const deleteMatierePremiere = useCallback(async (matierePremiereToDelete) => {
    try {
      const response = await MatierePremiereAPI.deleteMatierePremiereRequest(matierePremiereToDelete.id);
    

     
        setMatierePremiere((prevMatierePremieres) =>
            prevMatierePremieres.filter((c) => c.id !== matierePremiereToDelete.id)
        );
        setMatierePremiereDeleted(true);

    } catch (error) {
      toast.error('Failed to delete MatierePremiere.');
    }
  }, []);


  const handleDeleteMatierePremiere = useCallback(() => {
    if (matierePremiereToDelete) {
      console.log("matierePremiere to deleteeeee",matierePremiereToDelete)
      deleteMatierePremiere(matierePremiereToDelete);
      setDeleteModal(false);
    }
  }, [matierePremiereToDelete, deleteMatierePremiere]);

  const onClickDelete = (matierePremieres) => {
    setMatierePremiereToDelete(matierePremieres);
    setDeleteModal(true);
  };

  useEffect(() => {
    if (matierePremiereToDelete) {
      //deleteMatierePremiere(matierePremiereToDelete); Cz I think is running the deletion twice
      setMatierePremiereToDelete(null);
    }
  }, [matierePremiereDeleted]);

  //////////////////////////////////////   EXPORT  ////////////////////////////////////

  const headers = [
    { id: "matierePremiereId", displayName: "MatierePremiere ID" },
    { id: "name", displayName: "Name" },
    { id: "quantity", displayName: "Quantity" },
    { id: "unit", displayName: "Unit" },
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
      id: selectedMatierePremiere ? selectedMatierePremiere.id : "0",
      name: (selectedMatierePremiere && selectedMatierePremiere.name) || "",
      quantity: (selectedMatierePremiere && selectedMatierePremiere.quantity) || "",
      unit: (selectedMatierePremiere && selectedMatierePremiere.unit) || "",
      priceU: (selectedMatierePremiere && selectedMatierePremiere.priceU) || "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Name"),
      quantity: Yup.string().required("Please Enter Quantity"),
      unit: Yup.string().required("Please Enter Unit"),
      priceU: Yup.string().required("Please Enter Price for each UNit"),

    }),
    onSubmit: (values) => {
      console.log("selected matierePremiere to update",selectedMatierePremiere)
      if (isEdit) {
        const updateMatierePremiere = {
          id: selectedMatierePremiere ? selectedMatierePremiere.id : 0,
          name: values.name,
          quantity: values.quantity,
          unit: values.unit,
          priceU: values.priceU,

        };
        console.log(updateMatierePremiere.id)
        const id = selectedMatierePremiere.id;
        HandleupdateMatierePremiere( id , updateMatierePremiere);
        validation.resetForm();
      } else {
        const newMatierePremiere = {
          // id: (Math.floor(Math.random() * 10) + 20).toString(),
          name: values["name"],
          quantity: values["quantity"],
          unit: values["unit"],
          priceU: values["priceU"],


        };
        console.log("new matierePremiere", newMatierePremiere);
        addMatierePremiere(newMatierePremiere);
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
      header: "Quantity ID",
      accessorKey: "quantity",
      enableColumnFilter: false,
    },
    {
      header: "Unit",
      //accessorKey: "unit",
      accessorKey: "unit",
      enableColumnFilter: false,
    },
    {
      header: "Prix Unitaire",
      //accessorKey: "unit",
      accessorKey: "priceU",
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
                const matierePremiereData = cellProps.row.original;
                setInfo(matierePremiereData);
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
              onClick={() => handleMatierePremiereClick(cellProps.row.original)}
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
                const matierePremiereData = cellProps.row.original;
                console.log("matierePremiere date delte",matierePremiereData)
                onClickDelete(matierePremiereData);
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
      const allIds = matierePremieres.map((item) => item.id);
      setSelectedCheckBoxDelete(allIds);
      setIsMultiDeleteButton(true);
      console.log(allIds);
    } else {
      setSelectedCheckBoxDelete([]);
      setIsMultiDeleteButton(false);
    }
  }, [matierePremieres]);

  const deleteMultiple = useCallback(() => {
    setMatierePremiere((prevMatierePremieres) => {
      const updatedMatierePremieres = prevMatierePremieres.filter(
        (c) => !selectedCheckBoxDelete.includes(c.id)
      );
      return updatedMatierePremieres;
    });
    setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete([]);
    document.getElementById("checkBoxAll").checked = false;
    setDeleteModalMulti(false);
  }, [selectedCheckBoxDelete]);

  useEffect(() => {
    if (matierePremiereDeleted) {
      setMatierePremiereToDelete(null);
      setMatierePremiereDeleted(false);
    }
  }, [matierePremiereDeleted]);

  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={matierePremieres.map((matierePremiere) => ({
            matierePremiereId: String(matierePremiere.matierePremiereId),
            name: String(matierePremiere.name),
            quantity: String(matierePremiere.quantity),
            unit: String(matierePremiere.unit),
            priceU: String(matierePremiere.priceU),

          }))}
          headers={headers}
          filename={"MatierePremieres"}
        />

        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteMatierePremiere}
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
          <BreadCrumb title="MatierePremieres" pageTitle="CRM" />
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
                        Add MatierePremieres
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
                  {/*{matierePremieres && matierePremieres.length ? (*/}
                  {isLoiding  ? ( <Loader/> ) : (
                    <TableContainer
                      columns={columns}
                      data={matierePremieres || []}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={8}
                      className="custom-header-css"
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light"
                      handleMatierePremiereClick={handleMatierePremiereClicks}
                      isMatierePremieresFilter={true}
                      SearchPlaceholder="Search for matierePremieres..."
                    />
                    )}
            {/*      ) : (
                    <Loader />
                  )}
*/}
                  {/* :::::::::::::::::::::: ADD / UPDATE MODAL :::::::::::::::::::::::::: */}
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                    <ModalHeader className="bg-info-subtle p-3" toggle={toggle}>
                      {!!isEdit ? "Edit MatierePremiere" : "Add MatierePremiere"}
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
                                htmlFor="quantityid-field"
                                className="form-label"
                              >
                                Quantity ID
                              </Label>
                              <Input
                                name="quantity"
                                id="quantityid-field"
                                className="form-control"
                                placeholder="Enter Quantity"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.quantity || ""}
                                invalid={
                                  validation.touched.quantity &&
                                  validation.errors.quantity
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.quantity &&
                              validation.errors.quantity ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.quantity}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="priceU-field"
                                className="form-label"
                              >
                                Prix Unitaire
                              </Label>
                              <Input
                                name="priceU"
                                id="priceU-field"
                                className="form-control"
                                placeholder="Enter Prix Unitaire"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.priceU || ""}
                                invalid={
                                  validation.touched.priceU &&
                                  validation.errors.priceU
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.priceU &&
                              validation.errors.priceU ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.priceU}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="unit-field"
                                className="form-label"
                              >
                                Unit
                              </Label>
                              <Input
                                name="unit"
                                id="unit-field"
                                className="form-control"
                                placeholder="Enter Unit No."
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.unit || ""}
                                invalid={
                                  validation.touched.unit &&
                                  validation.errors.unit
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.unit &&
                              validation.errors.unit ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.unit}
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
                            {!!isEdit ? "Update" : "Add MatierePremiere"}
                          </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>

            {/* :::::::::::::::::::::: VIEW MatierePremiere :::::::::::::::::::::::::: */}
            <Modal
              id="viewModal"
              isOpen={viewModal}
              toggle={toggleViewModal}
              centered
            >
              <ModalHeader toggle={toggleViewModal}>View MatierePremiere</ModalHeader>
              <ModalBody>
                <div id="contact-view-detail">
                  <div className="text-center mb-3">
                    <h5 className="mt-4 mb-1">{info.name}</h5>
                    <p className="text-muted">{info.matierePremiereId}</p>

                    <ul className="list-inline mb-0">
                      <li className="list-inline-item avatar-xs">
                        <Link
                          to="#"
                          className="avatar-title bg-success-subtle text-success fs-15 rounded"
                        >
                          <i className="ri-unit-line"></i>
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
                            <td className="fw-medium">Quantity ID</td>
                            <td>{info.quantity || "tonyanoble@velzon.com"}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Unit</td>
                            <td>{info.unitNumber}</td>
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
