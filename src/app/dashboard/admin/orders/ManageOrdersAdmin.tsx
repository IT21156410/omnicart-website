import React from "react";
import ManageOrders from "../../common/orders/ManageOrders.tsx";

const ManageOrdersAdmin: React.FC = ({isAdmin}: { isAdmin?: boolean }) => {
    return (
        <ManageOrders isAdmin={isAdmin}/>
    );
};

export default ManageOrdersAdmin;
