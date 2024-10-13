import React, {useEffect, useState} from "react";
import {NotificationService} from "../services/NotificationService.ts";
import {Notification} from '../types/models/notification'
import {Alert, Button, Drawer, Space} from "antd";

// Notification list component
const Notifications = ({open, setOpen}: { open: boolean, setOpen: (value: boolean) => void }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    // const [open, setOpen] = React.useState<boolean>(false);

    // Fetch notifications when the component loads
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const fetchedNotifications = await NotificationService.getNotifications();
            setNotifications(fetchedNotifications.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [open]);

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
        <Drawer
            closable
            destroyOnClose
            title={<p className="mb-0">Notifications</p>}
            placement="right"
            open={open}
            loading={loading}
            onClose={() => setOpen(false)}
        >
            <Button size="small" type="primary" className="mb-2" onClick={fetchNotifications}>
                Reload
            </Button>
            <div>
                <div className="border-0">
                    {notifications.map((notification) => (
                        <div key={notification.id} className="p-0 mb-1">
                            <Alert
                                className={`px-3 py-1 ${notification.isRead ? 'bg-light' : ''}`}
                                message={(
                                    <div>
                                        <div className="d-flex justify-content-between">
                                            <div className="fw-medium fs-6">{notification.title}</div>
                                            {
                                                !notification.isRead && (
                                                    <Space direction="vertical">
                                                        <Button size="small" type="primary"
                                                                onClick={() => handleMarkAsRead(notification.id)}>
                                                            Mark as Read
                                                        </Button>
                                                    </Space>
                                                )
                                            }
                                        </div>
                                        <small
                                            className="text-muted"
                                        >
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </small>

                                    </div>
                                )}
                                description={notification.message}
                                type="info"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </Drawer>

    );
};

export default Notifications;
