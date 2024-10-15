import {User} from "../../../../types";
import autoTable from "jspdf-autotable";
import JsPDF from "jspdf";
import {getCurrentDateTime} from "../../../../utils/date-time.ts";

export const generatePDF = (users: User[]) => {
    const doc = new JsPDF({orientation: "landscape"});

    doc.setFontSize(18);
    doc.text('Users Report', 14, 22);

    // Create the table data
    const tableData = users.map((product) => [
        product.name,
        product.email,
        product.role, // Assuming category object has a name
        product.isActive ? "Activated" : "Not Activated",
    ]);

    autoTable(doc, {
        head: [['Name', 'Email', 'Role', 'Account Status']],
        body: tableData,
        startY: 30,
    });

    // Save the PDF
    doc.save(`users_report-${getCurrentDateTime()}.pdf`);
};