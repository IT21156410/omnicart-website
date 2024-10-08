import React, {useEffect, useState} from "react";
import {NotificationService} from "../services/NotificationService.ts";
import {Role} from "../enums/auth.ts";

// Notification list component
const Notifications: React.FC<{ userId: string; userRoles: Role }> = ({userId, userRoles}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Fetch notifications when the component loads
        const fetchNotifications = async () => {
            try {
                const fetchedNotifications = await NotificationService.getNotifications(userId, userRoles);
                setNotifications(fetchedNotifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [userId, userRoles]);

    // Mark notification as read
    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await NotificationService.markNotificationAsRead(notificationId);
            setNotifications(notifications.map(n =>
                n.id === notificationId ? {...n, isRead: true} : n
            ));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    if (loading) {
        return <div>Loading notifications...</div>;
    }

    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notification) => (
                    <li key={notification.id} style={{backgroundColor: notification.isRead ? '#e0e0e0' : '#fff'}}>
                        <p>{notification.message}</p>
                        <p>Received: {new Date(notification.createdAt).toLocaleString()}</p>
                        {!notification.isRead && (
                            <button onClick={() => handleMarkAsRead(notification.id)}>Mark as Read</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
