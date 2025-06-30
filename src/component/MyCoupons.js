import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db, auth } from "../firebase";
import ScratchCard from "react-scratchcard-v2";
import "./MyCoupons.css"

const MyCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [walletUpdated, setWalletUpdated] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      const q = query(
        collection(db, "coupons"),
        where("userId", "==", auth.currentUser?.uid),
        where("isClaimed", "==", false)
      );
      const snapshot = await getDocs(q);
      setCoupons(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchCoupons();
  }, [walletUpdated]);

  const claimCoupon = async (coupon) => {
    try {
      const walletRef = doc(db, "wallets", auth.currentUser?.uid);
      await updateDoc(walletRef, {
        walletBalance: increment(coupon.amount), 
      });

      const couponRef = doc(db, "coupons", coupon.id);
      await updateDoc(couponRef, { isClaimed: true });

      alert(`🎉 ₹${coupon.amount} added to your wallet!`);
      setWalletUpdated(true);
    } catch (error) {
      console.error("Error claiming coupon:", error);
    }
  };

  return (
    <div className="coupon-container">
      <h2 className="heading">🎁 My Coupons</h2>
      {coupons.length === 0 ? (
        <p className="no-coupons">No unclaimed coupons yet.</p>
      ) : (
        <div className="coupon-grid">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="scratch-card-wrapper">
              <ScratchCard
                width={300}
                height={150}
                image="/scratch-silver1.jpg"
                finishPercent={50}
                onComplete={() => claimCoupon(coupon)}
              >
                <div className="scratch-content">
                  <h3>₹{coupon.amount} Cashback</h3>
                  <p>Tap & Scratch to claim</p>
                </div>
              </ScratchCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoupons;
