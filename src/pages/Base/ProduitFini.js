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
import * as ProduitFiniAPI from "../ApiCalls/ProduitFiniAPI";
import * as CollaboratorsAPI from "../ApiCalls/CollaboratorsAPI";
import {updateProduitFiniRequest} from "../ApiCalls/ProduitFiniAPI";
export default function ProduitFinis() {
  document.title = "ProduitFinis";

/*  // DATA
  const mockProduitFinis = [
    {
      id: 1,
      produitFiniId: "#VZ001",
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
      ProduitFiniId: "#VZ002",
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
      ProduitFiniId: "#VZ003",
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
      ProduitFiniId: "#VZ004",
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
      ProduitFiniId: "#VZ005",
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
      ProduitFiniId: "#VZ006",
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
      ProduitFiniId: "#VZ007",
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
      ProduitFiniId: "#VZ008",
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
      ProduitFiniId: "#VZ009",
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
      ProduitFiniId: "#VZ010",
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
  const [ProduitFinis, setProduitFini] = useState([]);
  const [selectedProduitFini, setSelectedProduitFini] = useState([]);
  const [ProduitFiniToDelete, setProduitFiniToDelete] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [ProduitFiniDeleted, setProduitFiniDeleted] = useState(false);
  const [ProduitFiniAdded, setProduitFiniAdded] = useState(false);
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState([]);
  const [assignStatus, setAssignStatus] = useState([]);
  const [info, setInfo] = useState([]);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedMatierePremieres, setSelectedMatierePremieres] = useState([]);
  const [matierePremiereQuantities, setMatierePremiereQuantities] = useState({})
  const [matierePremieres, setMatierePremieres] = useState([]);
  const [permis, setPermis] = useState([]);
  const [atierePremiereDetails, setAtierePremiereDetails] = useState([]);

  const [isLoiding, setLoiding] = useState(true);
///////////////////////////////////////////////////////////////////////////GET ALL CLIENTS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*  useEffect(() => {
    setProduitFini(mockProduitFinis);
    if (!info.id && ProduitFinis.length > 0) {
      setIsEdit(false);
      setInfo(ProduitFinis[0]);
    }
  }, []);*/
  

  const getAllProduitFinis = async () => {
    try {
      const response = await axiosWithToken.get('/produit');
      console.log(response)
      if (response.data != null ) {
      const ProduitFinis = response.data.map(ProduitFini => ({
        ...ProduitFini,
        id: ProduitFini.id,
      }));
        console.log('Response of getting all ProduitFinis:', ProduitFinis);
        return ProduitFinis;
      }else {
        console.log('No ProduitFinis found');
        return [];
      }

    } catch (error) {
      console.error('Error getting ProduitFinis:', error);
      throw error;
    }
  } ;

  const getAllMatierePremieres = async () => {
    try {
      const response = await axiosWithToken.get("/matiere");
      const mappedData = response.data.map(mp => ({ label: mp.name, value: mp.id }));
      console.log("aa",mappedData);
      setPermis(mappedData);
console.log("permis",permis);
    } catch (error) {
      console.error("Error getting matiere premieres:", error);
      throw error;
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const ProduitFinisData = await  getAllProduitFinis();
        const matierePremieresData = await getAllMatierePremieres();

        
        setProduitFini(ProduitFinisData);
        setMatierePremieres(matierePremieresData);


        if (!info.id && ProduitFinisData.length > 0) {
          setIsEdit(false);
          setInfo(ProduitFinisData[0]);
        }
      } catch (error) {
        console.error('Failed to fetch ProduitFinis:', error);
      }finally {
        setLoiding(false);
      }
    };      fetchData();
  }, []);
  const fetchMatierePremiereDetails = async (id) => {
    try {
      const response = await axiosWithToken.get(`/matiere/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching matiere premiere details:", error);
      return null;
    }
  };
  useEffect(() => {
    const fetchDetails = async () => {
      if (info.matiere_premiere_quantities && typeof info.matiere_premiere_quantities === 'object') {
        const detailsPromises = Object.entries(info.matiere_premiere_quantities).map(async ([id, quantity]) => {
          const details = await fetchMatierePremiereDetails(id);
          return { ...details, quantity };
        });

        const details = await Promise.all(detailsPromises);
        
        setAtierePremiereDetails(details);
        console.log("d",atierePremiereDetails)
      }
    };

    fetchDetails();
  }, [info]);

  ////////////////////////////////////// HANDLERS ////////////////////////////////////

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setIsEdit(false);
      setSelectedProduitFini(null);
    } else {
      setModal(true);
      setSelectedMatierePremieres([]);
      setMatierePremiereQuantities({});
      setStatus([]);
      setAssignStatus([]);
    }
  }, [modal]);
  

  const toggleViewModal = useCallback(() => {
    setViewModal(!viewModal);
  }, [viewModal]);

  const handleProduitFiniClicks = () => {
    setSelectedProduitFini("");
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
    return ProduitFinis.length > 0 ? Math.max(ProduitFinis.map((ProduitFini) => ProduitFini.id)) + 1 : 1;
  };

  const generateNewProduitFiniId = () => {
    return `#VZ${String(generateNewId()).padStart(3, "0")}`;
  };
  function handlesStatus(statuses) {
    setStatus(statuses);
    const assigned = statuses.map(({ label, value }) => ({ label, value }));
    setAssignStatus(assigned);
  }
 
  const addProduitFini = async(newProduitFini) => {
    try {
      const response = await ProduitFiniAPI.addProduitFiniRequest(newProduitFini);
   /*   const parts =response.split('CLIENT') ;
      const loginId = parts[0] ;
      const ProduitFiniId = parts[1].trim(" ") ;
      console.log("LOGIN ID of adding ProduitFini:", loginId);
      console.log("ProduitFiniID of adding ProduitFini:", ProduitFiniId);*/
      console.log("CLIENT PASSWORD IS : " ,  response.password)  ;
      const  newL = {
        ...response,
        id : response.ProduitFiniId,
        username : response.username,
      statuses  : newProduitFini.status ? [transformStatus(newProduitFini.status)] : [],
      }
     

      console.log('New ProduitFini added:', response) ;
      setProduitFini(ProduitFinis);
      setProduitFiniAdded(true);
      setIsEdit(false);
      setModal(false);
      toast.success("ProduitFini addedd!") 
    } catch (error) {
      toast.error('Failed to add ProduitFini.');
      console.error('Error adding ProduitFini:', error);
    }
  }

/*
  const addProduitFini = (newProduitFini) => {
    console.log("New ProduitFini:", newProduitFini);

    // Check if the id exists in the ProduitFinis array
    const existingProduitFiniIndex = ProduitFinis.findIndex((c) => c.id === newProduitFini.id);

    let updatedProduitFinis;
    if (existingProduitFiniIndex !== -1) {
      // Update existing ProduitFini
      updatedProduitFinis = ProduitFinis.map((c, index) =>
        index === existingProduitFiniIndex
          ? {
              ...c, // Preserve other fields from the existing ProduitFini
              ...newProduitFini, // Update fields with new values
              last_activity: [
                moment().format("DD MMM, YYYY"),
                moment().format("hh:mmA"),
              ],
            }
          : c
      );
    } else {
      // Add new ProduitFini
      const newProduitFiniWithId = {
        ...newProduitFini,
        id: generateNewId(), // Generate a new unique id
        ProduitFiniId: generateNewProduitFiniId(),
        creation_date: moment().format("DD MMM, YYYY"),
        last_activity: [
          moment().format("DD MMM, YYYY"),
          moment().format("hh:mmA"),
        ],
      };
      updatedProduitFinis = [newProduitFiniWithId, ...ProduitFinis];
    }

    setProduitFini(updatedProduitFinis);
    setProduitFiniAdded(true);
    setIsEdit(false);
    setModal(false);
  };
*/

  useEffect(() => {
    if (ProduitFiniAdded) {
      setProduitFiniAdded(false);
    }
  }, [ProduitFiniAdded]);

  ////////////////////////////////////// UPDATE ////////////////////////////////////

  const handleProduitFiniClick = useCallback(
    (arg) => {
      const selectedProduitFini = arg;
console.log("sele",selectedProduitFini)
      setSelectedProduitFini({
        id: selectedProduitFini.id,
        name: selectedProduitFini.name,
        unit: selectedProduitFini.unit,
        quantity: selectedProduitFini.quantity,
        priceU: selectedProduitFini.priceU,
        
       

      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  const HandleupdateProduitFini = async (id, updateProduitFini) => {
    console.log('New collab body Form ', updateProduitFini);
    console.log('New collab body ID ', id);

    try {
      const response = await ProduitFiniAPI.updateProduitFiniRequest(id, updateProduitFini);
      console.log("resp",response)
      const updatedL = {
        ...response,
        id: id,
        statuses: response.status ? [transformStatus(response.status)] : [],
      };
      setProduitFini(ProduitFinis.map(ProduitFini =>
          ProduitFini.id === id ? updatedL : ProduitFini
      ));
      setProduitFiniAdded(true);
      setIsEdit(false);
      setModal(false);
      toast.success('ProduitFini updated successfully.');
    } catch (error) {
      toast.error('Failed to update collaborator.');
    }
  };

  ////////////////////////////////////// DELETE ////////////////////////////////////

/*  const deleteProduitFini = useCallback((ProduitFiniToDelete) => {
    setProduitFini((prevProduitFinis) => prevProduitFinis.filter((c) => c.id !== ProduitFiniToDelete.id));
    setProduitFiniDeleted(true);
  }, []);*/


  const deleteProduitFini = useCallback(async (ProduitFiniToDelete) => {
    try {
      const response = await ProduitFiniAPI.deleteProduitFiniRequest(ProduitFiniToDelete.id);
    

     
        setProduitFini((prevProduitFinis) =>
            prevProduitFinis.filter((c) => c.id !== ProduitFiniToDelete.id)
        );
        setProduitFiniDeleted(true);

    } catch (error) {
      toast.error('Failed to delete ProduitFini.');
    }
  }, []);


  const handleDeleteProduitFini = useCallback(() => {
    if (ProduitFiniToDelete) {
      console.log("ProduitFini to deleteeeee",ProduitFiniToDelete)
      deleteProduitFini(ProduitFiniToDelete);
      setDeleteModal(false);
    }
  }, [ProduitFiniToDelete, deleteProduitFini]);

  const onClickDelete = (ProduitFinis) => {
    setProduitFiniToDelete(ProduitFinis);
    setDeleteModal(true);
  };

  useEffect(() => {
    if (matierePremiereQuantities) {
      const initialSelected = permis.filter(mp =>
        Object.keys(matierePremiereQuantities).includes(mp.value.toString())
      );
      setSelectedMatierePremieres(initialSelected);
      setMatierePremiereQuantities(matierePremiereQuantities);
    }
  }, [matierePremiereQuantities, permis]);

  const handleMatierePremiereChange = (selectedOptions) => {
    setSelectedMatierePremieres(selectedOptions || []);
  };

  const handleMatierePremiereQuantityChange = (id, quantity) => {
    setMatierePremiereQuantities(prevQuantities => ({
      ...prevQuantities,
      [id]: quantity
    }));
  };

  useEffect(() => {
    if (ProduitFiniToDelete) {
      //deleteProduitFini(ProduitFiniToDelete); Cz I think is running the deletion twice
      setProduitFiniToDelete(null);
    }
  }, [ProduitFiniDeleted]);

  //////////////////////////////////////   EXPORT  ////////////////////////////////////

  const headers = [
    { id: "ProduitFiniId", displayName: "ProduitFini ID" },
    { id: "name", displayName: "Name" },
    { id: "quantity", displayName: "Quantity" },
    { id: "priceU", displayName: "Price U" },
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
      id: selectedProduitFini ? selectedProduitFini.id : "0",
      name: (selectedProduitFini && selectedProduitFini.name) || "",
      quantity: (selectedProduitFini && selectedProduitFini.quantity) || "",
      unit: (selectedProduitFini && selectedProduitFini.unit) || "",
      priceU: (selectedProduitFini && selectedProduitFini.priceU) || "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Name"),
      quantity: Yup.string().required("Please Enter Quantity"),
      unit: Yup.string().required("Please Enter Unit"),
      priceU: Yup.string().required("Please Enter prix unitaire"),


    }),
    onSubmit: async (values) => {
        const matierePremiereData = selectedMatierePremieres.map(mp => ({
          id: mp.value,
          quantity: matierePremiereQuantities[mp.value] || 0
        }));
        const newProduitFini = {
          ...values,
          matiere_premiere_quantities: matierePremiereData
        };
        console.log("npf",newProduitFini)
  
        if (isEdit) {
          HandleupdateProduitFini(selectedProduitFini.id, newProduitFini);
        } else {
          addProduitFini(newProduitFini);
        }
      }
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
      header: "Prix Unitaire",
      accessorKey: "priceU",
      enableColumnFilter: false,
    },
    {
      header: "Unit No",
      //accessorKey: "unit",
      accessorKey: "unit",
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
                const ProduitFiniData = cellProps.row.original;
                console.log("data",ProduitFiniData)
                setInfo(ProduitFiniData);
                console.log("info",info)
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
              onClick={() => handleProduitFiniClick(cellProps.row.original)}
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
                const ProduitFiniData = cellProps.row.original;
                console.log("ProduitFini date delte",ProduitFiniData)
                onClickDelete(ProduitFiniData);
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
      const allIds = ProduitFinis.map((item) => item.id);
      setSelectedCheckBoxDelete(allIds);
      setIsMultiDeleteButton(true);
      console.log(allIds);
    } else {
      setSelectedCheckBoxDelete([]);
      setIsMultiDeleteButton(false);
    }
  }, [ProduitFinis]);

  const deleteMultiple = useCallback(() => {
    setProduitFini((prevProduitFinis) => {
      const updatedProduitFinis = prevProduitFinis.filter(
        (c) => !selectedCheckBoxDelete.includes(c.id)
      );
      return updatedProduitFinis;
    });
    setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete([]);
    document.getElementById("checkBoxAll").checked = false;
    setDeleteModalMulti(false);
  }, [selectedCheckBoxDelete]);

  useEffect(() => {
    if (ProduitFiniDeleted) {
      setProduitFiniToDelete(null);
      setProduitFiniDeleted(false);
    }
  }, [ProduitFiniDeleted]);

  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={ProduitFinis.map((ProduitFini) => ({
            ProduitFiniId: String(ProduitFini.ProduitFiniId),
            name: String(ProduitFini.name),
            quantity: String(ProduitFini.quantity),
            unit: String(ProduitFini.unit),

          }))}
          headers={headers}
          filename={"ProduitFinis"}
        />

        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteProduitFini}
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
          <BreadCrumb title="ProduitFinis" pageTitle="CRM" />
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
                        Add ProduitFinis
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
                  {/*{ProduitFinis && ProduitFinis.length ? (*/}
                  {isLoiding  ? ( <Loader/> ) : (
                    <TableContainer
                      columns={columns}
                      data={ProduitFinis || []}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={8}
                      className="custom-header-css"
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light"
                      handleProduitFiniClick={handleProduitFiniClicks}
                      isProduitFinisFilter={true}
                      SearchPlaceholder="Search for ProduitFinis..."
                    />
                    )}
            {/*      ) : (
                    <Loader />
                  )}
*/}
                  {/* :::::::::::::::::::::: ADD / UPDATE MODAL :::::::::::::::::::::::::: */}
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-info-subtle p-3" toggle={toggle}>
          {!!isEdit ? "Edit ProduitFini" : "Add ProduitFini"}
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
            <Label htmlFor="name-field" className="form-label">Name</Label>
            <Input
              name="name"
              id="name-field"
              className="form-control"
              placeholder="Enter Name"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.name || ""}
              invalid={validation.touched.name && validation.errors.name}
            />
            {validation.touched.name && validation.errors.name ? (
              <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
            ) : null}
          </div>
        </Col>
        <Col lg={12}>
          <div>
            <Label htmlFor="quantity-field" className="form-label">Quantity</Label>
            <Input
              name="quantity"
              id="quantity-field"
              className="form-control"
              placeholder="Enter Quantity"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.quantity || ""}
              invalid={validation.touched.quantity && validation.errors.quantity}
            />
            {validation.touched.quantity && validation.errors.quantity ? (
              <FormFeedback type="invalid">{validation.errors.quantity}</FormFeedback>
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
            <Label htmlFor="unit-field" className="form-label">Unit</Label>
            <Input
              name="unit"
              id="unit-field"
              className="form-control"
              placeholder="Enter Unit"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.unit || ""}
              invalid={validation.touched.unit && validation.errors.unit}
            />
            {validation.touched.unit && validation.errors.unit ? (
              <FormFeedback type="invalid">{validation.errors.unit}</FormFeedback>
            ) : null}
          </div>
        </Col>
        <Col lg={12}>
          <div>
            <Label htmlFor="matiere-premiere-field" className="form-label">Matiere Premiere</Label>
            <Select
              id="matiere-premiere-field"
              isMulti
              options={permis}
              onChange={handleMatierePremiereChange}
              value={selectedMatierePremieres}
              placeholder="Select Matiere Premiere"
              classNamePrefix="select"
            />
          </div>
        </Col>
        {selectedMatierePremieres.map(mp => (
          <Col lg={12} key={mp.value}>
            <div>
              <Label htmlFor={`quantity-${mp.value}`} className="form-label">
                Quantity for {mp.label}
              </Label>
              <Input
                id={`quantity-${mp.value}`}
                type="number"
                min="0"
                placeholder="Enter Quantity"
                value={matierePremiereQuantities[mp.value] || ""}
                onChange={(e) => handleMatierePremiereQuantityChange(mp.value, e.target.value)}
              />
            </div>
          </Col>
        ))}
      </Row>
    </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setModal(false)}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-success"
                id="add-btn"
              >
                {!!isEdit ? "Update" : "Add ProduitFini"}
              </button>
            </div>
          </ModalFooter>
        </Form>
      </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>

            {/* :::::::::::::::::::::: VIEW ProduitFini :::::::::::::::::::::::::: */}
            <Modal
              id="viewModal"
              isOpen={viewModal}
              toggle={toggleViewModal}
              centered
            >
              <ModalHeader toggle={toggleViewModal}>View ProduitFini</ModalHeader>
              <ModalBody>
                <div id="contact-view-detail">
                  <div className="text-center mb-3">
                    <h5 className="mt-4 mb-1">{info.name}</h5>
                    <p className="text-muted">{info.ProduitFiniId}</p>

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
                            <td className="fw-medium">Name</td>
                            <td>{info.name || "tonyanoble@velzon.com"}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Quantity ID</td>
                            <td>{info.quantity }</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Unit</td>
                            <td>{info.unit}</td>
                          </tr>

                 
                    <tr>
                      <td className="fw-medium">Matiere Premiere</td>
                      <td>
                        <Table className="table table-borderless mb-0">
                          <tbody>
                            {atierePremiereDetails.map((mp, index) => (
                              <tr key={index}>
                                <td className="fw-medium">{mp.name}</td>
                                <td>{mp.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
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
