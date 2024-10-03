import React, {createContext, useCallback, useContext, useState, useMemo} from "react";
import {Toast, ToastContainer} from "react-bootstrap";

interface Notification {
    id: number;
    title?: string;
    message: string;
    type: "success" | "error" | "info";
}

interface NotificationContextType {
    addNotification: (message: string, type?: "success" | "error" | "info", title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

export const NotificationProvider = ({children}: { children: React.ReactNode }) => {

    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback(
        (message: string, type: "success" | "error" | "info" = "info", title?: string) => {
            const newNotification: Notification = {
                id: Date.now(), // Unique ID based on the timestamp
                title,
                message,
                type,
            };
            setNotifications((prev) => [...prev, newNotification]);

            // Auto-remove notification after 5 seconds
            setTimeout(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
            }, 5000);
        },
        []
    );

    const value = useMemo(() => ({addNotification}), [addNotification]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <ToastContainer position="top-end" className="p-3">
                {notifications.map((notification) => (
                    <Toast
                        key={notification.id}
                        bg={notification.type === "success" ? "success" : notification.type === "error" ? "danger" : "info"}
                        onClose={() => setNotifications((prev) => prev.filter((n) => n.id !== notification.id))}
                    >
                        {notification.title &&
                            <Toast.Header>
                                <strong className="me-auto">{notification.title}</strong>
                            </Toast.Header>}
                        <Toast.Body className="text-dark bg-light">{notification.message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </NotificationContext.Provider>
    );
};
