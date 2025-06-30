import React, { useEffect, useState } from "react";
import "./BankAccountInfo.css";
import { FaUniversity, FaEllipsisV } from "react-icons/fa";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const BankAccountInfo = () => {
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [fetchedBalances, setFetchedBalances] = useState({});
  const [cardData, setCardData] = useState({
    accountNumber: "",
    bankName: "",
    expiry: "",
    holderName: "",
    ifscCode: "",
  });

  const user = auth.currentUser;

  const formatAccountNumber = (num) =>
    num
      ? num
          .replace(/\s?/g, "")
          .replace(/(.{4})/g, "$1 ")
          .trim()
      : "**** **** **** ****";

  const fetchCards = async () => {
    if (!user) return;
    const docRef = doc(db, "adminProfiles", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAccounts(docSnap.data().accountCards || []);
      const storedTotal = localStorage.getItem("totalEarnings");
      if (storedTotal) setTotalEarnings(parseFloat(storedTotal));
    }
  };
  const fetchAccountBalance = async (index) => {
    if (!user) return;
    const docRef = doc(db, "adminProfiles", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const account = data.accountCards?.[index];
      if (account && account.accountBalance !== undefined) {
        setFetchedBalances((prev) => ({
          ...prev,
          [index]: account.accountBalance,
        }));
      } else {
        alert("No balance data found.");
      }
    }
  };

  const handleInputChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    const docRef = doc(db, "adminProfiles", user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return;

    const data = docSnap.data();
    const existingCards = data.accountCards || [];

    if (editIndex !== null) {
      existingCards[editIndex] = cardData;
    } else {
      const isDuplicate = existingCards.some(
        (card) => card.accountNumber === cardData.accountNumber
      );
      if (isDuplicate) return alert("Card already exists");
      existingCards.push(cardData);
    }

    await updateDoc(docRef, {
      accountCards: existingCards,
      updatedAt: new Date().toISOString(),
    });

    setCardData({
      accountNumber: "",
      bankName: "",
      expiry: "",
      holderName: "",
      ifscCode: "",
    });
    setShowModal(false);
    setEditIndex(null);
    fetchCards();
  };

  const handleDelete = async (index) => {
    if (
      !user ||
      !window.confirm("Are you sure you want to delete this Account Details?")
    )
      return;
    const docRef = doc(db, "adminProfiles", user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return;

    const data = docSnap.data();
    const updatedCards = [...(data.accountCards || [])];
    updatedCards.splice(index, 1);

    await updateDoc(docRef, {
      accountCards: updatedCards,
      updatedAt: new Date().toISOString(),
    });

    setMenuIndex(null);
    fetchCards();
  };

  const handleEdit = (index) => {
    if (!window.confirm("Edit this Account Details?")) return;
    const selected = accounts[index];
    setCardData(selected);
    setEditIndex(index);
    setShowModal(true);
    setMenuIndex(null);
  };

  useEffect(() => {
    fetchCards();
  }, [user]);

  return (
    <>
      <div className="earnings-card">
        <div className="earnings-title">Total Earnings</div>
        <div className="earnings-amount">₹{totalEarnings.toLocaleString()}</div>
        <div className="earnings-subtext">Your Booking Revenue</div>
      </div>

      <div className="bank-section">
        <div className="bank-section-header">
          <h3>Payment Method</h3>
          <button
            className="add-card-btn"
            onClick={() => {
              setShowModal(true);
              setEditIndex(null);
              setCardData({
                accountNumber: "",
                bankName: "",
                expiry: "",
                holderName: "",
                ifscCode: "",
              });
            }}
          >
            Add New Card
          </button>
        </div>

        <div className="bank-card-container">
          {accounts.map((acc, idx) => (
            <div className="bank-card" key={idx}>
              <div className="bank-card-overlay">
                <div className="bank-card-top">
                  <FaUniversity className="bank-card-icon" />
                  <h3>{acc.bankName}</h3>
                  {fetchedBalances[idx] !== undefined && (
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#c8e6c9",
                        marginLeft: "20px",
                      }}
                    >
                      ₹{parseFloat(fetchedBalances[idx]).toFixed(2)}
                    </div>
                  )}
                  <div className="menu-wrapper">
                    <FaEllipsisV
                      className="menu-icon"
                      onClick={() =>
                        setMenuIndex(idx === menuIndex ? null : idx)
                      }
                    />
                    {menuIndex === idx && (
                      <div className="menu-options">
                        <button onClick={() => handleEdit(idx)}>Edit</button>
                        <button onClick={() => handleDelete(idx)}>
                          Delete
                        </button>
                        <button onClick={() => fetchAccountBalance(idx)} style={{fontSize:"12px"}}>
                          Check Balance
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bank-card-number">
                  {formatAccountNumber(acc.accountNumber)}
                </div>
                <div className="bank-card-bottom">
                  <div>
                    <p className="labelicon" style={{ color: "#b3e5fc" }}>
                      Account Holder
                    </p>
                    <p className="value" style={{ color: "#fff" }}>
                      {acc.holderName}
                    </p>
                  </div>
                  <div>
                    <p className="labelicon" style={{ color: "#b3e5fc" }}>
                      IFSC
                    </p>
                    <p className="value" style={{ color: "#fff" }}>
                      {acc.ifscCode}
                    </p>
                  </div>
                  <div>
                    <p className="labelicon" style={{ color: "#b3e5fc" }}>
                      Valid Date
                    </p>
                    <p className="value" style={{ color: "#fff" }}>
                      {acc.expiry}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>{editIndex !== null ? "Edit Card" : "Add New Card"}</h3>
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={cardData.accountNumber}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                value={cardData.bankName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="holderName"
                placeholder="Account Holder"
                value={cardData.holderName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="ifscCode"
                placeholder="IFSC Code"
                value={cardData.ifscCode}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="expiry"
                placeholder="Expiry (MM/YY)"
                value={cardData.expiry}
                onChange={handleInputChange}
              />
              <button onClick={handleSave}>Save</button>
              <button
                style={{ backgroundColor: "red" }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BankAccountInfo;
