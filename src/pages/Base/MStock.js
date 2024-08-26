import React, { useEffect, useState, useCallback } from "react";
import { Input, Table } from "reactstrap";
import axiosWithToken from "../ApiCalls/axiosWithToken";
import Loader from "../../Components/Common/Loader";

export default function MouvementStocks() {
  document.title = "MouvementStocks";

  // State management
  const [mouvementStocks, setMouvementStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from API
  const getAllMouvementStocks = async () => {
    try {
      const response = await axiosWithToken.get('/movement');
      if (response.data != null) {
        setMouvementStocks(response.data);
      } else {
        setMouvementStocks([]);
      }
    } catch (error) {
      console.error('Error getting mouvementStocks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllMouvementStocks();
  }, []);

  // Filter and search logic
  const filteredMouvementStocks = mouvementStocks.filter((mouvement) => {
    return (
      (filterType === "" || mouvement.type === filterType) &&
      (searchTerm === "" ||
        mouvement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mouvement.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(mouvement.quantity).includes(searchTerm) ||
        String(mouvement.produit_id).includes(searchTerm) ||
        String(mouvement.matierePremiere_id).includes(searchTerm) ||
        String(mouvement.user_id).includes(searchTerm))
    );
  });

  return (
    <div className="mt-">
   
      <div className="search-filter-container">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Input
          type="select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="entre">Entre</option>
          <option value="sortie">Sortie</option>
        </Input>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <Table className="table-striped">
          <thead>
            <tr>
              <th>Type</th>
              <th>Date</th>
              <th>Quantity</th>
              <th>Produit ID</th>
              <th>Matière Première ID</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredMouvementStocks.map((mouvement) => (
              <tr key={mouvement.id}>
                <td>{mouvement.type}</td>
                <td>{mouvement.date}</td>
                <td>{mouvement.quantity}</td>
                <td>{mouvement.produit_id}</td>
                <td>{mouvement.matierePremiere_id}</td>
                <td>{mouvement.user_id}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
