import React, {useEffect, useState} from 'react';
import {NotificationService} from "../services/NotificationService.ts";
import {Badge, Button} from "antd";
import {BellFilled} from "@ant-design/icons";

const NotificationBellButton = ({showDrawer}: { showDrawer: () => void }) => {

    const [notificationCount, setNotificationCount] = useState<number>(0)
    useEffect(() => {
        // Fetch notifications when the component loads
        const fetchNotifications = async () => {
            try {
                const fetchedNotifications = await NotificationService.unreadNotificationCountForUser();
                setNotificationCount(fetchedNotifications.data.unreadCount);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
            }
        };
        fetchNotifications();

    }, [notificationCount, location.pathname]);

    return (
        <Button className="mx-1" onClick={showDrawer}>
            <Badge count={notificationCount} size="small">
                <BellFilled className="fs-6"/>
            </Badge>
        </Button>
    );
};

export default NotificationBellButton;