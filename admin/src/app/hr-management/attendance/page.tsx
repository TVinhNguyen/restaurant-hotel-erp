"use client";

import React, { useEffect, useState } from 'react';
import {
    Card,
    Table,
    DatePicker,
    Row,
    Col,
    Tag,
    Button,
    Modal,
    Form,
    Select,
    Input,
    TimePicker,
    message,
    Statistic,
    Progress,
    Space,
    Typography,
    Popconfirm
} from 'antd';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    CalendarOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { mockAttendance, type AttendanceRecord } from '../../../data/mockAttendanceNew';
import { Employee, getMockEmployees } from '../../../data/mockEmployees';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function AttendancePage() {
    const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);
    const [form] = Form.useForm();

    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendance);
    const [workingShifts, setWorkingShifts] = useState<any[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    const todayAttendance = attendanceRecords.filter(record => {
        const recordDate = record.date;
        const selectedDateStr = selectedDate.format('YYYY-MM-DD');
        console.log('Filtering attendance:', { recordDate, selectedDateStr, match: recordDate === selectedDateStr });
        return recordDate === selectedDateStr;
    });

    console.log('Total attendance records:', attendanceRecords.length);
    console.log('Today attendance records:', todayAttendance.length);
    useEffect(() => {
        fetchEmployees();
        fetchWorkingShifts();
        fetchAttendance();
    }, []);
    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}/employees`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const formattedEmployees = data.data.map((employee: any) => ({
                    id: employee.id,
                    fullName: employee.fullName || employee.full_name || 'Unknown',
                    position: employee.position || 'Not specified',
                    department: employee.department || 'Unassigned',
                    status: employee.status || 'active',
                }));
                setEmployees(formattedEmployees);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchWorkingShifts = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}/working-shifts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const formattedShifts = data.data.map((shift: any) => ({
                    id: shift.id,
                    employeeId: shift.employeeId || shift.employee_id,
                    employeeName: shift.employee?.fullName || shift.employee?.full_name || 'Unknown',
                    workingDate: shift.workingDate || shift.working_date,
                    startTime: shift.startTime || shift.start_time,
                    endTime: shift.endTime || shift.end_time,
                    shiftType: shift.shiftType || shift.shift_type
                }));
                setWorkingShifts(formattedShifts);
            }
        } catch (error) {
            console.error('Error fetching working shifts:', error);
        }
    };

    const fetchAttendance = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}/attendance?page=1&limit=10`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Attendance response:', result);

                // Handle the response format from backend service
                const attendanceData = result.data || result;
                const formattedAttendance = attendanceData.map((record: any) => ({
                    id: record.id,
                    workingShiftId: record.workingShiftId || record.working_shift_id,
                    employeeId: record.employeeId || record.employee_id,
                    employeeName: record.employee?.fullName || record.employee?.full_name || 'Unknown',
                    date: record.date,
                    checkIn: record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
                    checkOut: record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
                    status: record.status,
                    notes: record.notes || ''
                }));
                setAttendanceRecords(formattedAttendance);
            } else {
                console.error('Failed to fetch attendance:', response.status, response.statusText);
                message.error('Failed to fetch attendance records');
                // Fallback to mock data
                setAttendanceRecords(mockAttendance);
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
            message.error('Error fetching attendance records');
            // Fallback to mock data
            setAttendanceRecords(mockAttendance);
        }
    };

    // Calculate statistics
    const presentCount = todayAttendance.filter(a => a.status === 'present').length;
    const absentCount = todayAttendance.filter(a => a.status === 'absent').length;
    const lateCount = todayAttendance.filter(a => a.status === 'late').length;
    const halfDayCount = todayAttendance.filter(a => a.status === 'half-day').length;

    // Statistics calculations
    const attendancePercentage = employees.length > 0 ? (presentCount / employees.length) * 100 : 0;

    const columns = [
        {
            title: 'Employee Name',
            dataIndex: 'employeeName',
            key: 'employeeName',
            sorter: (a: AttendanceRecord, b: AttendanceRecord) => a.employeeName.localeCompare(b.employeeName),
        },
        {
            title: 'Working Shift',
            dataIndex: 'workingShiftId',
            key: 'workingShiftId',
            render: (shiftId: string) => {
                const shift = workingShifts.find(s => s.id === shiftId);
                return shift ? `${shift.shiftType} (${shift.startTime}-${shift.endTime})` : 'No Shift';
            },
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Check In',
            dataIndex: 'checkIn',
            key: 'checkIn',
            render: (time: string) => time || '-',
        },
        {
            title: 'Check Out',
            dataIndex: 'checkOut',
            key: 'checkOut',
            render: (time: string) => time || '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusConfig = {
                    present: { color: 'green', text: 'Present' },
                    absent: { color: 'red', text: 'Absent' },
                    late: { color: 'orange', text: 'Late' },
                    'half-day': { color: 'blue', text: 'Half Day' },
                };
                const config = statusConfig[status as keyof typeof statusConfig];
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        // {
        //     title: 'Working Hours',
        //     dataIndex: 'workingHours',
        //     key: 'workingHours',
        //     render: (hours: number) => hours ? `${hours}h` : '-',
        // },
        // {
        //     title: 'Overtime',
        //     dataIndex: 'overtime',
        //     key: 'overtime',
        //     render: (hours: number) => hours ? `${hours}h` : '-',
        // },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes: string) => notes || '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: AttendanceRecord) => (
                <Space>
                    <Button
                        size="small"
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Attendance"
                        description="Are you sure you want to delete this attendance record?"
                        onConfirm={() => handleDeleteAttendance(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleAddAttendance = async (values: any) => {
        try {
            const attendanceData = {
                employeeId: values.employeeId,
                workingShiftId: values.workingShiftId || null,
                date: values.date.format('YYYY-MM-DD'),
                checkInTime: values.checkIn ? `${values.date.format('YYYY-MM-DD')}T${values.checkIn.format('HH:mm:ss')}` : null,
                checkOutTime: values.checkOut ? `${values.date.format('YYYY-MM-DD')}T${values.checkOut.format('HH:mm:ss')}` : null,
                status: values.status,
                notes: values.notes || ''
            };

            let response;
            if (isEditMode && selectedAttendance) {
                // Update existing attendance
                response = await fetch(`${API_ENDPOINT}/attendance/${selectedAttendance.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(attendanceData)
                });
            } else {
                // Create new attendance
                response = await fetch(`${API_ENDPOINT}/attendance`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(attendanceData)
                });
            }

            if (response.ok) {
                message.success(`Attendance record ${isEditMode ? 'updated' : 'added'} successfully!`);
                setIsModalVisible(false);
                setIsEditMode(false);
                setSelectedAttendance(null);
                form.resetFields();
                fetchAttendance(); // Refresh data
            } else {
                const error = await response.json();
                message.error(`Error ${isEditMode ? 'updating' : 'creating'} attendance: ${error.message}`);
            }
        } catch (error) {
            console.error('Error with attendance:', error);
            message.error(`Error ${isEditMode ? 'updating' : 'creating'} attendance record`);
        }
    };

    const showEditModal = (attendance: AttendanceRecord) => {
        setIsEditMode(true);
        setSelectedAttendance(attendance);

        // Pre-populate form with existing data
        form.setFieldsValue({
            employeeId: attendance.employeeId,
            workingShiftId: attendance.workingShiftId,
            date: dayjs(attendance.date),
            checkIn: attendance.checkIn ? dayjs(attendance.checkIn, 'HH:mm') : null,
            checkOut: attendance.checkOut ? dayjs(attendance.checkOut, 'HH:mm') : null,
            status: attendance.status,
            notes: attendance.notes
        });

        setIsModalVisible(true);
    };

    const handleDeleteAttendance = async (id: string) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/attendance/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                message.success('Attendance record deleted successfully!');
                fetchAttendance(); // Refresh data
            } else {
                const error = await response.json();
                message.error(`Error deleting attendance: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting attendance:', error);
            message.error('Error deleting attendance record');
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Attendance Management</Title>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Present"
                            value={presentCount}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Absent"
                            value={absentCount}
                            prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Late"
                            value={lateCount}
                            prefix={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Attendance Rate"
                            value={attendancePercentage}
                            precision={1}
                            suffix="%"
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: attendancePercentage >= 80 ? '#52c41a' : '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Working Hours Summary - Removed since not in new structure */}

            {/* Date Filter and Add Button */}
            <Card style={{ marginBottom: '24px' }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space>
                            <CalendarOutlined />
                            <DatePicker
                                value={selectedDate}
                                onChange={(date) => {
                                    console.log('DatePicker onChange:', date);
                                    if (date) {
                                        setSelectedDate(date);
                                        console.log('Selected date updated to:', date.format('YYYY-MM-DD'));
                                    } else {
                                        setSelectedDate(dayjs());
                                        console.log('Selected date reset to today');
                                    }
                                }}
                                format="DD/MM/YYYY"
                                allowClear={false}
                                placeholder="Select date"
                            />
                        </Space>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setIsEditMode(false);
                                setSelectedAttendance(null);
                                form.resetFields();
                                setIsModalVisible(true);
                            }}
                        >
                            Add Attendance
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Attendance Table */}
            <Card title={`Attendance Records - ${selectedDate.format('DD/MM/YYYY')}`}>
                <Table
                    columns={columns}
                    dataSource={todayAttendance}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                    scroll={{ x: 800 }}
                />
            </Card>

            {/* Add Attendance Modal */}
            <Modal
                title={isEditMode ? "Edit Attendance Record" : "Add Attendance Record"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setIsEditMode(false);
                    setSelectedAttendance(null);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddAttendance}
                >
                    <Form.Item
                        label="Employee"
                        name="employeeId"
                        rules={[{ required: true, message: 'Please select an employee!' }]}
                    >
                        <Select placeholder="Select employee">
                            {employees.map(employee => (
                                <Select.Option key={employee.id} value={employee.id}>
                                    {employee.fullName} - {employee.position}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Working Shift (Optional)"
                        name="workingShiftId"
                    >
                        <Select placeholder="Select working shift (optional)" allowClear>
                            {workingShifts.map(shift => (
                                <Select.Option key={shift.id} value={shift.id}>
                                    {shift.employeeName} - {shift.workingDate} ({shift.startTime} - {shift.endTime})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[{ required: true, message: 'Please select date!' }]}
                        initialValue={dayjs()}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Check In Time"
                                name="checkIn"
                            >
                                <TimePicker
                                    style={{ width: '100%' }}
                                    format="HH:mm"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Check Out Time"
                                name="checkOut"
                            >
                                <TimePicker
                                    style={{ width: '100%' }}
                                    format="HH:mm"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Please select status!' }]}
                    >
                        <Select placeholder="Select status">
                            <Select.Option value="present">Present</Select.Option>
                            <Select.Option value="absent">Absent</Select.Option>
                            <Select.Option value="late">Late</Select.Option>
                            <Select.Option value="half-day">Half Day</Select.Option>
                        </Select>
                    </Form.Item>

                    {/* <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Working Hours"
                                name="workingHours"
                            >
                                <Input type="number" min={0} max={24} step={0.5} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Overtime Hours"
                                name="overtime"
                            >
                                <Input type="number" min={0} max={12} step={0.5} />
                            </Form.Item>
                        </Col>
                    </Row> */}

                    <Form.Item
                        label="Notes"
                        name="notes"
                    >
                        <Input.TextArea rows={3} placeholder="Additional notes..." />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setIsModalVisible(false);
                                setIsEditMode(false);
                                setSelectedAttendance(null);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {isEditMode ? "Update Record" : "Add Record"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
