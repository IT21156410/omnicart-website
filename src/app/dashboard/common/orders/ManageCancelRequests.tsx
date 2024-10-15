import React, {useEffect, useState} from 'react';
import {Button, Card, Input, message, Select, Table, TableProps, Tag} from "antd";
import {CancelRequest, CancelRequestStatus} from "../../../../types/models/CancelRequest.ts";
import {CancelRequestService} from "../../../../services/CancelRequestService.ts";
import axios from "axios";
import {useAuth} from "../../../../hooks/useAuth.tsx";
import {Role} from "../../../../enums/auth.ts";
import {Order} from "../../../../types/models/Order.ts";
import JsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {getCurrentDateTime} from "../../../../utils/date-time.ts";

const ManageCancelRequests = ({isAdmin}: { isAdmin?: boolean }) => {

    const { user } = useAuth();

    const [cancelRequests, setCancelRequests] = useState<CancelRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [processingRequest, setProcessingRequest] = useState<boolean>(false);
    const [axiosController, setAxiosController] = useState(new AbortController());
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<CancelRequestStatus | null>(null);

    const filteredRequests = cancelRequests.filter(request =>
        request.orderId.includes(searchText) &&
        (statusFilter ? request.status === statusFilter : true)
    );

    const role: Role = isAdmin ? Role.admin : Role.csr;

    useEffect(() => {
        const fetchCancelRequests = async () => {
            console.log("Fetching cancel requests")
            try {
                setLoading(true);
                const result = await CancelRequestService.getAllCancelRequests(role, axiosController);
                if (result.success) {
                    setCancelRequests(result.data);
                } else {
                    setError(result.message);
                }
            } catch (err: unknown) {
                if (axios.isCancel(err)) {
                    setAxiosController(new AbortController());
                    console.error("Request canceled", err.message);
                } else {
                    setError("Something went wrong!");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCancelRequests();

        return () => {
            axiosController.abort("Component unmounted");
        };
    }, [axiosController]);

    const columns: TableProps<CancelRequest>['columns'] = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId'
        },
        {
            title: 'Customer ID',
            dataIndex: 'customerId',
            key: 'customerId'
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, request) => (
                <Tag color={request.status === CancelRequestStatus.Approved ? 'green' : request.status === CancelRequestStatus.Rejected ? 'red' : 'orange'}>
                {request.status}
            </Tag>
            )
        },
        {
            title: 'Requested Date',
            dataIndex: 'requestedDate',
            key: 'requestedDate'
        },
        {
            title: 'Action',
            key: 'operation',
            render: (_, request) => (
                <div className="d-flex justify-content-evenly">
                    {(user!.role === Role.admin || user!.role === Role.csr)   && (
                        <>
                            <Button
                                type="primary"
                                onClick={() => handleProcessRequest(request, true)}
                                size="small"
                                disabled={request.status !== CancelRequestStatus.Pending}
                                color="primary"
                            >
                                Approve
                            </Button>
                            <Button
                                onClick={() => handleProcessRequest(request, false)}
                                size="small"
                                disabled={request.status !== CancelRequestStatus.Pending}
                                color="danger"
                                className={`${!(request.status !== CancelRequestStatus.Pending) && "bg-danger text-light"}`}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                </div>
            ),
        }
    ];

    const handleProcessRequest = async (request: CancelRequest, isApproved: boolean) => {
        try {
            setProcessingRequest(true);
            const result = await CancelRequestService.processCancelRequest(role, request, isApproved);
            if (result.success) {
                message.success(result.message);
                setCancelRequests(prevRequests =>
                    prevRequests.map(req => req.id === request.id ? { ...req, status: isApproved ? CancelRequestStatus.Approved : CancelRequestStatus.Rejected } : req)
                );
            } else {
                message.error("Failed to process request.");
            }
        } catch (e) {
            let error = 'Error processing request';
            if (e?.response?.data?.message) {
                error = e?.response?.data?.message;
            }
            message.error(error);
        } finally {
            setProcessingRequest(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleGenerateReport = () => {
        generatePDF(cancelRequests);
    };

    return (
        <Card loading={loading} title="Manage Cancel Requests">
            <div className="d-flex justify-content-between mb-3">
                <Input
                    placeholder="Search by order ID"
                    value={searchText}
                    onChange={handleSearch}
                    style={{ width: 200 }}
                />
                <div>
                    <Select<CancelRequestStatus>
                        style={{ width: 200 }}
                        placeholder="Filter by status"
                        onChange={setStatusFilter}
                        allowClear
                        options={[
                            { value: CancelRequestStatus.Pending, label: 'Pending' },
                            { value: CancelRequestStatus.Approved, label: 'Approved' },
                            { value: CancelRequestStatus.Rejected, label: 'Rejected' },
                        ]}
                    />
                    <Button className="mb-2 ms-4" type="primary" onClick={handleGenerateReport}>
                        Generate PDF Report
                    </Button>
                </div>
            </div>
            <Table<CancelRequest> rowKey="id" columns={columns} dataSource={filteredRequests} />
        </Card>
    );
};

const generatePDF = (cancelRequests: CancelRequest[]) => {
    const doc = new JsPDF({orientation: "landscape"});

    // Title of the document
    doc.setFontSize(18);
    doc.text('Cancel Requests Report', 14, 22);

    // Create the table
    const tableData = cancelRequests.map((request) => {
        return [
            request.orderId,
            request.customerId,
            request.reason,
            request.status,
            request.requestedDate,
        ];
    });

    autoTable(doc, {
        head: [['Order ID', 'Customer ID', 'Reason', 'Status', 'Requested Date']],
        body: tableData,
        startY: 30,
    });

    // Save the PDF
    doc.save(`cancel_requests_report-${getCurrentDateTime()}.pdf`);
};

export default ManageCancelRequests;
