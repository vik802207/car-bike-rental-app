import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(stored);
  }, []);

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.setItem("notifications", JSON.stringify([]));
  };

  const addNotification = (msg) => {
    const newNotif = { msg, read: false };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      markAllAsRead,
      clearAll,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
